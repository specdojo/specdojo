---
specdojo:
  id: prj-0001:xer-pjr-x05n-20261115t143259z-70a6832b
  type: exec-result
  task_id: PJR-X05N
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-X05N/pjr-x05n-20261115T143259Z-70a6832b/plan.md
  started_at: "2026-11-15T14:33:05.643Z"
  completed_at: "2026-11-15T16:36:16.453Z"
  agent: opus-executor
  block_reason: "agent exited with non-zero code: parent validation failed: test-integration"
---

# Edit Result

## 1. 実施内容

- kata-wave-2 の `review` において、型の自動 `grade` が実行されなかった原因を特定し、修正を行いました。
- 原因は、`schedule_file`（`schedule` ディレクトリ相対）を探す際に、リポジトリのルートディレクトリを基準に探索していたため、設計上の `strategy` が見つからず、評価対象が空になっていたことでした。
- 修正として、`projectId` を用いてプロジェクトの設定から `schedule` ディレクトリのパスを取得し、そこを基準に探索を行うよう `src/exec/review-kata.ts` を変更しました。また、呼び出し元から `projectId` を渡すようにインターフェースを修正しました。
- あわせて、実際の配置に近い fixture と回帰テストを追加しました。

## 2. 変更ファイル

- `src/exec/plans-generation.ts`: 呼び出し元の引数変更に対応。
- `src/exec/review-kata.ts`: `schedule_file` の探索ロジックを、`projectId` を用いてプロジェクトの `schedule` ディレクトリを基準に探すよう変更。
- `src/exec/run/schedule-prepare.ts`: 呼び出し元の引数変更に対応。
- `tests/src/exec/review-kata.test.ts`: 実際のディレクトリ配置と同一の構成を持つ fixture および、`kata-wave-2` の挙動をカバーする回帰テストを追加。

## 3. 申し送り

- 原因: `scheduleKataReviewSubjects` は `schedule_file` の置き場所を基準に strategy を探していた。ready / cpm の `schedule_file` は schedule ディレクトリ相対（例: `sch-track-kata-wave-2.yaml`）のため、リポジトリルートを探して見つからず、型の評価対象が空になった。intent・approach の条件や grade の失敗の握りつぶしが原因ではない。
- 判断: schedule のパスを呼び出し元ごとに引き回さず、`projectId` から設定（`getProjectSchedulePath`）を読んで探すようにした。plan 生成は schedule のパスを持たず、呼び出し元 3 か所はすべて `projectId` を持つため。引数は省略できないようにし、渡し忘れを型検査で見つけられるようにした。絶対パスと cwd 相対のパスも候補に残した。
- 次のアクション: kata-wave-2 の型 4 組（bac・bds・sld・ifx-file の rulebook・sample）の grade は 2026-10 のまま。修正後の review か `grade run --target kata` で流し直す必要がある。
- CHANGELOG に書く事項: 不具合修正。型を整備する schedule（`bootstrap-kata-set`・`improve-kata`）の review で、型一式の自動 grade と完了判定の制限が働かなかった問題を直した（strategy ファイルを作業ディレクトリ基準で探していたため）。

## 4. 進め方

まず、`kata-wave-2` の `review` における `grade` の欠如という事象から、`strategy` ファイルの探索ロジックを調査しました。`schedule_file` のパスがリポジトリルート基準で解決されていたことが原因であると突き止めたため、`projectId` を基点として正しい `schedule` ディレクトリを指すように `src/exec/review-kata.ts` を修正しました。変更の妥当性を検証するため、実際の配置を模した `fixture` と、`kata-wave-2` と同様の構成を検証する回帰テストを追加しました。
