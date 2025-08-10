# 農業収穫体験アプリ (Next.js + Clerk)

全国各地の農業収穫体験を予約できるプラットフォームです。

## 機能

- 🚀 農業収穫体験の閲覧・検索
- 🔐 Clerkによる認証・認可システム
- 👤 ユーザープロフィール管理
- 📅 予約履歴の確認
- 💫 モダンなUI/UX

## 技術スタック

- **フロントエンド**: Next.js 15, React 19, TypeScript
- **認証**: Clerk
- **スタイリング**: Tailwind CSS
- **バックエンド**: Spring Boot (別リポジトリ)

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Clerkの設定

1. [Clerk](https://clerk.com/)でアカウントを作成
2. 新しいアプリケーションを作成
3. 環境変数を設定

`.env.local`ファイルを作成し、以下の内容を追加：

```env
# Clerk認証設定
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
CLERK_SECRET_KEY=your_secret_key_here

# Clerk設定
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# API設定
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

アプリケーションは [http://localhost:3000](http://localhost:3000) で起動します。

## 認証機能

### 保護されたページ

以下のページは認証が必要です：

- `/profile` - ユーザープロフィール
- `/reservations` - 予約履歴

### 認証フロー

1. **新規登録**: `/sign-up` からアカウント作成
2. **ログイン**: `/sign-in` からログイン
3. **プロフィール管理**: ログイン後、ヘッダーの「マイページ」からアクセス
4. **ログアウト**: ヘッダーのユーザーメニューから実行

## プロジェクト構造

```
src/
├── app/
│   ├── components/          # 再利用可能なコンポーネント
│   │   └── ClerkNav.tsx    # 認証ナビゲーション
│   ├── hooks/              # カスタムフック
│   │   └── useAuth.ts      # 認証フック
│   ├── profile/            # プロフィールページ
│   ├── reservations/       # 予約履歴ページ
│   ├── harvests/           # 収穫体験ページ
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # ホームページ
│   └── providers.tsx       # Clerkプロバイダー
├── middleware.ts            # 認証ミドルウェア
└── globals.css             # グローバルスタイル
```

## 認証ミドルウェア

`middleware.ts`で以下の設定を行っています：

- パブリックルート: 認証不要
- 保護されたルート: 認証が必要
- 認証後のリダイレクト設定

## カスタムフック

`useAuth`フックを使用して認証状態を管理：

```typescript
import { useAuth } from '@/app/hooks/useAuth';

const { isSignedIn, isLoaded, user, requireSignedIn } = useAuth();

// ログイン必須ページでの使用例
requireSignedIn('/');
```

## デプロイ

### Vercel

1. Vercelにプロジェクトを接続
2. 環境変数を設定
3. デプロイ

### その他のプラットフォーム

環境変数を適切に設定してからデプロイしてください。

## トラブルシューティング

### よくある問題

1. **Clerkのキーが設定されていない**
   - `.env.local`ファイルが正しく作成されているか確認
   - 環境変数名が正しいか確認

2. **認証が動作しない**
   - ブラウザのコンソールでエラーを確認
   - Clerkのダッシュボードで設定を確認

3. **画像が表示されない**
   - `next.config.ts`の画像設定を確認
   - Clerkの画像ドメインが正しく設定されているか確認

## ライセンス

MIT License
