import { supabase } from '@/lib/supabase';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // ドキュメントを削除（チャンクも自動で削除される）
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return Response.json({ message: 'ドキュメントを削除しました' });
  } catch (error) {
    console.error('削除エラー:', error);
    return Response.json(
      { error: '削除に失敗しました' },
      { status: 500 }
    );
  }
}