---
specdojo:
  id: prj-0001:xer-t-data-flow-cdfd-task-execution-010
  type: exec-result
  task_id: T-DATA-FLOW-cdfd-task-execution-010
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-DATA-FLOW-cdfd-task-execution-010-plan.md
  started_at: "2026-08-09T21:06:15.880Z"
  completed_at: "2026-08-09T21:14:37.134Z"
  agent: codex-expert-edit-agent
  execution: agent
  approach: retrofit
  targets:
    - prj-0001:cdfd-task-execution
---

# Edit Result

## 1. 実施内容

対象成果物が存在しなかったため「新設」を選択し、`P-04 タスク実行` の領域別 CDFD を作成した。上位 CDFD、依存成果物、プロジェクト文脈、成果物カタログの done criteria と、指定された実装エビデンス5件を照合し、次を表・図・例外表へ反映した。

- Ready task の単発・自動・並列選択から、担当確定、claim、plan / result 準備、edit / review / finalize、result 検証、worktree 統合、complete、次 phase の Ready 再計算までの正常経路。
- human / agent、in-place / worktree の責務差、登録済み nickname による Agent 選択、成果物・result・event・Git 履歴の更新境界。
- project busy の skip / wait / fail、block 後の unblock / release、todo の cancel、done の人間による reopen、レート制限後の `resume --due`、worktree の依存導入・commit・merge 失敗に対する停止・再開条件。
- review / finalize の差し戻し、Agent による `ready` 昇格の拒否、前提不足時に PJR へ渡す判断情報と `P-02 登録簿運用` への委譲境界。

プロジェクトの Why からは、人と AI Agent が同じ正本を使って作業を引き継ぐこと、AI が不足した業務判断を代替しないこと、特定個人への作業集中を避けることを判断軸として反映した。詳細な価値仮説は対象成果物へ再掲していない。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/010-data-flow/cdfd-task-execution.md`（新規作成）
- `docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-task-execution-010-result.md`（本 result を更新）

## 3. 申し送り

### 3.1. 未反映の乖離・確認事項

- 上位 `P-04` は実行状態を主要出力とする一方、現行の in-place 経路は state 追跡を明示しなければ claim / complete / block event を生成しない。本文では AS-IS の経路差として明記した。scheduled task の in-place 実行で state 追跡を必須にするか、state 非追跡を正式な ad-hoc 経路として承認するかは PO / ARC の判断候補である。候補は、仕様を state 非追跡経路まで明示して維持するか、実装を scheduled task では常時追跡へ変更することである。
- done criteria は前提不足時の PJR 登録と PO 判断情報を要求するが、指定された実装エビデンスから PJR の自動登録は確認できなかった。本文では Agent が推測せず finding・影響・必要判断・再開条件を result / block 理由へ残し、`P-02 登録簿運用` へ手動委譲する現行境界とした。自動登録を意図する場合は、承認済み仕様と別実装 task が必要である。
- Agent による `ready` 昇格は worktree commit で拒否されるが、in-place 経路には同じ commit 境界がない。人間専用ゲートを全経路で同じ強度にする場合は、in-place の検証・commit 方針を別 task で検討する必要がある。

### 3.2. 未確認範囲

- 列挙された実装エビデンス5件はすべて参照した。そこから import される `exec-plans`、`exec-results`、`exec-strategy`、`exec-limit`、各 provider CLI の内部は evidence_refs 外のため調査していない。このため plan / result テンプレートの全文、phase set の生成規則、レート制限時刻の解析規則は呼び出し境界までの確認である。
- human が行う成果物内容の判断、review / finalize の実際の承認、PJR 起票、外部 provider の可用性はコードから確認できない業務・外部依存であり、推測していない。
- Git hook、npm registry、OS / Git の障害原因は外部依存であり、実装が定める停止・rollback・再開境界のみを記述した。

## 4. 進め方と実践の型の適用

`retrofit` として、実装を意図された仕様の正本とはみなさず、根拠を次のように分離した。

- 意図された仕様: [[prj-0001:cdfd-overview|概念データフロー図（全体概要）]] の `P-04` 境界、[[prj-0001:cdfd-catalog-planning|概念データフロー図（カタログ〜計画展開）]] の Ready・Schedule 引渡し、`dct-data-flow.yaml` の4つの done criteria、`prj-overview.md` の人と AI Agent が同じ正本から協働・継承する判断原則。
- 文書構造と記法: `cdfd-rulebook.md` の必須4章・一行一プロセス・主要例外・領域外委譲・受入確認と、include される `cdfd-mermaid-rulebook.md` のノード形状、全 edge のラベル、領域内 `flowchart TB`、凡例を適用した。recipe / sample / template は plan の確定対象ではないため参照せず、rulebook と既存の依存 CDFD の構成を基準にした。
- 判断: 対象成果物が存在せず、カタログに path と done criteria が定義済みだったため「新設」とした。上位文書の `P-04` 境界を維持し、実装から確認できない業務判断を補わなかった。

### 4.1. 実装エビデンスと抽出した現在動作

| 実装エビデンス             | 抽出した現在動作                                                                                                                                                                                                                                                                                                                                                                                               | 成果物への反映                                                 |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `src/exec-run.ts`          | Ready を critical-first / FIFO で単発・自動・並列選択する。登録済み nickname を mode・capability・proficiency・priority・provider 空き枠で解決し、claim、plan / result scaffold、Agent 実行、必須 result 検証、complete / block を制御する。worktree は通常の自動経路、in-place は既定で event 非追跡である。レート制限は候補切替・block・再開時刻を記録し、`resume --due` が元 actor と worktree で再開する。 | `P-04-01`〜`P-04-08`、実行経路表、`E-02`〜`E-04`、状態遷移表   |
| `src/exec-run-lock.ts`     | project 単位で run / resume / cycle を排他し、busy 時は skip / wait / fail を選ぶ。heartbeat と token で所有を管理し、陳腐化 lock を rename 後に回収する。                                                                                                                                                                                                                                                     | `P-04-01`、`E-01`                                              |
| `src/exec-events.ts`       | event が task state の正本で、claim→doing、block→blocked、unblock→doing、complete→done、release→todo、todo の cancel→cancelled、done の reopen→todo を畳み込む。owner・actor・依存と cross-actor 操作を検証し、reopen は人間専用かつ進行済み後続 task を保護する。                                                                                                                                             | `P-04-02`、`P-04-08`、`E-08`、状態遷移表                       |
| `src/exec-worktree.ts`     | task ごとの `exec/<task>` branch / worktree を作成・再利用し、tracked `package-lock.json` ごとに独立した `npm ci` を実施する。Git index lock 競合は限定回数再試行する。                                                                                                                                                                                                                                        | `P-04-03`、worktree 経路、`E-05`                               |
| `src/exec-worktree-ops.ts` | plan / result / claim を checkpoint 後に task worktree を作り、mode・targets に基づく許可範囲だけを commit する。Agent の `ready` 昇格を拒否し、root 差分との重複を検査して merge を直列化する。merge 失敗時は abort、成功後は worktree / branch を削除する。失敗時は再開用 worktree を保持する。                                                                                                              | `P-04-03`、`P-04-06`、`P-04-08`、worktree 経路、`E-05`・`E-06` |

### 4.2. 一致・乖離・確認不能の分類

| 分類             | 照合結果                                                                                                                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 一致             | Ready 選択、claim、plan / result 生成、Agent 実行、review / finalize mode、result 検証、worktree commit / merge、complete、block・再開・訂正の主要 lifecycle は done criteria と `P-04` 境界に一致した |
| 一致             | human / agent、worktree / in-place、単発 / 自動 / 並列、登録済み nickname 選択と更新先の差を、指定実装から識別できた                                                                                   |
| 乖離候補         | in-place の既定 event 非追跡、in-place における Agent の `ready` 昇格ガード強度、PJR 自動登録の不存在は、上位意図または done criteria の解釈について PO / ARC の確認余地がある                         |
| 実装から確認不能 | PO の業務判断、human review / finalize の実施内容、PJR の手動運用、Agent が前提不足をどの品質で抽出するかは実装だけでは確認できないため、責任境界と必要情報だけを記述した                              |
| 未確認           | evidence_refs 外の import 先と外部 provider / npm / Git hook の内部動作は調査対象に追加せず、上記「未確認範囲」に記録した                                                                              |

### 4.3. done criteria の確認

- [x] Ready 選択・claim・plan / result 生成・実行・review・finalize・complete の正常経路を、担当と入出力を含めて表と図に記載した（BA）。
- [x] human / agent、in-place / worktree、単発 / 自動 / 並列、登録済み nickname と各経路の成果物・event・result 更新を実行経路表に記載した（ARC）。
- [x] busy 時の skip / wait / fail、unblock / release / cancel / reopen、`resume --due`、worktree の依存導入・統合失敗を主要例外と状態遷移表に記載した（QE）。
- [x] ready の人間専用ゲート、差し戻し、前提不足時に PJR / PO 判断へ渡す情報をプロセス・例外・委譲・受入条件に記載した（PO）。

### 4.4. 検査結果

- `npx prettier --write docs/ja/product/010-business-specs/010-data-flow/cdfd-task-execution.md docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-task-execution-010-result.md`: 成功。
- `npx markdownlint docs/ja/product/010-business-specs/010-data-flow/cdfd-task-execution.md docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-task-execution-010-result.md`: 成功。
- `npx tsx src/specdojo.ts catalog validate`: sandbox が tsx の IPC socket `/tmp/tsx-1000/*.pipe` に対する listen を許可せず、内容検証の開始前に `EPERM` で失敗。IPC server を使わない等価起動 `node --import tsx src/specdojo.ts catalog validate` で再実行し、全 catalog が `OK`、終了コード 0。未作成の別成果物に対する既存 warning はあったが、本成果物のエラー・warning はなかった。
- `npx tsx src/specdojo.ts index build`: 同じ sandbox 制約で内容検証の開始前に `EPERM`。`node --import tsx src/specdojo.ts index build` で再実行し、1017 entries を生成、終了コード 0。
- 本 result の最終更新後にも、上記の整形・Markdownlint・catalog validate・index build を再実行して成功を確認した。
