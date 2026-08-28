---
specdojo:
  id: prj-0001:pjr-jg9q-auto-rebuild-stale-tracks
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-22T14:30:21Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-23T01:32:32Z"
  conclusion: exec cycle に stale トラックの自動再生成を追加し、手順を5段へ拡張した。判定は既存の鮮度検知を再利用するため設定項目は増やしていない。再生成は auto ループより前に完了し、失敗した場合はタスク実行へ進まず中断する。再生成が不要な場合は何も出力しない。preprocess や postprocess を宣言する仕組みは導入していない。
  register_events:
    - v: 1
      id: reg_9399ff3756284d318ade07fbceaf0690
      ts: "2026-08-22T14:32:19Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs(register): トラック自動再生成を PJR-JG9Q として起票"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: strategy が更新されたトラックを exec cycle で自動再生成する
        - field: description
          from: ""
          to: 計画物として `sch-strategy-<track>` を更新しても、`sch-track-<track>` を再生成しない限り次のトラックのタスクは現れない。exec validate は strategy が track より新しいことを既に検出して警告するが、exec cycle の手順は resume・doc-index・validate と refresh・auto ループの4段で、schedule build を含まない。鮮度検知の結果を使って自動再生成することで、設定面を増やさずに次トラックへ自動で進めるようにする。preprocess や postprocess を宣言できる仕組みは、鮮度では表せない要求が出るまで導入しない。
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
          to: "2026-08-22"
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
      legacy_commit: 44b2d0c51cd72d25d215b2375a744deaa8cd6164
    - v: 1
      id: reg_ad19c015600d0ffea51719d186da5854
      ts: "2026-08-23T00:34:34Z"
      action: start
      actor: SpecDojo Test
      from_status: open
      to_status: in-progress
      reason: "exec(register PJR-JG9Q): start"
      changes:
        - field: status
          from: open
          to: in-progress
      legacy_commit: 22c543ec1572dbac011f06a518a21673a61ee016
      previous_event_id: reg_9399ff3756284d318ade07fbceaf0690
    - v: 1
      id: reg_f4b42ad8e0c46f3257bace2d758ae87a
      ts: "2026-08-23T00:55:19Z"
      action: review
      actor: SpecDojo Test
      from_status: in-progress
      to_status: review
      reason: "exec(register PJR-JG9Q): review"
      changes:
        - field: status
          from: in-progress
          to: review
      legacy_commit: 9fd47831885ccb503865db8f034027d8c65fe5dc
      previous_event_id: reg_ad19c015600d0ffea51719d186da5854
    - v: 1
      id: reg_5c263333826db913ab2415412cfd8afc
      ts: "2026-08-23T01:32:32Z"
      action: close
      actor: SpecDojo Test
      from_status: review
      to_status: done
      reason: "exec(register PJR-JG9Q): close"
      changes:
        - field: status
          from: review
          to: done
        - field: completed
          from: "-"
          to: "2026-08-23"
        - field: conclusion
          from: "-"
          to: exec cycle に stale トラックの自動再生成を追加し、手順を5段へ拡張した。判定は既存の鮮度検知を再利用するため設定項目は増やしていない。再生成は auto ループより前に完了し、失敗した場合はタスク実行へ進まず中断する。再生成が不要な場合は何も出力しない。preprocess や postprocess を宣言する仕組みは導入していない。
      legacy_commit: 08c492b3799f2a66589811c2964c03f683067734
      previous_event_id: reg_f4b42ad8e0c46f3257bace2d758ae87a
---

# PJR-JG9Q strategy が更新されたトラックを exec cycle で自動再生成する

## 1. 概要

計画物として sch-strategy-<track> を更新しても、sch-track-<track> を再生成しない限り次のトラックのタスクは現れない。exec validate は strategy が track より新しいことを既に検出して警告するが、exec cycle の手順は resume・doc-index・validate と refresh・auto ループの4段で、schedule build を含まない。鮮度検知の結果を使って自動再生成することで、設定面を増やさずに次トラックへ自動で進めるようにする。preprocess や postprocess を宣言できる仕組みは、鮮度では表せない要求が出るまで導入しない。

preprocess と postprocess を宣言する仕組みは導入しない。今回の要件は鮮度検知だけで表現でき、設定面を増やすとコマンド注入の攻撃面も増えるためである。鮮度では表せない要求（トラック完了時の通知、失敗時のみの処理など）が出た場合に、`pipeline.parent_validations` と同じ固定 ID 参照方式で別途設計する。

## 2. 完了条件

- `exec cycle` の実行中に、`sch-strategy-<track>` が `sch-track-<track>` より新しいトラックが自動で再生成される。
- 判定は既存の鮮度検知（`src/exec-schedule.ts` の警告と同じ基準）を用い、新しい設定項目を追加しない。
- 再生成は `--auto` でタスクを選ぶ前に完了し、同じ cycle の中で新しいトラックのタスクが Ready として現れる。
- 再生成に失敗した場合は、その時点で理由を出力して停止する。古い track のままタスクを実行しない。
- 鮮度が同じ（再生成不要）の場合は何も実行せず、出力にも余計な行を出さない。
- 自動再生成が `sch-milestones.yaml` の `status` を書き換えない（PJR-AAR2 の対応が前提）。
- 単発の `exec run` や `exec refresh` の挙動は変えない。自動再生成は `exec cycle` に限定する。
- 上記を検証する unit test / integration test が追加され、`npm run test:unit` と `npm run test:integration` が成功する。
- `exec cycle` の手順がコマンドリファレンスと exec 運用ガイドへ反映されている。

## 3. 作業内容

| No  | 作業                                                | 担当 | 状態 | メモ                                                            |
| --- | --------------------------------------------------- | ---- | ---- | --------------------------------------------------------------- |
| 1   | 既存の鮮度検知を再利用できる形に整理する            | ARC  | done | 警告と cycle が `findStaleGeneratedTracks` を共用               |
| 2   | `exec cycle` の手順へ自動再生成を組み込む           | ARC  | done | index 後・validate / refresh 前と auto の各次ラウンド前に実行   |
| 3   | 失敗時の停止と出力を実装する                        | ARC  | done | build 失敗時は refresh と auto を実行せず終了コード 1           |
| 4   | PJR-AAR2 の status 書き換えを解消してから有効化する | ARC  | done | PJR-AAR2 完了済みを確認し、既存 status 保持テストを前提にした   |
| 5   | unit test / integration test を追加する             | ARC  | done | fresh・missing・outdated・失敗停止・Ready 反映・実行順を網羅    |
| 6   | コマンドリファレンスと exec 運用ガイドを更新する    | ARC  | done | 5 step と loop 内の再判定を command / exec / routine 文書へ反映 |

## 4. 対応結果

- `src/exec-schedule.ts` の鮮度判定を `findStaleGeneratedTracks` として構造化し、従来の `exec validate` 警告と `exec cycle` の自動再生成で同じ判定を共用した。track がない場合と strategy の更新時刻が track より新しい場合を対象とし、track 名順で決定的に処理する。
- `src/exec-run.ts` で doc-index 再構築後、`exec validate` / `exec refresh` より前に stale track ごとの `schedule build --force` を実行するようにした。`--loop` では auto の各次ラウンドでも index build 後・refresh 前に再判定するため、前ラウンドで strategy を更新した場合も同じ cycle で次 track の Ready task を選択できる。
- 再生成が不要な場合はコマンドを実行せず、再生成用のログや summary 項目も出力しない。再生成に失敗した場合は該当 track を表示し、古い track のまま refresh / auto へ進まず終了コード 1 とする。単発の `exec run` と `exec refresh` には自動再生成を追加していない。
- [[prj-0001:pjr-aar2-milestones-status-follows-last-built-track|PJR-AAR2 sch-milestones の status が最後に build したトラックの strategy に引きずられる]] が完了済みで、`schedule build` が既存 `sch-milestones.yaml` の status を保持する実装と回帰テストを確認した。今回の再生成経路でも同じコマンドを利用する。
- unit test に鮮度判定、fresh 時の無処理・無出力、複数 track の処理順、失敗時の即時停止を追加した。integration test には、実際の `schedule build` と `exec refresh` を通して新規 task が Ready になること、および cycle の dry-run で build が index と validate の間に配置されることを追加した。
- [[specdojo:command-reference|コマンドリファレンス]]、[[specdojo:exec-operation-guide|exec運用ガイド]]、[[specdojo:routine-operation-guide|routine運用ガイド]]へ、条件付きの再生成、失敗時の停止、loop 内の再判定、単発コマンドとの境界を反映した。
- `npm run typecheck` と unit test 全 1,255 件が成功した。Markdown の整形・静的検査、register build、catalog validate、index build も成功した。integration test の実行は executor / reporter pipeline の分担に従って親 runner が行う。
- preprocess / postprocess や新しい設定項目は追加していない。残課題はない。

## 5. 関連ドキュメント

- 前提となる課題: [[prj-0001:pjr-aar2-milestones-status-follows-last-built-track|PJR-AAR2 sch-milestones の status が最後に build したトラックの strategy に引きずられる]]
- 計画物をトラック化した項目: [[prj-0001:pjr-qf7t-planning-domain-and-track|PJR-QF7T planning ドメインとトラックを新設し、計画成果物をカタログとScheduleへ載せる]]
- 同じ鮮度検知の実装例: `src/build-if-stale.ts` と `src/dist-freshness.ts`
- 変更対象の実装: `src/exec-run.ts` の cycle 手順、`src/exec-schedule.ts` の鮮度検知
