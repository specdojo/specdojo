---
specdojo:
  id: prj-0001:xep-pjr-4n3r-20261108t030421z-bbee27c3
  type: exec-plan
  rulebook: none
  task_id: PJR-4N3R
  name: "外部 I/F（コマンド）（ifx-cmd）の型を、実装と同じことを書かない形に手入れする"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  approach: rulebook-maintenance
  targets:
    - specdojo:ifx-cmd-rulebook
---

# Edit Plan: PJR-4N3R

## 1. このフェーズで行うこと

外部 I/F（コマンド）の型を手入れする。引数・オプションの表は持たずコマンドリファレンスを参照し、入出力の約束（終了コード・作るファイル・副作用）に絞る

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 外部コマンド連携仕様（AI provider CLI）
- `depends_on`:
  - [[ifx-index]]
- `overview`: AI provider CLI（Claude Code / Codex CLI / opencode 等）を外部プロセスとして起動・連携するための実行契約、引数、入出力ストリーム、終了コード、エラー処理を定義する
- `path`: `docs/ja/product/020-external-interface-specs/ifx-cmd-ai-provider-cli.yaml`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-4N3R/pjr-4n3r-20261108T030421Z-bbee27c3/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/ifx-cmd-rulebook.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **_MISSING_**
- 責務: _MISSING_

このロールが重視するレビュー観点:

- _MISSING_

## 4. 進め方

参照の向きを「成果物 → rulebook」に切り替え、対象成果物に紐づく rulebook を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[major/vp-qe-verifiability; line=64; anchor=`""`\]: ``ルートキーだけでなく、`command`、`arguments`、`streams`、`authentication`、`execution`、`error_handling` の各入れ子キーについて必須・任意と条件付き必須を明記し、仕様だけで pass / fail を判定できるようにしてください。``
- F002 \[minor/vp-qe-verifiability; line=118; anchor=`""`\]: `error_handling 内で記載すべき具体的なキー名（timeout_action, malformed_output_action, authentication_failure_action 等）を明記してください。`
- F003 \[major/vp-qe-omissions-consistency; line=56; anchor=`"| arguments      | option／positional の種別、必須性、型、値の供給元、説明                          | ○    |"`\]: `` `version` に SemVer、`supersedes` に ID 配列を許可していますが、対応 schema は `version` を正整数に限定し、`supersedes` を許可していないため, メタ項目の契約を schema と一致させてください。 ``
- F004 \[major/vp-qe-omissions-consistency; line=64; anchor=`""`\]: ``対応 schema が必須とする `command.purpose`、`command.subcommands`、`command.shell`、各引数属性、各認証属性、実行属性、エラー処理属性の必須性を本文要件へ追加してください。``
- F005 \[major/vp-qe-omissions-consistency; line=83; anchor=`""`\]: `` `arguments[].kind` の `positional`、`position` キー、`value_source` の `config` は対応 schema で許可されず、rulebook に従った引数定義が検証エラーになるため、許容キーと enum を統一してください。 ``
- F006 \[major/vp-qe-omissions-consistency; line=100; anchor=`""`\]: ``終了カテゴリとして定義した `rate_limit` は対応 schema の `exit_codes[].category` で許可されていないため, rulebook と schema の enum を一致させてください。``
- F007 \[major/vp-qe-kata-conformance; line=83; anchor=`""`\]: ``rulebook と recipe が許容する `positional` および rulebook が許容する `config` を対応 schema が拒否するため、rulebook・recipe・template・schemaを通じた引数契約を統一してください。``

### 成果物から届いた Kata が原因の finding

- なし

各記録の `source=grade` / `source=condense` を確認する。grade は成果物・行・viewpoint・内容、condense は result・修正前の場所・種類・直し方・理由を読み、`cause.location` と照合して、見直し対象の Kata の該当箇所を確認する。この節の condense の記録も Kata の見直しの根拠とし、判定は `vp-arc-conciseness` を参照する。以下の手順は、この節と Kata そのものの grade の finding に適用する。

1. 見直し対象の rulebook を読み込み、現状の章構成・必須項目・禁止事項・判定基準を把握する。
2. plan に展開された finding は severity にかかわらず、message と同じ viewpoint ID の判定根拠を修正要件として読み取る。message と判定根拠から指摘の根拠となる規範を特定し、対象 rulebook の frontmatter から辿れる recipe / sample / template、`併せて適用する rulebook`、該当する執筆標準のうち必要な文書を読み、指摘された問題を解消するよう該当箇所を修正する。
3. 修正後、各 finding の問題が判定根拠に照らして解消したことを確認する。未解消、根拠不足、または判断不能の finding は、理由と次のアクションを result の `進め方と実践の型の適用` セクションに記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。
4. 複数の成果物・review result・対象領域の慣行を根拠に、それらが成果物の実態と合っているかを見直す。
5. 成果物側で繰り返し守られていない規定は、規定が過剰なのか成果物側の不備なのかを判断し、根拠とともに rulebook へ反映するか result に記録する。
6. 既存記述のうち、根拠と整合しない・陳腐化したものは見直し、整合するものは維持する。

finding の修正後は、再評価で構造・整合性が劣化していないことを確認する。

見直した rulebook は [[specdojo:rulebook-authoring-standard]]（章立て・記述ルール・禁止事項の正本）に従う。recipe / sample / template と記述が矛盾しないように更新する（構造・必須項目・禁止事項は rulebook を正とする）。

approach 全体の定義は [[specdojo:ryu-guide]] の「実践の型メンテナンスの進め方」を参照する。本タスクの実行に必要な rulebook メンテナンスの進め方は、このセクションで完結する。

### 4.1. 見直しの根拠が不足する場合

- finding の message と判定根拠、対象 rulebook から辿れる関連文書、該当する執筆標準、利用可能な成果物・review result・対象領域の慣行を確認しても改訂を判断できない場合に限り、根拠不足として見送る。成果物または review result がないことだけを理由に見送らない。
- 見送る場合は、確認した資料、判断できなかった理由、不足している根拠、次のアクションを result の `進め方と実践の型の適用` セクションに記録する。
- 根拠不足のまま推測で rulebook を改訂しない。確証が得られた範囲に改訂を限定し、残りは申し送りに残す。
- 見直し対象の rulebook が存在しない場合は、根拠とした成果物群から新規に作成する。

### 4.2. 判断根拠の記録

見直しの根拠とした規範・成果物・review result と判断根拠を result に残す。記録先は次のとおり。

- 根拠とした規範・成果物・review result、改訂・維持した記述とその根拠、矛盾時に rulebook を正とした箇所: result の `進め方と実践の型の適用` セクション。

## 5. 完了手順

1. 「このフェーズで行うこと」に従って rulebook を更新する。
2. 共通規約に従って、必要な整形・静的検査を実行する。
3. result の `実施内容`・`変更ファイル`・`進め方と実践の型の適用` セクションを記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。

## 6. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- 方針（indie が決定、2026-11-08）: 引数・オプションの表は持たずコマンドリファレンスを参照し、入出力の約束（終了コード・作るファイル・副作用）に絞る。
- rulebook にあわせて ifx-cmd-recipe・ifx-cmd-sample・ifx-cmd-template も揃える。

## 個票の追加完了条件

成果物カタログの `done_criteria` に加え、登録簿の個票が定める次の条件も満たす。

- [[specdojo:ifx-cmd-rulebook]] に、次の規則を書いている。
  - 引数・オプションの表は持たず、正本を参照する。SpecDojo 自身のコマンドならコマンドリファレンス、SpecDojo が起動する外部の CLI（AI provider CLI など）なら、その起動を定める設定（`exec-defaults.yaml` の `command_template`）と [[specdojo:exec-config-guide]] を正本とする。
  - 文書には、入出力の約束（渡すもの・受け取るもの・終了コードの意味・作るファイル・副作用・失敗の扱い）を書く。
- `ifx-cmd-recipe`・`ifx-cmd-sample`・`ifx-cmd-template` を新しい規則に合わせている。
- 型の変更に合わせて schema（`docs/specdojo/schemas/v1/`）を変える必要があれば変えている。その場合も、今の形で書かれた既存の文書が引き続き検査を通る（後方互換）。schema を変えたかどうかと理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- 規則と sample の書き方で迷った点や、決めきれない点は `_UNDECIDED_` で残さず executor が決め、決めた内容と理由を個票の対応結果に書いている。型の確定（PJR-RZ9Q）で人が判断する材料にする。
- 成果物の文書（`docs/ja/product/` 配下）は作らず、ほかの種類の型も変えていない。ただし、この型を参照している別の型の記述（例: 関連する型の「〜との関係」の節）が食い違う場合は、その箇所だけを直している。
- CHANGELOG の未公開の版の節に型の変更を書き、公開済みの版の節を変えていない。
- `npm run lint:md`・`npm run validate:schema`・`npm run test:unit` が通っている。

`共通規約 sha256:7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b` `docs/ja/projects/prj-0001/execution/conventions/7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b.txt`
