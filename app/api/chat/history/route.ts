import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) throw error;
    return Response.json({ messages: data });
  } catch (error) {
    console.error('履歴取得エラー:', error);
    return Response.json(
      { error: '履歴の取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .neq('id', 0);

    if (error) throw error;
    return Response.json({ message: '履歴を削除しました' });
  } catch (error) {
    console.error('履歴削除エラー:', error);
    return Response.json(
      { error: '履歴の削除に失敗しました' },
      { status: 500 }
    );
  }
}