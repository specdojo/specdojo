---
specdojo:
  id: prj-0001:xrp-jbr-grade-deliverable-bcde62014538-review
  type: exec-plan
  rulebook: none
  task_id: JBR-grade-deliverable-bcde62014538-review
  name: "成果物の継続品質評価 の実行結果レビュー"
  mode: review
  status: ready
  project_id: prj-0001
  origin: job
  job_id: job-grade-deliverable
  run_id: JBR-grade-deliverable-bcde62014538
---

# Job Run Review Plan: 成果物の継続品質評価

## 1. このフェーズで行うこと

Job Run が作成した出力を変更せずにレビューし、統合可能かを判定する。

## 2. Job Run

- `job_id`: `job-grade-deliverable`
- `run_id`: `JBR-grade-deliverable-bcde62014538`
- Run の状態: `succeeded`
- exec ブランチ: `exec/prj-0001-JBR-grade-deliverable-bcde62014538`
- 実行前 commit: `e0ac74427b92965e3c33d5a20d58521d2586327a`
- 出力 commit: `d991ccb895577ac33b247ecfeb4420138c3eb537`
- Job Run result: `_RUN../worktrees/prj-0001-JBR-grade-deliverable-bcde62014538/docs/ja/projects/prj-0001/execution/exec/results/JBR-grade-deliverable-bcde62014538-review-result.md`
- review result: `../worktrees/prj-0001-JBR-grade-deliverable-bcde62014538/docs/ja/projects/prj-0001/execution/exec/results/JBR-grade-deliverable-bcde62014538-review-result.md`

Job の目的:

成果物を文書単位の agy 単段評価へ流し、最新の品質と done_criteria 充足状況を更新する。

Job 固有の確認事項:

runner が記録した command evidence の終了コードと、stdout に出力された
`results.tsv` から次を判断して報告する。

- 終了コード75（rate limit）または中断で未完了の段が残っているか。残る場合は同じ
  `--run-id` で再開できる状態かを確認する。
- `failed` の段があるか。ある場合は agent 側の失敗、`grade apply` による executor の
  marker の機械変換の拒否、done_criteria の過不足のいずれかへ切り分ける。
- Run が `partial` の場合は、`passed` の成果物が1件以上あり、各 `failed` の成果物と
  失敗段が pipeline state に記録されて次の Run の `--incomplete` で選択できるかを確認する。
- `retry_exhausted` の成果物があるか。ある場合は失敗段と連続失敗回数を示し、人手での
  原因解消または state の再開判断を促す。
- agy 単段の verdict と score に、評価設定の見直しを要する偏りがあるか。
- 未充足の done_criteria がある成果物と、その確認担当ロールを特定する。

選択された成果物が0件の場合は no-op と判断する。判断できない事象は推測で埋めず、
観測した事実と未確認の範囲を分けて報告する。

## 3. 完了条件

1. `e0ac74427b92965e3c33d5a20d58521d2586327a..d991ccb895577ac33b247ecfeb4420138c3eb537` の差分が当該 Job Run の出力だけで構成されている。
2. Job Run の状態、command evidence、result の記述が相互に整合している。
3. score・verdict・finding・失敗文書がある場合は、その変化と理由を確認している。
4. Run が `partial` の場合は、完了分を統合でき、失敗分が次の Run で再試行できる記録を持つときだけ `complete-with-findings` とし、失敗した対象と理由を finding に残している。
5. Run が `failed` の場合、または `partial` でも完了分がない、失敗分を再試行できない、未開始の対象がある場合は `incomplete` とし、再開または人手対応に必要な理由を残している。
6. reviewer は Job Run の出力を修正せず、review result だけに判断を記録している。

## 4. 判断手順

1. `git diff --stat e0ac74427b92965e3c33d5a20d58521d2586327a..d991ccb895577ac33b247ecfeb4420138c3eb537` と `git diff --name-status e0ac74427b92965e3c33d5a20d58521d2586327a..d991ccb895577ac33b247ecfeb4420138c3eb537` で出力範囲を確認する。
2. Job Run の plan・result・evidence・Run JSON と、Job が更新した成果物を照合する。
3. `succeeded` で完了条件を満たす場合は `complete`、軽微な finding を残して統合可能なら `complete-with-findings` とする。
4. `partial` で完了分を統合可能かつ失敗分を次の Run へ回せる場合は `complete-with-findings` とする。`partial` に `complete` は使わない。
5. 失敗、未完了、対象外変更、根拠不足がある場合は `incomplete` とし、改善指示と waiting の理由を明記する。

## 5. 完了手順

1. review result の全セクションを埋める。
2. `decision` に verdict を記録する。
3. verdict にかかわらず、レビュー自体を完了できた場合は終了コード 0 とする。

## 6. 異常終了の条件

- 出力 commit、Job Run の記録、result のいずれかを読めず、レビュー自体を完了できない場合は終了コード 1 とする。
- review executor は成果物や Job Run 出力を編集しない。

## 共通: 記法・成果物規約

作業を始める前に、共通の規約の詳細 `docs/ja/specdojo/exec-templates/xep-common-conventions-template.md` を読み、その内容に従う。次の箇条書きは、そのうち守らないと失敗に直結する要点である。

- result（review plan の場合は review result）への記入は、タスク完了に必須の作業である。成果物の編集とは別に、最後に必ず実施する。
- 終了コード 0 で完了する前に、result の必須セクションをすべて実際の内容で埋め、プレースホルダ（_TODO_ など）や未記入のセクションを残さない。
- 文書へのリンクは、対象文書が既に存在する場合は `[[id|title]]` 形式で記載する（`id` は project 修飾 doc id）。
- リンクを表（テーブル）のセル内に置く場合は、区切りの `|` を `[[id\|title]]` のようにエスケープする。エスケープしないと列がずれて表が壊れ、prettier 整形でセルが分割されて固定化される。
- まだ存在しない文書を参照する場合は、`[[...]]` ではなく `` `id` `` または `` `filename` `` のようにバッククォートで仮置きする。
- Markdown の自由記述では、`_` を含む識別子・フィールド名（例: `depends_on`）を必ずインラインコードで囲む。result に描画される executor evidence や reporter の自由記述も同じ記法にする。
- 成果物 frontmatter の `status` を `ready` に変更しない。`ready` への昇格は人間のみが行うため、`draft` のまま据え置く（exec のコミット時ガードでも昇格はブロックされる）。
- ファイルの読み取り・書き込み・編集は、作業ディレクトリ（カレントディレクトリ）からの相対パスで指定する。絶対パスを自分で組み立てたり、作業ディレクトリ名を推測して指定したりしない（作業ディレクトリ名の取り違えは外部パス扱いになり拒否される）。
- 検査を実行する前に、リポジトリの `package.json`、`.specdojo/specdojo.config.json`、hook 設定（`lefthook.yml` など）を読み、本共通規約の詳細にある検査表の適用条件で、実行する検査を決める。
- 適用条件を満たさない検査は実行せず、executor evidence の validations に `not_applicable` と非適用の理由を `reason` へ記録する。適用される検査が 1 つもない場合も同じく、該当する検査ごとに `not_applicable` と理由を記録する。
- `not_run` は、適用される検査を実行できたのに実行しなかった場合だけに使う。runner は `not_run` を検証失敗として扱い、タスクを先へ進めない。
- `pipeline.parent_validations` に設定された検査は executor evidence の validations に含めなくてよい。executor が同じ検査を `not_run` または `not_applicable` として含めても、同じリポジトリで実行した親 runner の結果を正とする。

### review の判断手順

review plan に共通で適用する。review はタスクの成果を判定し、成果物の品質は判定しない。成果物の品質は grade が一度だけ評価する。review はその評価結果（grade・finding）を事実として受け取り、このタスクを完了してよいかを判断する（[[bps-task-completion]]）。

- 成果物を再評価しない。観点ごとの pass / fail を付け直したり、評価結果の判定を自分の判断で置き換えたりしない。評価結果の内容に疑義がある場合は、疑義の内容と再評価が必要な理由を改善指示に記録する。
- 評価結果の鮮度を最初に確認する（`E-01`）。plan の「評価結果」章に示す評価対象と `--target` を使い、`specdojo grade list --target <対象種別> --path <評価対象> --changed-only` を実行する。`--target deliverable` の場合は `--dependency-changed` でも同様に実行する。いずれかが評価対象のパスを出力した場合、または評価結果サイドカーが存在しない場合は、評価結果が最新でない。成果物を自分で評価して補わず、verdict を `grade-stale` とする。
- 評価結果を確定できない場合（`E-02`）は、verdict を `grade-unavailable` とする。サイドカーを読み取れない場合と、`specdojo grade list --target <対象種別> --path <評価対象> --incomplete` が評価対象のパスを出力する場合（評価パイプラインが未完了）が該当する。
- 評価結果が最新であれば、サイドカーの `verdict` / `score` / `finding_counts` / `findings`、および `done_criteria`（存在する場合）を読み取る。
- 変更内容・この plan・実行記録・完了条件・最新の finding を照合し、このタスクの範囲と完了条件を満たすかを判断する（`S-02`）。完了条件の充足は、評価結果に判定がある場合はそれを事実として用いる。評価結果が扱わない事項を review で確かめる。対象は、フェーズ説明が求めた変更が行われたか、対象外の変更が混入していないか、実行記録の検証結果が成功しているかである。実行記録（先行する edit タスクの result）を特定できない場合は、確認できなかったことを判断根拠に記録する。
- finding が残っていても、このタスクの範囲と完了条件を満たしていれば完了できる。その場合は finding を消去・再評価せず、完了を妨げない理由と必要な改善指示を記録する。
- 判断の根拠は、評価結果・成果物・plan・実行記録を実際に読んで得た具体的な事実に限る。executor の最終メッセージや result の自己申告を、そのまま、または言い換えて根拠にしない。
- verdict を記録する直前に鮮度の確認を再実行する。最初の確認の後に成果物が変更されて評価結果が最新でなくなった場合は、verdict を `changed-during-review` とする（review 中の成果物変更）。

verdict は次の 6 値から 1 つを選ぶ。各値は [[bps-task-completion]] の検証・受入観点と一対一に対応する。

| verdict                  | 受入観点                | 選ぶ条件                                                                          | 記録すること                                               |
| ------------------------ | ----------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `complete`               | 完了可能                | 評価結果が最新で、plan と完了条件を満たし、完了を妨げる未充足事項がない           | 照合した根拠                                               |
| `complete-with-findings` | 品質 finding を伴う完了 | 評価結果に finding があるが、このタスクの範囲と完了条件は満たしている             | finding が完了を妨げない理由と改善指示                     |
| `incomplete`             | 品質良好だが未完了      | plan または完了条件に未充足事項がある（grade の良否は問わない）                   | 未充足事項と、再計画に使う改善指示                         |
| `grade-stale`            | 評価結果が最新でない    | 評価結果がない、`content_hash` が一致しない、または評価コンテキストの変化が未反映 | 鮮度確認のコマンドと出力。完了可否は判断しない             |
| `grade-unavailable`      | 評価不能                | 評価結果を読み取れない、または評価パイプラインが未完了で grade・finding が未確定  | 評価不能の理由と不足情報。完了は保留する                   |
| `changed-during-review`  | review 中の成果物変更   | 最初の鮮度確認の後に成果物が変更され、評価結果が最新でなくなった                  | 変更を検知した確認の出力。verdict を確定せず再評価を求める |

- verdict が `complete` 以外でも、review result を記録できた場合は正常終了する（終了コード 0）。runner は verdict に応じて再評価または再計画へ進む。
- review result の章立ては `評価結果の確認`、`判断根拠`、`未充足事項・改善指示`、`approach に応じた確認`、`decision` である。`decision` の `verdict` は必ず上表の値で埋める。
