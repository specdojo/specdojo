---
specdojo:
  id: prj-0001:xep-t-launch-prj-comparison-of-alternatives-120
  type: exec-plan
  rulebook: xep-rulebook
  task_id: T-LAUNCH-prj-comparison-of-alternatives-120
  name: Sample 最終調整
  mode: edit
  status: ready
  project_id: prj-0001
  owner: ARC
  on_critical_path: true
  approach: sample-maintenance
  targets:
    - prj-0001:prj-comparison-of-alternatives
    - prj-comparison-of-alternatives-sample
---

# Edit Plan: T-LAUNCH-prj-comparison-of-alternatives-120

## 1. このフェーズで行うこと

レビュー済みの完成版成果物と review 結果を根拠に sample を最終調整する。
粒度・文体・表の書き方と完成例としての妥当性を確認し、必要な箇所のみ修正する。
プロジェクト固有の値は一般化またはプレースホルダ化し、再利用可能な例にする。

## 2. 対象成果物

- `name`: 代替案比較
- `depends_on`:
  - [[prj-0001:prj-scope]]
  - [[prj-0001:prj-issues-and-approach]]
- `overview`: 技術的・方針的な代替案を比較評価
- `path`: `docs/ja/projects/prj-0001/020-project-definition/prj-comparison-of-alternatives.md`
- `result`: `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-prj-comparison-of-alternatives-120-result.md`

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **ARC（Architect）**
- 責務: rulebook、recipe、sample、template、成果物カタログの構造整合と技術制約を整理する。

このロールが重視するレビュー観点:

- 文書構造・配置・命名: frontmatter、ID、ファイル名、配置、見出し、リンクがプロジェクトの文書体系と整合しているか。
- 成果物間整合: 成果物カタログ、Schedule、RACI、組織定義、メンバー定義、生成物と矛盾していないか。
- 技術前提・制約の明確性: 技術的な前提、制約、外部依存、構成判断が必要な範囲で明示されているか。

## 4. 進め方

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行は、いずれも実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

1. 見直し対象の sample を読み込み、現状の粒度・文体・表の書き方を把握する。
2. 複数の成果物・review result・対象領域の慣行を根拠に、それらが完成例として適切かを見直す。
3. rulebook の必須項目・禁止事項を満たす最小の記述例になるよう再構成し、実成果物の丸写しを避ける。
4. 既存記述のうち、根拠と整合しない・陳腐化したものは見直し、整合するものは維持する。

見直した sample は [[sample-authoring-standard]]（構成・記述ルール・禁止事項の正本）に従う。rulebook / recipe と記述が矛盾しないように更新する（構造・必須項目・禁止事項は rulebook を正とする）。

approach 全体の定義は [[specdojo-reference-materials-guide]] の「参考資料メンテナンスの進め方」を参照する。本タスクの実行に必要な sample メンテナンスの進め方は、このセクションで完結する。

### 4.1. 見直しの根拠が不足する場合

- 見直しの根拠とできる成果物・review result が不足し、sample の改訂が妥当か判断できない場合は、その事実と判断を result の `参考資料の活用` セクションに記録する。
- 根拠不足のまま推測で sample を改訂しない。確証が得られた範囲に改訂を限定し、残りは申し送りに残す。
- 見直し対象の sample が存在しない場合は、根拠とした成果物群から新規に作成する。

### 4.2. 判断根拠の記録

見直しの根拠とした成果物・review result と判断根拠を result に残す。記録先は次のとおり。

- 根拠とした成果物・review result、改訂・維持した記述とその根拠、矛盾時に rulebook を正とした箇所: result の `参考資料の活用` セクション。

## 5. 完了手順

1. 「このフェーズで行うこと」に従って sample を更新する。
2. 共通規約に従って、必要な整形・静的検査を実行する。
3. result の `実施内容`・`変更ファイル`・`参考資料の活用` セクションを記入する。これはタスク完了に必須であり、`_TODO_` を残したまま終了しない（詳細は共通規約を参照）。

## 6. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

## 共通: 記法・成果物規約

この規約は、生成される全 exec plan に共通で適用される。result の完了条件、他文書を参照する際のリンク記法、成果物の状態（status）の扱いを統一する。

- result（review plan の場合は review result）への記入は、タスク完了に必須の作業である。成果物の編集とは別に、最後に必ず実施する。
- 終了コード 0 で完了する前に、result の必須セクションをすべて実際の内容で埋め、プレースホルダ（`_TODO_` など）や未記入のセクションを残さない。
- 成果物に変更が不要と判断した場合でも、result の記入は省略しない。変更不要と判断した理由と根拠を result に記入してから完了する。
- result が未記入・プレースホルダのまま終了コード 0 で終了すると、runner は成果物未完了（block）として扱い、タスクはやり直しになる。完了前に result の記入漏れがないことを必ず確認する。
- 文書へのリンクは、対象文書が既に存在する場合は `[[id|title]]` 形式で記載する（`id` は project 修飾 doc id）。
- リンクを表（テーブル）のセル内に置く場合は、区切りの `|` を `[[id\|title]]` のようにエスケープする。エスケープしないと列がずれて表が壊れ、prettier 整形でセルが分割されて固定化される。
- まだ存在しない文書を参照する場合は、`[[...]]` ではなく `` `id` `` または `` `filename` `` のようにバッククォートで仮置きする。
- 成果物 frontmatter の `status` を `ready` に変更しない。`ready` への昇格は人間のみが行うため、`draft` のまま据え置く（exec のコミット時ガードでも昇格はブロックされる）。
- ファイルの読み取り・書き込み・編集は、作業ディレクトリ（カレントディレクトリ）からの相対パスで指定する。絶対パスを自分で組み立てたり、作業ディレクトリ名を推測して指定したりしない（作業ディレクトリ名の取り違えは外部パス扱いになり拒否される）。
- 編集・書き込みが作業ディレクトリ外（`external_directory`）として拒否された場合、原因はパス指定の誤り（誤った絶対パス・ディレクトリ名の取り違え）である。bash の heredoc などへ回避的に切り替えず、相対パスに直したうえで同じ編集ツールで再実行する。
- 整形・静的検査は、この plan の完了手順または本共通規約で明示されたコマンドだけを実行する。plan に未記載の追加 test / build / schema 検証を独自に実行しない。追加検証が必要と判断した場合は、実行せず result の申し送りに残す。
- Markdown 成果物を編集した後は、`npx prettier --write <対象ファイル>` で整形し、`npx markdownlint <対象ファイル>` で静的検査を実施する。検査でエラーが出た場合は修正してから完了とする。
