# 📚 ナレッジQA チャットボット（RAG Chat App）

RAG（検索拡張生成）を搭載した社内ナレッジQAチャットボットです。  
社内ドキュメントをアップロードし、その内容に基づいてAIが質問に回答します。

## デモ画面

### チャット画面
- AIが社内ドキュメントに基づいて回答
- 参照ソースの表示（どのドキュメントから回答したか）
- 類似度（%）の表示
- チャット履歴の保存・削除
- マークダウン形式の回答表示

### ドキュメント管理画面
- テキスト入力での登録
- ファイルのドラッグ＆ドロップでアップロード
- 対応形式: TXT, PDF, Excel(.xlsx / .xls), PowerPoint(.pptx), Word(.docx)
- ドキュメントの一覧表示
- ドキュメントの削除

## 本番URL

Vercel にデプロイ済みです。  
本番URLは Vercel の Deployments / Domains から確認できます。

## 技術スタック

| レイヤー | 技術 |
|----------|------|
| フロントエンド | Next.js 16 + TypeScript |
| UIライブラリ | Tailwind CSS + shadcn/ui |
| バックエンド | Next.js Route Handlers |
| データベース | Supabase (PostgreSQL + pgvector) |
| LLM | Claude API (Anthropic) |
| ドキュメント解析 | officeparser, xlsx |
| Markdown表示 | react-markdown |
| デプロイ | Vercel |
| バージョン管理 | Git + GitHub |

## 主な機能

- RAG（Retrieval-Augmented Generation）による社内ドキュメント検索・回答生成
- チャットボット（社内QA対応）
- ドキュメント管理（登録・一覧・削除）
- ファイルアップロード（TXT / PDF / Excel / PowerPoint / Word）
- チャット履歴管理（読込・削除）
- 参照ソース引用表示（参照元 + 類似度%）
- マークダウン表示対応
- レスポンシブデザイン（PC・スマホ対応）

## セットアップ手順

### 1. リポジトリをクローン

```bash
git clone https://github.com/Kaneko-Takahashi/rag-chat-app.git
cd rag-chat-app
```

### 2. パッケージをインストール

```bash
npm install
```

### 3. 環境変数を設定

プロジェクト直下に `.env.local` ファイルを作成し、以下を設定してください。

```env
ANTHROPIC_API_KEY=あなたのClaude APIキー
NEXT_PUBLIC_SUPABASE_URL=あなたのSupabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=あなたのSupabase Anon Key
```

### 4. Supabase データベースをセットアップ

Supabase の SQL Editor で以下を実行してください。

1. pgvector 拡張の有効化
2. `documents` テーブルの作成
3. `document_chunks` テーブルの作成
4. `chat_messages` テーブルの作成

詳細は `docs/setup-guide.md` を参照してください。

### 5. 開発サーバーを起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスしてください。

## デプロイ手順

### Vercel へのデプロイ

1. GitHub にコードを push
2. Vercel でリポジトリを Import
3. Environment Variables に以下を設定
4. Deploy を実行

設定する環境変数:

```env
ANTHROPIC_API_KEY=あなたのClaude APIキー
NEXT_PUBLIC_SUPABASE_URL=あなたのSupabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=あなたのSupabase Anon Key
```

## Vercelデプロイ対応メモ

Vercel デプロイ時に発生した問題と対応内容のメモです。

### 1. pdf-parse の型エラー対応
`pdf-parse` は Vercel のビルド環境で ESM import の型エラーが発生したため、PDF処理を `officeparser` に統一しました。

対応内容:
- `pdf-parse` の使用を中止
- PDF の読み取りを `officeparser.parseOffice()` に統一
- `pdf-parse` を依存関係から削除

### 2. Supabase Edge Functions の Deno エラー対応
`supabase/functions/embed/index.ts` は Deno 環境向けのファイルですが、Vercel の Next.js ビルド時に TypeScript チェック対象となり、`Cannot find name 'Deno'` エラーが発生しました。

対応内容:
- `tsconfig.json` の `exclude` に `supabase/functions` を追加
- Next.js のビルド対象から Supabase Edge Functions を除外

修正後の `tsconfig.json` のポイント:

```json
"exclude": [
  "node_modules",
  "supabase/functions"
]
```

## プロジェクト構成

```text
app/
  api/
    chat/
      route.ts                  # チャットAPI（Claude + RAG連携）
      history/
        route.ts                # チャット履歴API
    documents/
      route.ts                  # ドキュメントCRUD API
      upload/
        route.ts                # ファイルアップロードAPI
      [id]/
        route.ts                # ドキュメント削除API
  documents/
    page.tsx                    # ドキュメント管理画面
  layout.tsx                    # レイアウト設定
  page.tsx                      # チャットUI（メイン画面）

components/
  ui/                           # shadcn/ui コンポーネント

lib/
  rag/
    embeddings.ts               # チャンク分割・ドキュメント取込
    retriever.ts                # キーワード検索
  supabase.ts                   # Supabase接続設定

docs/
  setup-guide.md                # セットアップガイド

supabase/
  functions/
    embed/
      index.ts                  # Supabase Edge Function
```

## 動作確認済み機能

- チャットで質問送信
- Claude API による回答生成
- RAG によるドキュメント検索
- 参照ソース表示
- 類似度（%）表示
- チャット履歴の読込・削除
- ドキュメント登録・一覧・削除
- TXT / PDF / Excel / PowerPoint / Word ファイルのアップロード
- マークダウン表示
- Vercel 本番デプロイ

## ドキュメント

詳細なセットアップ手順・用語集は `docs/setup-guide.md` に記載しています。

## 今後の改善候補

- ベクトル検索の高度化
- 認証機能の追加
- UI/UXの改善
- faviconデザインの調整
- エラーハンドリング強化
- 本番運用向け監視・ログ改善

## 作者

Kaneko-Takahashi
