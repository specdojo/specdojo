---
specdojo:
  id: prj-0001:pjr-kata-artifact-kata-readiness-assessment
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-16T13:17:17Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-18T22:33:00Z"
  conclusion: sch-assessment のschema・CLI・テスト・関連ガイドを実装し、typecheck・lint・unit testを通過。review完了。
  register_events:
    - v: 1
      id: reg_fd7216ad0aa6b95c95d7d86faefba5b7
      ts: "2026-08-16T13:29:53Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs(register): add catalog and strategy automation todos"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: 成果物・Kataの利用可能性と推奨フローを判定するagentの実装
        - field: description
          from: ""
          to: "成果物カタログの各 `kind: work` を対象に、成果物本体と Kata（rulebook / recipe / sample / template）の存在、文書状態、内容の利用可能性、既存実装エビデンスの有無を判定する agent 処理を実装する。結果は track 単位のバージョン管理対象 `sch-assessment-<track>.yaml` として保存し、後続コードが標準 strategy profile と `approach` を決定論的に選択する入力にする。"
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: "2026-08-16"
        - field: due
          from: ""
          to: "2026-08-31"
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: 7769f1ba92e4242dc32091f30ef7c3d57fae7dac
    - v: 1
      id: reg_1ee66b21251648e6da197ad6ed680ecc
      ts: "2026-08-18T15:38:58Z"
      action: start
      actor: SpecDojo Test
      from_status: open
      to_status: in-progress
      reason: "exec(register PJR-KATA): start"
      changes:
        - field: status
          from: open
          to: in-progress
      legacy_commit: 747c809840c408653c1c1473ff5086e4aa553afc
      previous_event_id: reg_fd7216ad0aa6b95c95d7d86faefba5b7
    - v: 1
      id: reg_49c7e9886b344b1d66078d53effdfb21
      ts: "2026-08-18T15:45:50Z"
      action: wait
      actor: SpecDojo Test
      from_status: in-progress
      to_status: waiting
      reason: "exec(register PJR-KATA): wait"
      changes:
        - field: status
          from: in-progress
          to: waiting
        - field: conclusion
          from: "-"
          to: "agent exited with non-zero code: agent exited with non-zero code"
      legacy_commit: 06f04bdfa27e31c643753f22e3faa6721f9575d2
      previous_event_id: reg_1ee66b21251648e6da197ad6ed680ecc
    - v: 1
      id: reg_6f3908f732937d06d1e8d2d26785f4cc
      ts: "2026-08-18T22:06:30Z"
      action: start
      actor: SpecDojo Test
      from_status: waiting
      to_status: in-progress
      reason: "exec(register PJR-KATA): start"
      changes:
        - field: status
          from: waiting
          to: in-progress
      legacy_commit: 7f63d856ba4c58f67327275f8542fcb08c59e637
      previous_event_id: reg_49c7e9886b344b1d66078d53effdfb21
    - v: 1
      id: reg_814c391a166410c4eaa9d4cdbb64cede
      ts: "2026-08-18T22:30:20Z"
      action: review
      actor: SpecDojo Test
      from_status: in-progress
      to_status: review
      reason: "exec(register PJR-KATA): review"
      changes:
        - field: status
          from: in-progress
          to: review
      legacy_commit: 4521c9cd2d013367b319fb60f9e2d44051b7cbd9
      previous_event_id: reg_6f3908f732937d06d1e8d2d26785f4cc
    - v: 1
      id: reg_4507731688c32a16e358738b7d031767
      ts: "2026-08-20T13:25:09Z"
      action: close
      actor: SpecDojo Test
      from_status: review
      to_status: done
      reason: "chore: pjr-kataをclose"
      changes:
        - field: status
          from: review
          to: done
        - field: completed
          from: "-"
          to: "2026-08-19"
        - field: conclusion
          from: "agent exited with non-zero code: agent exited with non-zero code"
          to: sch-assessment のschema・CLI・テスト・関連ガイドを実装し、typecheck・lint・unit testを通過。review完了。
      legacy_commit: 51160c8176a310d584b9b3c79c0d84d7160c563c
      previous_event_id: reg_814c391a166410c4eaa9d4cdbb64cede
---

# PJR-KATA 成果物・Kataの利用可能性と推奨フローを判定するagentの実装

## 1. 概要

成果物カタログの各 `kind: work` を対象に、成果物本体と Kata（rulebook / recipe / sample / template）の存在、文書状態、内容の利用可能性、既存実装エビデンスの有無を判定する agent 処理を実装する。結果は track 単位のバージョン管理対象 `sch-assessment-<track>.yaml` として保存し、後続コードが標準 strategy profile と `approach` を決定論的に選択する入力にする。

ファイル存在、frontmatter、宣言参照、schema 適合などコードで判断できる事実は事前に機械判定し、agent には「内容が対象成果物の作成・更新基準として信頼できるか」という意味判断だけを行わせる。agent は `sch-strategy-<track>.yaml` を直接生成・編集しない。

## 2. 完了条件

- `sch-assessment-<track>.yaml` の schema と正準配置先が定義され、対象 track・catalog・local ID ごとに成果物と4種の Kata の存在、status、利用可否、根拠、confidence、実装エビデンスの有無、推奨フローを保持できる。
- `resolveKataRefs` 等の既存解決規則を再利用し、存在確認、`none` 宣言、慣例 ID、frontmatter status、参照切れをコードで事前判定する。同じ解決規則を agent prompt 側へ重複実装しない。
- agent の利用可能性判定には、少なくとも「対象成果物向けの内容か」「空または placeholder 中心でないか」「相互に致命的な矛盾がないか」「現行 rulebook・schema と整合するか」の観点と具体的根拠が含まれる。
- 推奨フローは単純な存在数ではなくタスク目的を含めて判定し、少なくとも次を表現できる。
  - 成果物と Kata 一式を初期整備する `bootstrap`
  - 4種が揃い信頼できる場合の `fully-guided`
  - recipe を主基準として利用できる場合の `recipe-guided`
  - 利用可能な Kata がない場合の `freeform`
  - 既存実装を反映する場合の `retrofit`
  - 必要に応じた `cross-deliverable-dedup`
- `finalize` / `bootstrap-finalize` と各 maintenance approach は、単なる生成状況判定ではなく目的別フェーズであることを schema と生成規則から区別できる。
- `bootstrap` は「Kata が1件でも欠ける」だけでは自動選択せず、成果物と再利用可能な Kata を一式で初期整備する対象かを判定理由に含める。
- 一部の Kata だけが利用可能、ファイルは存在するが利用不能、`status: draft` だが利用可能、宣言先不在、`evidence_refs` あり、既存成果物あり／なしを含む test fixture が追加されている。
- 現行の「整備状況とタスク目的の判断は人が行う」という設計記述を、機械的事実判定・agent 意味判定・必要な human 確認の新しい責務分担へ更新する。
- `npm run typecheck`、変更対象に対応する test、`npm run lint:md` が成功する。

## 3. 作業内容

| No  | 作業                                                                                        | 担当 | 状態 | メモ                                                                        |
| --- | ------------------------------------------------------------------------------------------- | ---- | ---- | --------------------------------------------------------------------------- |
| 1   | `resolveKataRefs`、Kata frontmatter、DCT、`approach` の現行解決規則を整理する               | ARC  | done | 存在と利用可能性を別フィールドとして扱う                                    |
| 2   | `sch-assessment-<track>.yaml` の正準配置、schema、判定状態、根拠・confidence 契約を設計する | ARC  | done | agent 出力はバージョン管理し、strategy の再生成根拠としてレビュー可能にする |
| 3   | コードによる事実収集と agent による意味判定の境界を実装する                                 | ARC  | done | agent にファイル探索、ID導出、存在判定をさせない                            |
| 4   | 推奨フローの判定表と、判定不能時に未確定として停止する規則を実装する                        | ARC  | done | `bootstrap` / `fully-guided` / `recipe-guided` の3択へ限定しない            |
| 5   | 正常系、部分整備、矛盾、参照切れ、実装先行を含む自動テストを追加する                        | ARC  | done | agent 応答は fixture 化し、schema・変換コードを決定的にテストする           |
| 6   | 実践の進め方ガイド、Schedule設計ガイド、関連 schema・CLI リファレンスを更新する             | ARC  | done | human の `ready` 確定権限は変更しない                                       |

## 4. 対応結果

- 判定結果の正本を `<schedule_path>/assessments/sch-assessment-<track>.yaml` と定め、schema を `docs/specdojo/schemas/v1/sch-assessment.schema.yaml` に追加した。`facts`（コード収集）と `judgment`（agent 判定）を分離し、`recommended_approach` は判定規則の結果として検証する契約にした。
- 事実収集は `resolveKataRefs` / `loadRulebookRefs` / `resolveDeliverableSchemaRef` を再利用し、宣言・慣例・`none`・参照切れ・`status`・実装エビデンスの解決をコード側だけで判定する `src/schedule-assessment.ts` を追加した。agent prompt（`src/schedule-assessment-prompt.ts`）は探索と `facts` 編集を明示的に禁止する。
- 利用可能性は `target-fit` / `substantive-content` / `internal-consistency` / `standard-alignment` の4観点を必須とし、`usability` は観点の結果から導出して不一致を検証エラーにした。
- 推奨フローは `intent`（7種）と利用可能性から導出する。`author-deliverable` のみ整備状況で `fully-guided` / `recipe-guided` / `freeform` に分岐し、`bootstrap` / `retrofit` / `cross-deliverable-dedup` / 各 `*-maintenance` / `finalize` / `bootstrap-finalize` は目的別フェーズとして `intent` からのみ選べる（`approachPurpose` で区別）。`bootstrap` は `bootstrap_scope` と理由が必須で、対象がすべて利用可能なら選べない。判定不能時は `undecided` とし、対象 `local_id` の blocking な `open_questions` を必須にした。
- CLI は `specdojo schedule assessment prompt / scaffold / validate` を追加し、`--from` 取り込み時に `facts` の改変・scope 欠落を検出する。テストは `tests/src/schedule-assessment.test.ts`（36件）と `tests/src/schedule-assessment-command.test.ts`（10件）で、部分整備・宣言先不在・`none` 宣言・慣例解決・`status: draft` だが利用可能・`evidence_refs` あり・既存成果物あり／なしを網羅した。
- ガイドの「整備状況とタスク目的の判断は人が行う」という記述を、機械的事実判定・agent 意味判定・コードによる規則適用・human 承認の分担へ更新した（実践の進め方ガイド、実践の型活用ガイド、Schedule設計ガイド、CLIコマンドリファレンス、ディレクトリ構成リファレンス、スケジュール作成ルール）。
- _ASSUMPTION_: 判定結果の配置は `dct-plan-<domain>.yaml` の先例に倣い、`sch-*.yaml` を直接走査する処理と衝突しないよう `assessments/` サブディレクトリとした。プロジェクト実データ（prj-0001 の各 track の判定結果）は本タスクでは生成していない。生成と strategy への反映は後続の PJR-STRG で扱う。

## 5. 関連ドキュメント

- [[specdojo:ryu-guide|実践の進め方ガイド]]
- [[specdojo:kata-guide|実践の型活用ガイド]]
- [[specdojo:schedule-design-guide|Schedule設計ガイド]]
- [[specdojo:sch-rulebook|スケジュール作成ルール]]
- 前提: [[prj-0001:pjr-dctg-data-flow-dct-instance-analysis|data-flow等からDCT成果物インスタンスを判定するagentの実装]]
- 後続: [[prj-0001:pjr-strg-deterministic-dct-strategy-generation|DCTとsch-strategyの決定論的ジェネレーター実装]]
