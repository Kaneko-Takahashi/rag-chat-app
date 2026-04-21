# 📚 ナレッジQA チャットボット（RAG Chat App）

RAG（検索拡張生成）を搭載した社内ナレッジQAチャットボットです。
社内ドキュメントをアップロードし、その内容に基づいてAIが質問に回答します。

## デモ画面

### チャット画面
- AIが社内ドキュメントに基づいて回答
- 参照ソースの表示（どのドキュメントから回答したか）
- チャット履歴の保存・削除

### ドキュメント管理画面
- テキスト入力での登録
- ファイルのドラッグ＆ドロップでアップロード
- 対応形式: TXT, PDF, Excel(.xlsx), PowerPoint(.pptx), Word(.docx)
- ドキュメントの削除

## 技術スタック

| レイヤー | 技術 |
|----------|------|
| フロントエンド | Next.js + TypeScript |
| UIライブラリ | Tailwind CSS + shadcn/ui |
| バックエンド | Next.js API Routes |
| データベース | Supabase (PostgreSQL + pgvector) |
| LLM | Claude API (Anthropic) |
| バージョン管理 | Git + GitHub |

## 主な機能

- RAG（Retrieval-Augmented Generation）による社内ドキュメント検索・回答生成
- チャットボット（社内QA対応）
- ドキュメント管理（登録・一覧・削除）
- ファイルアップロード（TXT / PDF / Excel / PowerPoint / Word）
- チャット履歴管理
- 参照ソース引用表示
- レスポンシブデザイン（PC・スマホ対応）

## セットアップ手順

### 1. リポジトリをクローン

git clone https://github.com/Kaneko-Takahashi/rag-chat-app.git
cd rag-chat-app

### 2. パッケージをインストール

npm install

### 3. 環境変数を設定

.env.local ファイルを作成し、以下を設定してください。

ANTHROPIC_API_KEY=あなたのClaude APIキー
NEXT_PUBLIC_SUPABASE_URL=あなたのSupabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=あなたのSupabase Anon Key

### 4. Supabase データベースをセットアップ

Supabase の SQL Editor で以下を実行してください。

1. pgvector拡張の有効化
2. documents テーブルの作成
3. document_chunks テーブルの作成
4. chat_messages テーブルの作成

詳細は docs/setup-guide.md を参照してください。

### 5. 開発サーバーを起動

npm run dev

ブラウザで http://localhost:3000 にアクセスしてください。

## プロジェクト構成

- app/ --- アプリケーション本体
  - api/chat/route.ts --- チャットAPI（Claude + RAG連携）
  - api/chat/history/route.ts --- チャット履歴API
  - api/documents/route.ts --- ドキュメントCRUD API
  - api/documents/upload/route.ts --- ファイルアップロードAPI
  - api/documents/[id]/route.ts --- ドキュメント削除API
  - documents/page.tsx --- ドキュメント管理画面
  - page.tsx --- チャットUI（メイン画面）
  - layout.tsx --- レイアウト設定
- lib/ --- ライブラリ
  - rag/embeddings.ts --- チャンク分割・ドキュメント取込
  - rag/retriever.ts --- キーワード検索
  - supabase.ts --- Supabase接続設定
- docs/ --- ドキュメント
  - setup-guide.md --- セットアップガイド
- supabase/functions/embed/ --- Edge Functions

## ドキュメント

詳細なセットアップ手順・用語集は docs/setup-guide.md に記載しています。

## 作者

Kaneko-Takahashi