---
specdojo:
  id: prj-0002:pjr-rwqv-lp-changelog
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  owner: BA
  registered_at: "2026-11-02T06:36:50Z"
  due_on: "2026-11-30"
---

# PJR-RWQV specdojo-lp に CHANGELOG.md と更新ルールを整える

## 1. 概要

LP 独自の CHANGELOG.md を作成し、確認できる直近の変更を Unreleased に記載する。develop への統合時に追記し、本番公開時に公開日付きの節へ移す運用を README に記載する。

## 2. 入力

- 利用者は specdojo-lp の develop を push 済みと述べ、CHANGELOG.md の作成を希望した。提案した todo の起票と実行を依頼し、担当 BA、期限 2026年11月末を指定した。
- 合意した方針：develop に統合した変更は Unreleased に記載し、main から本番公開する際に公開日付きの節へ移す。SpecDojo 本体の変更履歴とは分け、当面は日付で管理する。過去の変更をすべて復元せず、確認できる直近の変更から始める。
- README の運用では main が本番公開状態、develop はプレビューの統合先。develop への push を本番公開として記録しない。Git の main..develop と実際の差分を確認し、公開日を推測せず、公開済みの変更を未公開と誤記しない。

## 3. 完了条件

- `specdojo-lp` のルートに `CHANGELOG.md` があり、日本語で LP 独自の変更要点を記録している。`Unreleased` の節を用意し、必要な分類（追加・変更・修正・開発環境など）に分ける。空の分類を機械的に並べない。
- `main..develop` の履歴と実際の差分から確認できる直近の未公開変更を `Unreleased` にまとめ、単なる commit の羅列にしない。対象範囲と確認した根拠を個票の対応結果に残す。過去の全履歴の復元や SpecDojo 本体の変更履歴の転記は行わず、公開日・公開済みの版を推測して作らない。
- `README.md` から `CHANGELOG.md` へ相対リンクで案内し、次の運用を記載する。
  - `develop` への統合時に変更要点を `Unreleased` へ追記する。
  - `main` から本番公開する際に、人が公開日を確認して `YYYY-MM-DD` の節へ移し、次の `Unreleased` を残す。
  - プレビューへの反映と本番公開を区別し、当面は LP 独自の日付で管理する。SpecDojo 本体の版や `package.json` の版とは同期させない。
- 変更は `specdojo-lp` の `CHANGELOG.md`・`README.md` と本個票の対応結果に限定する。設定・依存関係・画面・既存の公開済み履歴は変更しない。`main` への統合・公開・`git push`・PR 作成は行わない。
- `specdojo-lp` で `npm run lint:md` と、変更した Markdown 2件を対象にした Prettier の整形確認が成功する。runner に設定された親検証も成功し、実施内容・検証結果・残課題を個票の対応結果に記録し、pipeline の `handoff` にも必要な申し送りを残す。

## 4. 作業内容

| No  | 作業                                                   | 担当 | 状態 | メモ                                                      |
| --- | ------------------------------------------------------ | ---- | ---- | --------------------------------------------------------- |
| 1   | LP の README と Git 履歴・差分を確認し、記載対象を選ぶ | BA   | done | `main..develop` の履歴と実差分を照合した                  |
| 2   | CHANGELOG.md と README の案内・更新ルールを整える      | BA   | done | LP 独自の変更要点と公開日での運用を記載した               |
| 3   | Markdown の検査と親検証を通し、対応結果を残す          | BA   | done | executor の検査・記録は完了。親検証は後続 runner に委ねる |

## 5. 対応結果

### 5.1. 実施内容

- `specdojo-lp:CHANGELOG.md` を新規作成し、日本語の `Unreleased` を「追加」「変更」「開発環境・運用」に分けた。commit の羅列を避け、確認できる直近の LP の変更要点を記録した。空の分類や、公開日を推測した公開済みの節は作っていない。
- `specdojo-lp:README.md` に変更履歴への相対リンクと更新ルールを追加した。`develop` 統合時の追記、履歴と実差分の確認、人が本番公開の完了・公開日を確認して `YYYY-MM-DD` の節へ移す手順、次の `Unreleased` と未公開項目の保持を記載した。プレビューと本番公開を区別し、LP 独自の日付で管理して本体や `package.json` の版とは同期させないことも明記した。
- 変更対象は上記2件と本個票の作業内容・対応結果のみ。設定・依存関係・画面・既存の公開済み履歴は変更していない。登録簿の一覧・個票のステータス項目・result は編集せず、commit・Git 設定変更・`main` への統合・公開・push・PR 作成は行っていない。

### 5.2. 記載範囲と根拠

- 変更前に共通規約、LP の README と技術スタック定義、および [[prj-0002:pjr-8v7t-product-repo-develop-branch|プロダクトのブランチ運用]] と [[prj-0002:pjr-mr7s-lp-roadmap-kata-waza-ryu|直近の LP 説明追加と表記統一]] を確認した。README の運用に従い、`main` を公開済みの基準とした。
- 確認時の LP の `main` と `origin/main` はともに `6873c8785234e3b836adf382e4b4e0987900ab47`、`develop` と `origin/develop` および作業開始時の HEAD はともに `5a9f5321b1a1ad2535bd7a5f618fc5155823bbd6` だった。`git merge-base main develop` は `main` と一致した。ローカルにある参照で比較しており、リモートへの fetch や本番環境の調査は行っていない。
- `git log --oneline main..develop` の22コミットと `git diff --stat main..develop`・`git diff --name-only main..develop` の12ファイルを確認し、README・技術スタック定義・`package.json`・lint 設定・5つのセクションコンポーネントの実差分を照合した。対象はこのブランチ間の差分と今回追加した履歴・更新ルールであり、`main` 以前の全履歴や SpecDojo 本体の変更履歴は転記していない。
- `RegisterTypes.astro` と `ToolFit.astro` の差分から plan モードとの比較説明を、`RegisterTypes.astro` と `NextSteps.astro` から epic を含む8種類と `depends_on` の説明を記載した。
- `GetStarted.astro` の差分から Dev Container の推奨 preset、Git hook・markdownlint 設定、任意の docs-lint・docs-site、CLI の `--topic`・`--depends-on`、起動 script 名、および日本語の会話例への更新をまとめた。
- `Roadmap.astro` の差分から型（Kata）・技（Waza）・流（Ryu）の役割と PDCA との関係の紹介、および `routine + job` への表記統一を記載した。三つを組み合わせた仕組みの提供状況は「準備中」と記録した。
- `package.json` と lint 設定の差分から文書 lint の導入を、README と技術スタック定義の差分から `develop`・`main` の運用とトピックのブランチ名の変更を記載した。merge や同一作業の複数コミットを重複して列挙していない。公開日は Git の commit 日から推測していない。

### 5.3. 検証結果

- project と LP の `package.json`、project の `.specdojo/specdojo.config.json`・`lefthook.yml` と両リポジトリの整形・Markdown lint 設定を確認して検査を選定した。LP には独自の AGENTS・SpecDojo 設定・hook 設定はなかった。
- LP で `npx --no-install prettier --write CHANGELOG.md README.md` と `npx --no-install prettier --check CHANGELOG.md README.md` が成功した。
- project から `npm --prefix ../specdojo-lp run lint:md` を実行し、LP 全体の Markdown lint が成功した。これは project リポジトリを対象とする親検証とは別の、LP の完了条件の検査である。
- 個票に対する `npx --no-install prettier --write docs/ja/projects/prj-0002/controls/project-register/pjr-rwqv-lp-changelog.md` と同じパスの `--check` が成功した。project と LP の `git diff --check` も成功した。
- `node --import tsx src/specdojo.ts register build --project prj-0002` が成功し、個票とイベントの整合性検証および生成ビューの再生成が完了した。生成先は Git 管理対象外であり、登録簿の正本の一覧は編集していない。
- prj-0002 は `catalog_path` が未設定のためカタログ検証は適用外。YAML ファイルは変更していないため個別 schema 検証も適用外。project の lint・型検査・テスト・schema の親検証8種は executor では重複実行せず、後続 runner の結果を正とする。

### 5.4. 申し送り

- executor の編集と LP の検査は完了した。後続 runner は設定済みの親検証8種を実行し、reporter は実施内容・変更ファイル・検証結果と本節の申し送りを result に反映する。親検証は executor 終了後に実行されるため、この記録時点では成功を主張しない。
- 今回の変更で `main` への取り込みや本番公開は行っていない。次回の本番公開時に、人が公開完了と実際の公開日を確認し、公開した項目だけを日付付きの節へ移す。

### 5.5. 統合後の確認（specdojo-orchestrator、2026-11-02）

- LP の `develop` の `73455100bf0e` で `CHANGELOG.md` の新規作成と `README.md` の追記を確認した。未公開の変更は `Unreleased` に分類して記載され、公開日付きの節は作られていない。
- README には変更履歴への相対リンクと、統合時・本番公開時の更新手順がある。変更された LP のファイルはこの2件のみだった。
- LP の Markdown lint と変更した2ファイルの Prettier 確認は成功した。runner の親検証 8 種（lint-ts・lint-fm・lint-md・lint-mermaid・test-integration・validate-schema・typecheck・test-unit）もすべて成功した。
- プロジェクトの実行記録は `project/prj-0002/develop` の `96a2cc0f8` に統合された。完了条件を個票・result・実際の差分に照らして確認し、状態は close 判断まで `review` とする。

## 6. 関連ドキュメント

- `specdojo-lp:README.md`: develop と main、および本番公開の運用。
- [[prj-0002:pjr-8v7t-product-repo-develop-branch]]: プロダクトリポジトリのブランチ運用。
- [[prj-0002:pjr-mr7s-lp-roadmap-kata-waza-ryu]]: 直近の LP 説明追加と表記統一。
