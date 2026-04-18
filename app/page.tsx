'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      const assistantMessage: Message = { role: 'assistant', content: data.message };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* ヘッダー */}
      <header className="px-6 py-4 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="bg-blue-500 text-white rounded-lg p-1.5 text-sm">AI</span>
            ナレッジQA チャットボット
          </h1>
          <p className="text-sm text-slate-400 mt-1">RAG搭載 - 社内ドキュメントから回答します</p>
        </div>
      </header>

      {/* メッセージエリア */}
      <ScrollArea className="flex-1">
        <div className="max-w-3xl mx-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="text-center mt-32">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-slate-400 text-lg">質問を入力してください</p>
              <p className="text-slate-500 text-sm mt-2">社内ドキュメントに基づいて回答します</p>
            </div>
          )}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* アイコン */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-emerald-500 text-white'
                }`}>
                  {msg.role === 'user' ? 'U' : 'AI'}
                </div>
                {/* メッセージ */}
                <div
                  className={`p-4 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white rounded-tr-sm'
                      : 'bg-slate-700 text-slate-100 rounded-tl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-emerald-500 text-white">
                  AI
                </div>
                <div className="bg-slate-700 p-4 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* 入力エリア */}
      <div className="border-t border-slate-700 bg-slate-900/80 backdrop-blur-sm p-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="質問を入力してください..."
            disabled={isLoading}
            className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6"
          >
            送信
          </Button>
        </div>
      </div>
    </div>
  );
}