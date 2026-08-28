---
specdojo:
  id: prj-0001:pjr-0154-operations-domain-timing
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: decided
  priority: medium
  owner: PO
  due_on: "2026-08-31"
  completed_at: "2026-08-04T12:00:00Z"
  conclusion: シビックテックサービスの運用設計（090-operations相当）はprj-0001の対象外とし、代表試行（SC-01〜SC-03）確認後の後続プロジェクトで検討する
  register_events:
    - v: 1
      id: reg_d8cd2456072f27bea3e300acfb9a796c
      ts: "2026-08-05T09:31:39Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs: PJR-0153をdeprecate, PJR-0154を起票"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: シビックテックサービスの運用設計（090-operationsドメイン）の対応時期を決定
        - field: description
          from: ""
          to: "`dct-data-flow.yaml`（プロジェクト推進・オペレーション推進の業務フロー）を拡充する過程で、SpecDojoを用いて作成するシビックテックサービス自体の「運用設計」（`docs-structure-guide.md` が定める製品ドキュメント構成の `090-operations` ドメイン相当）を、どのプロジェクトでいつ整理するかが未確定であることが判明した。`prj-scope.md` は「個別ソリューションの本番開発・運用」をスコープ外としているが、その担い手が prj-0001 の後続活動か、別プロジェクトかは明記されていなかったため、判断を確定する。"
        - field: type
          from: ""
          to: decision
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: _TODO_
        - field: registered
          from: ""
          to: _TODO_
        - field: due
          from: ""
          to: _TODO_
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: f1e6a33769b5de1c207e05a8815b101314b018cd
    - v: 1
      id: reg_2addc0f74a54b612a567203b5e8f057e
      ts: "2026-08-09T10:55:22Z"
      action: close
      actor: SpecDojo Test
      from_status: open
      to_status: decided
      reason: "exec(register PJR-9P5Q): 既存登録項目を個票 frontmatter へ一括移行する"
      changes:
        - field: status
          from: open
          to: decided
        - field: description
          from: "`dct-data-flow.yaml`（プロジェクト推進・オペレーション推進の業務フロー）を拡充する過程で、SpecDojoを用いて作成するシビックテックサービス自体の「運用設計」（`docs-structure-guide.md` が定める製品ドキュメント構成の `090-operations` ドメイン相当）を、どのプロジェクトでいつ整理するかが未確定であることが判明した。`prj-scope.md` は「個別ソリューションの本番開発・運用」をスコープ外としているが、その担い手が prj-0001 の後続活動か、別プロジェクトかは明記されていなかったため、判断を確定する。"
          to: 運用設計について、prj-0001での対応方針を決定する
        - field: owner
          from: _TODO_
          to: PO
        - field: due
          from: _TODO_
          to: "2026-08-31"
        - field: conclusion
          from: "-"
          to: シビックテックサービスの運用設計（090-operations相当）はprj-0001の対象外とし、代表試行（SC-01〜SC-03）確認後の後続プロジェクトで検討する
      legacy_commit: dbac152079df02ec9bbad154a3253c043e10655a
      previous_event_id: reg_d8cd2456072f27bea3e300acfb9a796c
    - v: 1
      id: reg_34584a950f84cb88f8d8e155f88b7145
      ts: "2026-08-09T14:39:40Z"
      action: update
      actor: SpecDojo Test
      from_status: decided
      to_status: decided
      reason: "exec(register PJR-EQAQ): 登録簿日時をregistered_at・completed_atへ移行する"
      changes:
        - field: completed
          from: "-"
          to: "2026-08-04"
      legacy_commit: 38201bef867f3cc1454db6b748fc979ed3f2fa8f
      previous_event_id: reg_2addc0f74a54b612a567203b5e8f057e
---

# PJR-0154 シビックテックサービスの運用設計（090-operationsドメイン）の対応時期を決定

## 1. 背景

運用設計について、prj-0001での対応方針を決定する

`dct-data-flow.yaml`（プロジェクト推進・オペレーション推進の業務フロー）を拡充する過程で、SpecDojoを用いて作成するシビックテックサービス自体の「運用設計」（`docs-structure-guide.md` が定める製品ドキュメント構成の `090-operations` ドメイン相当）を、どのプロジェクトでいつ整理するかが未確定であることが判明した。`prj-scope.md` は「個別ソリューションの本番開発・運用」をスコープ外としているが、その担い手が prj-0001 の後続活動か、別プロジェクトかは明記されていなかったため、判断を確定する。

## 2. 検討した選択肢

<!-- prettier-ignore -->
| 選択肢 | 内容 | 利点 | 懸念 |
| --- | --- | --- | --- |
| A | prj-0001 のスコープに `090-operations` ドメイン（`dct-operations.yaml`）を今すぐ追加する | 代表試行の検証と並行して運用設計まで一貫して整備できる | `prj-scope.md`「全ライフサイクル・全文書種別の完成」の対象外方針と矛盾し、初期公開の最小セット優先を崩す |
| B | prj-0001 は対象外のまま据え置き、担い手を未定にする | 現状維持で追加作業がない | 実際にシビックテックへ適用する段になって毎回スコープ判断をやり直すことになる |
| C | prj-0001 は対象外とし、代表試行（SC-01〜SC-03）の確認後に着手する後続プロジェクトで扱うと決定する | `prj-scope.md` の初期公開優先方針と整合し、代表試行で得た知見を運用設計へ反映できる | 後続プロジェクトの起票時期・実施主体は別途決定が必要 |

## 3. 決定内容

シビックテックサービスの運用設計（`090-operations` ドメイン相当の data-flow 整理を含む）は、prj-0001 の対象外とする。代表試行（`prj-success-criteria-and-acceptance-criteria.md` の SC-01〜SC-03、AC-01「代表試行を実施できる」）の確認後に着手する後続プロジェクトで検討する。

## 4. 採択理由

- `prj-scope.md` §4「スコープ外」の「個別ソリューションの本番開発・運用」「全ライフサイクル・全文書種別の完成」の対象外方針（三つの価値仮説に必要な最小セットを優先）と整合するため。
- `prj-overview.md` §5.2 の短期指標が「実際のシビックテックでの利用」を公開後の外部利用として扱っており、運用設計は代表試行の検証結果を踏まえてから着手する方が、当事者の実情に即した整理ができるため。
- prj-0001 の初期公開（SC-01〜SC-03 確認まで）は最小成果物セットの検証を優先しており、運用設計まで含めると `prj-scope.md`「6. スコープ変更方針」の変更手続きなしに対象を広げることになるため。

## 5. 影響範囲とフォローアップ

<!-- prettier-ignore -->
| 項目 | 内容 |
| --- | --- |
| 影響範囲 | `dct-data-flow.yaml`（対象外を維持）、prj-0001 の成果物カタログ（`090-operations` ドメインを追加しない） |
| 必要な対応 | 代表試行完了・AC-01 確認後、後続プロジェクトの起票要否を改めて判断する |
| 追跡先 | 後続プロジェクト起票時に、本決定（PJR-0154）を根拠として参照する |

## 6. 関連ドキュメント

- [[prj-0001:prj-scope]]
- [[prj-0001:prj-success-criteria-and-acceptance-criteria]]
- [[prj-0001:dct-data-flow]]
