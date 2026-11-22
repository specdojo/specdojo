---
specdojo:
  id: prj-0001:pjr-rpnf-sample-docs-build-at-gates
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: high
  difficulty: easy
  registered_at: "2026-11-21T23:03:49Z"
  derived_from:
    - PJR-50RQ
---

# PJR-RPNF sample の executor がタスクごとに docs:build を流し、メモリーと時間を使う

## 1. 概要

sample の作成規則の最終チェックが docs:build を求めるため、型の executor が 1 件ごとに 5〜6GB と数分を使う。タスクごとのチェックから外し、波の区切りと release の前に 1 回流す運用にする。

## 2. 入力

- 2026-11-21 の夜、型の executor の docs:build（5.8GB）でコンテナのメモリーと swap が尽きかけた。
- runner は executor が `not_run` と報告した検証を、親の検証が肩代わりしない限り失敗にする（src/exec/reporter.ts）。docs:build は親の検証に入っていない。
- docs:build は deploy の workflow（.github/workflows/deploy.yml）で流れる。check:release には入っていない。
- タスクごとのチェックから外し、区切りで 1 回流す案（A）は indie の決定（2026-11-22）。

## 3. 完了条件

- `.github/instructions/sample.instructions.md` の最終チェックから「`npm run docs:build` でエラーがない」を外す。代わりに、文書サイトのビルドは型の schedule の区切り（gate の前）と release の前にオーケストレーターがまとめて 1 回流すため、タスクごとには流さないと 1 行で書く。
- 外した後も、最終チェックに `npm run -s lint:md` は残す。
- `pm-orchestrator-playbook` の docs:build の項に、次を書く。
  - 型の schedule では、gate（例: `G-KATA-WAVE-3-first-pass`）の前と release の前に、`exec queue` の 1 段として `npm run docs:build` を 1 回流す。並べた run と重ねない。
  - 失敗したら、出力の対象ファイルから原因のタスクを特定し、同じ型の todo か新しい項目で直す。
- `rulebook.instructions.md` など、ほかの作成規則に docs:build をタスクごとに求める記述がないことを確かめ、個票の対応結果に書く。
- `docs/ja/specdojo/` の guides・standards で、executor にタスクごとの docs:build を求める記述があれば同じ方針に直す。手順の例として docs:build を挙げているだけの記述（`id-and-file-naming-standard` の解決の確認の手順など）は変えない。どれを変え、どれを変えなかったかを個票の対応結果に書く。
- `package.json`・`tools/`・`.github/workflows/` は変えない。`check:release` に docs:build を足す案があれば、個票の対応結果に案として書く。
- `CHANGELOG.md` は変えない。個票の対応結果の `### 5.1. CHANGELOG に書く事項` に、区分と行の文案を書く。
- `npm run lint:md`・`npm run lint:fm` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                          | 担当 | 状態 | メモ                      |
| --- | --------------------------------------------- | ---- | ---- | ------------------------- |
| 1   | sample の作成規則の最終チェックを直す         | DEV  | done | `lint:md` は残す          |
| 2   | playbook に区切りで流す運用を書く             | DEV  | done | `exec queue` の 1 段      |
| 3   | ほかの作成規則・guides・standards を確かめる  | DEV  | done | 変えた・変えないを記録    |
| 4   | `check:release` の案と CHANGELOG の文案を書く | DEV  | done | `package.json` は変えない |

## 5. 対応結果

### 5.1. 実施内容

- `.github/instructions/sample.instructions.md` の最終チェックから `docs:build` の項を外し、区切りと release の前にオーケストレーターが 1 回流す旨の 1 行へ置き換えた。`npm run -s lint:md` の項は残した。
- `pm-orchestrator-playbook` の docs:build の項に、gate の前と release の前に `exec queue` の 1 段として 1 回流すこと、失敗時の原因タスク特定と修正方針を追記した。
- `rulebook.instructions.md` ほかの `.github/instructions/` に、タスクごとの docs:build を求める記述はなかった。
- `docs/ja/specdojo/` の guides・standards に、executor へタスクごとの docs:build を求める記述はなく、変更していない。対象外とした記述は次のとおり。
  - `id-and-file-naming-standard`: 解決確認の手順例。
  - `project-move-guide`・`release-v0-3-0-migration-guide`: 移行後の確認手順。
  - `exec-config-guide`: `lint:mermaid` の説明での言及。
  - `job-sequence-guide` と `job-sequence` の sample: `exec queue` の段の例。
- `package.json`・`tools/`・`.github/workflows/`・`CHANGELOG.md` は変えていない。

### 5.2. check:release の案

`check:release` の末尾に `npm run docs:build` を足す案がある。deploy の workflow と二重になり時間とメモリーを使うため、採否は indie の判断とし、本タスクでは足していない。

### 5.3. CHANGELOG に書く事項

- 区分: Changed
- 文案: sample の作成規則の最終チェックから `docs:build` を外し、型の schedule の区切りと release の前に 1 回流す運用にしました（PJR-RPNF）。

## 6. 関連ドキュメント

- [[prj-0001:pm-orchestrator-playbook]]
