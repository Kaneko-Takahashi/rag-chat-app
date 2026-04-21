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
| フロントエンド | Next.js 16 + TypeScript | チャットUI |
| UIライブラリ | Tailwind CSS + shadcn/ui | モダンなデザイン |
| バックエンド | Next.js Route Handlers | APIエンドポイント |
| データベース | Supabase（PostgreSQL + pgvector） | データ保存・検索 |
| LLM | Claude API（Anthropic） | AI回答生成 |
| ドキュメント解析 | officeparser, xlsx | PDF / Office文書のテキスト抽出 |
| Markdown表示 | react-markdown | AI回答の整形表示 |
| デプロイ | Vercel | 本番公開 |
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
| Supabase | データベース + 認証 + ストレージ + APIがセットになったサービス |
| npm | Node.jsのパッケージ（部品）を管理・インストールするツール |
| チャンク | ドキュメントを小さく分割した断片。RAGで検索しやすくするために使う |
| API Key | 外部サービス（Claude、Supabase等）を利用するための認証キー |
| shadcn/ui | UIの基本パーツ（ボタン、入力欄等）を提供するライブラリ |
| Radix | UIの基本パーツを提供するライブラリ。アクセシビリティが組み込まれている |
| Edge Function | Supabase上で動くサーバーレス関数 |
| officeparser | PDF / Word / PowerPoint などからテキストを抽出するライブラリ |
| xlsx | Excelファイルからテキストを抽出するライブラリ |
| Scoop | Windows用のパッケージマネージャー。コマンドラインでソフトをインストールできる |
| Vercel | Next.jsアプリを簡単にデプロイできるホスティングサービス |
| Deno | Supabase Edge Functions が動く実行環境 |

---

## Day 1 セットアップ手順

### Step 1: GitHub リポジトリ作成

1. GitHubにログイン
2. 「New repository」をクリック
3. Repository name: `rag-chat-app`
4. Description: `RAG（検索拡張生成）を搭載した社内ナレッジQAチャットボット。Next.js + Supabase + Claude API で構築。`
5. Visibility: `Public`
6. README: ON
7. `.gitignore`: `Node` を選択
8. 「Create repository」をクリック

### Step 2: SourceTree でクローン

1. SourceTreeを開く
2. 「クローン」タブを選択（「作成」ではない）
3. ソースURL: `https://github.com/Kaneko-Takahashi/rag-chat-app.git`
4. 保存先: `C:\dev\rag-chat-app`
5. 名前: `rag-chat-app`
6. 「クローン」ボタンをクリック

### Step 3: Cursor でプロジェクトを開く

1. Cursorを起動
2. 「Open Folder」で `C:\dev\rag-chat-app` を開く
3. ターミナルを開く: `Ctrl + J`

### Step 4: Node.js バージョン確認

以下を実行します。

```bash
node -v
```

例: `v22.11.0`

### Step 5: docs フォルダ作成

```bash
mkdir docs
```

`mkdir` は「make directory」の略で、フォルダを作成するコマンドです。

### Step 6: Next.js プロジェクト作成

既存の README.md を削除します。

```bash
del README.md
```

Next.js プロジェクトを作成します。

```bash
npx create-next-app@latest . --typescript --tailwind --app --use-npm
```

コマンドの意味:
- `npx`: 一時的にダウンロードして実行
- `.`: 現在のフォルダに作成
- `--typescript`: TypeScript使用
- `--tailwind`: Tailwind CSS使用
- `--app`: App Router使用
- `--use-npm`: npm使用

途中の質問 `Ok to proceed? (y)` に `y` を入力します。

### Step 7: 動作確認

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスし、画面が表示されればOKです。

サーバー停止:
- `Ctrl + C`
- 「バッチ ジョブを終了しますか？」に `y`

### Step 8: 必要パッケージのインストール

```bash
npm install @supabase/supabase-js @anthropic-ai/sdk ai
```

各パッケージの役割:
- `@supabase/supabase-js`: Supabase接続用
- `@anthropic-ai/sdk`: Claude API用
- `ai`: AIチャット実装の補助

### Step 9: UIライブラリのインストール

```bash
npm install shadcn@latest
```

初期設定:

```bash
npx shadcn init
```

選択の目安:
- スタイル選択: `Radix`
- プリセット: `Nova`

コンポーネント追加:

```bash
npx shadcn add input
npx shadcn add scroll-area
npx shadcn add button
```

### Step 10: 環境変数ファイルの作成

```bash
New-Item .env.local
```

`.env.local` に以下を記述します。

```env
ANTHROPIC_API_KEY=your_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

注意:
- `.env.local` は秘密情報を保存するファイルです
- GitHubには公開されません（`.gitignore`で除外されます）

### Step 11: Supabase プロジェクト作成

1. Supabase にアクセス
2. 「New project」をクリック
3. Project name: `rag-chat-app`
4. Database password: 強力なパスワードを設定してメモしておく
5. Region: 任意の近いリージョンを選択
6. 「Create new project」をクリック
7. STATUS が `Healthy` になるまで待つ

作成直後は `Unhealthy` と表示されることがありますが、数分待てば正常になることがあります。

### Step 12: Supabase API キーの取得

1. Supabase ダッシュボード → 左メニュー `Settings`
2. `API Keys` を開く
3. API URL を `NEXT_PUBLIC_SUPABASE_URL` に設定
4. `anon public` のキーを `NEXT_PUBLIC_SUPABASE_ANON_KEY` に設定

注意:
- `Publishable key` ではなく、実際にアプリ側で使用するキーを確認して設定してください
- Supabase画面の表示仕様は変更されることがあります

### Step 13: Supabase 接続ファイルの作成

```bash
New-Item lib/supabase.ts
```

`lib/supabase.ts` に Supabase クライアントの初期化コードを記述します。

### Step 14: Supabase データベースのセットアップ

Supabase ダッシュボード → SQL Editor で以下を順番に実行します。

#### 14-1: ベクトル検索の拡張機能を有効化

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

#### 14-2: ドキュメントテーブルの作成

- `documents` テーブル: 原本を保存
- `document_chunks` テーブル: 分割した断片を保存

#### 14-3: 類似検索関数の作成

- `match_documents` 関数を作成
- ユーザーの質問に似たドキュメントを見つけるための関数

#### 14-4: チャット履歴テーブルの作成

- `chat_messages` テーブルを作成

### Step 15: チャットAPI の作成

以下を実行します。

```bash
mkdir app/api
mkdir app/api/chat
New-Item app/api/chat/route.ts
```

Claude API と連携し、RAG検索 → 回答生成 → 履歴保存を行うAPIを作成します。

### Step 16: チャットUI の作成

`app/page.tsx` にモダンなダークテーマのチャットUIを実装します。

実装内容:
- ユーザー/AIのメッセージ表示
- アイコン付きUI
- ローディングアニメーション
- Enterキー送信
- レスポンシブ対応の土台

### Step 17: Claude API キーの設定

1. Anthropic Console にアクセス
2. APIキーを作成（例: `rag-chat-app`）
3. `.env.local` の `ANTHROPIC_API_KEY` に貼り付け

### Step 18: 動作確認

```bash
npm run dev
```

`http://localhost:3000` でチャットUIが表示されれば Day 1 完了です。

---

## Day 2 RAGパイプライン実装

### Step 19: RAG用ファイルの作成

```bash
mkdir lib/rag
New-Item lib/rag/embeddings.ts
New-Item lib/rag/retriever.ts
```

- `embeddings.ts`: テキストのチャンク分割とドキュメント取込処理
- `retriever.ts`: キーワード検索による関連ドキュメント検索処理

### Step 20: Scoop のインストール

Supabase CLI をインストールするために Scoop を使用します。

```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

質問が出たら `Y` を入力します。

続いて:

```bash
irm get.scoop.sh | iex
```

### Step 21: Supabase CLI のインストール

```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

`npm install -g supabase` ではうまくいかない場合があるため、Scoop経由を採用しています。

### Step 22: Supabase Edge Function の作成

```bash
supabase init
supabase link
supabase functions new embed
```

補足:
- `supabase init`: 初期化
- `supabase link`: Supabaseプロジェクトと接続
- `supabase functions new embed`: Edge Function作成

`supabase link` 実行時にパスワードを聞かれたら、Supabase作成時のDBパスワードを入力します。  
Deno の確認が出た場合は `Y` を選択します。

その後、`index.ts` に Embedding 生成コードを記述してデプロイします。

```bash
supabase functions deploy embed
```

`WARNING: Docker is not running` が表示されても、状況によってはそのまま進められる場合があります。

### Step 23: ドキュメント管理画面の作成

```bash
mkdir app/documents
New-Item app/documents/page.tsx
mkdir app/api/documents
New-Item app/api/documents/route.ts
```

実装内容:
- ドキュメントの新規登録（テキスト入力）
- 一覧表示
- チャット画面との相互リンク

### Step 24: サンプル社内ドキュメントの登録

テキスト入力で例として以下のような文書を登録します。

- 社内休暇制度ガイド
- 経費精算マニュアル
- 情報セキュリティポリシー

### Step 25: RAGチャットの動作テスト

チャット画面で次のように質問します。

- `有給休暇は何日もらえますか？`

登録したドキュメントに基づいた回答が返ればOKです。

### Step 26: 削除機能の追加

```bash
mkdir "app/api/documents/[id]"
New-Item "app/api/documents/[id]/route.ts"
```

実装内容:
- 各ドキュメントに削除ボタンを追加
- 削除前に確認ダイアログ表示
- ドキュメントとチャンクを一括削除

### Step 27: ファイルアップロード機能の追加

必要パッケージをインストールします。

```bash
npm install xlsx officeparser
```

補足:
- `officeparser`: PDF / Word / PowerPoint などのテキスト抽出
- `xlsx`: Excel のテキスト抽出

アップロードAPIファイルを作成します。

```bash
New-Item app/api/documents/upload/route.ts -Force
```

実装内容:
- ドラッグ＆ドロップ
- クリックによるファイル選択
- 対応形式: TXT, PDF, Excel, PowerPoint, Word

### Step 28: ファイルアップロードテスト

テスト例:
- `社内イベント案内.txt`
- `会議室利用ガイド.docx`
- `社内研修プログラム.pptx`
- `出張申請ガイド.pdf`
- `社員連絡先一覧.xlsx`

---

## Day 3-4 機能改善・仕上げ

### Step 29: ソース引用表示

チャットAPIにソース情報を追加します。

実装内容:
- AI回答の下に「参照ソース」ボタンを表示
- クリックでどのドキュメントを参照したか確認可能
- 類似度（%）も表示

### Step 30: チャット履歴機能

```bash
New-Item app/api/chat/history/route.ts
```

実装内容:
- チャット履歴の読込
- 履歴表示
- 履歴削除

### Step 31: マークダウン表示対応

```bash
npm install react-markdown
```

AIの回答内の太字や見出しが正しく表示されるように対応します。

### Step 32: favicon の設定

`app/layout.tsx` を修正します。

対応内容:
- タイトルを `ナレッジQA チャットボット` に変更
- favicon を設定
- `lang="ja"` に変更

### Step 33: レスポンシブデザイン対応

チャット画面を PC・スマホ両対応に修正します。

対応内容:
- レイアウト調整
- 文字サイズ・余白の最適化
- スマホでも使いやすいUIに改善

### Step 34: README.md の作成

プロジェクトの説明、技術スタック、セットアップ手順、プロジェクト構成を記載します。

### Step 35: SourceTree でコミット・GitHub公開

SourceTree でコミット・プッシュします。

コミットメッセージ例:
- `Day3-4: ソース引用・履歴機能・レスポンシブ対応・ドキュメント整備`

---

## Day 5 Vercelデプロイと本番公開

### Step 36: Vercel にデプロイ

1. Vercel にログイン
2. GitHub リポジトリ `rag-chat-app` を Import
3. Environment Variables を設定
4. `Deploy` を実行

設定する環境変数:

```env
ANTHROPIC_API_KEY=あなたのClaude APIキー
NEXT_PUBLIC_SUPABASE_URL=あなたのSupabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=あなたのSupabase Anon Key
```

### Step 37: pdf-parse 問題の対応

Vercel ビルド時に `pdf-parse` の ESM import に関する型エラーが発生する場合があります。  
このプロジェクトでは、PDF処理を `officeparser` に統一して対応しました。

対応内容:
- `pdf-parse` を使用しない
- PDF処理を `officeparser.parseOffice()` に統一
- `pdf-parse` を依存関係から削除

### Step 38: Supabase Edge Function の Deno エラー対応

Vercel の TypeScript チェック時に、`supabase/functions/embed/index.ts` が対象となり、`Cannot find name 'Deno'` エラーが出ることがあります。

この場合は `tsconfig.json` の `exclude` に `supabase/functions` を追加します。

修正例:

```json
{
  "exclude": [
    "node_modules",
    "supabase/functions"
  ]
}
```

### Step 39: 本番動作確認

以下を確認します。

- 本番URLが表示できる
- チャット送信ができる
- AI回答が返る
- 参照ソースが表示される
- ドキュメント管理画面が表示できる
- ドキュメント登録・削除ができる
- ファイルアップロードができる
- チャット履歴が読込・削除できる

### Step 40: GitHub ドキュメント更新

以下を更新します。

- `README.md`
- `docs/setup-guide.md`

---

## SourceTree の使い方

### SourceTree とは

Gitの操作をGUI（画面操作）で行えるツールです。コマンドを覚えなくても、ボタン操作でコミット・プッシュができます。

### 基本用語

| 用語 | 意味 |
|------|------|
| クローン | GitHubのリポジトリをローカル（自分のPC）にコピーすること |
| コミット | ファイルの変更を記録すること（セーブポイントのようなもの） |
| プッシュ | ローカルのコミットをGitHubにアップロードすること |
| プル | GitHubの最新状態をローカルにダウンロードすること |
| ステージング | コミットするファイルを選択すること |

### コミットとプッシュの手順

1. SourceTreeを開き、`rag-chat-app` プロジェクトを選択
2. 「ファイルステータス」タブを確認
3. 変更されたファイルにチェックを入れる（ステージング）
4. コミットメッセージを入力
5. 「コミット」ボタンをクリック
6. 「変更をすぐに origin/main にプッシュする」にチェックが入っていれば自動でGitHubにアップロードされます

### コミットメッセージの書き方

| 例 | 意味 |
|----|------|
| Day1: プロジェクト初期セットアップ完了 | 初日の作業完了 |
| Day2: RAGパイプライン実装・ファイルアップロード機能追加 | 2日目の作業完了 |
| Day3-4: ソース引用・履歴機能・レスポンシブ対応・ドキュメント整備 | 3〜4日目の作業完了 |
| Day5: Vercelデプロイ成功・README整備完了 | 5日目の作業完了 |
| feat: チャットUI作成 | 新機能の追加 |
| fix: API接続エラーを修正 | バグ修正 |
| docs: セットアップガイド追加 | ドキュメントの追加・修正 |

---

## 現在のプロジェクト構成

```text
rag-chat-app/
├─ app/
│  ├─ api/
│  │  ├─ chat/
│  │  │  ├─ route.ts                  # チャットAPI: Claude + RAG連携
│  │  │  └─ history/
│  │  │     └─ route.ts               # チャット履歴API
│  │  ├─ documents/
│  │  │  ├─ route.ts                  # ドキュメントCRUD API
│  │  │  ├─ upload/
│  │  │  │  └─ route.ts               # ファイルアップロードAPI
│  │  │  └─ [id]/
│  │  │     └─ route.ts               # ドキュメント削除API
│  ├─ documents/
│  │  └─ page.tsx                     # ドキュメント管理画面
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx                        # チャットUI: メイン画面
├─ components/
│  └─ ui/                             # shadcn/ui コンポーネント
├─ docs/
│  └─ setup-guide.md                  # このドキュメント
├─ lib/
│  ├─ rag/
│  │  ├─ embeddings.ts                # チャンク分割・ドキュメント取込
│  │  └─ retriever.ts                 # キーワード検索
│  ├─ supabase.ts                     # Supabase接続設定
│  └─ utils.ts
├─ public/
├─ supabase/
│  └─ functions/
│     └─ embed/
│        └─ index.ts                  # Edge Function
├─ .env.local                         # 環境変数: 秘密情報
├─ .gitignore                         # Gitで管理しないファイルの指定
├─ package.json                       # プロジェクト設定・依存パッケージ
├─ README.md                          # プロジェクト説明
└─ tsconfig.json                      # TypeScript設定
```

---

## 補足メモ

### Vercelデプロイ対応メモ

- `pdf-parse` は Vercel ビルドで型エラーが発生したため使用を中止
- PDF処理は `officeparser` に統一
- `tsconfig.json` の `exclude` に `supabase/functions` を追加
- Supabase Edge Functions は Deno 環境、Next.js は Node.js 環境である点に注意
- Vercel の古い失敗デプロイを `Redeploy` すると、古いコミットを再実行する場合がある
- 最新コミットのデプロイ行を確認してログを見ることが重要

### 公開時の注意

- `.env.local` は GitHub に含めない
- APIキーや秘密情報を README / docs に直接書かない
- 公開前に本番URLで実際に動作確認する
- GitHub に載せる説明文は、初学者が見ても分かるように丁寧に書く

### 本番公開完了の状態

以下が確認できれば公開完了です。

- Vercel のステータスが `Ready`
- 本番URLが表示される
- チャット回答が返る
- ソース引用が表示される
- ドキュメント管理が動作する
- README / setup-guide が最新状態になっている