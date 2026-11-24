---
specdojo:
  id: prj-0001:pjr-g2xj-kata-review-all-strategy
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-24T13:33:23Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-0BGE
  depends_on:
    - PJR-E30T
  commit_type: docs
  commit_scope: schedule
---

# PJR-G2XJ 全 sample の段のレビューの strategy を作る

## 1. 概要

書き手と別のモデルの振り分けと流す順を組み、track kata-review-all の strategy を作る

## 2. 入力

- 担当は BA、期限は 2026-11-30（利用者、2026-11-24）
- PJR-0BGE の段取りとして 2026-11-24 の晩の実行の前に行う（利用者、2026-11-24）
- flash が書いた sample は sol に任せる（オーケストレーターの推奨、2026-11-24）

## 3. 完了条件

- `docs/ja/projects/prj-0001/schedule/sch-strategy-kata-review-all.yaml`（track `kata-review-all`）を作る。scope は `dct-kata` の非推奨でない sample のうち、目合わせを済ませた `prj-overview-sample`・`opr-sample`・`stsd-sample` を除くすべてとする。
- 段の phase set は `sch-strategy-kata-review-calibration.yaml` の `kata-agent-review-pass`（報告の形を直した後の版）を写す。`task_suffix` は文字列のまま保つ。
- agent は、書き手と別のモデルにする決まり（kata-guide の `書き手と別のモデルの組み方`）で `owner_rules` の `phase_overrides[].agent` に書く。codex が書いた sample（`bac-sample`�`bdd-sample`�`cdfd-uc-sample`�`dct-index-sample`�`ifd-sample`�`opd-sample`�`pm-roles-sample`�`sysd-critical-flows-sample`�`sysd-cross-cutting-policy-sample`�`sysd-index-sample`）は `opus-executor`、ほか（claude が書いたもの、および flash が書いた `cdt-sample`�`ifx-cmd-sample`）は `sol-executor` とする。reporter は `sonnet-reporter`。書き手はオーケストレーターが実行の記録から調べた（2026-11-24）。
- owner は、各 sample を整えた既存の strategy（`sch-strategy-kata-wave-*`・`sch-strategy-business-specs-kata` など）の `owner_rules` に合わせる。見つからないものは rulebook の担当の役割から決め、決め方を個票の対応結果に書く。
- 流す順は、grade が pass でない `opd-sample`・`bes-sample`・`ifx-file-sample`・`etc-index-sample` を先にし、残りは型の系列の順（プロジェクトの定義・計画 → 業務 → システム → 試験・運用など）にする。順の付け方（strategy の設定）と理由を個票の対応結果に書く。
- `npm run validate:schema:file`（sch-strategy の schema）を通し、`specdojo schedule build --project prj-0001 --track kata-review-all --dry-run` で sample ごとに 110→120→130→140→150 の順につながることと、タスクの数（sample の数 × 5）を確かめて個票の対応結果に書く。
- track（`sch-track-kata-review-all.yaml`）は作らない。作ると `exec run --auto` の選択に入るため、実行の前にオーケストレーターが作る。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。

## 4. 作業内容

| No  | 作業                                                                      | 担当 | 状態 | メモ                                                         |
| --- | ------------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------------ |
| 1   | scope・phase set・approach を目合わせの strategy から写して組む           | BA   | done | 103 件、`kata-agent-review-pass` をそのまま写した            |
| 2   | owner を既存の strategy から決め、書き手と別の agent を指名する           | BA   | done | 決め方は「owner の決め方」、agent は「agent の振り分け」     |
| 3   | 流す順を `cross_domain_dependencies` で付ける                             | BA   | done | 付け方と理由は「流す順」                                     |
| 4   | schema の検証と `schedule build --dry-run` で段のつながりと件数を確かめる | BA   | done | 結果は「確かめた結果」。track は作らない（完了条件のとおり） |

## 5. 対応結果

`docs/ja/projects/prj-0001/schedule/sch-strategy-kata-review-all.yaml`（track `kata-review-all`）を作った。scope は [[prj-0001:dct-kata]] の sample 106 件（すべて非推奨でない）から目合わせの `prj-overview-sample`・`opr-sample`・`stsd-sample` を除いた 103 件である。phase set は [[prj-0001:sch-strategy-kata-review-calibration]] の `kata-agent-review-pass` を本文ごと写し、`task_suffix` は文字列（`"110"`〜`"150"`）のまま保った。`approach_rules` も同じく `improve-kata`（`kata_target: rulebook`）にした。track（`sch-track-kata-review-all.yaml`）は作っていない。

### 5.1. owner の決め方

次の順で、先に当たったものを採った。

1. sample そのものを `owner_rules` に持つ strategy（`sch-strategy-kata-wave-3`〜`6-*`）の owner。69 件がこれで決まった。
2. 同じ型の代表の成果物で sample を作った・整えた kata の strategy（`kata-wave-1`・`kata-wave-2`・`business-specs-kata`・`business-specs-kata-2`・`project-kata`）の owner。複数あれば新しいほうを採った。`kata-slim`・`kata-slim-2` は型をまたいで一律 BA で削る段のため使わなかった。
3. 上の 2 つで決まらないものは、同じ rulebook の sample の owner、または rulebook の担当の役割から決めた。

2 と 3 で決めたものは次のとおり。

| sample                                                                                                                                                                                                           | owner | 根拠                                                                                                   |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------ |
| `sysd-index-sample`・`sysd-critical-flows-sample`・`sysd-cross-cutting-policy-sample`・`sf-index-sample`・`ifd-sample`・`bes-index-sample`・`ifx-index-sample`・`dct-index-sample`                               | ARC   | `kata-wave-1`                                                                                          |
| `sld-sample`・`ifx-file-sample`                                                                                                                                                                                  | ARC   | `kata-wave-2`                                                                                          |
| `bac-sample`                                                                                                                                                                                                     | BA    | `kata-wave-2`                                                                                          |
| `bds-sample`                                                                                                                                                                                                     | UX    | `kata-wave-2`                                                                                          |
| `sf-sample`・`cdt-sample`・`ccd-sample`・`bdd-sample`・`br-sample`・`bes-sample`                                                                                                                                 | ARC   | `business-specs-kata`                                                                                  |
| `clis-sample`・`cdsd-sample`・`cdfd-uc-sample`・`ifx-cmd-sample`                                                                                                                                                 | BA    | `business-specs-kata-2`（`ifx-cmd-sample` は `business-specs-kata` の ARC より新しいほうを採った）     |
| `prj-assumptions-constraints-dependencies-sample`・`prj-comparison-of-alternatives-sample`・`pm-organization-sample`・`pm-plan-sample`・`pm-quality-management-plan-sample`・`pm-raci-sample`・`pm-roles-sample` | PM    | `project-kata`                                                                                         |
| `prj-charter-sample`                                                                                                                                                                                             | PO    | `launch`（kata の strategy に無く、`prj-*` の sample の owner も PO）                                  |
| `opd-sample`                                                                                                                                                                                                     | OPS   | 同じ `opd-rulebook` の sample（`opd-access-control-sample` など）の owner                              |
| `pm-orchestrator-playbook-sample`                                                                                                                                                                                | PM    | プロジェクトの運営の文書で、ほかの `pm-*` の sample と同じ役割                                         |
| `ifx-api-sample`・`ifx-msg-sample`                                                                                                                                                                               | ARC   | rulebook の合意の当事者（DEV が ARC の助言で作る）のうち、ほかの `ifx-*` の sample の owner に合わせた |

### 5.2. agent の振り分け

[[specdojo:kata-guide|実践の型活用ガイド]] の `書き手と別のモデルの組み方` に従い、`owner_rules` の各規則の `phase_overrides[].agent` に R1〜R5 の 5 段とも書いた。codex が書いた 10 件（`bac-sample`・`bdd-sample`・`cdfd-uc-sample`・`dct-index-sample`・`ifd-sample`・`opd-sample`・`pm-roles-sample`・`sysd-critical-flows-sample`・`sysd-cross-cutting-policy-sample`・`sysd-index-sample`）は `opus-executor`、ほかの 93 件（flash が書いた `cdt-sample`・`ifx-cmd-sample` を含む）は `sol-executor` にした。reporter はすべて `sonnet-reporter` である。`owner_rules` は owner と executor の組ごとに 11 規則に分けた。

### 5.3. 流す順

`exec run --auto` は ready のタスクを critical-first（slack、最早開始、タスク ID の順）で選ぶ。依存のない sample どうしはタスク ID（`local_id` の英字順）で選ばれるため、順は `cross_domain_dependencies` で付けた。

- 段: grade が pass でない sample → プロジェクトの定義・計画 → 業務 → システム → 試験 → 運用・移行の 6 段に分けた。段の中の並びは `scope.catalogs[].local_ids` に同じ順で書いた。
- 付け方: 各段の最後の sample を区切りとし、区切りは段のほかの sample を待ち、次の段の sample は区切りの R5 を待つ。段の中は並べて流せる。区切りは `etc-index-sample`・`dct-index-sample`・`imp-business-sample`・`sysd-index-sample`・`imp-test-sample`・`imp-operations-sample` である。
- 先頭の段に `tsp-index-sample` を入れた。カタログの `depends_on` で `etc-index-sample` が `tsp-index-sample` を待つため、試験の段に残すと依存が循環するからである。
- 段ごとに区切りで止める理由: 依存の無い sample を前の段の残りより先に選ばせないためである。前の段の 1 件だけに依存させると、後の段のほうが slack が小さくなり先に選ばれる。

### 5.4. 確かめた結果

- `npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/sch-strategy.schema.yaml --data docs/ja/projects/prj-0001/schedule/sch-strategy-kata-review-all.yaml`: valid。
- `specdojo schedule build --project prj-0001 --track kata-review-all --dry-run`: 終了コード 0。タスクは 515 件（103 件 × 5）で、103 件とも 110→120→130→140→150 の順に前の段の 1 件だけを待つ。track の外への依存は無い。executor は `opus-executor` が 10 件、`sol-executor` が 93 件で、reporter はすべて `sonnet-reporter` である。
- 依存の深さで見た R1 の始まる順は、先頭の段の 4 件（`opd-sample`・`bes-sample`・`ifx-file-sample`・`tsp-index-sample`）→ `etc-index-sample` → プロジェクトの定義・計画 → 業務 → システム → 試験 → 運用・移行の順になった。

### 5.5. 迷った点と決めたこと

- 段ごとに区切りで止めるため、区切りの sample の 5 段は段の中で 1 件だけ流れ、並べて流せない時間ができる。また段の 1 件が blocked になると、次の段は区切りを通るまで始まらない。順を守ることを優先した。夜通しの実行で止まった場合は、オーケストレーターが blocked の sample を再開するか、track を作る前に該当の `cross_domain_dependencies` を外す。
- 系列の分け方は rulebook の分野で決めた。`nfr-*`・`sac-sample`・`trc-requirements-to-specs-sample` はシステムの段、`mm-sample`・`pr-sample`・`dct-*` はプロジェクトの定義・計画の段、`imp-*` は影響を見る相手の系列の段に入れた。
- `approach_rules` は目合わせの strategy に合わせて `kata_target: rulebook` にした。段の `approach` は phase の `sample-maintenance` が決める。

### 5.6. CHANGELOG に書く事項

- なし

## 6. 関連ドキュメント

- [[prj-0001:pjr-0bge-kata-review-all]]（親の epic）
- [[prj-0001:sch-strategy-kata-review-calibration]]（写した phase set）
- [[specdojo:kata-guide|実践の型活用ガイド]]（段と agent の組み方の正本）
- [[prj-0001:dct-kata]]（scope のカタログ）
- `docs/ja/projects/prj-0001/schedule/sch-strategy-kata-review-all.yaml`（成果物）
