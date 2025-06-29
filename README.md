# TOEIC Part 1 対策アプリ

TOEIC Listening Part 1（写真描写問題）の反復練習を行うWebアプリケーションです。

## 概要

このアプリケーションは、TOEIC Part 1の写真描写問題の練習を目的として開発されています。ユーザーは問題を解き、成績を確認しながら効率的に学習を進めることができます。

## 主な機能

- **ユーザー認証**: JWT ベースの登録・ログイン機能
- **ランダム出題**: 問題をランダムに出題（5〜20問選択可能）
- **即時判定**: 回答後すぐに正誤判定と解説表示
- **学習統計**: 正答率や学習履歴の可視化
- **レスポンシブ対応**: PC・モバイル両対応

## 技術スタック

### バックエンド
- **Java 21**
- **Spring Boot 3.5.3**
- **Spring Security** (JWT認証)
- **Spring Data JPA**
- **PostgreSQL 16**

### フロントエンド
- **HTML5 / CSS3**
- **JavaScript (ES2021)**
- **レスポンシブデザイン**

## プロジェクト構成

```
toeic/
├── src/
│   ├── main/
│   │   ├── java/com/example/toeic/
│   │   │   ├── entity/          # エンティティクラス
│   │   │   ├── repository/      # データアクセス層
│   │   │   ├── service/         # ビジネスロジック層
│   │   │   ├── controller/      # REST API層
│   │   │   ├── config/          # 設定クラス
│   │   │   └── dto/             # データ転送オブジェクト
│   │   └── resources/
│   │       ├── static/          # フロントエンドファイル
│   │       │   ├── css/
│   │       │   ├── js/
│   │       │   └── index.html
│   │       ├── data/            # 初期問題データ
│   │       └── application.yml  # アプリケーション設定
│   └── test/                    # テストファイル
├── questions/                   # 問題管理用ディレクトリ
│   ├── questions.json
│   └── images/
├── build.gradle                 # ビルド設定
└── README.md
```

## 開発環境構築

このプロジェクトは VSCode の Dev Containers を使用して開発環境を構築することを推奨しています。  
ローカル環境を汚すことなく、統一された開発環境で作業を開始できます。

### 前提条件

以下がインストールされていることを確認してください：

- **Visual Studio Code**
- **Docker Desktop**
- **Dev Containers 拡張機能** (VS Code)

### 開発環境セットアップ手順

1. **Spring Boot Extension Pack をインストール**
   - VS Code の拡張機能マーケットプレース (Ctrl+Shift+X) で「Spring Boot Extension Pack」を検索
   - インストール後、歯車マークから「devcontainer.json に追加する」を選択

2. **Dev Container 設定ファイルの作成**
   - 「ファイルを追加」→「ワークスペースに構成を追加する」を選択
   - 「すべての定義を表示...」→「Java devcontainers」を選択
   - Java バージョン：「21-bullseye」を選択
   - 「Install Gradle」にチェックを入れる
   - 追加機能は選択せずに「OK」

3. **Dev Container で開く**
   - 左下の緑色のアイコンをクリック
   - 「コンテナーで再度開く」(Reopen in Container) を選択
   - 初回は Docker イメージのビルドに時間がかかります

4. **環境構築完了の確認**
   - エクスプローラに「開発コンテナー：JAVA」と表示される
   - Ctrl+Shift+P でコマンドパレットを開き、「spring init」で Spring Initializr が使用可能

> **参考記事**: [VSCodeのDevContainersでSpringBoot環境を構築](https://zenn.dev/sleepwalk/articles/7518fbd39043c9)

## セットアップ

### 前提条件
- Java 21
- PostgreSQL 16
- Gradle

### データベース設定

PostgreSQLデータベースを作成し、以下の設定を `application.yml` に反映してください：

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/toeic_part1
    username: your_username
    password: your_password
```

### 環境変数（オプション）
```bash
export DATABASE_URL=jdbc:postgresql://localhost:5432/toeic_part1
export DATABASE_USERNAME=your_username
export DATABASE_PASSWORD=your_password
export JWT_SECRET=your_jwt_secret_key
```

### アプリケーション起動

1. リポジトリをクローン
```bash
git clone <repository-url>
cd ToeicPart1/toeic
```

2. 依存関係をインストール
```bash
./gradlew build
```

3. アプリケーション起動
```bash
./gradlew bootRun
```

4. ブラウザでアクセス
```
http://localhost:8080
```

## API エンドポイント

### 認証
- `POST /api/auth/signup` - 新規登録
- `POST /api/auth/login` - ログイン

### 問題
- `GET /api/questions/random?limit=n` - ランダム問題取得

### 回答
- `POST /api/results` - 回答送信
- `POST /api/results/session/{sessionId}/finish` - セッション終了

### 統計
- `GET /api/stats/overview` - 成績サマリ取得

## 開発者向け情報

### データベースER図
```
users(id, email, password_hash, created_at)
  ↓
sessions(id, user_id, started_at, finished_at, total_questions, correct_answers)
  ↓
results(id, user_id, session_id, question_id, choice_id, is_correct, answered_at)
  ↓
questions(id, image_path, explanation, created_at)
  ↓
choices(id, question_id, sentence, is_correct, choice_order)
```

### 問題データ追加

1. `questions/images/` に画像ファイルを配置
2. `questions/questions.json` に問題データを追加
3. アプリケーション再起動で自動的にデータベースに反映

### テスト実行
```bash
./gradlew test
```

## ライセンス

このプロジェクトはMITライセンスのもとで公開されています。

## 貢献

バグ報告や機能追加の提案は、GitHubのIssueまでお願いします。プルリクエストも歓迎です。

## 作成者

システム開発プロジェクト

---

**注意**: 本アプリケーションは学習目的で作成されており、実際のTOEIC試験とは異なる場合があります。 