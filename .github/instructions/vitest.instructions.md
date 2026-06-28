---
applyTo: "tests/**/*.test.ts"
---

# Vitest テストコード記述ルール

このプロジェクトで Vitest のテストコードを作成・更新する際の共通ルールです。

## 1. 基本方針

- テストは仕様として読める名前にし、実装詳細ではなく観測可能な振る舞いを検証する。
- 既存の TypeScript 実装ルールに従い、`strict` 前提で型エラーを残さない。
- 1 つのテストケースでは 1 つの主要な振る舞いに集中する。
- 正常系だけでなく、境界値、外部入力の不備、失敗時のエラー文脈を検証する。
- テストのためだけに本番コードの公開 API を不自然に広げない。

## 2. ファイル配置と命名

- テストコードは `tests/` 配下に配置する。
- ファイル名は `*.test.ts` に統一し、`*.spec.ts` は使わない。
- テスト対象の本番コードのパスが分かるように、`tests/` 配下のディレクトリ構造を対応させる。
- テストデータや fixture を分ける場合は、関連するテストに近い `tests/` 配下へ置く。

```text
src/exec-shared.ts
tests/src/exec-shared.test.ts
tools/docs/src/validate-md-content.ts
tests/tools/docs/src/validate-md-content.test.ts
scripts/validate-templates.ts
tests/scripts/validate-templates.test.ts
```

## 3. import と Vitest API

- Vitest API は `vitest` から明示的に import する。
- Node.js 標準ライブラリは `node:` プレフィックスで import する。
- テスト対象の import は、本番コードと同じ ESM / NodeNext の前提に合わせる。
- 未使用の `describe`、`beforeEach`、mock、fixture を残さない。

```typescript
import { describe, expect, it } from "vitest";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
```

## 4. テスト構造

- `describe` はテスト対象の関数名、CLI 機能名、またはモジュール責務を表す。
- `it` / `test` の名前は「何をすると、何が起きるか」が分かる文にする。
- Arrange / Act / Assert の流れが読み取れるように、準備、実行、検証を混ぜない。
- 同じ準備が 3 回以上出る場合だけ helper 化を検討する。
- helper は期待値を隠しすぎず、テスト本文から重要な条件が読める形にする。

```typescript
describe("parseProjectId", () => {
  it("returns the prefix before the first colon", () => {
    const actual = parseProjectId("kinuya:catalog");

    expect(actual).toBe("kinuya");
  });
});
```

## 5. 期待値とアサーション

- 期待値は可能な限り具体的に書く。
- スナップショットは、出力全体の変化をレビューしやすい場合に限定する。
- 配列やオブジェクトの一部だけを検証する場合は、検証しない項目がなぜ不要か分かる粒度にする。
- エラー検証では、例外が発生することだけでなく、調査に必要なメッセージや文脈を確認する。
- 日付、時刻、ファイル順序など環境差が出やすい値は固定する。

```typescript
expect(result).toEqual({
  id: "dct-project-management",
  status: "ready",
});

expect(() => parseRequiredField({})).toThrow(/required field: id/);
```

## 6. ファイル I/O と一時ディレクトリ

- 実ファイルを扱うテストでは、`mkdtemp` でテストごとの一時ディレクトリを作成する。
- 一時ディレクトリは `afterEach` または `finally` で削除する。
- リポジトリ内の実ファイルを直接変更しない。
- パスは `node:path` で組み立て、OS 依存の区切り文字に依存しない。
- ファイル内容の読み書きでは UTF-8 を明示する。

```typescript
const dir = await mkdtemp(path.join(tmpdir(), "specdojo-test-"));

try {
  const input = path.join(dir, "input.yaml");
  await writeFile(input, "id: sample\n", "utf8");

  const actual = await loadYaml(input);

  expect(actual).toEqual({ id: "sample" });
} finally {
  await rm(dir, { recursive: true, force: true });
}
```

## 7. Mock と副作用

- mock は外部プロセス、時刻、環境変数、ネットワーク、重い I/O など境界部分に限定する。
- 純粋な変換処理や検証ロジックは、mock せずに入力と出力で検証する。
- モジュール全体を差し替える `vi.mock()` より、関数単位の `vi.spyOn()` を優先する。`vi.mock()` はモジュール全体の挙動が変わり、テスト間干渉の原因になりやすい。
- `vi.spyOn` や `vi.stubEnv` を使った場合は、テスト後に `vi.restoreAllMocks()` または対応する復元処理を行う。
- `process.env` を変更する場合は、元の値を保存して復元する。
- テスト間で共有される mutable state を残さない。

## 8. セットアップとティアダウン

- セットアップ処理に副作用（ファイル生成、DB 書き込みなど）がある場合は `beforeEach` / `afterEach` を使い、テストごとに独立した状態を保証する。
- 副作用がなく、生成コストが高い読み取り専用データ（大きな fixture の解析結果など）は `beforeAll` / `afterAll` でまとめてよい。
- `afterEach` / `afterAll` の中でエラーが起きると後続のクリーンアップが止まる。一時ディレクトリの削除など失敗させたくないクリーンアップは `try/finally` で囲む。

## 9. 非同期処理と CLI

- Promise を返す処理は必ず `await` する。
- 非同期の失敗は `await expect(promise).rejects...` で検証する。
- CLI のテストでは、標準出力、標準エラー、終了コード、生成ファイルを分けて検証する。
- 実プロセス起動が不要な場合は、CLI 本体から呼び出す関数を直接テストする。
- 実プロセスを起動する統合テストでは、入力ファイルと作業ディレクトリを一時ディレクトリに閉じ込める。

```typescript
await expect(loadYaml("missing.yaml")).rejects.toThrow(/missing.yaml/);
```

## 10. テストデータ

- fixture は最小限にし、テストの意図に関係ない項目を増やさない。
- YAML / JSON / Markdown の fixture は、実際の schema や文書規約に沿った形にする。
- 不正データの fixture は、どのルール違反を表すか名前で分かるようにする。
- 複数テストで共有する fixture を変更する場合は、影響範囲を確認する。

## 11. 実行と検証

- テスト追加後は、プロジェクトで定義された Vitest 実行 script を使って確認する。
- Vitest 実行 script が未定義の場合は、導入時に `npm test` または `npm run test` で実行できる script を追加する。
- TypeScript の型影響がある変更では、`npm run build` も実行する。
- Markdown、schema、template 生成に関係するテストでは、必要に応じて `npm run check` または該当する検証 script を実行する。

## 12. 禁止事項

| 禁止事項                                               | 理由                                               |
| ------------------------------------------------------ | -------------------------------------------------- |
| 実装の private な途中状態だけを検証する                | リファクタリングで壊れやすく仕様にならないため     |
| `expect(true).toBe(true)` のような空のテストを書く     | 回帰検知に役立たないため                           |
| timer、mock、環境変数の変更を復元せずに残す            | テスト間の依存や flaky test の原因になるため       |
| 実リポジトリのファイルをテスト中に上書きする           | 作業ツリーを破壊する可能性があるため               |
| OS やローカル時刻に依存した期待値を書く                | 環境差で結果が不安定になるため                     |
| 大量の snapshot に仕様判断を丸投げする                 | レビューが難しく、意図しない変更を見逃しやすいため |
| 本番コードの型エラーを `as any` や `@ts-ignore` で隠す | テストの信頼性と保守性を下げるため                 |
