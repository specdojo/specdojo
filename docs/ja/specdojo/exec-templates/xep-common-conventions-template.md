## 共通: 記法・成果物規約

この規約は、生成される全 exec plan に共通で適用される。result の完了条件、他文書を参照する際のリンク記法、成果物の状態（status）の扱いを統一する。

- result（review plan の場合は review result）への記入は、タスク完了に必須の作業である。成果物の編集とは別に、最後に必ず実施する。
- 終了コード 0 で完了する前に、result の必須セクションをすべて実際の内容で埋め、プレースホルダ（_TODO_ など）や未記入のセクションを残さない。
- 成果物に変更が不要と判断した場合でも、result の記入は省略しない。変更不要と判断した理由と根拠を result に記入してから完了する。
- result が未記入・プレースホルダのまま終了コード 0 で終了すると、runner は成果物未完了（block）として扱い、タスクはやり直しになる。完了前に result の記入漏れがないことを必ず確認する。
- result の frontmatter は scaffold 済みの構造を正本とする。`id` / `task_id` / `mode` / `project_id` / `plan_ref` / `agent` / `execution` / `approach` / `targets` はキーの追加・削除・改名をせず、scaffold された値のまま維持する。見出し構成（`# Edit Result` などの H1、`## 1.` 以降の章立て）も独自の構成に置き換えない。埋めるのは本文セクションの `_TODO_` プレースホルダの中身だけである。`status` と `completed_at` は完了処理（runner 側）が更新するため、自分で書き換えない。
- 文書へのリンクは、対象文書が既に存在する場合は `[[id|title]]` 形式で記載する（`id` は project 修飾 doc id）。
- リンクを表（テーブル）のセル内に置く場合は、区切りの `|` を `[[id\|title]]` のようにエスケープする。エスケープしないと列がずれて表が壊れ、prettier 整形でセルが分割されて固定化される。
- まだ存在しない文書を参照する場合は、`[[...]]` ではなく `` `id` `` または `` `filename` `` のようにバッククォートで仮置きする。
- Markdown の自由記述では、`_` を含む識別子・フィールド名（例: `depends_on`）を必ずインラインコードで囲む。result に描画される executor evidence や reporter の自由記述も同じ記法にする。
- 成果物 frontmatter の `status` を `ready` に変更しない。`ready` への昇格は人間のみが行うため、`draft` のまま据え置く（exec のコミット時ガードでも昇格はブロックされる）。
- plan に「プロジェクトコンテキスト」章がある場合、そこに挙がる文書はプロジェクト共通の前提を読むための参照であり、成果物 frontmatter の `based_on` へ転記しない。参照して得た前提は本文の記述内容へ反映する。
- 成果物 frontmatter の `based_on` に書けるのは、その成果物の `depends_on` の推移閉包に含まれる先行成果物だけである。閉包外の ID を書くと `catalog validate` が「`based_on` が `depends_on` の推移閉包に含まれていません」としてエラーになり、コミットがブロックされる。`based_on` を増やす必要が生じた場合は、自分で転記せず、根拠不足として result に記録する。
- ファイルの読み取り・書き込み・編集は、作業ディレクトリ（カレントディレクトリ）からの相対パスで指定する。絶対パスを自分で組み立てたり、作業ディレクトリ名を推測して指定したりしない（作業ディレクトリ名の取り違えは外部パス扱いになり拒否される）。
- 編集・書き込みが作業ディレクトリ外（`external_directory`）として拒否された場合、原因はパス指定の誤り（誤った絶対パス・ディレクトリ名の取り違え）である。bash の heredoc などへ回避的に切り替えず、相対パスに直したうえで同じ編集ツールで再実行する。
- 作業用のファイル（編集用スクリプト、検証用の一時データなど）はリポジトリの外（一時ディレクトリ）に置き、終了前に削除する。リポジトリ内、とくにリポジトリ直下に作業用のファイルを作らない。成果物ではない新規ファイルは commit されず、`commit-scope:` の警告として記録される。
- 整形・静的検査は、この plan の完了手順または本共通規約で明示されたコマンドを実行する。変更対象に必要な test、build、schema 検証は、plan に個別記載がなくても実行してよい。同じ test script では対象限定と全件を同一 executor run 内で連続実行せず、どちらか一方に絞る。下表、plan、またはプロジェクト標準が全件 test を求める場合は、全件を1回だけ実行して対象限定の実行を省く。この制約は executor が sandbox 内で実行する test script の回数に対するものであり、親検証に設定された ID のコマンドは対象外である（親 runner が別途実行する）。実行したコマンド・対象・結果は result に記録する。
- executor / reporter pipeline で親 runner の検証が設定されている場合、executor は設定済み ID に対応するコマンドを sandbox 内で実行せず、executor 終了後に親 runner が固定許可リストから実行して evidence へ追記する。`validate-schema` は `npm run validate:schema`、`test-unit` は `npm run test:unit`、`test-integration` は `npm run test:integration` に対応する。executor は親検証と同じコマンドの対象限定版も追加せず、二重実行しない。
- Markdown 成果物を編集した後は、`npx prettier --write <対象ファイル>` で整形し、`npx markdownlint <対象ファイル>` で静的検査を実施する。検査でエラーが出た場合は修正してから完了とする。
- YAML 成果物を編集した後は、対応 schema `_SCHEMA_REF_` に従って記述し、`npm run validate:schema:file -- --schema _SCHEMA_REF_ --data <対象ファイル>` で schema 検査を実施する。検査でエラーが出た場合は修正してから完了とする。
- 終了する前に、コミット時に実行される検査（pre-commit 相当）を先回りで実行し、失敗をすべて修正してから完了する。コミット時に初めて失敗が判明すると commit がブロックされ、成果物の内容が完成していてもタスクは block になる。
- 実行対象は、変更したファイルの種別で判断する。下表のうち、変更したファイルが該当する行の検査をすべて実行する。該当行がない場合は追加の検査は不要である。ただし親検証に設定された ID のコマンドは下表よりも優先し、executor は実行しない。下表に同じコマンドが挙がっていても、親 runner の実行に委ねる。
- 検査コマンドの正本はリポジトリの hook 設定（`lefthook.yml` など）である。下表と設定が食い違う場合は設定側に合わせ、実行したコマンドと結果を result に記録する。`specdojo` コマンドは、リポジトリで定められた起動方法（`npx tsx src/specdojo.ts <subcommand>` など）で実行する。ただし、sandbox 環境で `tsx` の IPC エラー（`EPERM`）が発生する場合は、代わりに `node --import tsx src/specdojo.ts <subcommand>` を使用して実行する。

| 変更したファイル                                                                                       | 実行する検査                                                                                                                          |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `*.md`                                                                                                 | `npx prettier --write <対象ファイル>`、`npx markdownlint <対象ファイル>`                                                              |
| `*.ts` / `*.js` / `*.json` / `*.yaml` / `*.yml`                                                        | `npx prettier --write <対象ファイル>`                                                                                                 |
| `src/`、`tests/`、`scripts/`、`tools/`、`tsconfig*.json`                                               | `npm run typecheck`                                                                                                                   |
| `src/`、`tests/`、`docs/ja/specdojo/templates/`、`docs/ja/specdojo/exec-templates/`、`vitest.config.*` | pipeline executor は `npm run test:unit`、それ以外は `npm test`（`test-unit` が親検証に設定されている場合は executor では実行しない） |
| `docs/ja/projects/` 配下                                                                               | `specdojo catalog validate`                                                                                                           |
| `dct-*.yaml`                                                                                           | `specdojo catalog build`                                                                                                              |
| `pjr-index.md`                                                                                         | `specdojo register build`                                                                                                             |
| `sch-*.yaml`                                                                                           | `specdojo exec refresh`                                                                                                               |
| `docs/` 配下                                                                                           | `specdojo index build`                                                                                                                |

<!-- review-only:start -->

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

<!-- review-only:end -->
