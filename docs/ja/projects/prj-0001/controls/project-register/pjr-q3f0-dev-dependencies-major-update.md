---
specdojo:
  id: prj-0001:pjr-q3f0-dev-dependencies-major-update
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: deferred
  priority: low
  owner: DEV
  registered_at: "2026-09-29T22:17:28Z"
  conclusion: typescript-eslint が TypeScript 7 に未対応（<6.1.0）のため延期する。typescript-eslint が対応したら再開する
---

# PJR-Q3F0 開発用依存の major 更新

## 1. 概要

TypeScript 7、vitest 5、@types/node（Node の下限に合わせ 22 系）、@vscode/vsce 4 への更新と、docs-lint の json-schema-ref-parser の上流対応の確認を行う（リリースと切り離す）

## 2. 完了条件

- _TODO_: 再開するときに記載する。再開の条件は「対応結果」の延期の理由を参照する。

## 3. 作業内容

| No  | 作業                                               | 担当         | 状態 | メモ       |
| --- | -------------------------------------------------- | ------------ | ---- | ---------- |
| 1   | 周辺のパッケージの TypeScript 7 への対応を確かめる | orchestrator | done | 2026-10-16 |
| 2   | 再開の条件を満たしたら、完了条件を記入して再開する | DEV          | open | -          |

## 4. 対応結果

2026-10-16 に延期した。周辺のパッケージが TypeScript 7 に追いついておらず、lint の土台が使えなくなるため（利用者の判断）。

| パッケージ                                       | 最新版（2026-10-16）           | 対応している TypeScript                      |
| ------------------------------------------------ | ------------------------------ | -------------------------------------------- |
| `typescript`                                     | 7.0.2（本リポジトリは 6.0.3）  | -                                            |
| `typescript-eslint`・`@typescript-eslint/parser` | 8.71.2                         | `>=4.8.4 <6.1.0`                             |
| `@astrojs/check`（specdojo-lp）                  | 0.9.10                         | `^5.0.0 \|\| ^6.0.0`                         |
| `vitest`                                         | 5.0.5（本リポジトリは 4.1.11） | 依存に `@types/node` `^22.0.0 \|\| >=24.0.0` |

- 再開の条件: `typescript-eslint` の対応範囲に TypeScript 7 が入ったとき。vitest 5 と `@types/node` は TypeScript と切り離して先に行ってもよいが、急ぐ理由はないため同じ時期にまとめる。

## 5. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
