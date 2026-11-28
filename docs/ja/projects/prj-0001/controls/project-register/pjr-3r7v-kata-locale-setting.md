---
specdojo:
  id: prj-0001:pjr-3r7v-kata-locale-setting
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-28T00:21:32Z"
  due_on: "2026-12-31"
  derived_from:
    - PJR-F4MG
---

# PJR-3R7V kata の言語を選ぶ設定 kata_locale を実装する

## 1. 概要

PJR-F4MG で決めた設計に沿って、kata（rulebook・recipe・sample・template など）の言語を選ぶ設定 `kata_locale` を実装する。英語版の kata は `docs/en/specdojo/` に日本語版と同じ id で置かれ、npm package にも入っているが、利用者が英語の kata を選ぶ経路がまだない。

## 2. 入力

- 設計は PJR-F4MG の対応結果「英語の kata の置き場所と言語の選び方」で決めた（設定のキー、init の質問、kata list での見え方、ja へのフォールバック）
- 英語版の kata は docs/en/specdojo/ に日本語版と同じ id で置き、npm package の files に含めた（c4ce5b53c1）
- 実装は v0.10.0 の後に入れる。担当 DEV・期限 2026-12-31 は indie の指示（2026-11-28）

## 3. 完了条件

- `.specdojo/specdojo.config.json` の最上位に `kata_locale`（`ja` / `en`、既定 `ja`）を足す。設定の schema と設定リファレンスに書く。
- kata の解決（`kata list`・`kata show`・`kata eject`、exec plan などの rulebook の参照）で、指定の言語の variant を先に探し、無ければ `ja` に戻る。eject した利用リポジトリの kata が優先される今の順は変えない。
- `init` で project 名の後に `Kata language (ja / en) [ja]:` を聞き、非対話では `--kata-locale <ja|en>` で渡せる。
- `kata list` の最後に `LOCALE` 列を足す。解決した文書の言語を出し、英語を選んで日本語に戻った文書は `ja (fallback)` と出す。既存の列の位置は変えない。
- 英語の kata を選んだときに、登録簿の必須節や一覧の生成など日本語の表記に頼る処理が壊れないかを確かめ、結果を個票の対応結果に書く。直す必要があるものは、この項目で直すか別の項目にするかを executor が決め、理由を個票の対応結果に書く。
- `init` の既定を `LANG` に合わせるかと、CLI・オーケストレーターの案内の言語も切り替えるかは、この項目では決めない。`_UNDECIDED_` のまま残し、個票の対応結果に何が足りないかを書く。
- 単体テストまたは統合テストで、次の 4 つの場合を確かめている。
  - `ja` を選んだ場合
  - `en` を選んだ場合
  - `en` を選んで英語版がない場合（`ja (fallback)`）
  - 不正な値
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、案を個票の対応結果と報告の `handoff` に書く。
- 作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                                               | 担当 | 状態 | メモ                                                                                                   |
| --- | ------------------------------------------------------------------ | ---- | ---- | ------------------------------------------------------------------------------------------------------ |
| 1   | `kata_locale` を設定・schema・設定リファレンスに足す               | DEV  | done | 型・読み込み時の検証・schema・設定リファレンス・コマンドリファレンス                                   |
| 2   | kata の解決に言語の variant と `ja` へのフォールバックを足す       | DEV  | done | `resolveSpecdojoResourceIfExists` に集約。`kata list`・`show`・`eject`・`install` と plan の参照が使う |
| 3   | `init` の質問と `--kata-locale`、`kata list` の `LOCALE` 列を足す  | DEV  | done | `init` は設定に `kata_locale` を必ず書く                                                               |
| 4   | 英語の kata で日本語の表記に頼る処理が壊れないかを確かめる         | DEV  | done | 登録簿の template は `ja` に固定した。理由は対応結果                                                   |
| 5   | 4 つの場合のテストを書き、型検査・lint・単体テストと親の検証を通す | DEV  | done | executor では型検査と変更箇所の ESLint・関係する単体テストを実行。全件は親の検証で確かめる             |

## 5. 対応結果

PJR-F4MG の「英語の kata の置き場所と言語の選び方」に沿って `kata_locale` を実装した。

- 設定: `.specdojo/specdojo.config.json` の最上位に `kata_locale`（`ja` / `en`、既定 `ja`）を足した。`loadConfig` と kata の解決の両方で検証し、ほかの値は `kata_locale must be one of ja | en` のエラーにする。schema（`docs/specdojo/schemas/v1/specdojo-config.schema.yaml`）、[[specdojo:specdojo-config-reference|設定リファレンス]]、[[specdojo:command-reference|コマンドリファレンス]] に書いた。
- 解決: `src/shared/template-resolution.ts` の `resolveSpecdojoResourceIfExists` に集約し、`resolveSpecdojoPathIfExists` をこれに通した。対象は rulebooks・standards・recipes・samples・templates で、exec-template・defaults・schema は CLI の版と対応するため切り替えない。設定は `src/shared/kata-locale.ts` が `loadConfig` の副作用（`.env` 読み込みや警告）なしに読み、mtime と size で cache する。
- 解決順: 利用リポジトリの選んだ言語 → 利用リポジトリの `ja` → package の選んだ言語 → package の `ja`。_ASSUMPTION_: 「eject した kata が優先される順を変えない」を、日本語版を eject して手を入れた利用者が `en` に切り替えても手直しを失わない順と読んだ。この場合は `ja (fallback)` と表示されるため、英語版を使うには英語版を eject するか日本語版の eject を外す。
- `kata eject`・`kata install` は解決した言語の置き場所（`en` なら `docs/en/specdojo/...`）へコピーする。同じファイル名は選んだ言語を先に採り、同じ ID を二重に数えない。
- `init`: project 名の後に `Kata language (ja / en) [ja]:` を聞き、非対話は `--kata-locale <ja|en>`。不正な対話入力は同じ質問をやり直す。生成する設定には選んだ値を必ず書く。
- `kata list`: 最後に `LOCALE` 列を足した（`KIND SOURCE EJECTABLE ID PATH LOCALE`）。既存の列の位置は変えていない。言語中立の schema は `-`、利用者の kata（`kata_authority`）は `ja` と出す。`PATH` は解決した言語の置き場所を出す。

### 5.1. 日本語の表記に頼る処理の確認

- 個票: `register add --input` の差し込み（`## N. 入力`、`src/register/input.ts`）、完了条件の抽出（`src/exec/register.ts`）、作業内容の表の検査（`src/register/work-table.ts`）、変更範囲の節の分類（`src/exec/run/change-scope.ts`）、`register update --section` の節名が日本語の見出しで読み書きしている。英語の個票 template（`Inputs`・`Completion criteria`・`Work items`）では、入力の節が重複して足され、完了条件が「明示的な完了条件がない」と扱われ、作業内容の表の検査が黙って外れて close を止められない。
- 一覧と派生ビュー: 列は章番号と位置で扱うため（`REGISTER_SECTION_RE` と template の列見出し）、英語の template でも生成は壊れない。ただし一覧の説明は個票の本文から作るため、個票と言語を揃える必要がある。
- 判断: この項目では、登録簿の template（個票・一覧・派生ビュー）を `kata_locale` に関わらず `ja` に固定した（`src/register/core.ts` の `REGISTER_TEMPLATE_ROOTS`）。英語の見出しへの対応は上の5か所と exec plan の文言に広がり、`kata_locale` の実装とは別に検討と検証が要るため、別の項目にする。
- 成果物: rulebook の本文 schema（md-content lint）は明示した glob と schema で検査するため、`kata_locale` では変わらない。英語の template から作った成果物は `docs/ja/projects/` 配下に置かれるため、日本語の見出しを前提とした本文検査を当てる運用では見出しが合わない。対象の型の本文検査を使う project は、当面 `ja` を使う。

### 5.2. 未決事項

- _UNDECIDED_: `init` の既定を OS の言語（`LANG`）に合わせるか。英語の利用者の手間と、同じ手順で作った project の kata の言語が環境で変わることの比較に、利用者の判断が要る。
- _UNDECIDED_: CLI・オーケストレーターの案内の言語も切り替えるか。同じキーで切り替えるか別キーにするか、案内文の英訳の範囲（exec plan の共通規約・オーケストレーター SSOT を含むか）が決まっていない。

### 5.3. CHANGELOG に書く事項

- 区分: Added
- 行の文案: 設定の `kata_locale`（`ja` / `en`）で kata の言語を選べるようにした。選んだ言語の版が無い kata は日本語版を使い、`kata list` の `LOCALE` 列に `ja (fallback)` と出す。`init` は project 名の後に言語を聞き、非対話では `--kata-locale` で指定できる。
- 区分: Changed
- 行の文案: `kata list` の最後に `LOCALE` 列を足した。既存の列の位置は変わらない。

### 5.4. 残課題

- 登録簿の個票の英語の見出しへの対応（5.1 の5か所と exec plan の文言）は別の項目で起票する。対応後に `REGISTER_TEMPLATE_ROOTS` の `ja` 固定を外す。
- maintenance 系の approach の commit 許可範囲（`kataDirsForKinds`）は `docs/ja/specdojo/` だけを返す。英語の kata を exec で手入れする場合は `docs/en/specdojo/` を足す必要がある。
- 保護された設定（`.specdojo/` など）は変えていない。このリポジトリの設定に `kata_locale` を書く必要はない（既定 `ja`）。

### 5.5. 検証

- `npx tsc -b` は成功した。変更した `src` と `tests` の ESLint はエラーがない（警告は既存の関数行数のみ）。
- `npx vitest run tests/src/kata tests/src/commands/init.test.ts tests/src/register/template-locale.test.ts tests/src/shared tests/src/exec/plans` は成功した。`ja`・`en`・`en` で英語版が無い場合（`ja (fallback)`）・不正な値の4つを `tests/src/kata/command.test.ts` で、`init` の質問と `--kata-locale` を `tests/src/commands/init.test.ts` で、登録簿の `ja` 固定を `tests/src/register/template-locale.test.ts` で確かめる。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` などの全件は親 runner の検証で確かめる。

## 6. 関連ドキュメント

- [[specdojo:specdojo-config-reference|設定リファレンス]]: `kata_locale` のキーと解決順。
- [[specdojo:command-reference|コマンドリファレンス]]: `init --kata-locale` と `kata list` の `LOCALE` 列。
- [[specdojo:id-and-file-naming-standard|ID・ファイル命名標準]]: 言語の variant を同じ id で置く規則。
- 設計元: PJR-F4MG の対応結果「英語の kata の置き場所と言語の選び方」。
