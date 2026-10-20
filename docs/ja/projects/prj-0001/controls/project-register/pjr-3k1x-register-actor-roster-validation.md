---
specdojo:
  id: prj-0001:pjr-3k1x-register-actor-roster-validation
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-20T12:59:05Z"
  completed_at: "2026-10-20T13:51:01Z"
  conclusion: register の --by を人と agent の名簿と予約名（SpecDojo・specdojo-orchestrator・night-orchestrator）で確かめ、alias は実体名で記録する。名簿にない名前は記帳の前に止める。オーケストレーター本文の規則は PJR-C50G で書いた
---

# PJR-3K1X register の --by の actor が名簿と照らし合わされず、書き方がばらばらになっている

## 1. 課題内容

register の --by に渡した値は、項目別のイベントの actor にそのまま記録され、人の名簿（pm-members.yaml）とも agent の名簿（agent-members.yaml）とも照らし合わされない。本リポジトリのイベントでは、オーケストレーターが orchestrator・claude-orchestrator・specdojo-orchestrator、人が naoji3x・manual・PO（役割の名前）、同じ agent が 2 段構成の前後で codex-expert-executor と sol-executor と記録され、誰が決めて誰が close したかを名簿からたどれない（2026-10-20、利用者の質問で分かった）

## 2. 影響範囲

| 観点         | 影響                                                                                                  |
| ------------ | ----------------------------------------------------------------------------------------------------- |
| スコープ     | `register` の状態遷移と更新の `--by`、イベントの `actor`、人と agent の名簿、オーケストレーターの本文 |
| スケジュール | 急がない（次の版）                                                                                    |
| コスト       | 誰が決めて誰が close したかを、イベントから人がたどり直す手間                                         |
| 品質         | 決定や承認の記録が名簿と結びつかない                                                                  |
| 関係者       | 登録簿の利用者、オーケストレーター                                                                    |

## 3. 対応方針

| 項目     | 内容                                                                                                                          |
| -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `--by` の値を名簿と照らし合わせずに記録している。オーケストレーターは pipeline の段を持たないため、agent の名簿に入れられない |
| 対応策   | `--by` を名簿と予約の名前に限り、オーケストレーターの名前を決め、人の承認は人の nickname で残す                               |
| 依存事項 | なし                                                                                                                          |
| 完了条件 | 下記の完了条件を満たす                                                                                                        |

### 3.1. 完了条件

- `register` の状態遷移・更新の `--by` は、人の名簿の nickname、agent の名簿の名前（別名は実体に解決して記録する）、runner が使う予約の名前（`SpecDojo` など、一覧を決めて規則に書く）だけを受け付け、それ以外は理由を出して止める。既存の利用者のために、照合を警告にとどめる設定を用意するかを決めて result に書く。
- オーケストレーターの actor の名前を、次のどちらかに決めて実装し、理由を result に書く。
  - agent の名簿に、pipeline の段を持たない役割（例: `orchestrator`）として登録できるようにする。
  - 予約の名前を 1 つ決める（例: `specdojo-orchestrator`）。
- 決定や承認の記録は、役割の名前（`PO` など）ではなく人の nickname で残すことを、[[specdojo:pjr-rulebook]]・[[specdojo:register-operation-guide]] とオーケストレーターの本文（4 つのラッパーと配布の雛形も同じ本文）に書く。
- 過去のイベントは書き換えない。名前の対応（例: `codex-expert-executor` と `sol-executor`、`naoji3x` と `indie`）をたどるための一覧を、規則かガイドに書くかを決める。
- 単体テストで、名簿にない `--by` を止めること、別名を実体で記録すること、予約の名前を受け付けることを確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [0.4.1] - 未定` の節に書く。公開済みの版の節は変えない（2026-10-20、利用者の承認で 0.4.1 の範囲に加えた）。

## 4. 対応結果

- `register` の actor を人・agent の合成名簿と予約一覧へ照合し、agent alias は実体の nickname に正規化して event へ記録するようにした。名簿にも予約一覧にもない値は、個票や event を書き換える前に理由を示して停止する。
- 予約 actor は、CLI/runner の既定値 `SpecDojo`、対話型オーケストレーターの `specdojo-orchestrator`、夜間 runner の `night-orchestrator` の 3 つとした。オーケストレーターを pipeline agent 名簿へ混ぜると段の責務と起動設定を誤認させるため、予約名として管理する。
- 未知の actor を警告だけで通す互換設定は設けない。監査記録の不整合を継続させず、利用者に名簿または予約名への修正を求めるためである。
- 決定・承認は Role code ではなく人の nickname で記録する規則を、[[specdojo:pjr-rulebook]]、[[specdojo:register-operation-guide]]、コマンドリファレンスへ反映した。
- オーケストレーター本文の正本 `.agents/specdojo-orchestrator.agent.md` と同期先は agent 保護対象のため、この executor では変更していない。人または対話型オーケストレーターが agent 実行外で、利用者の判断は本人の nickname、オーケストレーター自身の操作は `specdojo-orchestrator` を `--by` に渡す規則を正本へ追記し、`npm run orchestrator:sync` で 10 個の同期先へ反映する必要がある。
- 過去の event は変更せず、旧 actor と現在の名前の対応、および一意に対応しない `manual` / `PO` の調査方法を [[specdojo:register-operation-guide]] に記載した。
- 単体テストに、未知の actor の拒否、agent alias の実体名への解決、予約 actor の受け入れを追加した。

## 5. 関連ドキュメント

- [[specdojo:pjr-rulebook]]（影響先）
- [[prj-0001:pjr-c50g-orchestrator-prompt-operations]]（オーケストレーターの本文）
