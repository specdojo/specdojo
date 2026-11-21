---
specdojo:
  id: prj-0002:pjr-9tsg-lp-changelog-release-2026-11-02
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: easy
  owner: BA
  registered_at: "2026-11-02T11:05:22Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-02T11:21:25Z"
  conclusion: "specdojo-lp の CHANGELOG に 2026-11-02 の公開済み8項目を記録し、次の Unreleased を残した。PR #1 のマージ・本番表示、LP の文書検査と親検証8種を確認した。"
  derived_from:
    - PJR-RWQV
---

# PJR-9TSG specdojo-lp の公開済み変更を CHANGELOG の 2026-11-02 節へ移す

## 1. 概要

PR #1 の本番公開を確認できたため、LP の CHANGELOG.md の公開済み項目を 2026-11-02 の節へ移し、次の Unreleased を残す。

## 2. 入力

- PR #1 は 2026-11-02 に main へマージされ、マージコミットは 5c5f91ffcf5e012a96cfccda8d7295b31ade8f6a。Workers Builds は成功した。
- 本番の SpecDojo（<https://specdojo.org/>）は HTTP 200 を返し、Kata・Waza・Ryu と小文字の `routine + job` が表示されることを確認した。
- README の運用に従い、実際の公開日 2026-11-02 で公開済み項目を記録する。

## 3. 完了条件

- `specdojo-lp/CHANGELOG.md` の既存の `Unreleased` にある公開済み項目を、内容と分類を保って `## 2026-11-02` の節へ移す。公開済みの範囲は PR #1 のマージコミットと本番ページの反映に照らして確認し、未公開の項目が見つかれば `Unreleased` に残す。
- 次の変更を記録できる `## Unreleased` の節を日付付きの節より上に残す。公開日には確認済みの 2026-11-02 を使い、SpecDojo 本体や `package.json` の版と結び付けない。
- 変更対象は LP の `CHANGELOG.md` と本個票の対応結果に限定する。画面、設定、依存関係、README の公開ルールは変更しない。`main` への統合、公開、`git push`、PR 作成は行わない。
- LP の Markdown lint と変更した Markdown の Prettier 確認が成功する。runner に設定された親検証を通し、公開範囲の根拠、変更内容、検証結果、残課題を本個票の対応結果に残す。pipeline の申し送りが必要なら `handoff` にも記録する。

## 4. 作業内容

| No  | 作業                                              | 担当 | 状態 | メモ                                                                         |
| --- | ------------------------------------------------- | ---- | ---- | ---------------------------------------------------------------------------- |
| 1   | PR の公開範囲と既存の変更履歴を照合する           | BA   | done | 入力の公開確認とローカル履歴・実差分を照合。直接の再照合の制約は 5.2. に記録 |
| 2   | 公開済み項目を日付付きの節へ移し、次の節を残す    | BA   | done | 8 項目と 3 分類を保持し、空の Unreleased を上に残した                        |
| 3   | LP の文書検査と親検証を確認し、対応結果を記録する | BA   | done | executor の検査は成功。後続の親検証は runner に申し送り                      |

## 5. 対応結果

### 5.1. 実施内容・変更ファイル

- `specdojo-lp:CHANGELOG.md` の `Unreleased` の直下に `## 2026-11-02` を設け、既存の全 8 項目を「追加」「変更」「開発環境・運用」の 3 分類と本文を保ったまま移した。次の変更用に空の `## Unreleased` を日付付きの節より上に残した。公開日は本個票の入力にある実際の公開日を使い、SpecDojo 本体や `package.json` の版とは結び付けていない。
- 本個票の作業内容・対応結果を更新した。編集対象は LP の CHANGELOG と本個票のみであり、画面・設定・依存関係・README の公開ルール・登録簿の一覧・個票のステータス項目は変更していない。result の記入と親検証は後続の reporter / runner が担当する。

### 5.2. 公開範囲の根拠と確認上の制約

- 共通規約、LP の README 第 7 節、技術スタック定義、および [[prj-0002:pjr-rwqv-lp-changelog|変更履歴の作成と公開時の更新ルール]] を確認した。公開済みと判断する前提は、本個票の入力にある PR #1 の 2026-11-02 の main へのマージ（`5c5f91ffcf5e012a96cfccda8d7295b31ade8f6a`）、Workers Builds 成功、本番 HTTP 200 と Kata・Waza・Ryu・小文字の `routine + job` の表示確認である。これらは入力の確認済み事実として採用し、executor が再確認した事実とは区別する。
- 作業開始時の LP の HEAD・`develop`・`origin/develop` は `73455100bf0e56b23b24404438b878106cb5cee8`、ローカルの `main`・`origin/main` は公開前の `6873c8785234e3b836adf382e4b4e0987900ab47` だった。`git log main..HEAD` と `git diff main..HEAD` で 24 コミット・13 ファイルを確認し、8 項目の記載と実差分を照合した。古いローカルの main を現在の本番状態とは扱っていない。
- register と plan モードの比較は `RegisterTypes.astro`・`ToolFit.astro`、8 種類と `depends_on` は `RegisterTypes.astro`・`NextSteps.astro`、初期設定・CLI 例・起動 script・日本語の会話例は `GetStarted.astro` の差分と一致した。Kata・Waza・Ryu の紹介と `routine + job` は `Roadmap.astro`、docs-lint 導入は `package.json` と lint 設定、ブランチ運用と履歴更新ルールは README・CHANGELOG の差分と一致した。「準備中」は公開済みの説明文の内容として保持した。
- _ASSUMPTION_: 入力で確認済みの PR #1 の公開は、上記のローカル develop に含まれる既存 8 項目を対象とする。照合したローカル履歴に未公開として分離する項目は見つからなかったため、全項目を日付付きの節へ移した。ただし指定マージコミットはローカルに存在せず、GitHub と本番サイトへの Web 取得は失敗し、sandbox の直接通信も名前解決に失敗したため、マージコミットの tree と本番ページの直接の再照合はできていない。ホスト環境で PR #1 の包含範囲と本番反映を再照合し、公開対象外が見つかった場合は該当項目を `Unreleased` に戻すことを申し送る。Git の参照や設定は変更していない。

### 5.3. 検証結果

- project と LP の `package.json`、project の `.specdojo/specdojo.config.json`・`lefthook.yml`、両リポジトリの整形・Markdown lint 設定を確認して検査を選定した。LP に独自の AGENTS・SpecDojo 設定・hook 設定はなかった。
- LP で `npx --no-install prettier --write CHANGELOG.md` と `npx --no-install prettier --check CHANGELOG.md` が成功した。project から実行した `npm --prefix ../specdojo-lp run lint:md` も成功した。LP 全体の Markdown lint は、project を対象とする親検証とは別の完了条件として実施した。
- 変更前の HEAD と変更後の CHANGELOG を比較し、変更が日付見出しと空行の追加だけであること、8 項目と 3 分類が保持されること、空の `Unreleased` が日付付きの節より上にあることを確認した。
- 個票の Prettier 整形・確認、両リポジトリの `git diff --check`、および `node --import tsx src/specdojo.ts register build --project prj-0002` で個票とイベントの整合性を検査した。生成ビューは Git 管理対象外であり、登録簿の正本の一覧は編集していない。
- prj-0002 は `catalog_path` が未設定のためカタログ検証は適用外。YAML ファイルは変更していないため個別 schema 検証も適用外。親検証 8 種は executor で重複実行せず、後続 runner の結果を正とする。本記録時点では親検証の成功を主張しない。

### 5.4. 残課題・申し送り

- executor の編集と文書検査は完了した。後続 runner は設定済みの親検証 8 種（lint-ts・lint-fm・lint-md・lint-mermaid・test-integration・validate-schema・typecheck・test-unit）を実行し、reporter は実施内容・変更ファイル・検証結果・公開範囲の根拠と制約・本節の申し送りを result に反映する。
- ホスト環境で PR #1 のマージコミットと本番ページを直接再照合する確認を `requires_human` として申し送る。入力の公開確認を前提に編集済みであり、公開対象外が見つかった場合はその項目を `Unreleased` に戻す。

### 5.5. 統合後の確認（specdojo-orchestrator、2026-11-02）

- PR #1 は `MERGED` で、2026-11-02T11:01:18Z にマージされた。GitHub の `main` はマージコミット `5c5f91ffcf5e012a96cfccda8d7295b31ade8f6a` を指す。マージコミットの tree と PR head `73455100bf0e56b23b24404438b878106cb5cee8` の tree は、ともに `f34dfa2922f544b5fd22b4f107c8d5b8d16ebc9e` だった。Workers Builds の check も成功した。
- 公開ページは HTTP 200 を返し、「型（Kata）」「技（Waza）」「流（Ryu）」と小文字の `routine + job` を含み、大文字の `routine + Job` を含まないことを確認した。executor の通信制約による申し送りをホストで確認した。
- LP の `develop` の `9b231e4` では `CHANGELOG.md` に日付見出しと空行を追加しただけで、既存の 8 項目と 3 分類を保持した。`Unreleased` は日付付きの節より上にある。LP の他のファイルは変更されていない。project の実行記録は `project/prj-0002/develop` の `5ed433d87` に統合された。
- executor の LP Markdown lint・Prettier 確認と、runner の親検証 8 種（lint-ts・lint-fm・lint-md・lint-mermaid・test-integration・validate-schema・typecheck・test-unit）の成功を個票・result・実際の差分に照らして確認した。公開範囲に残る未確認事項はない。

## 6. 関連ドキュメント

- [[prj-0002:pjr-rwqv-lp-changelog]]: 変更履歴の作成と本番公開時の更新ルール。
- `specdojo-lp:README.md`: LP の公開・変更履歴の運用。
- `specdojo-lp:CHANGELOG.md`: 公開日を記録する対象。
