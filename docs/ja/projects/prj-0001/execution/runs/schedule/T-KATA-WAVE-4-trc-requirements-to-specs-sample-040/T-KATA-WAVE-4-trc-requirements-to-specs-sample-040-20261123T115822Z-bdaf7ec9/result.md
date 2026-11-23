---
specdojo:
  id: prj-0001:xer-t-kata-wave-4-trc-requirements-to-specs-sample-040-20261123t115822z-bdaf7ec9
  type: exec-result
  task_id: T-KATA-WAVE-4-trc-requirements-to-specs-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-4-trc-requirements-to-specs-sample-040/T-KATA-WAVE-4-trc-requirements-to-specs-sample-040-20261123T115822Z-bdaf7ec9/plan.md
  started_at: "2026-11-23T11:58:29.137Z"
  completed_at: "2026-11-23T16:28:10.690Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:trc-requirements-to-specs-sample
    - specdojo:trc-requirements-to-specs-rulebook
---

# Edit Result

## 1. 実施内容

- trc-requirements-to-specs-rulebook を簡潔に見直した。
- F001（生成手段の不足）に対応するため、「生成の手順」の節を追加し、手作業による手順を明文化した。
- F002（要求に対応しない仕様の扱い）に対応するため、要求に対応しない仕様を別の表として扱う規定とし、表の構成を見直した。
- F003（`一部充足` の条件）に対応するため、条件から「参照先が未作成」という文言を除外した。
- PJR-76N9 に基づき、役割の割り当てに関する記述を削除し、文書の利用場面や用途の定義に絞った。
- F004（sample との矛盾）については、rulebook を正として規定を整理し、sample 側の修正が必要な事項を handoff に残した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/trc-requirements-to-specs-rulebook.md`: rulebook の章構成を整理し、生成の手順の追加、要求に対応しない仕様の表の扱いに関する規定の変更、`一部充足` の条件の修正、および役割に関する記述の廃止を行った。

## 3. 申し送り

- F004（sample と rulebook の矛盾）は rulebook を正とし、この段では sample を変えていない。sample を直す段で次の 6 点を rulebook に合わせる必要がある。(1) 「トレース対象の前提」で `bac-*` を仕様の参照元として扱っている。`bac-*` は要求側に置く。(2) 「トレース対象の前提」に母集団、生成の手段（「生成の手順」による手作業）、生成日、生成元の版を書く。(3) req-r1-004 は対応仕様 `bes-audit-log` があるのに `未着手` としている。`relations.satisfies` と `status` に基づいて判定し直す。(4) ギャップ表から担当・期限の列を外す。(5) 「更新時は備考欄に参照チケット ID を追記する」という手で追記させる規定を外す。(6) `based_on` をマトリクスの生成元（要求の文書と、抽出した仕様の文書）と一致させる。あわせて、要求に対応しない仕様の別表とサマリの件数（合計が母集団の件数と一致すること）を rulebook の新しい規定に合わせ、`_TODO_`・`_UNDECIDED_` が残るギャップ列も見直す。
- 生成コマンドはまだない（`src` に trc の生成処理はない）。rulebook では手作業の「生成の手順」を定めた。生成コマンドを作るかどうかは、要求→テストの rulebook にある `_UNDECIDED_` と合わせて決める必要がある。
- 直さなかった箇所と理由: 全体方針・位置づけ・ファイル命名・Frontmatter・6.4./6.5.・禁止事項（文言を 1 か所揃えた以外）は、grade の指摘も冗長な記述も見つからなかったため、そのままにした。

## 4. 進め方と実践の型の適用

対象の sample が従う rulebook を、grade の指摘と成果物の `done_criteria` に沿って簡潔に整えた。rulebook に完成例の章を置かず、記述ガイドには章ごとの判断基準と良い例・悪い例を記述する方針を維持した。PJR-76N9 に従い、「誰がどの利用場面で何を判断するか」という記述を「どの利用場面で何を判断するための文書か」という趣旨に修正し、役割の割り当てを本文から除外した。
