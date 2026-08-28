---
specdojo:
  id: prj-0001:pjr-rg7c-reporter-result-generation
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-10T06:28:44Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-10T22:42:22Z"
  conclusion: reporterの厳格な出力契約（Ajv 2020 strict schema検証・形式不正時3回再試行）とresult決定的描画をexec-reporter.ts/exec-results.tsに実装。frontmatter不変・review RVP順序一致を確認。対象85件成功。
  register_events:
    - v: 1
      id: reg_0bdc07b7a0ade614ff3088724904fd5c
      ts: "2026-08-10T06:36:41Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs(register): add executor reporter pipeline todos"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: reporterステージとresult生成を実装する
        - field: description
          from: ""
          to: reporterへplanとevidenceを引き渡し、厳格な構造化出力を検証してからrunnerがfrontmatterとresult Markdownを決定的に生成する。
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
          to: "2026-08-10"
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
      legacy_commit: 05c3d3781552e051565e003506dd009eb1312db5
    - v: 1
      id: reg_ea1d39c7074d6978899e32de974d9d63
      ts: "2026-08-10T07:22:15Z"
      action: start
      actor: SpecDojo Test
      from_status: open
      to_status: in-progress
      reason: "exec(register PJR-RG7C): start"
      changes:
        - field: status
          from: open
          to: in-progress
      legacy_commit: 2e2e94eb632acd326d03d55d3c1cb649b642fd46
      previous_event_id: reg_0bdc07b7a0ade614ff3088724904fd5c
    - v: 1
      id: reg_b9783f93953299caa9a70c37dddad1d1
      ts: "2026-08-10T07:44:35Z"
      action: review
      actor: SpecDojo Test
      from_status: in-progress
      to_status: review
      reason: "exec(register PJR-RG7C): review"
      changes:
        - field: status
          from: in-progress
          to: review
      legacy_commit: b68fa59bc32f855d3adfba271e0431ca6fcc1e76
      previous_event_id: reg_ea1d39c7074d6978899e32de974d9d63
    - v: 1
      id: reg_97a4f52e6b585c4b78f6f7e116efe4a9
      ts: "2026-08-10T22:46:50Z"
      action: close
      actor: SpecDojo Test
      from_status: review
      to_status: done
      reason: "exec(register PJR-TC43): executor / reporterパイプラインのE2E検証と文書化"
      changes:
        - field: status
          from: review
          to: done
        - field: completed
          from: "-"
          to: "2026-08-11"
        - field: conclusion
          from: "-"
          to: reporterの厳格な出力契約（Ajv 2020 strict schema検証・形式不正時3回再試行）とresult決定的描画をexec-reporter.ts/exec-results.tsに実装。frontmatter不変・review RVP順序一致を確認。対象85件成功。
      legacy_commit: 095189d5df7fcb58163a4c5c1f6e847a113a1db3
      previous_event_id: reg_b9783f93953299caa9a70c37dddad1d1
---

# PJR-RG7C reporterステージとresult生成を実装する

## 1. 概要

reporterへplanとevidenceを引き渡し、厳格な構造化出力を検証してからrunnerがfrontmatterとresult Markdownを決定的に生成する。

## 2. 完了条件

- reporter に plan、evidence、必要最小限の差分情報を入力し、成果物の再編集なしで結果を要約できる。
- reporter 出力を厳格な JSON スキーマで検証し、不正な出力を result へ反映しない。
- runner が管理する frontmatter と reporter の構造化出力から result Markdown を決定的に生成できる。
- reporter の形式エラーは reporter だけを再試行し、executor の成果と evidence を再利用できる。
- 生成した result が frontmatter 検証と Markdown lint を通過する。

## 3. 作業内容

| No  | 作業                                        | 担当 | 状態 | メモ                             |
| --- | ------------------------------------------- | ---- | ---- | -------------------------------- |
| 1   | reporter の入力契約と出力 JSON を定義する   | ARC  | open | 生ログ全体は渡さない             |
| 2   | reporter 起動と構造検証を実装する           | ARC  | open | 形式エラーを明示する             |
| 3   | result の決定的レンダラーを実装する         | ARC  | open | frontmatter は runner が所有する |
| 4   | reporter 単独リトライと検証テストを追加する | ARC  | open | executor は再実行しない          |

## 4. 対応結果

- reporter stage の入力を plan と runner が収集した上限付き executor evidence に限定し、edit / review を判別する `exec-reporter-output.schema.yaml` と同じ JSON Schema を Ajv 2020 strict mode で検証する処理を追加した。生ログや raw diff は reporter prompt へ渡さない。
- pipeline の第2 stage 要件（`capabilities`、`proficiency`、`stage_role: reporter`）から agent を独立選択し、worktree / in-place の両経路で executor 成功後に起動するよう runner を拡張した。
- reporter が返した検証済み JSON から edit / review result の本文を決定的に描画し、scaffold 済み frontmatter は runner 管理のまま保持する renderer を追加した。review では scaffold の RVP ID と順序の完全一致も検証する。
- reporter が終了コード0で形式不正な出力を返した場合は最大3回 reporter だけを再実行し、同じ plan と executor evidence を再利用する。process failure、rate limit、形式エラー、reporter の blocked 判定は `pipeline_stage=reporter` として block へ伝播する。
- strict schema、追加フィールド拒否、単独形式リトライ、決定的描画、frontmatter 不変、Markdown lint、executor / reporter 実プロセスを通す in-place 統合をテストで固定した。stage 単位の resume は [[prj-0001:pjr-7mxj-pipeline-resume-recovery]] の範囲として分離した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-jxv7-executor-evidence-collection]]
- [[specdojo:plan-result-lifecycle-guide]]
- [[specdojo:exec-operation-guide]]
