---
specdojo:
  id: prj-0001:pjr-1f46-kata-sc-01-sc-03
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: note
  item_status: decided
  priority: medium
  registered_at: "2026-08-14T14:29:15Z"
  conclusion: kataは広く整備し、成果物本体の完成はSC-01〜SC-03に必要な範囲へテーラリングする。prj-scope.md更新済み。
---

# PJR-1F46 成果物カタログはkata整備のため最大セットで作成し、実装・運用はSC-01〜SC-03へテーラリングする

## 1. メモ

全19ドメイン238件の成果物カタログを、prj-0001自身の最小スコープではなくkata（rulebook/recipe/sample/template）整備・検証を兼ねて最大セットで作成した。evidence_refs（コード・テスト）とbased_on（prj-*/pm-*文書）による裏付けでAI生成の捏造リスクを抑える方針とし、prj-scope.mdの該当箇所（初期公開に含めるもの2、スコープ外表）を更新済み。

## 2. 背景・文脈

`business-specs`から`migration-planning`まで全ドメインの成果物カタログを作成した時点で、238件中実体があるのは28件（約12%）に留まり、`prj-scope.md`「4. スコープ外」の「全ライフサイクル・全文書種別の完成」（三つの価値仮説に必要な最小セットを優先する）と矛盾するのではないかという懸念を確認した。

検討の結果、次の理由でカタログを最大セットのまま維持する判断に至った。

- 最大セットで作成したことで、`uis-index`/`bds-index`用rulebookの欠落（PJR-MWXS）、CLIコマンド起動型連携を表す`ifx-cmd`区分の欠落（PJR-T7EM、`esil.schema.yaml`の不整合も判明）、`sysd-<term>`型の欠落（PJR-ZP0B）という、kata（実践の型）側の欠陥を実際に発見できた。最小セットのままでは発見できなかった可能性が高い。
- AI生成の捏造リスクは、`evidence_refs`（既存の`src/`・`tests/`実装コード）と`based_on`（既存の`prj-success-criteria-and-acceptance-criteria.md`のSC-01〜06/AC-01〜04、`prj-comparison-of-alternatives.md`の評価軸等）による裏付けで大きく低減できる。`dct-data-flow.yaml`では`evidence_refs`が既に実践されている。
- 唯一裏付けが弱いのは`current-state`/`impact-analysis`/`migration-planning`（じぶんごとプラネット比較）だが、これはWeb一次情報＋出典明記で対応済み。

これを受け、`prj-scope.md`の「初期公開に含めるもの」2番目と「4. スコープ外」の該当行を、kata整備（rulebook/recipe/sample/templateと成果物カタログへの宣言）を最小セット原則の例外とする形へ更新した。

## 3. フォローアップ

- コードが実在する領域（`data-model`／`system-design`／`architecture`／`test-specs`／`external-interface-specs`／`system-functions`）の各カタログエントリへ`evidence_refs`を追記する。
- `bac-*`／`sac-*`／`nfr-*`の該当エントリへ、`prj-success-criteria-and-acceptance-criteria`（AC-01〜04、SC-01〜06）・`prj-comparison-of-alternatives`（評価軸）への参照を追加する。
- 成果物本体の作成・Schedule化は、SC-01〜SC-03に必要な範囲を優先し、238件を一括着手しない。

## 4. 関連ドキュメント

- [[prj-0001:prj-scope]]: 本メモを反映して更新した対象文書
- [[prj-0001:prj-success-criteria-and-acceptance-criteria]]: SC-01〜06・AC-01〜04（bac/sac/nfrの根拠）
- [[prj-0001:prj-comparison-of-alternatives]]: D-01〜D-03の評価軸（nfrの目標値の根拠）
- [[prj-0001:prj-overview]]: BV-01〜04、Start Anywhere Evolve Always等の原則
- [[specdojo:dct-rulebook]]: `evidence_refs`によるretrofitの仕組み
