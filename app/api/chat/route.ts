import Anthropic from '@anthropic-ai/sdk';
import { retrieveRelevantChunks } from '@/lib/rag/retriever';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
    if (!apiKey) {
      return Response.json(
        { error: 'ANTHROPIC_API_KEY が設定されていません' },
        { status: 503 }
      );
    }

    const anthropic = new Anthropic({ apiKey });
    const body = await req.json();
    const message = typeof body?.message === 'string' ? body.message : '';
    if (!message.trim()) {
      return Response.json({ error: 'メッセージが必要です' }, { status: 400 });
    }

    // 1. RAG: 関連ドキュメントを検索
    let contextText = '';
    let sources: { content: string; similarity: number }[] = [];
    try {
      console.log('RAG検索開始:', message);
      const chunks = await retrieveRelevantChunks(message);
      if (chunks && chunks.length > 0) {
        sources = chunks.map((chunk: any) => ({
          content: chunk.content.substring(0, 100) + '...',
          similarity: Math.round(chunk.similarity * 100),
        }));
        contextText = chunks.map((chunk: any) => chunk.content).join('\n\n---\n\n');
      }
    } catch (error) {
      console.log('RAG検索スキップ:', error);
    }

    // 2. プロンプト構築
    const systemPrompt = contextText
      ? `あなたは社内ナレッジベースのAIアシスタントです。
以下のコンテキスト情報を基に、正確に回答してください。
コンテキストに含まれない情報については「その情報は登録されたドキュメントに見つかりませんでした」と回答してください。

## コンテキスト:
${contextText}`
      : 'あなたは親切なAIアシスタントです。質問に丁寧に回答してください。';

    // 3. Claude APIで回答生成
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: message }],
    });

    const assistantMessage =
      response.content[0].type === 'text' ? response.content[0].text : '';

    // 4. チャット履歴を保存
    await supabase.from('chat_messages').insert([
      { role: 'user', content: message },
      { role: 'assistant', content: assistantMessage },
    ]);

    console.log('ソース件数:', sources.length, sources);
    return Response.json({
      message: assistantMessage,
      sources: sources,
    });
  } catch (error) {
    console.error('チャットAPIエラー:', error);
    return Response.json(
      { error: 'チャットの処理に失敗しました' },
      { status: 500 }
    );
  }
}
