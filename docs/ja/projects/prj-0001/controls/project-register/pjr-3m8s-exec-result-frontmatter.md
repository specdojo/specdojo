---
specdojo:
  id: prj-0001:pjr-3m8s-exec-result-frontmatter
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-08-10T03:23:11Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-10T04:18:49Z"
  conclusion: result frontmatterの破壊検出を全exec経路へ追加し、rate-limit再開時はrunner管理項目だけを許容する二段階照合で誤blockを解消
  register_events:
    - v: 1
      id: reg_bbdd287c532e67b7b6400d3b1f3b7ea2
      ts: "2026-08-10T03:31:44Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "fix(exec-plans): require result frontmatter/heading structure to stay scaffolded"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: exec完了ガードがresultのfrontmatter破壊を検出できない
        - field: description
          from: ""
          to: "`downgradeUnfilledResult`/`isResultUnfilled` は result 本文の `_TODO_` 残存有無のみを検証し、result frontmatter の必須フィールド（`id`/`task_id`/`project_id`/`agent`/`approach`/`targets` 等）の欠落・改変を検出しない。ローカルモデル等が `_TODO_` を消しつつ frontmatter を独自形式へ書き換えた場合、success として扱われ commit/merge/complete まで進んでしまう（`T-DATA-FLOW-cdfd-agent-config-operation-070` で実際に発生）。frontmatter 必須フィールドの非空・scaffold 値との一致検証を追加する。"
        - field: type
          from: ""
          to: issue
        - field: priority
          from: ""
          to: high
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
      legacy_commit: 83dd002c28a2c083b970c54c95f3e6cf2980f1c2
    - v: 1
      id: reg_37ff6bcfc1aec534734e5775b39525b5
      ts: "2026-08-10T04:32:53Z"
      action: close
      actor: SpecDojo Test
      from_status: open
      to_status: done
      reason: "fix(exec): guard result frontmatter and completion merge"
      changes:
        - field: status
          from: open
          to: done
        - field: completed
          from: "-"
          to: "2026-08-10"
        - field: conclusion
          from: "-"
          to: result frontmatterの破壊検出を全exec経路へ追加し、rate-limit再開時はrunner管理項目だけを許容する二段階照合で誤blockを解消
      legacy_commit: 518fe51391ba29d889433758f3f59f951648c304
      previous_event_id: reg_bbdd287c532e67b7b6400d3b1f3b7ea2
---

# PJR-3M8S exec完了ガードがresultのfrontmatter破壊を検出できない

## 1. 課題内容

`downgradeUnfilledResult`/`isResultUnfilled` は result 本文の `_TODO_` 残存有無のみを検証し、result frontmatter の必須フィールド（`id`/`task_id`/`project_id`/`agent`/`approach`/`targets` 等）の欠落・改変を検出しない。ローカルモデル等が `_TODO_` を消しつつ frontmatter を独自形式へ書き換えた場合、success として扱われ commit/merge/complete まで進んでしまう（`T-DATA-FLOW-cdfd-agent-config-operation-070` で実際に発生）。frontmatter 必須フィールドの非空・scaffold 値との一致検証を追加する。

## 2. 影響範囲

| 観点         | 影響                                                                                                  |
| ------------ | ----------------------------------------------------------------------------------------------------- |
| スコープ     | schedule / in-place / register / Job の各 exec 終了経路と、result の完了判定・テスト・運用ガイド      |
| スケジュール | 2026-08-31 までに完了ガードを実装する。既存 schedule の依存関係・期間は変更しない                     |
| コスト       | runner 内で agent 起動前の frontmatter スナップショットを保持し、終了時に比較するメモリ・処理が増える |
| 品質         | result frontmatter が破壊された実行を commit / merge / complete 前に block し、無効な完了記録を防ぐ   |
| 関係者       | exec runner を保守する ARC、result を記入する agent / human、完了結果を確認するプロジェクト担当者     |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                   |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `isResultUnfilled` が本文の必須プレースホルダだけを確認し、runner が scaffold した frontmatter と agent 終了後の frontmatter を比較していなかった                                                                                      |
| 対応策   | agent 起動前の result frontmatter を保持し、終了時に必須値の非空・固定値を検証したうえで、`specdojo` 名前空間を YAML パース後の構造として scaffold と比較する。全 exec 終了経路から同じ検証へ渡し、不一致を failure / block へ降格する |
| 依存事項 | result scaffold を生成する `src/exec-results.ts`、各実行経路を制御する `src/exec-run.ts`、frontmatter 名前空間の共通 parser                                                                                                            |
| 完了条件 | 本文を記入して終了コード 0 となった場合でも、必須値の欠落・空値、scaffold 値の変更、キーの追加・削除、`specdojo` 名前空間の置換を block する。値を変えない YAML 表記変更は許容し、既存の正常系・失敗・rate limit の判定を維持する      |

## 4. 対応結果

- `isResultUnfilled` に必須 scaffold 項目の非空・固定値検証と、agent 起動前の `specdojo` frontmatter との意味的な一致検証を追加した。
- schedule worktree、通常 in-place、register in-place / worktree、Job の全経路で scaffold スナップショットを完了ガードへ渡すようにした。不一致時は commit / merge / complete より前に failure / block へ降格する。
- review で検出した rate-limit 再開時の誤判定を修正した。schedule worktree は再開直前の result を当該試行の厳密比較基準とし、元 scaffold との不変項目比較も併用する。runner が試行間に更新する `status` / `completed_at` / `block_reason` のみ元 scaffold との差分を許容し、前回試行から持ち越された固定値破壊は引き続き検出する。
- result ファイル自体の削除、必須値の欠落・空値、`approach` / `targets` を含む値変更、独自キー追加、名前空間置換を検出し、YAML の引用符だけの変更は許容するテストを追加した。rate-limit 後の正常な resume 完了と、前回試行で壊された不変 frontmatter の拒否も回帰テストへ追加し、対象テスト 40 件と型検査は成功した。
- 全体テストは 1,007 件中 991 件が成功した。残る worktree 関連 16 件は、この実行環境で Node.js の `spawnSync git` が Git の終了コード 0 にもかかわらず `EPERM` を返す制約による失敗であり、変更対象のテスト失敗ではないことを単独再現で確認した。

## 5. 関連ドキュメント

- [[specdojo:plan-result-lifecycle-guide|plan/resultライフサイクルガイド]]
- `src/exec-results.ts`
- `src/exec-run.ts`
- `tests/src/exec-results.test.ts`
- `tests/src/exec-run-downgrade-unfilled.test.ts`
