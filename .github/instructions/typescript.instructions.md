---
applyTo: '{src,tools,tests,scripts}/**/*.ts'
---

# TypeScript 実装ルール

このプロジェクトで TypeScript を実装・更新する際の共通ルールです。

## 1. 基本方針

- `strict` 前提で、型エラーを隠さずに実装する。
- 既存の関数分割、命名、エラー処理、CLI 出力のスタイルに合わせる。
- 読みやすさを優先し、過度な抽象化や将来用の汎用化は避ける。
- 公開 API、CLI の引数、出力形式、ファイル形式を変更する場合は、互換性への影響を明示して最小変更にする。

## 2. モジュールと import

- ESM と `NodeNext` を前提にする。
- Node.js 標準ライブラリは `node:` プレフィックスで import する。
- 相対 import は、既存コードの書式に合わせる。
- 未使用の import、変数、型定義を残さない。
- 循環依存を増やさず、共通処理は既存の shared module があればそこへ寄せる。

```typescript
import { readFile } from "node:fs/promises";
import path from "node:path";
```

## 3. 型設計

- `any` は原則使用しない。外部入力など型が不明な値は `unknown` で受け、検証してから扱う。
- オブジェクト構造は `interface` または `type` で明示する。既存で同等の型がある場合は再利用する。
- 文字列リテラルの集合は union type で表す。
- nullability は明示し、`undefined` / `null` の混在を避ける。
- 型アサーションは最後の手段とし、使う場合は直前で検証済みであることが分かる形にする。

```typescript
type TaskStatus = "todo" | "doing" | "done";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
```

## 4. 関数と制御フロー

- 関数は 1 つの責務に絞り、入力、変換、出力の境界を分ける。
- 早期 return でネストを浅くする。
- 非同期処理は `async` / `await` を使い、Promise の握りつぶしをしない。
- 配列操作は意図が明確な場合に `map` / `filter` / `flatMap` / `reduce` を使う。複雑になる場合は通常のループを使う。
- 例外を投げる関数と、結果を返して呼び出し側で扱う関数の責務を混在させない。

## 5. 外部入力とファイル処理

- CLI 引数、環境変数、YAML/JSON/Markdown 由来の値は信頼せず、必須項目・型・範囲を検証する。
- パスは文字列連結ではなく `node:path` で組み立てる。
- ファイル I/O は `node:fs/promises` を優先する。
- 文字コードは UTF-8 を前提にし、読み書き時に明示する。
- 生成ファイルや入力ファイルの順序が結果に影響する場合は、ソートして再現性を確保する。

## 6. エラー処理

- エラーメッセージには、対象ファイル、対象 ID、操作名など原因調査に必要な文脈を含める。
- 例外を再送出する場合は、元のエラー情報を失わない。
- CLI で複数対象を処理する場合、可能なら対象ごとに失敗を記録し、最後に集約して報告する。
- ユーザー入力の不備と実装上の不具合を区別できるメッセージにする。

## 7. 命名とコメント

- 変数・関数は `camelCase`、型・interface・class は `PascalCase` を使う。
- 複数の英単語を組み合わせる場合は camelCase の語境界を省略しない（例: `closeCmd`、`buildScope`）。単語を小文字で連結した名前は Code Spell Checker に未知語として検出されるため使わない。
- boolean は `is` / `has` / `can` / `should` などで意味が分かる名前にする。
- 略語は既存で定着しているものだけ使う。新たな略語を導入する場合は、省略前の完全な英単語を使う（例: `idx` → `index`、`len` → `length`、`cnt` → `count`）。
- コメントは、コードから読み取れない意図、制約、例外的判断を補足する場合にのみ書く。

## 8. テストと検証

- TypeScript 変更後は、少なくとも `npm run build` を実行して型チェックとビルドを確認する。
- `npm run lint:ts` で ESLint（`@typescript-eslint/no-explicit-any`、`consistent-type-imports` 等）のエラーがないことを確認する。自動修正可能なものは `npm run lint:ts:fix` で一括修正する。
- Markdown や schema 生成に影響する変更では、必要に応じて `npm run lint:md`、`npm run lint:fm`、`npm run validate:schema` を実行する。
- CLI の挙動を変える場合は、代表的な入力で実行結果を確認する。

## 9. 禁止事項

| 禁止事項                                           | 理由                                           |
| -------------------------------------------------- | ---------------------------------------------- |
| `any` を安易に使う                                 | `strict` の利点を失い、実行時エラーを招くため |
| `as` で検証なしに型を押し込む                      | 不正な外部入力を見逃すため                     |
| `// @ts-ignore` / `// @ts-expect-error` を常用する | 型エラーの原因を残したままにするため           |
| パスを `/` 連結の文字列で組み立てる                | OS 差異や正規化漏れの原因になるため            |
| 例外を空の `catch` で握りつぶす                    | 障害調査が困難になるため                       |
| 実行順が必要な処理で暗黙のファイル列挙順に依存する | 環境差で出力が変わるため                       |
