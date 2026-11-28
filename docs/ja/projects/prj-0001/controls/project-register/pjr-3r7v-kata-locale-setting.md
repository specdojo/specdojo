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

| No  | 作業                                                               | 担当 | 状態 | メモ |
| --- | ------------------------------------------------------------------ | ---- | ---- | ---- |
| 1   | `kata_locale` を設定・schema・設定リファレンスに足す               | DEV  | open | -    |
| 2   | kata の解決に言語の variant と `ja` へのフォールバックを足す       | DEV  | open | -    |
| 3   | `init` の質問と `--kata-locale`、`kata list` の `LOCALE` 列を足す  | DEV  | open | -    |
| 4   | 英語の kata で日本語の表記に頼る処理が壊れないかを確かめる         | DEV  | open | -    |
| 5   | 4 つの場合のテストを書き、型検査・lint・単体テストと親の検証を通す | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
