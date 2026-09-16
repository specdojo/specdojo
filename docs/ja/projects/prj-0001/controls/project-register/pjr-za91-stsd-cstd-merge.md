---
specdojo:
  id: prj-0001:pjr-za91-stsd-cstd-merge
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  owner: ARC
  registered_at: "2026-09-16T22:29:16Z"
  due_on: "2026-09-30"
  block_reason: "agent exited with non-zero code: 親 runner による `test-unit` (`npm run test:unit`) が失敗（exit 1）しており、`tests/src/catalog-merge.test.ts` においてテンプレートの章構成に関するテスト失敗が報告されているため"
---

# PJR-ZA91 STSD と CSTD を STSD へ統合し状態一覧と状態遷移図を 1 文書で扱う

## 1. 概要

ステータス定義（STSD）と概念状態遷移図（CSTD）は、どちらも「1 対象 = 1 ファイル」で常に 1:1 に対応し、CSTD の必須章「状態の説明」が STSD の状態定義と重複している。分けたままでは片方が空洞化するか二重管理になるため、状態一覧と状態遷移図を STSD 1 文書で扱う形へ統合する。

統合先を STSD（`stsd-<term>`）とする理由は次のとおり。

- `stsd` は Status Definition（ステータス定義）で、文書の役割（対象の状態を定義する）を表す。`cstd` は Conceptual State Transition Diagram で、表現形式（図）を指すため、状態一覧を同居させると名前と内容がずれる。
- カタログでは `dct-data-model-stsd` の 5 件が `dct-data-model-cstd` の 4 件を包含しており、STSD を正本にすると変更量が少ない。

### 1.1. 決定事項

- 統合後の STSD の本文構成は「概要 / 状態一覧 / 状態遷移図 / 遷移の説明 / 今後の検討メモ」とする。状態一覧は状態名・通称・意味・成立条件・管理場所を持つ。
- `stsd-rulebook` は現行 `cstd-rulebook`（grade 98）の内容を土台に書き直し、ID 規約の `stl-` 不整合と sample の blocker 指摘も解消する。
- `cstd-rulebook` / `cstd-sample` は deprecated とする。`cstd-mermaid-rulebook` は Mermaid 記法の参照として残し、`stsd-mermaid-rulebook` へ改名する。
- `dct-data-model-cstd.yaml` を廃止し、`dct-data-model-stsd.yaml` の 5 件（register-entry / task-execution / deliverable / routine-run / job-run）へ統合する。
- CDFD（`cdfd-<group>` / `cdfd-uc-<case>`）の「状態遷移の参照」表は「対象 / 状態を変えるプロセス / 状態定義（STSD）」の 1 参照列とする。
- CDFD が参照する対象と STSD の対応は次のとおりとする。登録項目 → `stsd-register-entry`、タスク・Schedule（track）のタスク → `stsd-task-execution`、文書・成果物 → `stsd-deliverable`、実行記録 → `stsd-job-run`。Kata・稼働構成（Onboarding）は状態を持たない扱いとし、参照表は「該当なし」と根拠を記す。

## 2. 完了条件

- `stsd-rulebook` が統合後の本文構成を定義し、`stsd-sample` / template / recipe が rulebook と整合している。
- `cstd-rulebook` / `cstd-sample` が `deprecated` になり、Mermaid 記法の rulebook が `stsd-mermaid-rulebook` として参照されている。
- `dct-data-model-cstd.yaml` が廃止され、`dct-data-model-stsd.yaml` の 5 件に統合内容が反映され、`specdojo catalog validate` が通過している。
- `cdfd-rulebook` / `cdfd-uc-rulebook` / template / sample / `cdfd-overview` と、`data-flow-pdca` の 8 文書の「状態遷移の参照」が STSD 単一参照になり、参照 ID が上記の対応表と一致している。
- `deliverables-reference` / `id-and-file-naming-standard` / `directory-layout-reference` の CSTD 行が統合後の記述に改まっている。
- `npm run lint:md` と `specdojo catalog validate` が通過している。

## 3. 作業内容

| No  | 作業                                                                                                                | 担当 | 状態 | メモ                                                          |
| --- | ------------------------------------------------------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------------- |
| 1   | `stsd-rulebook` を `cstd-rulebook` の内容を土台に統合構成へ改訂し、sample / template / recipe を整合させる          | ARC  | open | codex-expert-executor / gemma-reporter / worktree で実行      |
| 2   | `cstd-rulebook` / `cstd-sample` を deprecated にし、`cstd-mermaid-rulebook` を `stsd-mermaid-rulebook` へ改名する   | ARC  | open | 作業 1 と同一タスクで実施                                     |
| 3   | `dct-data-model-cstd.yaml` を `dct-data-model-stsd.yaml` へ統合し、参照・標準 3 文書の CSTD 行を更新する            | ARC  | open | -                                                             |
| 4   | `cdfd-rulebook` / `cdfd-uc-rulebook` / template / sample / `cdfd-overview` の「状態遷移の参照」を単一参照へ更新する | ARC  | open | -                                                             |
| 5   | `data-flow-pdca` の 8 文書の「状態遷移の参照」を単一参照へ書き換え、参照 ID を決定事項の対応表に揃える              | ARC  | open | オーケストレーターが直接対応。review-pass（`-090`）の前に実施 |
| 6   | PJR-ZFFZ の作業 1（移設先の要否と ID 確定）を本決定で更新する                                                       | ARC  | open | オーケストレーターが直接対応                                  |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[specdojo:stsd-rulebook]]
- [[specdojo:cstd-rulebook]]
- [[specdojo:cstd-mermaid-rulebook]]
- [[specdojo:cdfd-rulebook]]
- [[specdojo:cdfd-uc-rulebook]]
- [[prj-0001:dct-data-model-stsd]]
- [[prj-0001:dct-data-model-cstd]]
- [[prj-0001:cdfd-overview]]
- [[prj-0001:pjr-zffz-cdfd-3-stsd-cstd]]
- [[prj-0001:pjr-6pd7-cdfd-overview]]
