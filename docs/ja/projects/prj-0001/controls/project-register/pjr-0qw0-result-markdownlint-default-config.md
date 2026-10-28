---
specdojo:
  id: prj-0001:pjr-0qw0-result-markdownlint-default-config
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: high
  difficulty: medium
  registered_at: "2026-10-28T22:11:04Z"
  derived_from:
    - PJR-FMJ5
---

# PJR-0QW0 markdownlint の設定がない利用リポジトリで result の commit 前検査が MD013 で統合を止める

## 1. 概要

docs-lint を入れた利用リポジトリでは markdownlint の既定設定（MD013）が効き、日本語の result が必ず統合前に止まる。設定がなくても SpecDojo の規則で検査し、init が設定を作るようにする

## 2. 完了条件

- markdownlint の設定ファイルが無い利用リポジトリでも、`exec run --register` の result の commit 前検査（`assertResultMarkdownlint`）が、SpecDojo が result に求める規則で検査し、日本語の長い行（MD013）では止まらない。利用リポジトリに markdownlint の設定がある場合は、従来どおりそれを優先する。
- `init` と `config init` が、既存のファイルを上書きせずに、SpecDojo の文書規約に合う最小の `.markdownlint.yaml` を作る。既にある場合は変更しない。配布する pre-commit hook の markdownlint も、この設定で SpecDojo の生成物（個票・result など）を止めない。
- 設定の内容（無効にする規則の範囲、設定が無いときの既定の置き場所）は executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。
- 関連するガイド・リファレンス（quick-start・設定リファレンスなど該当するもの）に、作られる設定と既存の利用リポジトリでの対処を書く。
- `CHANGELOG.md` の未公開の `## [0.5.0]` の節の `不具合修正` に追記する。公開済みの版の節は変えない。
- 単体テストで、設定が無いときに MD013 違反だけの result が通ること、設定があるときはそれを優先すること、`init` が設定を作り既存を上書きしないことを確かめる。
- 作業の中で `npm run typecheck`・`npm run lint:ts`・`npm run lint:md`・`npm run test:unit` が通り、親の検証 7 件が通る。

## 3. 作業内容

| No  | 作業                                         | 担当     | 状態 | メモ                                                         |
| --- | -------------------------------------------- | -------- | ---- | ------------------------------------------------------------ |
| 1   | 設定が無いときの result 検査の規則を実装する | executor | done | 利用側の設定を優先し、不在時だけ基本規則を引数で指定         |
| 2   | `init` / `config init` で設定を作る          | executor | done | 通常の初期化で `.markdownlint.yaml` を生成し、既存設定を保持 |
| 3   | ガイド・CHANGELOG・テストを更新する          | executor | done | 生成設定、既存環境の対処、回帰テストを追加                   |

## 4. 対応結果

- `assertResultMarkdownlint` は、利用リポジトリの `.markdownlint.jsonc`・`.json`・`.yaml`・`.yml` と、親ディレクトリを含む `.markdownlintrc` の存在を確認し、存在するときは従来の CLI の読み込みに委ねる。不在時だけ `--disable` で基本規則を指定するため、利用側で明示した MD013 は引き続き検出する。
- 基本規則の正本は `src/shared/markdownlint-config.ts` の `DEFAULT_MARKDOWNLINT_CONFIG` にまとめた。result のフォールバックと、初期化・hook・Slidev の scaffold が同じ値を使う。MD013（日本語を含む長い行）、MD024（同名見出し）、MD033（HTML）、MD036（強調だけの行）、MD041（先頭の H1）、MD060（表の列幅）を無効にする。既存 scaffold と本体の文書規約に合わせ、これ以外の記法検査は維持するためである。フォールバックは引数だけで適用し、利用リポジトリに一時設定ファイルを作らない。
- 通常の `init` と `config init` は、不足する設定をリポジトリ直下の `.markdownlint.yaml` に生成する。SpecDojo の設定ファイルが既にある場合の `config init` でも補完し、dry-run では書き込まない。既存の markdownlint / CLI2 設定と、継承する `.markdownlintrc` は保持し、競合する設定を追加しない。`init --lefthook` / `--slidev` は既存の CLI2 対応を維持するため、従来の `.markdownlintrc` と `.markdownlint-cli2.yaml` の配置を使う。後から hook を追加した場合も生成済みの YAML は保持する。CLI2 overrides を使う際は、既存の移行手順で YAML の規則を rc へ移す。
- [[specdojo:quick-start-guide|Quick Startガイド]]、[[specdojo:command-reference|CLIコマンドリファレンス]]、[[specdojo:specdojo-config-reference|SpecDojo設定リファレンス]] に生成内容と既存利用リポジトリの対処を記載し、`CHANGELOG.md` の `0.5.0` の不具合修正へ追記した。
- 単体テストに、設定なしの日本語の長い result、5形式の既存設定の優先、親の rc の継承、初期化の生成・既存保持・dry-run・不足補完、初期化済み YAML を使う配布 hook の検査を追加した。API smoke は MD013 の再現と基本規則での通過、MD018 の検出維持、初期化の生成・保持・不足補完を確認済み。CLI の子プロセス起動は sandbox の EPERM 制約があるため、実経路の回帰テストと完了条件の検査7件は親 runner の検証へ委ねる。executor は result を編集せず、この判断と検証の申し送りを `handoff` にも記録する。
- CLI を直接起動する smoke でも、設定のない作業用ディレクトリで同じ `--disable` 引数による長い日本語行の通過、5形式の設定による MD013 の検出、MD018 の検出維持を確認した。Prettier 整形、hook 指定のカタログ検証、登録簿の派生ビュー生成、差分の空白検査も成功した。カタログ検証には、今回変更していない未作成文書の既存警告がある。

## 5. 関連ドキュメント

- [[prj-0001:pjr-fmj5-release-v0-5-0]]
- [[prj-0001:pjr-19hx-result-prettier-emphasis-mangling]]
