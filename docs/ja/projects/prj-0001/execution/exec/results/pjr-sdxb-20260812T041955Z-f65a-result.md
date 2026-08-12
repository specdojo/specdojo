---
specdojo:
  id: prj-0001:xer-pjr-sdxb-20260812t041955z-f65a
  type: exec-result
  task_id: PJR-SDXB
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-sdxb-20260812T041955Z-f65a-plan.md
  started_at: "2026-08-12T04:19:56.125Z"
  completed_at: "2026-08-12T04:25:53.437Z"
  agent: claude-expert-edit-agent
---

# Edit Result

## 1. 実施内容

登録簿項目 PJR-SDXB に対応し、`docs/ja/specdojo/templates/xep-bootstrap-template.md` に仕上げ品質チェックの節を追加した。個票 [[prj-0001:pjr-sdxb-bootstrap]] の「完了条件」を作業基準とし、5項目すべてを満たした。

- 旧「6. 完了手順」の直前に「6. 仕上げの品質チェック」を新設した。内容の質を上げる基本操作として、不要記述の削除・重複記述の統合・可読性のための分割・論理整合の確認の4操作を番号付きリストで明記した。
- 各操作の判定基準を既存記述に接続した。削除は「rulebook の必須要素にも「完了の狙い」に示された `done_criteria` にも寄与していない記述」、統合は「正本を1つ定め、他は要約または正本への参照に置き換える」、分割は「rulebook が定める章構成の範囲内で行い、章構成そのものを崩さない」、論理整合は「矛盾時は構造・必須項目・禁止事項について rulebook を正とする」とした。
- 観点別自己レビュー・修正ループとの区別を節の冒頭で明示した。「4操作を1回だけ通しで実施する」「単発の仕上げ操作であり、観点別の自己レビュー・修正ループではない」「同じ観点での再確認を繰り返さず1巡で終え、多観点での検証は後続の独立した review task に委ねる」と記述した。
- 判断できない箇所の扱いと記録先を規定した。削除・統合・分割の可否を判断できない箇所は無理に整理せず _TODO_ / _ASSUMPTION_ で論点を残し、実施内容と判断根拠は result の `進め方と実践の型の適用` セクションに記録する、とした。
- 章番号を繰り下げ、「7. 完了手順」「8. 異常終了の条件」とした。完了手順の旧手順3（成果物と各実践の型の相互矛盾の確認）は新節の「論理整合の確認」に包含されるため、「「仕上げの品質チェック」の4操作を1回だけ実施する（成果物と各実践の型の相互整合の確認を含む）」に置き換え、テンプレート内での記述重複を避けた。手順の総数は5のまま維持した。
- 個票の「作業内容」表（No.1〜5）を `done` に更新し、「対応結果」に実施内容・整合性確認・影響確認を記入した。

## 2. 変更ファイル

- `docs/ja/specdojo/templates/xep-bootstrap-template.md`（仕上げ品質チェックの節を追加、章番号を繰り下げ、完了手順の手順3を差し替え）
- `docs/ja/projects/prj-0001/controls/project-register/pjr-sdxb-bootstrap.md`（作業内容の状態・メモ、対応結果を更新）

実行した検査は次のとおり。すべて成功した。

| コマンド                                           | 対象・目的                               | 結果                                                              |
| -------------------------------------------------- | ---------------------------------------- | ----------------------------------------------------------------- |
| `npx prettier --write <変更した2ファイル>`         | Markdown 整形                            | 整形済み（テンプレートは変更なし、個票は表の桁揃えを整形）        |
| `npx markdownlint <変更した2ファイル>`             | Markdown 静的検査                        | エラーなし                                                        |
| `npm run -s lint:md`                               | 個票の完了条件（リポジトリ全体の検査）   | エラーなし                                                        |
| `npm test`                                         | `docs/ja/specdojo/templates/` 変更のため | 79 files / 1051 tests すべて成功                                  |
| `npx tsx src/specdojo.ts catalog validate`         | `docs/ja/projects/` 配下の変更のため     | exit 0（`dct-*.yaml` はすべて OK。WARN は本変更と無関係の既存分） |
| `npx tsx src/specdojo.ts register build`           | 個票（project-register）変更のため       | exit 0                                                            |
| `npx tsx src/specdojo.ts index build`              | `docs/` 配下の変更のため                 | 1149 entries を生成                                               |
| `npx tsx tools/docs/src/validate-history-links.ts` | 履歴蓄積ファイルのリンク記法検査         | exit 0                                                            |

## 3. 申し送り

- 登録簿（`pjr-index.md`）の行と個票の `item_status` は plan の指示どおり変更していない。状態遷移（review / close）は runner と人間の担当。
- 本変更が効くのは今後生成・再生成される `bootstrap` の plan のみで、生成済み plan（`T-LAUNCH-*-010` / `T-DATA-FLOW-cdfd-overview-005` / `-006` / `T-DATA-FLOW-cdfd-init-005`）は静的ファイルのため遡って更新されない。既存 plan に本チェックを適用したい場合は、対象タスクの plan 再生成が必要になる。
- 対になる todo [[prj-0001:pjr-aqmw-fully-guided-refine-pass-rulebook]]（`fully-guided` の refine-pass が rulebook 不適合を直さない問題）は本タスクの範囲外のため未対応。`xep-fully-guided-template.md` には既に「4.2. 既存記述の扱い」で削除・統合の規定があるため、今回追加した bootstrap 側の4操作と用語・判定基準をそろえてあり、両テンプレート間で矛盾はない。
- [[prj-0001:pjr-ez9g-sch-strategy-bootstrap-human-review]] が提案する bootstrap 後の human review ゲート（`sch-strategy-data-flow.yaml` への `bootstrap-kata-review` 追加）は本タスクの範囲外で未着手。本タスクは agent 側の仕上げ品質を上げる対応であり、両者は補完関係にある。

## 4. 進め方と実践の型の適用

本タスクは `origin: register`・`mode: edit` の登録簿項目対応であり、成果物カタログの `approach`（`fully-guided` などの実践の型に基づく進め方）は割り当てられていない。したがって rulebook / recipe / sample / template を基準とする進め方は適用対象外で、plan の「進め方」（登録簿の該当行と個票を読み、個票の完了条件を作業基準とする）に従った。実践の型の代わりに根拠としたのは次の文書である。

- 個票 [[prj-0001:pjr-sdxb-bootstrap]] の「完了条件」: 挿入位置（「6. 完了手順」の前）、記載すべき4操作、自己レビューループ禁止との非矛盾、`ryu-guide` との整合確認、`lint:md` 通過、他プロジェクト影響の記録という6つの受け入れ基準として使用した。
- 変更対象の `docs/ja/specdojo/templates/xep-bootstrap-template.md`: 既存の章構成・文体・「完了の狙い」章の制約（「下流ロールの適合性検証や観点別の自己レビュー・修正ループは行わず、多観点での検証は後続の独立した review task に委ねる」）を確認し、追加節の文体と非矛盾の書き方をそろえた。
- [[specdojo:ryu-guide]]: `bootstrap` approach の定義（approach 表の「成果物と rulebook / recipe / sample / template を同じタスクで初期作成し、互いに矛盾しない一式として揃える」）と、「通常の成果物編集では観点別の自己レビューを行わず、多観点での判定と証跡は独立したレビューが担う」という方針を確認した。追加節は approach の参照方針・対象範囲を変えないため、`ryu-guide` 側の修正は不要と判断した。
- `docs/ja/specdojo/templates/xep-fully-guided-template.md`: 個票が「同一ファイルへの過去の変更履歴」として挙げた類似修正例（[[prj-0001:pjr-0102-xep-fully-guided-template]]）に対応するファイル。その「4.2. 既存記述の扱い」にある削除・統合の規定を手本にし、判定基準（`done_criteria` に寄与しない記述は削除、重複は正本へ統合し他は要約・参照に置換、統合で情報が失われる場合は正本へ取り込んでから整理）の用語をそろえた。丸写しはせず、bootstrap の対象が「成果物と実践の型の一式」である点に合わせて、重複判定の範囲を「同一文書内または成果物と実践の型の間」へ拡張した。
- `.github/instructions/markdown.instructions.md`: 見出しの連番書式（`n.` 形式）、リスト記法、表記法に従った。章番号の繰り下げもこの規約に沿っている。

矛盾の解消と判断は次のとおり。

- 追加節と既存「完了の狙い」章の制約は、いずれも「観点別の自己レビュー・修正ループを行わない」点で一致させる必要があった。そこで追加節を「1回だけ通しで実施する単発の仕上げ操作」と定義し、繰り返しの再確認を明示的に排除して、多観点検証は後続 review task に委ねる旨を既存章と同じ表現で再掲した。
- 新節の「論理整合の確認」と、旧完了手順の手順3（成果物と各実践の型の相互矛盾の確認）が重複したため、手順3を新節への参照へ置き換えた。今回追加するルール自身（重複記述の統合）をテンプレート自体にも適用した形で、内容の欠落はない。
- 個票の完了条件では追加位置を「「6. 完了手順」の前」と指定していた一方、plan の概要文では「完了手順に追加する」と表現されていた。plan の「進め方」が「個票に完了条件がある場合はそれを作業の基準にする」と定めているため、完了条件の指定（完了手順の前の独立した節）を正とし、あわせて完了手順の手順3から新節を参照させることで、概要文の意図（完了手順の一部として実施される）も満たした。
- 影響確認: 本リポジトリのプロジェクトは `prj-0001` のみで、`prj-0001` 以外の対象は存在しない。`bootstrap` approach の使用箇所は `sch-strategy-launch.yaml`（`bootstrap-pass`）と `sch-strategy-data-flow.yaml`（`overview-bootstrap-pass` / `area-bootstrap-pass`）の2 track で、対応する bootstrap タスクは実行済み（`exec status` の doing 一覧に存在せず、plan も生成済み）。生成済み plan は静的ファイルのため本変更の影響を受けない。加えて、`src/` / `tools/` / `*.yaml` に `xep-bootstrap-template` の章番号や章タイトルへ依存する参照がないことを検索で確認し、`npm test` の全件成功で章番号繰り下げによる退行がないことを裏付けた。

_TODO_ / _ASSUMPTION_ として残した論点はない。
