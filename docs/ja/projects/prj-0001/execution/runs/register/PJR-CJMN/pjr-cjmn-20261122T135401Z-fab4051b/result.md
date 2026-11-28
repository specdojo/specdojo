---
specdojo:
  id: prj-0001:xer-pjr-cjmn-20261122t135401z-fab4051b
  type: exec-result
  task_id: PJR-CJMN
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-CJMN/pjr-cjmn-20261122T135401Z-fab4051b/plan.md
  started_at: "2026-11-22T13:54:02.478Z"
  completed_at: "2026-11-22T13:57:34.640Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- ifx-cmd-git-cli と ifx-cmd-github-cli を draft で作成し、カタログ登録と ifx-index・ifd-specdojo の付け替え、個票の更新を完了した。

## 2. 変更ファイル

- `docs/ja/product/020-external-interface-specs/ifx-index.yaml`: 変更、+9 / -11 行
- `docs/ja/product/030-architecture/020-infrastructure/ifd-specdojo.md`: 変更、+18 / -18 行
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-external-interface-specs.yaml`: 変更、+64 / -1 行
- `docs/ja/product/020-external-interface-specs/ifx-cmd-git-cli.yaml`: 追加、+144 / -0 行
- `docs/ja/product/020-external-interface-specs/ifx-cmd-github-cli.yaml`: 追加、+135 / -0 行

## 3. 申し送り

- 決定: Git の契約はローカル操作に限定した。src に git push・fetch・pull・clone・remote の呼び出しがなく、ifx-index の注記もリモートを混ぜない方針のため。
- 決定: src に gh を起動する実装がないため、ifx-cmd-github-cli は現行の利用境界（オーケストレーターは読み取りのみ、agent は全 gh と git push を deny、認証は named volume）と未決事項を記す文書にした。書き込み操作の許可範囲は `_UNDECIDED_`。
- 決定: PATH-07 の章は YAML に章がないため ifx-cmd-github-cli.yaml の先頭コメントに 3 論点（経路・認証・失敗後の保持範囲）として置いた。
- 決定: ifx-cmd-git-cli の `max_attempts` は上限が 2 種類で schema の単一整数で表せないため `_UNDECIDED_` とした。
- 未決: 両文書の `timeout_seconds`・`max_parallel`、gh の終了コード 4 の公式表との照合、トークン種別・スコープの標準。
- 残課題: cpd-specdojo-cli・cnd-specdojo・cxd-specdojo に ifx-cmd-git-cli・ifx-cmd-github-cli の（未作成）記述が残る。本タスクの対象外（ifx-index と ifd-specdojo のみ）のため変更していない。付け替えは後続で必要。
- CHANGELOG に書く事項: 区分 Documentation。Git CLI と GitHub CLI の外部コマンド連携仕様（ifx-cmd-git-cli・ifx-cmd-github-cli、draft）を追加し、外部システムI/F一覧の `spec_ref` を付け替えた。
- 型の grade は統合後に orchestrator が流す。個票の作業内容の表で grade の行は open のまま残している。
- 保護された設定の変更は不要だった。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
