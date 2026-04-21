'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';

type Source = {
  content: string;
  similarity: number;
};

type Message = {
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSources, setShowSources] = useState<number | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch('/api/chat/history');
        const data = await response.json();
        if (data.messages) {
          const history: Message[] = data.messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
          }));
          setMessages(history);
        }
      } catch (error) {
        console.error('履歴読込エラー:', error);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        sources: data.sources || [],
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!confirm('チャット履歴をすべて削除しますか？')) return;
    try {
      await fetch('/api/chat/history', { method: 'DELETE' });
      setMessages([]);
      setShowMenu(false);
    } catch (error) {
      console.error('削除エラー:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      {/* ヘッダー */}
      <header className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="bg-blue-500 text-white rounded-lg p-1 sm:p-1.5 text-xs sm:text-sm">AI</span>
              <span className="truncate">ナレッジQA チャットボット</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 sm:mt-1 hidden sm:block">RAG搭載 - 社内ドキュメントから回答します</p>
          </div>

          {/* PC用メニュー */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              onClick={clearHistory}
              className="text-slate-400 hover:text-red-400 text-sm"
            >
              🗑️ 履歴削除
            </button>
            <a href="/documents" className="text-blue-400 hover:text-blue-300 text-sm">
              📄 ドキュメント管理 →
            </a>
          </div>

          {/* スマホ用メニューボタン */}
          <div className="sm:hidden">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-white text-xl p-2"
            >
              ☰
            </button>
          </div>
        </div>

        {/* スマホ用ドロップダウンメニュー */}
        {showMenu && (
          <div className="sm:hidden mt-2 bg-slate-800 rounded-lg p-3 space-y-2">
            <button
              onClick={clearHistory}
              className="block w-full text-left text-slate-300 hover:text-red-400 text-sm py-2 px-3 rounded hover:bg-slate-700"
            >
              🗑️ 履歴削除
            </button>
            <a
              href="/documents"
              className="block text-blue-400 hover:text-blue-300 text-sm py-2 px-3 rounded hover:bg-slate-700"
            >
              📄 ドキュメント管理 →
            </a>
          </div>
        )}
      </header>

      {/* メッセージエリア */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
          {messages.length === 0 && (
            <div className="text-center mt-20 sm:mt-32">
              <div className="text-5xl sm:text-6xl mb-4">💬</div>
              <p className="text-slate-400 text-base sm:text-lg">質問を入力してください</p>
              <p className="text-slate-500 text-xs sm:text-sm mt-2">社内ドキュメントに基づいて回答します</p>
            </div>
          )}
          {messages.map((msg, index) => (
            <div key={index}>
              <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start gap-2 sm:gap-3 max-w-[95%] sm:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-emerald-500 text-white'
                  }`}>
                    {msg.role === 'user' ? 'U' : 'AI'}
                  </div>
                  <div
                    className={`p-3 sm:p-4 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-blue-500 text-white rounded-tr-sm'
                        : 'bg-slate-700 text-slate-100 rounded-tl-sm'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">{msg.content}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* ソース引用表示 */}
              {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                <div className="ml-9 sm:ml-11 mt-2">
                  <button
                    onClick={() => setShowSources(showSources === index ? null : index)}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    {showSources === index ? '▼ ソースを閉じる' : `▶ 参照ソース（${msg.sources.length}件）`}
                  </button>
                  {showSources === index && (
                    <div className="mt-2 space-y-2">
                      {msg.sources.map((source, sIndex) => (
                        <div
                          key={sIndex}
                          className="bg-slate-800 border border-slate-600 rounded-lg p-2 sm:p-3 text-xs"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-emerald-400 font-semibold">ソース {sIndex + 1}</span>
                            <span className="text-slate-400">類似度: {source.similarity}%</span>
                          </div>
                          <p className="text-slate-300 break-words">{source.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold bg-emerald-500 text-white">
                  AI
                </div>
                <div className="bg-slate-700 p-3 sm:p-4 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 入力エリア */}
      <div className="border-t border-slate-700 bg-slate-900/80 backdrop-blur-sm p-3 sm:p-4">
        <div className="max-w-3xl mx-auto flex gap-2 sm:gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="質問を入力..."
            disabled={isLoading}
            className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6"
          >
            送信
          </Button>
        </div>
      </div>
    </div>
  );
}