import { supabase } from '@/lib/supabase';

// テキストをチャンク（小さな断片）に分割する関数
export function splitIntoChunks(
  text: string,
  chunkSize: number = 800,
  overlap: number = 200
): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start += chunkSize - overlap;
  }

  return chunks;
}

// Embedding生成（Supabase Edge Function経由）
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/embed`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ text }),
    }
  );

  const data = await response.json();
  return data.embedding;
}

// ドキュメントを取り込む関数
export async function ingestDocument(title: string, content: string) {
  // 1. ドキュメントを保存
  const { data: doc, error: docError } = await supabase
    .from('documents')
    .insert({ title, content })
    .select()
    .single();

  if (docError) throw docError;

  // 2. チャンク分割
  const chunks = splitIntoChunks(content);

  // 3. 各チャンクをEmbedding化して保存
  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk);

    await supabase.from('document_chunks').insert({
      document_id: doc.id,
      content: chunk,
      embedding: embedding,
    });
  }

  return doc;
}