---
specdojo:
  id: prj-0001:pjr-rpnf-sample-docs-build-at-gates
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
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

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
