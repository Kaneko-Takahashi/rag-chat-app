import { ingestDocument } from '@/lib/rag/embeddings';
import { supabase } from '@/lib/supabase';

// ドキュメントをアップロードするAPI
export async function POST(req: Request) {
  try {
    const { title, content } = await req.json();

    if (!title || !content) {
      return Response.json(
        { error: 'タイトルと内容は必須です' },
        { status: 400 }
      );
    }

    const doc = await ingestDocument(title, content);
    return Response.json({ message: 'ドキュメントを登録しました', document: doc });
  } catch (error) {
    console.error('ドキュメント登録エラー:', error);
    return Response.json(
      { error: 'ドキュメントの登録に失敗しました' },
      { status: 500 }
    );
  }
}

// ドキュメント一覧を取得するAPI
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return Response.json({ documents: data });
  } catch (error) {
    console.error('ドキュメント取得エラー:', error);
    return Response.json(
      { error: 'ドキュメントの取得に失敗しました' },
      { status: 500 }
    );
  }
}