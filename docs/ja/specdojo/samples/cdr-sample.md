---
applyTo: "{app,src,tests}/**/*.{ts,tsx}"
specdojo:
  id: specdojo:cdr-sample
  type: architecture
  status: draft
  rulebook: specdojo:cdr-rulebook
  based_on:
    - specdojo:tsd-index-sample
---

# TypeScript 実装ルール

駄菓子屋きぬや販売管理システム（Next.js 14・TypeScript 5）の `app/`・`src/`・`tests/` 配下の TypeScript を実装・更新するときの規則です。言語・ライブラリ・版は技術スタック一覧に従い、本書では書き方と検証だけを定めます。

## 1. 基本方針

- `tsconfig.json` の `strict: true` を前提にし、型エラーを隠さずに直す。
- 既存の関数分割、命名、エラー処理の書き方に合わせる。新しい書き方を持ち込む場合は、同じ変更で既存箇所をそろえるか、理由を変更の説明に書く。
- 1 回の変更は依頼された範囲に絞る。無関係なファイルの整形や名前の変更を混ぜない。
- 金額（販売額・つけ残高）は円単位の整数で扱い、小数を使わない。

## 2. モジュールと import

- ESM で書き、`require` を使わない。
- `src/` 内の import は `@/` の別名を使い、`../../` のような 3 階層以上の相対 import を書かない。
- `app/` から業務処理を呼ぶ場合は `src/` の公開関数を経由し、`src/` から `app/` を import しない。この向きは ESLint の `no-restricted-imports` で検査する。
- サーバー専用の処理（Prisma による DB 接続、つけ残高の更新）は `src/server/` に置き、`"use client"` を宣言したコンポーネントから import しない。
- 型だけを import する場合は `import type` を使う（ESLint の `consistent-type-imports` で検査する）。

## 3. 型

- `any` を使わない。フォーム入力や API の要求本文など型が不明な値は `unknown` で受け、型ガード関数で検証してから使う。
- 文字列の取り得る値の集合は union 型で表す（例: 支払方法 `"cash" | "tsuke"`）。
- `as` による型の強制は、直前の検証で型が確定している場合だけ使う。
- `null` と `undefined` を混在させない。値が無いことは `undefined` で表し、Prisma が返す `null` は `src/server/` の境界で変換する。

```typescript
type Payment = "cash" | "tsuke";

function isPayment(value: unknown): value is Payment {
  return value === "cash" || value === "tsuke";
}
```

## 4. エラー処理

- 利用者の入力の不備は、検証結果として呼び出し側へ返し、画面に項目ごとのメッセージを出す。例外にしない。
- 想定外の失敗（DB 接続の失敗など）は例外として投げ、API ルートの境界で Sentry へ送ってから汎用のエラー応答に変換する。
- エラーメッセージには、操作名と対象の ID（商品コード、顧客 ID）を含める。顧客の氏名や残高をログに出さない。
- 空の `catch` で例外を握りつぶさない。再送出する場合は `cause` に元のエラーを渡す。

## 5. 命名

- 変数・関数は `camelCase`、型・コンポーネントは `PascalCase`、定数は `UPPER_SNAKE_CASE` を使う。
- 真偽値は `is`・`has`・`can` で始める（例: `isOutOfStock`）。
- 略語は `id`・`url` など定着したものだけを使い、`qty`・`amt` のような新しい略語を作らない。
- 業務の用語は既存コードで使っている英語名にそろえ、同じ用語に別の名前を付けない（例: つけは `tsuke` に統一し、`credit` と混ぜない）。

## 6. テストと検証

| コマンド                   | 対象                                  | 実行条件                                | 失敗時                                         |
| -------------------------- | ------------------------------------- | --------------------------------------- | ---------------------------------------------- |
| `npm run typecheck`        | 型検査（`app`・`src`・`tests`）       | TypeScript を変更したとき（毎回）       | 型エラーを直す。`@ts-ignore` で隠さない        |
| `npm run lint`             | ESLint（import の向き・型の import）  | TypeScript を変更したとき（毎回）       | `npm run lint -- --fix` で直し、残りを手で直す |
| `npm run test:unit`        | Vitest の単体テスト（売上・つけ残高） | `src/` を変更したとき                   | 失敗したテストの期待値ではなく実装を直す       |
| `npm run test:integration` | DB を使う統合テスト                   | DB 接続やマイグレーションを変更したとき | agent では実行せず、CI の結果を確認する        |

- 金額の計算やつけ残高の更新を変えた場合は、境界値（残高 0 円、上限額ちょうど）の単体テストを追加する。

## 7. 禁止事項

| 禁止事項                                             | 理由                                       |
| ---------------------------------------------------- | ------------------------------------------ |
| 金額を浮動小数点で計算する                           | 端数の誤差でつけ残高が合わなくなるため     |
| クライアントコンポーネントから DB 接続を import する | 接続情報がブラウザへ送られる危険があるため |
| 検証していない入力を `as` で型に押し込む             | 不正な数量や支払方法が記録されるため       |
| ログに顧客の氏名や残高を出す                         | 常連客の個人情報が漏れるため               |
| `// @ts-ignore` で型エラーを消す                     | 型エラーの原因を残したままにするため       |
