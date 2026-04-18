import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '@/lib/supabase';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  const { message } = await req.json();

  // 1. 関連ドキュメントを検索（RAG）
  let contextText = '';
  try {
    const { data: chunks } = await supabase.rpc('match_documents', {
      query_embedding: [], // 後でEmbedding機能を追加
      match_threshold: 0.7,
      match_count: 5,
    });
    if (chunks) {
      contextText = chunks.map((chunk: any) => chunk.content).join('\n\n---\n\n');
    }
  } catch (error) {
    console.log('RAG検索スキップ（Embedding未設定）');
  }

  // 2. Claude APIで回答生成
  const systemPrompt = contextText
    ? `あなたは社内ナレッジベースのAIアシスタントです。以下のコンテキスト情報を基に回答してください。\n\nコンテキスト:\n${contextText}`
    : 'あなたは親切なAIアシスタントです。質問に丁寧に回答してください。';

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      { role: 'user', content: message },
    ],
  });

  const assistantMessage = response.content[0].type === 'text'
    ? response.content[0].text
    : '';

  // 3. チャット履歴を保存
  await supabase.from('chat_messages').insert([
    { role: 'user', content: message },
    { role: 'assistant', content: assistantMessage },
  ]);

  return Response.json({ message: assistantMessage });
}