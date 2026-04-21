# RAG Chat App - セットアップガイド

## プロジェクト概要

RAG（Retrieval-Augmented Generation：検索拡張生成）を搭載した社内ナレッジQAチャットボットです。社内ドキュメント（PDF・テキスト・Excel・PowerPoint・Word）をアップロードし、その内容に基づいてAIが質問に回答します。

### 目的

- 生成AI（LLM）を活用したアプリケーション開発の学習
- チャットボット構築スキルの習得
- RAG構成の設計・実装の理解
- ポートフォリオとしてGitHubに公開

### 技術スタック

| レイヤー | 技術 | 説明 |
|----------|------|------|
| IDE | Cursor | AI支援による高速開発ツール |
| フロントエンド | Next.js + TypeScript | チャットUI |
| UIライブラリ | Tailwind CSS + shadcn/ui | モダンなデザイン |
| バックエンド | Next.js API Routes | APIエンドポイント |
| データベース | Supabase（PostgreSQL + pgvector） | データ保存・ベクトル検索 |
| LLM | Claude API（Anthropic） | AI回答生成 |
| バージョン管理 | Git + GitHub + SourceTree | ソースコード管理 |

---

## 用語集

| 用語 | 意味 |
|------|------|
| RAG | Retrieval-Augmented Generation（検索拡張生成）。ドキュメントを検索し、その結果を基にAIが回答を生成する仕組み |
| LLM | Large Language Model（大規模言語モデル）。ChatGPTやClaudeなどのAIモデル |
| Embedding | テキストを数値（ベクトル）に変換すること。意味が似た文章は似た数値になる |
| ベクトル検索 | Embeddingされた数値同士の類似度を計算して、関連するドキュメントを見つける方法 |
| pgvector | PostgreSQLでベクトル検索を可能にする拡張機能 |
| Supabase | データベース + 認証 + ストレージ + APIが全部セットになったサービス |
| npm | Node.jsのパッケージ（部品）を管理・インストールするツール |
| チャンク | ドキュメントを小さく分割した断片。RAGで検索しやすくするために使う |
| API Key | 外部サービス（Claude、Supabase等）を利用するための認証キー |
| shadcn/ui | UIの基本パーツ（ボタン、入力欄等）を提供するライブラリ |
| Radix | UIの基本パーツを提供するライブラリ。アクセシビリティが組み込まれている |
| Edge Function | Supabase上で動くサーバーレス関数 |
| officeparser | Word・PowerPointファイルからテキストを抽出するライブラリ |
| Scoop | Windows用のパッケージマネージャー。コマンドラインでソフトをインストールできる |

---

## Day 1 セットアップ手順

### Step 1: GitHub リポジトリ作成

1. GitHubにログイン
2. 「New repository」をクリック
3. Repository name: rag-chat-app
4. Description: RAG（検索拡張生成）を搭載した社内ナレッジQAチャットボット。Next.js + Supabase + Claude API で構築。
5. 視認性: Public
6. README: ON
7. .gitignore: Node を選択
8. 「Create repository」をクリック

### Step 2: SourceTree でクローン

1. SourceTreeを開く
2. 「クローン」タブを選択（「作成」ではない。「作成」だと別のリポジトリになる）
3. ソースURL: https://github.com/Kaneko-Takahashi/rag-chat-app.git
4. 保存先: C:\dev\rag-chat-app
5. 名前: rag-chat-app
6. 「クローン」ボタンをクリック

### Step 3: Cursor でプロジェクトを開く

1. Cursorを起動
2. 「Open Folder」で C:\dev\rag-chat-app を開く
3. ターミナルを開く: Ctrl + J

### Step 4: Node.js バージョン確認

node -v と入力して実行。結果: v22.11.0

### Step 5: docs フォルダ作成

mkdir docs と入力して実行。mkdir は「make directory」の略でフォルダを作成するコマンド。

### Step 6: Next.js プロジェクト作成

既存の README.md を削除: del README.md

Next.js プロジェクト作成: npx create-next-app@latest . --typescript --tailwind --app --use-npm

コマンドの意味: npx（一時的にダウンロードして実行）、.（現在のフォルダに作成）、--typescript（TypeScript使用）、--tailwind（Tailwind CSS使用）、--app（App Router使用）、--use-npm（npm使用）

途中の質問「Ok to proceed? (y)」に y を入力。

### Step 7: 動作確認

npm run dev と入力。ブラウザで http://localhost:3000 にアクセスし、画面が表示されればOK。

サーバー停止: Ctrl + C → 「バッチ ジョブを終了しますか？」に y を入力。

### Step 8: 必要パッケージのインストール

npm install @supabase/supabase-js @anthropic-ai/sdk ai と入力して実行。

各パッケージの役割: @supabase/supabase-js（Supabase接続用）、@anthropic-ai/sdk（Claude API用）、ai（AIチャット便利機能）

### Step 9: UIライブラリのインストール

npm install shadcn@latest と入力して実行。

初期設定: npx shadcn init と入力。スタイル選択は Radix（Enter）、プリセットは Nova（Enter）。

コンポーネント追加: npx shadcn add input と npx shadcn add scroll-area を実行。input はチャット入力欄、scroll-area はスクロール機能の部品。

### Step 10: 環境変数ファイルの作成

New-Item .env.local と入力して実行。

.env.local に以下を記述: ANTHROPIC_API_KEY=your_api_key_here、NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here、NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

注意: .env.local は秘密情報を保存するファイル。GitHubには公開されない（.gitignoreで除外済み）。

### Step 11: Supabase プロジェクト作成

1. https://supabase.com にアクセス
2. 「New project」をクリック
3. Project name: rag-chat-app
4. Database password: 強力なパスワード（メモしておく）
5. Region: Asia-Pacific
6. 「Create new project」をクリック
7. STATUS が Healthy になるまで待つ（2〜3分。作成直後は Unhealthy と表示されるが正常。F5で更新して待つ）

### Step 12: Supabase API キーの取得

1. Supabase ダッシュボード → 左メニュー Settings → API Keys
2. anon public のキー（eyJhbGci...で始まるもの）を NEXT_PUBLIC_SUPABASE_ANON_KEY に設定
3. API URL を NEXT_PUBLIC_SUPABASE_URL に設定

注意: Publishable key（sb_publishable_...）ではなく、Legacy タブの anon public キー（JWT形式）を使用すること。

### Step 13: Supabase 接続ファイルの作成

New-Item lib/supabase.ts と入力して実行。lib/supabase.ts に Supabase クライアントの初期化コードを記述。

### Step 14: Supabase データベースのセットアップ

Supabase ダッシュボード → SQL Editor で以下のSQLを順番に実行。

14-1: ベクトル検索の拡張機能を有効化: CREATE EXTENSION IF NOT EXISTS vector;

14-2: ドキュメントテーブルの作成: documents テーブル（原本を保存）と document_chunks テーブル（分割した断片とベクトルデータを保存）を作成。

14-3: 類似検索関数の作成: match_documents 関数を作成。ユーザーの質問に似たドキュメントをデータベースから見つけるための関数（RAGの心臓部分）。

14-4: チャット履歴テーブルの作成: chat_messages テーブルを作成。

### Step 15: チャットAPI の作成

mkdir app/api、mkdir app/api/chat、New-Item app/api/chat/route.ts を実行。Claude APIと連携し、RAG検索→回答生成→履歴保存を行うAPIを作成。

### Step 16: チャットUI の作成

app/page.tsx にモダンなダークテーマのチャットUIを実装。ユーザー/AIのメッセージをアイコン付きで表示、ローディングアニメーション、Enterキーで送信可能。

### Step 17: Claude API キーの設定

1. https://console.anthropic.com/ にアクセス
2. APIキーを作成（キー名: rag-chat-app）
3. .env.local の ANTHROPIC_API_KEY に貼り付け

### Step 18: 動作確認

npm run dev でサーバー起動。http://localhost:3000 でチャットUIが表示されればDay 1 完了。

---

## Day 2 RAGパイプライン実装

### Step 19: RAG用ファイルの作成

mkdir lib/rag、New-Item lib/rag/embeddings.ts、New-Item lib/rag/retriever.ts を実行。embeddings.ts はテキストのチャンク分割とドキュメント取込処理、retriever.ts はキーワード検索による関連ドキュメント検索処理。

### Step 20: Scoop のインストール

Supabase CLI をインストールするために Scoop が必要。Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser を実行（質問が出たら Y）。次に irm get.scoop.sh | iex を実行。Scoop は Windows用のパッケージマネージャー。

### Step 21: Supabase CLI のインストール

scoop bucket add supabase https://github.com/supabase/scoop-bucket.git を実行。次に scoop install supabase を実行。npm install -g supabase ではエラーになるため Scoop 経由でインストール。

### Step 22: Supabase Edge Function の作成

supabase init を実行（質問は Enter でデフォルト選択）。supabase link を実行（パスワードを聞かれたらDB作成時のパスワードを入力）。supabase functions new embed を実行（Denoの確認は Y）。index.ts にEmbedding生成コードを記述し、supabase functions deploy embed でデプロイ。「WARNING: Docker is not running」は無視してOK。

### Step 23: ドキュメント管理画面の作成

mkdir app/documents、New-Item app/documents/page.tsx、mkdir app/api/documents、New-Item app/api/documents/route.ts を実行。ドキュメントの新規登録（テキスト入力）、一覧表示、チャット画面との相互リンクを実装。

### Step 24: サンプル社内ドキュメントの登録

テキスト入力で3件登録: 社内休暇制度ガイド、経費精算マニュアル、情報セキュリティポリシー。

### Step 25: RAGチャットの動作テスト

チャット画面で「有給休暇は何日もらえますか？」と質問し、登録したドキュメントに基づいた回答が返ることを確認。

### Step 26: 削除機能の追加

mkdir "app/api/documents/[id]"、New-Item "app/api/documents/[id]/route.ts" を実行。各ドキュメントに削除ボタンを追加、削除前に確認ダイアログ表示、ドキュメントとチャンクを自動一括削除。

### Step 27: ファイルアップロード機能の追加

npm install pdf-parse-new xlsx mammoth officeparser を実行。各ライブラリの役割: pdf-parse-new（PDF抽出）、xlsx（Excel抽出）、officeparser（Word・PowerPoint抽出）。New-Item app/api/documents/upload/route.ts -Force を実行。ドラッグ＆ドロップとクリックでのファイルアップロード、5形式に対応（TXT, PDF, Excel, PowerPoint, Word）。

### Step 28: ファイルアップロードテスト

テスト成功したファイル: 社内イベント案内.txt、会議室利用ガイド.docx、社内研修プログラム.pptx、出張申請ガイド.pdf、社員連絡先一覧.xlsx

---

## Day 3-4 機能改善・仕上げ

### Step 29: ソース引用表示

チャットAPIにソース情報を追加。AIの回答の下に「参照ソース」ボタンを表示し、クリックでどのドキュメントから回答したかを確認可能。類似度（%）も表示。

### Step 30: チャット履歴機能

New-Item app/api/chat/history/route.ts を実行。チャット履歴の読込・表示、履歴削除機能を実装。

### Step 31: マークダウン表示対応

npm install react-markdown を実行。AIの回答内の太字や見出しが正しく表示されるように対応。

### Step 32: favicon の設定

app/layout.tsx を修正。タイトルを「ナレッジQA チャットボット」に変更、ロボット絵文字（🤖）をfaviconに設定、lang を ja に変更。

### Step 33: レスポンシブデザイン対応

チャット画面をPC・スマホ両対応に修正。スマホ用ハンバーガーメニュー、文字サイズ・余白の最適化を実装。

### Step 34: README.md の作成

プロジェクトの説明、技術スタック、セットアップ手順、プロジェクト構成を記載。

### Step 35: SourceTree でコミット・GitHub公開

SourceTree でコミット・プッシュ。コミットメッセージ例: 「Day3-4: ソース引用・履歴機能・レスポンシブ対応・ドキュメント整備」

---

## SourceTree の使い方

### SourceTree とは

Gitの操作をGUI（画面操作）で行えるツール。コマンドを覚えなくても、ボタン操作でコミット・プッシュができる。

### 基本用語

| 用語 | 意味 |
|------|------|
| クローン | GitHubのリポジトリをローカル（自分のPC）にコピーすること |
| コミット | ファイルの変更を記録すること（セーブポイントのようなもの） |
| プッシュ | ローカルのコミットをGitHubにアップロードすること |
| プル | GitHubの最新状態をローカルにダウンロードすること |
| ステージング | コミットするファイルを選択すること |

### コミットとプッシュの手順

1. SourceTreeを開き、rag-chat-app プロジェクトを選択
2. 「ファイルステータス」タブを確認
3. 変更されたファイルにチェックを入れる（ステージング）
4. コミットメッセージを入力
5. 「コミット」ボタンをクリック
6. 「変更をすぐに origin/main にプッシュする」にチェックが入っていれば自動でGitHubにアップロードされる

### コミットメッセージの書き方

| 例 | 意味 |
|----|------|
| Day1: プロジェクト初期セットアップ完了 | 初日の作業完了 |
| Day2: RAGパイプライン実装・ファイルアップロード機能追加 | 2日目の作業完了 |
| Day3-4: ソース引用・履歴機能・レスポンシブ対応・ドキュメント整備 | 最終日の作業完了 |
| feat: チャットUI作成 | 新機能の追加 |
| fix: API接続エラーを修正 | バグ修正 |
| docs: セットアップガイド追加 | ドキュメントの追加・修正 |

---

## 現在のプロジェクト構成

rag-chat-app/
- app/
  - api/
    - chat/
      - route.ts（チャットAPI: Claude + RAG連携）
      - history/route.ts（チャット履歴API）
    - documents/
      - route.ts（ドキュメントCRUD API）
      - upload/route.ts（ファイルアップロードAPI）
      - [id]/route.ts（ドキュメント削除API）
    - test-embed/route.ts（Embeddingテスト用API）
  - documents/page.tsx（ドキュメント管理画面）
  - favicon.ico
  - globals.css
  - layout.tsx
  - page.tsx（チャットUI: メイン画面）
- components/ui/（shadcn/ui コンポーネント）
- docs/setup-guide.md（このドキュメント）
- lib/
  - rag/
    - embeddings.ts（チャンク分割・ドキュメント取込）
    - retriever.ts（キーワード検索）
  - supabase.ts（Supabase接続設定）
  - utils.ts
- supabase/functions/embed/index.ts（Edge Function）
- .env.local（環境変数: 秘密情報）
- .gitignore（Gitで管理しないファイルの指定）
- package.json（プロジェクト設定・依存パッケージ）
- README.md（プロジェクト説明）
- tsconfig.json（TypeScript設定）
