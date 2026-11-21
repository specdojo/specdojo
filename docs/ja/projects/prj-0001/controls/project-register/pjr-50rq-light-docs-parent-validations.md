---
specdojo:
  id: prj-0001:pjr-50rq-light-docs-parent-validations
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-21T11:49:51Z"
---

# PJR-50RQ 文書だけを変えた run の親の検証を軽くし、並列を増やせるようにする

## 1. 概要

文書だけを変えた run でも test-integration・test-unit の全体とリポジトリ全体の lint が 1 本ずつ流れ、1 件あたり約 4 分かかる。文書を読むテストへの絞り込み、変えたファイルだけの lint、lint の並列化で縮め、exec の並列を 4 以上にできるようにする

## 2. 入力

- 2026-11-21、第 3 波と register の run の 46 回分の parent-validation-metrics.jsonl で測った中央値（最大）: test-integration 140 秒（869 秒）、test-unit 48 秒（119 秒）、lint-md 18 秒（90 秒）、lint-fm 17 秒（32 秒）、lint-mermaid・lint-d2・validate-schema は合わせて約 15 秒
- exec-defaults は `parent_validation_concurrency:` 1。test-integration の paths に `docs/ja/specdojo/**` が入り、test-unit は paths がなく毎回流れる。lint:md と lint:fm はリポジトリ全体を検査する
- 文書のパスを含む integration テストは 10 ファイルあるが、多くは fixture の文字列と見ている（未確認）
- コンテナのメモリーは 16GB で、測定時に swap を 2.5GB 使っていた。割り当ての変更は利用者がホストで行う
- 利用者の決定（2026-11-21、indie）: 文書を読むテストへの絞り込み、lint を変えたファイルだけにする、lint の並列化をこの項目で行い、確かめてから 4 列目を増やす

## 3. 完了条件

- 変える前に、文書だけを変えた run（第 3 波の型の run など）の親の検証の時間を、`parent-validation-metrics.jsonl` から検証ごとに集計して個票の対応結果に書く。
- test-integration のうち、実際の文書（`docs/ja/specdojo/**`・`docs/specdojo/**`）を読むテストを確かめて一覧にし、個票の対応結果に書く。文書のパスを fixture の文字列として持つだけのテストは、一覧に含めない。
- 実際の文書を読むテストを、unit と integration のどちらからも別の検証（例: `test-docs`。名前は executor が決め、理由を対応結果に書く）として流せるようにし、`package.json` の script の案を作る。文書だけを変えた run では、test-integration と test-unit の全体ではなく、この検証が流れるようにする。src・tests・tools・scripts・packages・vitest の設定・tsconfig を変えた run では、今までどおり test-integration と test-unit の全体が流れる。
- lint-md と lint-fm を、変えたファイルだけに流せるようにする（統合の commit の hook と同じ範囲）。設定や lint の規則のファイルを変えた run では、今までどおり全体に流す。
- 軽い lint の検証は並べて流し、test の検証は 1 本ずつにできるようにする。runner の側に必要な仕組み（検証ごとに並べてよいかを書くキーなど）を足し、schema と `exec-config-guide` を直す。
- 保護された設定（`.specdojo/exec-defaults.yaml`・`package.json`）は変えない。変える案を個票の対応結果と報告の `handoff` に書く。反映は利用者の承認のもと feature ブランチで行う。
- 単体テストで、文書だけの変更と src の変更のそれぞれで、どの検証が選ばれるかを確かめる。
- `CHANGELOG.md` は変えない。個票の対応結果の `### 5.1. CHANGELOG に書く事項` に、区分と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。
- 統合と保護された設定の反映の後に、オーケストレーターが文書だけを変える run を 1 回流し、検証の合計の時間を変える前と比べて個票に書く。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
