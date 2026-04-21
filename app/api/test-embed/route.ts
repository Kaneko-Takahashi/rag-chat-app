import { generateEmbedding } from '@/lib/rag/embeddings';

export async function GET() {
  try {
    const embedding = await generateEmbedding('テスト文章です');
    return Response.json({
      success: true,
      length: embedding.length,
      sample: embedding.slice(0, 5),
    });
  } catch (error: any) {
    return Response.json({
      success: false,
      error: error.message || String(error),
    });
  }
}