import { supabase } from '@/lib/supabase';

// ユーザーの質問に関連するドキュメントを検索する関数（キーワード検索）
export async function retrieveRelevantChunks(
  query: string,
  topK: number = 5
) {
  // クエリからキーワードを抽出
  const keywords = query
    .replace(/[？?。、！!の は が を に で と も や]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length >= 2);

  // 各キーワードでOR検索
  let allChunks: any[] = [];

  for (const keyword of keywords) {
    const { data, error } = await supabase
      .from('document_chunks')
      .select('id, content')
      .ilike('content', `%${keyword}%`);

    if (!error && data) {
      allChunks = [...allChunks, ...data];
    }
  }

  // 重複を排除してスコア計算
  const chunkMap = new Map<number, { id: number; content: string; matchCount: number }>();

  for (const chunk of allChunks) {
    if (chunkMap.has(chunk.id)) {
      chunkMap.get(chunk.id)!.matchCount += 1;
    } else {
      chunkMap.set(chunk.id, { id: chunk.id, content: chunk.content, matchCount: 1 });
    }
  }

  // マッチ数が多い順にソートしてtopK件返す
  const results = Array.from(chunkMap.values())
    .sort((a, b) => b.matchCount - a.matchCount)
    .slice(0, topK)
    .map((item) => ({
      id: item.id,
      content: item.content,
      similarity: Math.round(Math.min((item.matchCount / keywords.length), 1) * 100) / 100,
    }));

  return results;
}