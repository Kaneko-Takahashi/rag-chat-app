# RAG Chat App - セットアップガイド

## プロジェクト概要

RAG（Retrieval-Augmented Generation：検索拡張生成）を搭載した社内ナレッジQAチャットボットです。
社内ドキュメント（PDF・テキスト・Excel・PowerPoint・Word）をアップロードし、その内容に基づいてAIが質問に回答します。

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
 Next.js + TypeScript 
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
 Supabase（PostgreSQL + pgvector） 
|
 データ保存・ベクトル検索 
|
|
 LLM 
|
 Claude API（Anthropic） 
|
 AI回答生成 
|
|
 Embedding 
|
 Supabase Edge Function + Hugging Face 
|
 テキストのベクトル化 
|
|
 バージョン管理 
|
 Git + GitHub + SourceTree 
|
 ソースコード管理 
|

---

## 用語集

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
 RAG 
|
 Retrieval-Augmented Generation（検索拡張生成）。ドキュメントを検索し、その結果を基にAIが回答を生成する仕組み 
|
|
 LLM 
|
 Large Language Model（大規模言語モデル）。ChatGPTやClaudeなどのAIモデル 
|
|
 Embedding 
|
 テキストを数値（ベクトル）に変換すること。意味が似た文章は似た数値になる 
|
|
 ベクトル検索 
|
 Embeddingされた数値同士の類似度を計算して、関連するドキュメントを見つける方法 
|
|
 pgvector 
|
 PostgreSQLでベクトル検索を可能にする拡張機能 
|
|
 Supabase 
|
 データベース + 認証 + ストレージ + APIが全部セットになったサービス 
|
|
 npm 
|
 Node.jsのパッケージ（部品）を管理・インストールするツール 
|
|
 チャンク 
|
 ドキュメントを小さく分割した断片。RAGで検索しやすくするために使う 
|
|
 API Key 
|
 外部サービス（Claude、Supabase等）を利用するための認証キー 
|
|
 shadcn/ui 
|
 UIの基本パーツ（ボタン、入力欄等）を提供するライブラリ 
|
|
 Radix 
|
 UIの基本パーツを提供するライブラリ。アクセシビリティ（誰でも使いやすい設計）が組み込まれている 
|
|
 Edge Function 
|
 Supabase上で動くサーバーレス関数。今回はEmbedding生成に使用 
|
|
 officeparser 
|
 Word・PowerPointファイルからテキストを抽出するライブラリ 
|
|
 Scoop 
|
 Windows用のパッケージマネージャー。コマンドラインでソフトをインストールできる 
|

---

## Day 1 セットアップ手順

### Step 1: GitHub リポジトリ作成

1. GitHubにログイン
2. 「New repository」をクリック
3. 設定内容
   - Repository name: rag-chat-app
   - Description: RAG（検索拡張生成）を搭載した社内ナレッジQAチャットボット。Next.js + Supabase + Claude API で構築。
   - 視認性: Public
   - README: ON
   - .gitignore: Node を選択
4. 「Create repository」をクリック

### Step 2: SourceTree でクローン（ローカルにコピー）

1. SourceTreeを開く
2. 「クローン」タブを選択（「作成」ではない）
3. 設定内容
   - URL: https://github.com/ユーザー名/rag-chat-app.git
   - 保存先: C:\dev\rag-chat-app
4. 「クローン」をクリック

注意: 「作成」を選ぶと別の新しいリポジトリになるため、必ず「クローン」を使う

### Step 3: Cursor でプロジェクトを開く

1. Cursorを起動
2. 「Open Folder」で C:\dev\rag-chat-app を開く

### Step 4: Node.js バージョン確認

ターミナルを開く（Ctrl + J）

```bash
node -v
結果: v22.11.0（Node.jsがインストール済みであることを確認）

Step 5: docs フォルダ作成
bash
mkdir docs
mkdir = 「make directory」の略。フォルダを作成するコマンド

Step 6: Next.js プロジェクト作成
既存の README.md が邪魔になるため、先に削除

bash
del README.md
Next.js プロジェクトを作成

bash
npx create-next-app@latest . --typescript --tailwind --app --use-npm
コマンドの意味

npx: パッケージを一時的にダウンロードして実行
create-next-app@latest: Next.jsプロジェクト作成ツールの最新版
. : 現在のフォルダに作成
--typescript: TypeScript を使用
--tailwind: Tailwind CSS（デザインツール）を使用
--app: App Router（Next.jsの最新ルーティング方式）を使用
--use-npm: パッケージ管理にnpmを使用
途中の質問: 「Ok to proceed? (y)」に y を入力

Step 7: 動作確認
bash
npm run dev
ブラウザで http://localhost:3000 にアクセスし、Next.jsのデフォルト画面が表示されればOK

サーバー停止: Ctrl + C → 「バッチ ジョブを終了しますか？」に y を入力

Step 8: 必要パッケージのインストール
bash
npm install @supabase/supabase-js @anthropic-ai/sdk ai
インストールしたパッケージ

@supabase/supabase-js: Supabase に接続するためのライブラリ
@anthropic-ai/sdk: Claude API を使うためのライブラリ
ai: AIチャットの便利機能を提供するライブラリ
Step 9: UIライブラリのインストール
bash
npm install shadcn@latest
shadcn の初期設定

bash
npx shadcn init
質問への回答

スタイル選択: Radix（デフォルトのまま Enter）
プリセット選択: Nova（デフォルトのまま Enter）
UIコンポーネントの追加

bash
npx shadcn add input
npx shadcn add scroll-area
input: チャットの入力欄に使う部品
scroll-area: メッセージ表示エリアにスクロール機能をつける部品
Step 10: 環境変数ファイルの作成
bash
New-Item .env.local
.env.local に以下を記述

text
# Anthropic (Claude) API Key
ANTHROPIC_API_KEY=your_api_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
注意: .env.local は秘密情報を保存するファイル。GitHubには公開されない（.gitignoreで除外済み）

Step 11: Supabase プロジェクト作成
https://supabase.com にアクセス
「New project」をクリック
設定内容
Project name: rag-chat-app
Database password: 強力なパスワード（メモしておく）
Region: Asia-Pacific
「Create new project」をクリック
STATUS が Healthy になるまで待つ（2〜3分）
注意: 作成直後は Unhealthy と表示される。これはセットアップ中のため正常。ページを更新（F5）して待つ。

Step 12: Supabase API キーの取得
Supabase ダッシュボード → 左メニュー Settings
「API Keys」をクリック
以下をコピーして .env.local に貼り付け
API URL → NEXT_PUBLIC_SUPABASE_URL に設定
Publishable key → NEXT_PUBLIC_SUPABASE_ANON_KEY に設定
Step 13: Supabase 接続ファイルの作成
bash
New-Item lib/supabase.ts
lib/supabase.ts に以下を記述

typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
Step 14: Supabase データベースのセットアップ
Supabase ダッシュボード → 左メニュー SQL Editor で以下のSQLを順番に実行

14-1: ベクトル検索の拡張機能を有効化
sql
CREATE EXTENSION IF NOT EXISTS vector;
pgvector をインストール。テキストの意味をベクトル（数値）として保存・検索できるようになる。

14-2: ドキュメント関連テーブルの作成
sql
CREATE TABLE documents (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE document_chunks (
  id BIGSERIAL PRIMARY KEY,
  document_id BIGINT REFERENCES documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding VECTOR(1024),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
documents テーブル: アップロードしたPDFやテキストの原本を保存する場所
document_chunks テーブル: 原本を小さく分割した断片と、その意味をベクトル（数値）に変換したデータを保存する場所（RAGの検索に使う）
14-3: 類似検索関数の作成
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

14-4: チャット履歴テーブルの作成
sql
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
app/page.tsx にモダンなチャットUIを実装

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
ブラウザで http://localhost:3000 にアクセスし、チャットUIが表示されればDay 1 完了

補足: 左下の「N」アイコンはNext.jsの開発ツール。開発中のみ表示され、本番環境では表示されない。

Day 2 RAGパイプライン実装
Step 19: RAG用ファイルの作成
bash
mkdir lib/rag
New-Item lib/rag/embeddings.ts
New-Item lib/rag/retriever.ts
embeddings.ts: テキストをベクトル（数値）に変換し、ドキュメントを取り込む処理
retriever.ts: ユーザーの質問に関連するドキュメントを検索する処理
Step 20: Scoop のインストール（Windows用パッケージマネージャー）
Supabase CLI をインストールするために、まず Scoop が必要

bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
質問が出たら Y を入力

bash
irm get.scoop.sh | iex
Scoop = Windows用のパッケージマネージャー。コマンドラインでソフトウェアをインストールできるツール

Step 21: Supabase CLI のインストール
bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
npm install -g supabase ではエラーになるため、Scoop経由でインストール

Step 22: Supabase Edge Function の作成
bash
supabase init
質問が出たら Enter でデフォルトを選択

bash
supabase link
パスワードを聞かれたら、Supabase プロジェクト作成時に設定したデータベースパスワードを入力

bash
supabase functions new embed
Denoの設定確認が出たら Y を入力

supabase/functions/embed/index.ts にEmbedding生成のコードを記述（Hugging Faceの無料APIを使用）

デプロイ

bash
supabase functions deploy embed
注意: 「WARNING: Docker is not running」は無視してOK

Step 23: ドキュメント管理画面の作成
bash
mkdir app/documents
New-Item app/documents/page.tsx
mkdir app/api/documents
New-Item app/api/documents/route.ts
実装した機能

ドキュメントの新規登録（テキスト入力）
登録済みドキュメントの一覧表示
チャット画面とドキュメント管理画面の相互リンク
Step 24: サンプル社内ドキュメントの登録
以下の3件をテキスト入力で登録

社内休暇制度ガイド（有給休暇、夏季休暇、慶弔休暇等）
経費精算マニュアル（交通費、接待交際費、備品購入等）
情報セキュリティポリシー（パスワード管理、リモートワーク等）
Step 25: RAGチャットの動作テスト
チャット画面で「有給休暇は何日もらえますか？」と質問し、登録したドキュメントに基づいた回答が返ることを確認

Step 26: 削除機能の追加
bash
mkdir "app/api/documents/[id]"
New-Item "app/api/documents/[id]/route.ts"
実装した機能

各ドキュメントに削除ボタンを追加
削除前に確認ダイアログを表示
削除時にドキュメントとチャンクを自動で一括削除
Step 27: ファイルアップロード機能の追加
必要なライブラリをインストール

bash
npm install pdf-parse-new xlsx mammoth officeparser
各ライブラリの役割

pdf-parse-new: PDFからテキスト抽出
xlsx: Excelファイルからテキスト抽出
mammoth: 当初Word用に導入（後にofficeparserに統合）
officeparser: Word(.docx)・PowerPoint(.pptx)からテキスト抽出
bash
New-Item app/api/documents/upload/route.ts -Force
実装した機能

ドラッグ＆ドロップでファイルアップロード
クリックしてファイル選択も可能
対応形式: TXT, PDF, Excel(.xlsx), PowerPoint(.pptx), Word(.docx)
ファイルからテキストを自動抽出してRAGに登録
Step 28: ファイルアップロードテスト
以下のファイルでテスト実施・成功

社内イベント案内.txt（テキストファイル）
会議室利用ガイド.docx（Wordファイル）
社内研修プログラム.pptx（PowerPointファイル）
出張申請ガイド.pdf（PDFファイル）
社員連絡先一覧.xlsx（Excelファイル）
SourceTree の使い方
SourceTree とは
Gitの操作をGUI（画面操作）で行えるツール。コマンドを覚えなくても、ボタン操作でコミット・プッシュができる。

基本用語
用語	意味
クローン	GitHubのリポジトリをローカル（自分のPC）にコピーすること
コミット	ファイルの変更を記録すること（セーブポイントのようなもの）
プッシュ	ローカルのコミットをGitHubにアップロードすること
プル	GitHubの最新状態をローカルにダウンロードすること
ステージング	コミットするファイルを選択すること
初回セットアップ（本プロジェクトで実施済み）
SourceTreeを開く
上部タブ「クローン」を選択（「作成」ではない）
設定内容
ソースURL: https://github.com/Kaneko-Takahashi/rag-chat-app.git
保存先: C:\dev\rag-chat-app
名前: rag-chat-app
「クローン」ボタンをクリック
コミットとプッシュの手順
SourceTreeを開き、rag-chat-app プロジェクトを選択
「ファイルステータス」タブを確認
変更されたファイルが一覧表示される
コミットしたいファイルにチェックを入れる（ステージング）
下部のコミットメッセージ欄にメッセージを入力
「コミット」ボタンをクリック
上部メニューの「プッシュ」ボタンをクリック（自動プッシュ設定の場合は不要）
コミットメッセージの書き方（推奨）
例	意味
Day1: プロジェクト初期セットアップ完了	初日の作業完了
Day2: RAGパイプライン実装・ファイルアップロード機能追加	2日目の作業完了
feat: チャットUI作成	新機能の追加
fix: API接続エラーを修正	バグ修正
docs: セットアップガイド追加	ドキュメントの追加・修正
Day 3 以降の予定
Day 3: 機能改善・UI改善
ソース引用表示（どのドキュメントから回答したか）
チャット履歴の表示機能
favicon の設定
レスポンシブデザイン対応
Day 4: 仕上げ・GitHub公開
README.md の作成（プロジェクト説明）
最終テスト・仕上げ
SourceTree でコミット・GitHub公開の最終確認
現在のプロジェクト構成
text
C:\dev\rag-chat-app\
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts              # チャットAPI（Claude + RAG連携）
│   │   └── documents/
│   │       ├── route.ts              # ドキュメントCRUD API
│   │       ├── upload/
│   │       │   └── route.ts          # ファイルアップロードAPI
│   │       └── [id]/
│   │           └── route.ts          # ドキュメント削除API
│   ├── documents/
│   │   └── page.tsx                  # ドキュメント管理画面
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                      # チャットUI（メイン画面）
├── components/
│   └── ui/                           # shadcn/ui コンポーネント
├── docs/
│   └── setup-guide.md                # このドキュメント
├── lib/
│   ├── rag/
│   │   ├── embeddings.ts             # Embedding生成・チャンク分割・ドキュメント取込
│   │   └── retriever.ts              # ベクトル類似検索
│   ├── supabase.ts                   # Supabase接続設定
│   └── utils.ts
├── supabase/
│   └── functions/
│       └── embed/
│           └── index.ts              # Edge Function（Embedding生成）
├── .env.local                        # 環境変数（秘密情報）
├── .gitignore                        # Gitで管理しないファイルの指定
├── package.json                      # プロジェクト設定・依存パッケージ
└── tsconfig.json                     # TypeScript設定