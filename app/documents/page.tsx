'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Document = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('取得エラー:', error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // テキスト登録
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('✅ ドキュメントを登録しました');
        setTitle('');
        setContent('');
        fetchDocuments();
      } else {
        setMessage(`❌ エラー: ${data.error}`);
      }
    } catch (error) {
      setMessage('❌ 登録に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // ファイルアップロード
  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setMessage(`📤 「${file.name}」をアップロード中...`);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message}`);
        fetchDocuments();
      } else {
        setMessage(`❌ エラー: ${data.error}`);
      }
    } catch (error) {
      setMessage('❌ アップロードに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // ドラッグ＆ドロップ
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  // ファイル選択
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  // 削除
  const handleDelete = async (id: number, docTitle: string) => {
    if (!confirm(`「${docTitle}」を削除しますか？`)) return;

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMessage('✅ ドキュメントを削除しました');
        fetchDocuments();
      } else {
        setMessage('❌ 削除に失敗しました');
      }
    } catch (error) {
      setMessage('❌ 削除に失敗しました');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      {/* ヘッダー */}
      <header className="px-6 py-4 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="bg-emerald-500 text-white rounded-lg p-1.5 text-sm">📄</span>
              ドキュメント管理
            </h1>
            <p className="text-sm text-slate-400 mt-1">RAG用ナレッジベースの管理</p>
          </div>
          <a href="/" className="text-blue-400 hover:text-blue-300 text-sm">
            ← チャットに戻る
          </a>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-8">

          {/* ファイルアップロード */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`bg-slate-800 rounded-xl p-8 border-2 border-dashed transition-colors cursor-pointer ${
              isDragging
                ? 'border-blue-400 bg-blue-900/20'
                : 'border-slate-600 hover:border-slate-500'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf,.xlsx,.xls,.pptx,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="text-center">
              <p className="text-4xl mb-3">📁</p>
              <p className="text-white font-semibold">
                ファイルをドラッグ＆ドロップ
              </p>
              <p className="text-slate-400 text-sm mt-1">
                またはクリックしてファイルを選択
              </p>
              <p className="text-slate-500 text-xs mt-3">
              対応形式: TXT, PDF, Excel (.xlsx), PowerPoint (.pptx), Word (.docx)
              </p>
            </div>
          </div>

          {/* メッセージ表示 */}
          {message && (
            <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
              <p className="text-sm text-slate-300">{message}</p>
            </div>
          )}

          {/* テキスト登録フォーム */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-lg font-bold text-white mb-4">📝 テキストで登録</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 block mb-1">タイトル</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例: 社内規定マニュアル"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="text-sm text-slate-400 block mb-1">内容</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="ドキュメントの内容を貼り付けてください..."
                  rows={6}
                  className="w-full p-3 bg-slate-700 border border-slate-600 text-white placeholder:text-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isLoading || !title.trim() || !content.trim()}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isLoading ? '登録中...' : '登録する'}
              </Button>
            </div>
          </div>

          {/* ドキュメント一覧 */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-lg font-bold text-white mb-4">
              📚 登録済みドキュメント（{documents.length}件）
            </h2>

            {documents.length === 0 ? (
              <p className="text-slate-400 text-center py-8">
                まだドキュメントが登録されていません
              </p>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-slate-700 rounded-lg p-4 border border-slate-600"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{doc.title}</h3>
                        <p className="text-slate-400 text-sm mt-1 line-clamp-2">
                          {doc.content}
                        </p>
                        <p className="text-slate-500 text-xs mt-2">
                          登録日: {new Date(doc.created_at).toLocaleDateString('ja-JP')}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleDelete(doc.id, doc.title)}
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20 ml-4"
                      >
                        🗑️ 削除
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}