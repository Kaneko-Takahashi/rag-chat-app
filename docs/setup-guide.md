# RAG Chat App - セットアップガイド

## 📌 プロジェクト概要

RAG（Retrieval-Augmented Generation：検索拡張生成）を搭載した社内ナレッジQAチャットボットです。
社内ドキュメント（PDF・テキスト）をアップロードし、その内容に基づいてAIが質問に回答します。

### 目的
- 生成AI（LLM）を活用したアプリケーション開発の学習
- チャットボット構築スキルの習得
- RAG構成の設計・実装の理解
- ポートフォリオとしてGitHubに公開

### 技術スタック
|
 レイヤー 
|
 技術 
|
 説明 
|
|
----------
|
------
|
------
|
|
 IDE 
|
 Cursor 
|
 AI支援による高速開発ツール 
|
|
 フロントエンド 
|
 Next.js 16 + TypeScript 
|
 チャットUI 
|
|
 UIライブラリ 
|
 Tailwind CSS + shadcn/ui 
|
 モダンなデザイン 
|
|
 バックエンド 
|
 Next.js API Routes 
|
 APIエンドポイント 
|
|
 データベース 
|
 Supabase (PostgreSQL + pgvector) 
|
 データ保存・ベクトル検索 
|
|
 LLM 
|
 Claude API (Anthropic) 
|
 AI回答生成 
|
|
 バージョン管理 
|
 Git + GitHub + SourceTree 
|
 ソースコード管理 
|

---

## 📖 用語集

|
 用語 
|
 意味 
|
|
------
|
------
|
|
**
RAG
**
|
 Retrieval-Augmented Generation（検索拡張生成）。ドキュメントを検索し、その結果を基にAIが回答を生成する仕組み 
|
|
**
LLM
**
|
 Large Language Model（大規模言語モデル）。ChatGPTやClaudeなどのAIモデル 
|
|
**
Embedding
**
|
 テキストを数値（ベクトル）に変換すること。意味が似た文章は似た数値になる 
|
|
**
ベクトル検索
**
|
 Embeddingされた数値同士の類似度を計算して、関連するドキュメントを見つける方法 
|
|
**
pgvector
**
|
 PostgreSQLでベクトル検索を可能にする拡張機能 
|
|
**
Supabase
**
|
 データベース + 認証 + ストレージ + APIが全部セットになったサービス 
|
|
**
npm
**
|
 Node.jsのパッケージ（部品）を管理・インストールするツール 
|
|
**
チャンク
**
|
 ドキュメントを小さく分割した断片。RAGで検索しやすくするために使う 
|
|
**
API Key
**
|
 外部サービス（Claude、Supabase等）を利用するための認証キー 
|
|
**
shadcn/ui
**
|
 UIの基本パーツ（ボタン、入力欄等）を提供するライブラリ 
|
|
**
Radix
**
|
 UIの基本パーツを提供するライブラリ。アクセシビリティ（誰でも使いやすい設計）が組み込まれている 
|

---

## 🛠 Day 1 セットアップ手順

### Step 1: GitHub リポジトリ作成

1. GitHubにログイン
2. 「New repository」をクリック
3. 設定内容：
   - Repository name: `rag-chat-app`
   - Description: `RAG（検索拡張生成）を搭載した社内ナレッジQAチャットボット。Next.js + Supabase + Claude API で構築。`
   - 視認性: Public
   - README: ✅ ON
   - .gitignore: `Node` を選択
4. 「Create repository」をクリック

---

### Step 2: SourceTree でクローン（ローカルにコピー）

1. SourceTreeを開く
2. 「クローン」タブを選択（※「作成」ではない）
3. 設定内容：
   - URL: `https://github.com/ユーザー名/rag-chat-app.git`
   - 保存先: `C:\dev\rag-chat-app`
4. 「クローン」をクリック

> ⚠️ 注意: 「作成」を選ぶと別の新しいリポジトリになるため、必ず「クローン」を使う

---

### Step 3: Cursor でプロジェクトを開く

1. Cursorを起動
2. 「Open Folder」で `C:\dev\rag-chat-app` を開く

---

### Step 4: Node.js バージョン確認

ターミナルを開く（`Ctrl + J`）

```bash
node -v
結果: v22.11.0（Node.jsがインストール済みであることを確認）

Step 5: docs フォルダ作成
bash
mkdir docs
mkdir = 「make directory」の略。フォルダを作成するコマンド

Step 6: Next.js プロジェクト作成
既存の README.md が邪魔になるため、先に削除：

bash
del README.md
Next.js プロジェクトを作成：

bash
npx create-next-app@latest . --typescript --tailwind --app --use-npm
このコマンドの意味：

npx: パッケージを一時的にダウンロードして実行
create-next-app@latest: Next.jsプロジェクト作成ツールの最新版
.: 現在のフォルダに作成
--typescript: TypeScript を使用
--tailwind: Tailwind CSS（デザインツール）を使用
--app: App Router（Next.jsの最新ルーティング方式）を使用
--use-npm: パッケージ管理にnpmを使用
途中の質問：

「Ok to proceed? (y)」→ y を入力
Step 7: 動作確認
bash
npm run dev
ブラウザで http://localhost:3000 にアクセスし、Next.jsのデフォルト画面が表示されればOK

サーバー停止：

bash
Ctrl + C
「バッチ ジョブを終了しますか？」→ y を入力

Step 8: 必要パッケージのインストール
bash
npm install @supabase/supabase-js @anthropic-ai/sdk ai
インストールしたパッケージ：

@supabase/supabase-js: Supabase に接続するためのライブラリ
@anthropic-ai/sdk: Claude API を使うためのライブラリ
ai: AIチャットの便利機能を提供するライブラリ
Step 9: UIライブラリのインストール
bash
npm install shadcn@latest
shadcn の初期設定：

bash
npx shadcn init
質問への回答：

スタイル選択 → Radix（デフォルトのまま Enter）
プリセット選択 → Nova（デフォルトのまま Enter）
UIコンポーネントの追加：

bash
npx shadcn add input
npx shadcn add scroll-area
input: チャットの入力欄に使う部品
scroll-area: メッセージ表示エリアにスクロール機能をつける部品
Step 10: 環境変数ファイルの作成
bash
New-Item .env.local
.env.local に以下を記述：

text
# Anthropic (Claude) API Key
ANTHROPIC_API_KEY=your_api_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
⚠️ .env.local は秘密情報を保存するファイル。GitHubには公開されない（.gitignoreで除外済み）

Step 11: Supabase プロジェクト作成
https://supabase.com にアクセス
「New project」をクリック
設定内容：
Project name: rag-chat-app
Database password: 強力なパスワード（メモしておく）
Region: Asia-Pacific
「Create new project」をクリック
STATUS が「Healthy」🟢 になるまで待つ（2〜3分）
⚠️ 作成直後は「Unhealthy」🔴 と表示される。これはセットアップ中のため正常。ページを更新（F5）して待つ。

Step 12: Supabase API キーの取得
Supabase ダッシュボード → 左メニュー「⚙️ Settings」
「API Keys」をクリック
以下をコピーして .env.local に貼り付け：
API URL: NEXT_PUBLIC_SUPABASE_URL に設定
Publishable key: NEXT_PUBLIC_SUPABASE_ANON_KEY に設定
Step 13: Supabase 接続ファイルの作成
bash
New-Item lib/supabase.ts
lib/supabase.ts に以下を記述：

typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
Step 14: Supabase データベースのセットアップ
Supabase ダッシュボード → 左メニュー「SQL Editor」で以下のSQLを順番に実行：

① ベクトル検索の拡張機能を有効化
sql
CREATE EXTENSION IF NOT EXISTS vector;
pgvector をインストール。テキストの意味をベクトル（数値）として保存・検索できるようになる。

② ドキュメント関連テーブルの作成
sql
-- ドキュメントテーブル
CREATE TABLE documents (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- チャンク（分割されたドキュメント）テーブル
CREATE TABLE document_chunks (
  id BIGSERIAL PRIMARY KEY,
  document_id BIGINT REFERENCES documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding VECTOR(1024),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
documents テーブル: アップロードしたPDFやテキストの原本を保存する場所
document_chunks テーブル: 原本を小さく分割した断片と、その意味をベクトル（数値）に変換したデータを保存する場所（RAGの検索に使う）
③ 類似検索関数の作成
sql
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding VECTOR(1024),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id BIGINT,
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS 
$$
BEGIN
  RETURN QUERY
  SELECT
    document_chunks.id,
    document_chunks.content,
    1 - (document_chunks.embedding <=> query_embedding) AS similarity
  FROM document_chunks
  WHERE 1 - (document_chunks.embedding <=> query_embedding) > match_threshold
  ORDER BY document_chunks.embedding <=> query_embedding
  LIMIT match_count;
END;
$$
;
ユーザーの質問に似たドキュメントをデータベースから見つけるための関数（RAGの心臓部分）

④ チャット履歴テーブルの作成
sql
-- チャット履歴テーブル
CREATE TABLE chat_messages (
  id BIGSERIAL PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
チャットの会話履歴を保存するテーブル

Step 15: チャットAPI の作成
bash
mkdir app/api
mkdir app/api/chat
New-Item app/api/chat/route.ts
app/api/chat/route.ts にAPIのコードを記述（Claude APIと連携し、RAG検索 → 回答生成 → 履歴保存を行う）

Step 16: チャットUI の作成
app/page.tsx にモダンなチャットUIを実装：

ダークテーマのデザイン
ユーザー / AIのメッセージをアイコン付きで表示
ローディングアニメーション（考え中...）
Enter キーで送信可能
Step 17: Claude API キーの設定
https://console.anthropic.com/ にアクセス
「APIキーを作成」をクリック
キー名: rag-chat-app
作成されたキーを .env.local の ANTHROPIC_API_KEY= に貼り付け
Step 18: 動作確認
bash
npm run dev
ブラウザで http://localhost:3000 にアクセスし、チャットUIが表示されればDay 1 完了！
GET 200 が表示されれば正常動作。

💡 左下の「N」アイコンはNext.jsの開発ツール。開発中のみ表示され、本番環境では表示されない。

📅 Day 2 以降の予定
Day 2: RAGパイプライン実装
 Embedding生成機能の実装（テキスト → ベクトル変換）
 ドキュメントのチャンク分割ロジック
 ドキュメントアップロード機能（PDF・テキスト）
 ベクトル類似検索の動作確認
Day 3: ドキュメント管理画面
 ドキュメントアップロード画面の作成
 アップロード済みドキュメント一覧表示
 ドキュメントの削除機能
Day 4: RAG統合テスト
 サンプル社内ドキュメントの投入
 チャットでの質問 → RAG検索 → 回答生成の一連テスト
 回答精度の確認・調整
Day 5: 機能改善・UI改善
 ソース引用表示（どのドキュメントから回答したか）
 チャット履歴の表示機能
 favicon の設定
 レスポンシブデザイン対応
Day 6: 仕上げ・GitHub公開
 README.md の作成（プロジェクト説明）
 SourceTree でコミット・プッシュ
 GitHub公開の最終確認
📁 現在のプロジェクト構成
text
C:\dev\rag-chat-app\
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts        # チャットAPI（Claude連携）
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                # チャットUI（メイン画面）
├── components/
│   └── ui/                     # shadcn/ui コンポーネント
├── docs/
│   └── setup-guide.md          # このドキュメント
├── lib/
│   ├── supabase.ts             # Supabase接続設定
│   └── utils.ts
├── .env.local                  # 環境変数（秘密情報）
├── .gitignore                  # Gitで管理しないファイルの指定
├── package.json                # プロジェクト設定・依存パッケージ
├── README.md
└── tsconfig.json               # TypeScript設定



---

## 📝 SourceTree の使い方

### SourceTree とは
Gitの操作をGUI（画面操作）で行えるツール。コマンドを覚えなくても、ボタン操作でコミット・プッシュができる。

### 基本用語

| 用語 | 意味 |
|------|------|
| **クローン** | GitHubのリポジトリをローカル（自分のPC）にコピーすること |
| **コミット** | ファイルの変更を記録すること（セーブポイントのようなもの） |
| **プッシュ** | ローカルのコミットをGitHubにアップロードすること |
| **プル** | GitHubの最新状態をローカルにダウンロードすること |
| **ステージング** | コミットするファイルを選択すること |

### 初回セットアップ（本プロジェクトで実施済み）

1. SourceTreeを開く
2. 上部タブ「**クローン**」を選択
   - ⚠️「作成」ではない。「作成」だと別の新しいリポジトリになってしまう
3. 設定内容：
   - ソースURL: `https://github.com/Kaneko-Takahashi/rag-chat-app.git`
   - 保存先: `C:\dev\rag-chat-app`
   - 名前: `rag-chat-app`
4. 「クローン」ボタンをクリック

### コミット & プッシュの手順（GitHub公開時に使用）

#### ① SourceTree でコミット
1. SourceTreeを開き、`rag-chat-app` プロジェクトを選択
2. 「ファイルステータス」タブを確認
3. 変更されたファイルが一覧表示される
4. コミットしたいファイルにチェック ✅ を入れる（ステージング）
5. 下部のコミットメッセージ欄にメッセージを入力
   - 例: `Day1: プロジェクト初期セットアップ完了`
6. 「コミット」ボタンをクリック

#### ② GitHub にプッシュ
1. 上部メニューの「プッシュ」ボタンをクリック
2. ブランチ `main` にチェック ✅ が入っていることを確認
3. 「プッシュ」をクリック
4. GitHubのリポジトリページを開いて、ファイルが反映されていればOK

### コミットメッセージの書き方（推奨）

| 例 | 意味 |
|----|------|
| `Day1: プロジェクト初期セットアップ完了` | 初日の作業完了 |
| `feat: チャットUI作成` | 新機能の追加 |
| `fix: API接続エラーを修正` | バグ修正 |
| `docs: セットアップガイド追加` | ドキュメントの追加・修正 |