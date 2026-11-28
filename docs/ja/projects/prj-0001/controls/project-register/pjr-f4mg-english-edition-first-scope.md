---
specdojo:
  id: prj-0001:pjr-f4mg-english-edition-first-scope
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: hard
  owner: BA
  registered_at: "2026-11-23T22:53:08Z"
  due_on: "2026-12-31"
  completed_at: "2026-11-28T00:19:08Z"
  conclusion: 英語版の最初の範囲（README の英語の節、文書サイトの英語の入口とクイックスタート、入門ガイド、入門の型の組 5 つ）を作り、npm package に含めた。kata の言語の選び方（kata_locale）は設計を決め、実装は v0.10.0 の後に入れる
  derived_from:
    - PJR-BHJM
  depends_on:
    - PJR-BHJM
  commit_type: feat
  commit_scope: docs
---

# PJR-F4MG 英語版の最初の範囲を作る

## 1. 概要

PJR-BHJM で決めた範囲で、README・文書サイトの入口・クイックスタートと入門の型の組の英語版を作る

## 2. 入力

- v0.11.0 に入れる見込み（PJR-BHJM で確定する）
- 再開指示（2026-11-27）: PJR-BXYM は review 中だが、統合済みの [[specdojo:civic-tech-starter-guide|シビックテック入門ガイド]] の5つの型を正として英訳する。

## 3. 完了条件

- PJR-BHJMで決めた範囲で、英語版の最初の範囲を作る。案 A の場合は、README の英語の節（PJR-82H2 の続き）、文書サイトの英語の入口（`docs/en/`）とクイックスタート、入門の型の組（PJR-BXYM）の英語版とする。
- 英語の kata の置き場所と、言語の選び方（設定のキー、`init` の質問、`kata list` での見え方）を決め、決めた内容と理由を個票の対応結果に書く。決められない点は `_UNDECIDED_` で残し、何が足りないかを書く。
- 日本語の型を正本とし、英語版がどの日本語の版から訳したかを追えるようにする（frontmatter などで）。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema` を通し、文書サイトのビルド（`npm run docs:build`）が通ることを確かめる。

## 4. 作業内容

| No  | 作業                                             | 担当 | 状態 | メモ                                                                                                                                                              |
| --- | ------------------------------------------------ | ---- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 翻訳元の版を追う frontmatter の項目を足す        | BA   | done | `specdojo.translated_from`（`locale`・`commit`）を共通スキーマと ID 標準に足し、英語の guide・rulebook・recipe・sample を frontmatter lint の対象にした           |
| 2   | クイックスタートの英語版を作る                   | BA   | done | `docs/en/specdojo/guides/quick-start-guide.md` を同じ id で作った                                                                                                 |
| 3   | 文書サイトの英語の入口と README の英語の節を直す | BA   | done | `docs/en/index.md`・`docs/index.md`・README の英語の節から英語のクイックスタートへ案内した                                                                        |
| 4   | 英語の kata の置き場所と言語の選び方を決める     | BA   | done | 対応結果の「英語の kata の置き場所と言語の選び方」に書いた。CLI の実装は別の項目にする                                                                            |
| 5   | 入門の型の組の英語版を作る                       | BA   | done | 再開指示の5つの型に対応する rulebook 5件・recipe 3件・sample 4件・template 20件と入門ガイドを英訳した                                                             |
| 6   | 文書サイトのビルドを確かめる                     | BA   | open | `npm run docs:build` は `.specdojo/doc-index.json` を作り直すため executor では流せない。オーケストレーターが流す                                                 |
| 7   | 日英の rulebook の参照競合と Markdown 記法を直す | BA   | done | frontmatter の型照合を言語スコープに対応させ、回帰テストを追加した。クイックスタートの隣接する引用をまとめ、MD028 違反を修正した。lint の再評価は親 runner が行う |

## 5. 対応結果

PJR-BHJM の案 A と再開指示に従い、README・文書サイトの英語入口・クイックスタート・入門の型の組を揃えた。executor の成果物編集は完了し、文書サイトのビルドは作業内容6の理由によりホスト側へ申し送る。

- クイックスタートの英語版は、日本語版と同じ id（`specdojo:quick-start-guide`）で `docs/en/specdojo/guides/` に置いた。`.specdojo/index-config.yaml` の `locales` に `ja`・`en` が宣言済みのため、言語の variant として扱われる。ほかのガイドへの wikilink は書き換えず、英語版が無いあいだは日本語版へ解決される（表示名に「(Japanese)」を付けた）。
- 翻訳元の版は frontmatter の `specdojo.translated_from` に書く。`locale` は正本の言語、`commit` は訳したときに正本のファイルを最後に変えた commit とする。正本のパスは同じ id・同じ相対パスの `docs/ja/` 側で決まるため書かない。正本の差分は `git log <commit>.. -- docs/ja/<path>` で追える。共通スキーマ（`docs/specdojo/schemas/v1/common-frontmatter.schema.yaml`）に任意項目として足し、[[specdojo:id-and-file-naming-standard|ID・ファイル命名標準]] に規則を書いた。英語の guide・rulebook・recipe・sample に日本語版と共通の frontmatter schema を適用する。日本語の見出しを前提とする本文 schema は英語版には当てていない。
- 英語の型はプロジェクト概要・課題と解決アプローチ・ビジネスルール・システム化機能一覧・プロジェクト登録簿の5つ。既存の構成に従い、rulebook 5件、recipe 3件、sample 4件、template 20件（登録簿の型別個票9件・一覧と派生ビュー8件を含む）を作った。機能一覧は recipe・template、登録簿は recipe・sample と単一templateが `not-needed` のため、それらを新設していない。ID・ファイル名・参照先・雛形のフィールド・view-slot を維持し、本文を英訳した。新設文書の `status` は `draft` とした。
- 入門ガイドも英訳し、復元・確認状態・人の確定・記録の順、5つを選んだ理由、後で型を足す目安を英語で読めるようにした。英語の入口からガイドと5つの rulebook、README から両ガイドへ案内し、未翻訳文書は日本語へフォールバックすることと、CLI の言語選択は後続作業であることを書いた。
- PJR-BXYM は review 中だが、再開指示に基づき現在の組を翻訳元として固定した。人の確認で組や本文が変わった場合は、BXYM の変更を起点に翻訳の追従 todo を起票し、各文書の `translated_from.commit` から日本語の差分を照合する。追加・変更した型の構成ファイル、入門ガイド、英語入口を更新し、不要になった英語文書は参照の影響を確認してから扱いを決める。英語側だけで組を決め直さない。

### 5.1. 英語の kata の置き場所と言語の選び方

- 置き場所: 日本語と同じ構成で `docs/en/specdojo/{rulebooks,recipes,samples,templates}/` に置き、ファイル名と id は日本語版と同じにする。理由は、ID 標準の言語スコープ（同じ論理 id の言語 variant）と `index-config.yaml` の `locales` が既にあり、新しい id や参照の書き換えが要らないため。npm package に入れるには `package.json` の `files` に `docs/en/specdojo`（`generated` を除く）を足す必要がある。`package.json` は保護された設定のため、この項目では変えていない。
- 設定のキー: `.specdojo/specdojo.config.json` の最上位に `kata_locale`（`ja` / `en`、既定 `ja`）を置く。kata の解決では指定の言語の variant を先に探し、無ければ `ja` に戻る（ID 解決のフォールバックと同じ）。キーを kata に限ったのは、CLI の出力や project の文書の置き場所（`docs/ja/projects/`）の言語と混同させないため。
- `init` の質問: project 名の後に `Kata language (ja / en) [ja]:` を聞き、非対話では `--kata-locale <ja|en>` で渡す。
- `kata list`: 既存の列の位置を変えないよう、最後に `LOCALE` 列を足し、解決した文書の言語を出す。英語を選んで日本語に戻った文書は `ja (fallback)` と出し、英語版が無いことを分かるようにする。
- `_UNDECIDED_`: `init` の既定値を OS の言語（`LANG`）に合わせるか。英語の利用者の手間は減るが、同じ手順で作った project の kata の言語が環境で変わる。利用者の判断が要る。
- `_UNDECIDED_`: オーケストレーターや CLI の案内の言語を同じキーで切り替えるか。PJR-BHJM の範囲外のため、必要になったら別の項目で決める。

### 5.2. CHANGELOG に書く事項

- 区分: Added
- 行の文案: 英語のクイックスタートとシビックテック入門ガイド、最初に使う5つの型の英語版を文書サイトに追加し、README と英語入口から案内した。
- 区分: Added
- 行の文案: 翻訳文書の frontmatter に、日本語の翻訳元の言語と版を記録する `translated_from` を追加した。
- 区分: Fixed
- 行の文案: frontmatter の型照合で言語スコープを考慮し、同じ ID の日英 rulebook を参照競合として扱わないようにした。
- CLI の `kata_locale` と npm 配布の変更は今回実装していないため、その機能を追加済みとは記載しない。

### 5.3. 残課題

- `kata_locale`・`init` の質問と `--kata-locale`・`kata list` の `LOCALE` 列の実装は別項目で起票する。英語の kata を実行時に選ぶ経路を実装する際は、登録簿の必須節や一覧生成の日本語固定表記も確認する。
- npm 配布には `package.json` の `files` に `docs/en/specdojo` と `!docs/en/specdojo/**/generated/**` を追加する。保護された設定のため executor は変更せず、ホスト側での対応または別項目での実装を申し送る。
- `init` の既定を `LANG` に合わせるか、CLI・オーケストレーターの案内も切り替えるかは5.1の未決事項として後続項目で判断する。
- `npm run docs:build` は `.specdojo/doc-index.json` を更新するため sandbox 内では実行しない。ホスト側で他の重い実行と重ねずに実行し、英語入口・両ガイド・5つの型のリンクと描画を確認する（作業内容6）。

### 5.4. 日英の rulebook の解決方針

- 英語版の ID は日本語版と同じに保つ。英語用の ID や名前空間を新設する案は、同じ論理文書の翻訳には別 ID を振らない ID 標準に反し、参照先の書き換えも必要になるため採らない。
- 前回の frontmatter lint は、型照合の rulebook 索引が言語を区別せず、日英の同一 ID を重複と扱ったため、`--frail` が約1,300件の警告で失敗した。`packages/docs-lint/src/deliverable-type.cjs` で `.specdojo/index-config.yaml` の `locales` を読み、論理 ID を一意に解決した後、参照元と同じ言語の variant を優先するようにした。無ければ宣言順で最初に存在する言語を使い、言語中立の参照元もその順に従う。現設定では日本語が既定となる。
- 同一言語内の重複、言語中立 ID と言語別 ID の衝突、未修飾 ID の名前空間をまたぐ曖昧さは検出を維持する。`locales` 未宣言時の動作と、ローカルの同一 ID を同梱文書より優先する規則も維持する。日本語文書は日本語の rulebook を選ぶため、英語 variant の追加を理由とする曖昧さの警告を出さない。
- [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] に照合規則を追記し、日英の型照合、既定言語へのフォールバック、テンプレート、YAML、重複、同梱 rulebook の回帰テストを追加した。lint とテストの実行結果は親 runner が記録する。

### 5.5. 検証

- Prettier で変更した Markdown・YAML・CJS・TypeScript を整形した。`git diff --check` にエラーはない。型照合モジュールの `node --check` も成功した。
- 英語34文書について、日本語正本と同じ ID・メタ情報（翻訳状態と `translated_from` を除く）、正本の最終更新commit、雛形の置換トークン、生成ビューのslotを照合した。実リンク66件の参照先が存在し、英訳済みへの14件と日本語へフォールバックする52件を確認した。サンプル・テンプレート内の記入欄と未決の例示は翻訳対象として維持した。
- `npm run validate:schema:file` で共通 frontmatter schema を JSON Schema 2020-12 のメタスキーマに照らして検証した。メタスキーマ自体の直接指定は Ajv の登録済みIDと衝突するため、同メタスキーマへの参照だけを持つ一時ラッパーを用いて通した。
- `npm run validate:history-links` と `node --import tsx src/specdojo.ts register build --project prj-0001` は成功した。`node --import tsx tools/catalog-validate-if-configured.mjs` も終了コード0で、既存の未作成文書や再exportへの参照などの警告がある。
- 上記の照合と検査は今回の再開後にも実行した。クイックスタートの MD028 は2つの隣接引用を1つにまとめて修正した。
- lint・型検査・テストと全体のschema検証は親runnerの検証に委ね、executorでは重複実行していない。`npm run docs:build` は5.3の理由でホスト側の確認が必要である。

## 6. 関連ドキュメント

- [[prj-0001:pjr-bhjm-english-edition-scope|PJR-BHJM]]: 英語版の版と最初の範囲の決定（案 A）。
- [[prj-0001:pjr-bxym-civic-tech-starter-kata|PJR-BXYM]]: 入門の型の組（英語版の前提）。
- [[prj-0001:pjr-82h2-readme-english-overview|PJR-82H2]]: README の英語の概要。
- [[specdojo:id-and-file-naming-standard|ID・ファイル命名標準]]: 言語スコープと `translated_from` の規則。
- [[specdojo:quick-start-guide|Quick Start ガイド]]: 英語版の正本。
