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

駄菓子屋きぬや販売管理システム（Next.js・TypeScript）の `app/`・`src/`・`tests/` 配下の TypeScript を実装・更新するときの規則です。言語・ライブラリ・版は [[specdojo:tsd-index-sample|技術スタック一覧]]、モジュールの配置・境界は `kinuya-web-cpd`、エラーの通知・ログの方針は `kinuya-web-sysd-cross-cutting-policy` に従い、本書ではそれらに沿った書き方と検証だけを定めます。

_ASSUMPTION_: `kinuya-web-cpd`・`kinuya-web-sysd-cross-cutting-policy` は店頭タブレット向け Web アプリの設計の正本として扱う架空の文書で、本リポジトリには同梱しない。CLI 版の設計（[[specdojo:cpd-sample|販売処理サービス C4コンポーネント図]] など）は別構成の例であり、本書の根拠にしない。

## 1. 基本方針

- `tsconfig.json` の `strict: true` を前提にし、型エラーは原因のコードを直して解消する。
- 既存の関数分割、命名、エラー処理の書き方に合わせる。新しい書き方を持ち込む場合は、同じ変更で既存箇所をそろえるか、理由を変更の説明に書く。
- 1 回の変更は依頼された範囲に絞る。無関係なファイルの整形や名前の変更を混ぜない。
- 書式は Prettier、構文と import の規則は ESLint の設定を正とし、手で書式を整えない。

## 2. モジュールと import

- ESM で書き、`require` を使わない。
- `src/` 内の import は `@/` の別名を使い、`../../` のような 2 階層以上の相対 import を書かない。
- `app/` から業務処理を呼ぶ場合は `src/` の公開関数を経由し、`src/` から `app/` を import しない。この向きは `eslint.config.mjs` の `no-restricted-imports` で検査する。
- 新しいファイルは、`kinuya-web-cpd` が販売・在庫・つけの各処理に割り当てた置き場所に作る。割り当てのない処理を追加する場合は、置き場所を決めてから実装する。
- 型の import の書き方は `eslint.config.mjs` の `consistent-type-imports` に従う。

## 3. 型

- `any` を使わない。フォーム入力や API の要求本文など型が不明な値は `unknown` で受け、型ガード関数で検証してから使う。
- 文字列の取り得る値の集合は union 型で表す（例: 支払方法 `"cash" | "tsuke"`）。
- `as` による型の強制は、直前の型ガードで検証した値と、Prisma が生成した型の絞り込みにだけ使う。
- `null` と `undefined` を混在させない。値が無いことは `undefined` で表し、Prisma が返す `null` はサーバー側の DB 接続の境界で変換する。

```typescript
type Payment = "cash" | "tsuke";

function isPayment(value: unknown): value is Payment {
  return value === "cash" || value === "tsuke";
}
```

## 4. エラー処理

- 利用者の入力の不備（数量 0、未登録の商品コード、つけ上限の超過など）は、検証結果として呼び出し側へ返し、画面に項目ごとのメッセージを出す。例外にしない。
- 想定外の失敗（DB 接続の失敗など）は例外として投げる。API ルートでは共通のエラー応答処理を通し、`kinuya-web-sysd-cross-cutting-policy` が定める送信先（Sentry）への記録と汎用のエラー応答への変換をその処理に任せる。API ルートごとに `try`/`catch` で応答を組み立てない。
- エラーメッセージには、操作名と対象の ID（商品コード、顧客 ID、販売 ID）を含める。
- 空の `catch` で例外を握りつぶさない。再送出する場合は `cause` に元のエラーを渡す。

```typescript
try {
  await recordSale(sale);
} catch (error) {
  throw new Error(`販売の記録に失敗しました（販売 ID: ${sale.id}）`, {
    cause: error,
  });
}
```

## 5. 命名

- 変数・関数は `camelCase`、型・コンポーネントは `PascalCase`、定数は `UPPER_SNAKE_CASE` を使う。
- 真偽値は `is`・`has`・`can` で始める（例: `isOutOfStock`、`canSellOnTsuke`）。
- 略語は `id`・`url` など定着したものだけを使い、`qty`・`amt` のような新しい略語を作らない。
- 業務の用語は既存コードで使っている英語名にそろえ、同じ用語に別の名前を付けない（例: つけは `tsuke` に統一し、`credit` と混ぜない。在庫数は `stockCount`）。
- コンポーネントのファイル名はコンポーネント名と同じ `PascalCase.tsx`、それ以外のファイル名は `kebab-case.ts` にする。

## 6. テストと検証

変更の種類ごとに、次のコマンドを実行して成功させてから変更を出す。

| コマンド                   | 対象                                             | 実行条件                                | 失敗時                                                                   |
| -------------------------- | ------------------------------------------------ | --------------------------------------- | ------------------------------------------------------------------------ |
| `npm run typecheck`        | 型検査（`app`・`src`・`tests`）                  | TypeScript を変更したとき（毎回）       | 型エラーの原因を直す                                                     |
| `npm run lint`             | ESLint（import の向き・型の import）             | TypeScript を変更したとき（毎回）       | `npm run lint -- --fix` で直し、残りを手で直す                           |
| `npm run test:unit`        | Vitest の単体テスト（売上・つけ残高）            | `src/` を変更したとき                   | 実装を直す。仕様変更で期待値が変わる場合だけ、根拠を確かめて期待値を直す |
| `npm run test:integration` | DB を使う統合テスト                              | DB 接続やマイグレーションを変更したとき | agent では実行しない。CI の失敗を直せない場合は内容を報告する            |
| `npm run build`            | Next.js のビルド（サーバーとクライアントの分離） | `app/` を変更したとき                   | ビルドエラーに出たファイルの import を直す                               |

- `npm run test:integration` は PostgreSQL のコンテナを起動するため、agent の sandbox では実行せず、プルリクエストの GitHub Actions で実行する。
- 金額の計算やつけ残高の更新を変えた場合は、つけ上限（[[specdojo:dmd-sample|データ移行設計: 顧客台帳とつけ残高]] の `顧客台帳.つけ上限`。税込の円の整数、未設定は上限なし）に対して、次の境界の単体テストを追加する。
  - 残高 0 円で、つけ販売を受け付ける。
  - 販売後の残高がつけ上限ちょうどになる場合は、つけ販売を受け付ける。
  - 販売後の残高がつけ上限を 1 円超える場合は、上限超過の検証結果を返す。
  - つけ上限が未設定の顧客は、金額にかかわらずつけ販売を受け付ける。
- _UNDECIDED_: つけ上限を超える申し出を店主代表の承認で受け付けるかが決まっていない。決まるまでは上限超過を検証結果として返すテストだけを書き、承認の経路のテストは書かない。
- 本書を変更した場合は `specdojo catalog validate` で `based_on` が解決することを確かめ、`applyTo`・`specdojo.id`・`specdojo.rulebook` を成果物カタログの登録と照合する。

## 7. 禁止事項

| 禁止事項                                             | 理由                                               |
| ---------------------------------------------------- | -------------------------------------------------- |
| 金額（販売額・つけ残高）を浮動小数点で計算する       | 端数の誤差でつけ残高が合わなくなるため             |
| クライアントコンポーネントから DB 接続を import する | 接続情報がブラウザへ送られる危険があるため         |
| ログやエラーメッセージに顧客の氏名や残高を出す       | 常連客の個人情報が Sentry やログ経由で漏れるため   |
| `// @ts-ignore` で型エラーを消す                     | 型エラーの原因を残したままにするため               |
| テストで本番の DB 接続先や `.env` の値を使う         | 店頭で使っている販売履歴とつけ残高を書き換えるため |

## 8. Next.js のサーバーとクライアントの境界

- DB 接続とつけ残高の更新を行うファイルは、先頭で `server-only` を import し、クライアントから読み込まれた場合にビルドを失敗させる。
- `"use client"` は、入力・タップなど画面の操作を扱うコンポーネントにだけ付け、ページ全体に付けない。
- サーバーからクライアントコンポーネントへ渡す値は、画面に表示する項目だけに絞った型で定義し、Prisma のモデルの型をそのまま渡さない。
- _UNDECIDED_: 店頭タブレットの OS と対応ブラウザが決まっていない。決まるまでは、Next.js の既定の対応ブラウザで動く API だけを使い、それ以外のブラウザ API を使う場合は変更の説明に対象のブラウザを書く。
