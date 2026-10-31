---
specdojo:
  id: prj-0002:pjr-7mb3-lp-reflect-v0-6-0
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-10-31T09:38:30Z"
  due_on: "2026-11-30"
  derived_from:
    - prj-0001:PJR-2FV2
---

# PJR-7MB3 specdojo-lp に v0.6.0 の変更を反映する

## 1. 概要

prj-0001 の `CHANGELOG.md` の 0.6.0 の節を LP の文言とコマンド例に照らし、利用者に見える変更を反映するか、載せない理由を対応結果に書く。

## 2. 入力

- specdojo 0.6.0 と @specdojo/docs-lint 0.4.0 を 2026-10-31 に公開した（prj-0001:PJR-2FV2）。v0.5.0 までの反映は PJR-HDTZ で済んでいる
- LP の読み手に関わりそうな 0.6.0 の変更は、文脈を渡して成果物を作る流れ（draft approach・`_CONTEXT_`・--input・brief）、deliverable scaffold --target、プロダクトのリポジトリの git の運用への対応（`branch_template`・`commit_subject_template`・`merge_message_template`・`integration_strategy` ff・`commit_type` と `commit_scope`）。親の検証の lint-mermaid は SpecDojo 自身の開発用

## 3. 完了条件

- LP の画面の文言とコマンド例を、prj-0001 の `CHANGELOG.md` の `0.6.0` の節の利用者に見える変更と照合し、食い違いは LP 側を直すか、直さない理由を対応結果に書く。少なくとも次を判断し、判断と理由を対応結果に書く。
  - 文脈を渡して成果物を作る流れ（`deliverable scaffold --target` で雛形を作り、`_CONTEXT_:`・個票の `入力`（`--input`）・カタログの `brief` で前提を渡し、`draft` で下書きし `fully-guided` で磨く）を載せるか。載せる場合は、技術スタックなどの前提を渡して書かせる使い方として説明する。
  - プロダクトのリポジトリの git の運用（git-flow・GitHub flow に合わせた作業ブランチの名前、commit と merge commit の書式、`ff` の統合、個票の `commit_type` / `commit_scope`）への対応を載せるか。
  - `fully-guided` を磨き込み専用とした変更で、LP の既存の説明と食い違う箇所がないか。
- 親の検証の `lint-mermaid` は SpecDojo 自身の開発用のため載せない。
- 説明とコマンド例は、prj-0001 の現行のガイド（`exec-operation-guide`・`ryu-guide`・`specdojo-config-reference`・`command-reference`）と矛盾しない。
- 画面に表示する文言を変えた場合を除き、出力される HTML を変えない。
- 変更は `specdojo-lp` の `develop` へ統合する（prj-0002 の `integration_branch`）。
- `specdojo-lp` で `npm run build` が成功する。agent の sandbox では npm を実行できないため、executor は evidence の `validations` でこの検証を `requires_human` と記録し、ビルドは orchestrator が sandbox の外で確認する。
- prj-0002 は `catalog_path` を設定していないため、`specdojo catalog validate` は実行しない（evidence にも記録しない）。
- `specdojo-lp` には Prettier などの整形・lint の道具がないため、`specdojo-lp` のファイルに対して `prettier` などを実行しない（evidence にも記録しない）。

## 4. 作業内容

| No  | 作業                          | 担当         | 状態 | メモ                                                 |
| --- | ----------------------------- | ------------ | ---- | ---------------------------------------------------- |
| 1   | 食い違いを洗い出し、LP を直す | BA           | done | v0.6.0 の変更点と照合し、LP への変更不要と判断       |
| 2   | ビルドを確認する              | orchestrator | done | 統合後の develop で `npm run build` の成功を確認した |

## 5. 対応結果

### 5.1. 実施内容

- prj-0001 の `CHANGELOG.md` の `0.6.0` の節を `specdojo-lp` の画面表示文言（`src/` 配下のコンポーネント）、コマンド例、および `README.md` と照合した。
- 照合の基準として、現行のガイド（[[specdojo:exec-operation-guide|exec運用ガイド]]、[[specdojo:ryu-guide|流ガイド]]、[[specdojo:specdojo-config-reference|設定リファレンス]]、[[specdojo:command-reference|CLIコマンドリファレンス]]、[[specdojo:branch-workflow-guide|ブランチ運用ガイド]]）を参照した。
- 完了条件で求められた判断点（文脈を渡して成果物を作る流れ、プロダクトの Git 運用への対応、`fully-guided` の磨き込み専用化、親の検証 `lint-mermaid`）およびその他の変更について判断を行い、LP 側には変更を加えないこと（変更不要）と判断した。理由は後述の節に記録した。

### 5.2. 照合結果と判断

| 変更点・確認対象                                                                                                                                                                                  | 判断と理由                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 文脈を渡して成果物を作る流れ（`deliverable scaffold --target` で雛形を作り、`_CONTEXT_:`・個票の `入力`（`--input`）・カタログの `brief` で前提を渡し、`draft` で下書きし `fully-guided` で磨く） | **LP には載せない**。LP の導入（「5 つの手順で始めて、4 つの手順で回す」）は、既存の Web アプリ（`landing-page`）に `todo` で FAQ の節（コード）を追加する最小限の Quick Start に焦点を絞っている。ゼロから段階的に成果物を作成・磨き込むプロセスは設計成果物（仕様・TSD 等）向けの発展的な手順であり、LP の「これから」節（`Roadmap.astro`）の `schedule` および使い分け節（`ToolFit.astro`）の「型と品質評価」が「準備中」となっている方針（[[prj-0002:pjr-7t8x-lp-roadmap-pdca-matrix\|LP の PDCA マトリクス]] の「CLI に機能が存在することを、LP での提供範囲拡大の承認とは扱わない」）と整合させる。個票の `入力`（`--input`）も FAQ のような単一タスクの完了条件の提示には不要で認知負荷を高めるため割愛し、技術スタック選定等の文脈を渡す詳細手順は「次の一歩」に掲げたドキュメントサイト（全体概要ガイド・CLI コマンドリファレンス）へ委ねる。 |
| プロダクトリポジトリの Git 運用への対応（`repos[].branch_template`・`commit_subject_template`・`merge_message_template`・`integration_strategy: ff`・個票の `commit_type` / `commit_scope`）      | **LP には載せない**。これらは git-flow / GitHub flow や Conventional Commits などチーム固有の規約に合わせるための任意の拡張設定である。未設定時の作業ブランチ名（`exec/<project-id>-<item-id>`）、commit/merge 書式（`exec(register <item-id>): <title>`）、統合方式（`merge`）、および `Refs:` 行の付与は従来どおり動作し、LP の `GetStarted.astro`（最小構成の `repos` やコミット例）や `README.md` の運用説明と完全に一致する。初期体験のシンプルさを保つため基本例には追加せず、規約設定の詳細は設定リファレンスやブランチ運用ガイドへ委ねる。                                                                                                                                                                                                                                                                                                     |
| `fully-guided` を磨き込み専用とした変更と LP の既存説明の照合                                                                                                                                     | **食い違いなし、変更不要**。LP の全コンポーネント（`src/` 配下）および `README.md` において、`fully-guided`、`draft`、あるいは approach 自体への言及は一切存在しない（PJR-HDTZ でも approach を指定しない基本実行のみを案内している）。そのため、磨き込み専用化による記述の食い違いは発生しない。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 親の検証の `lint-mermaid`（`npm run lint:mermaid`）                                                                                                                                               | **LP には載せない**。完了条件のとおり、SpecDojo 自身のリポジトリ開発用（内部ツール・開発検証）であり、利用者がプロダクト開発で直接扱う機能ではないため。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `@specdojo/docs-lint` 0.4.0（`_CONTEXT_:` の検出、内部キャッシュ、options なし読み込みの修正）                                                                                                    | **変更不要**。LP の `init` 手順で任意コマンドとして掲載している `npx specdojo-docs-lint yaml-schema --modeline` はそのまま動作し、表示文言・コマンド例の修正は不要。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 不具合修正群（tmux サンプルのコンテナ検索、`入力` 節の章番号連続性、rulebook 雛形の `type` 解決など）                                                                                             | **変更不要**。LP の説明やチュートリアルを無効化する変更はなく、内部処理や個別修正の詳細は LP に掲載せず、CHANGELOG を正本とする。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

### 5.3. 成果物・変更ファイル

| ファイル                                                                                      | 内容                                                                                                                                                                |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 本個票（`docs/ja/projects/prj-0002/controls/project-register/pjr-7mb3-lp-reflect-v0-6-0.md`） | 作業内容・照合結果と判断・成果物・検証と申し送りを記録                                                                                                              |
| `specdojo-lp`（`specdojo-lp/` 配下）                                                          | 照合の結果、0.6.0 の変更はすべて LP の提供範囲外（準備中 / 任意拡張）または既定動作と一致しており、表示文言・コマンド例を変更する必要がないと判断したため、変更なし |

### 5.4. 検証と申し送り

- LP の全コンポーネント（`src/` 配下）および `README.md` を 0.6.0 CHANGELOG と現行ガイド（`exec-operation-guide`・`ryu-guide`・`specdojo-config-reference`・`command-reference`）と照合し、食い違いや無効なコマンド例がないことを確認した。
- 本個票内の表の区切り `|` をエスケープし、Markdown の表構造と列数が正しく維持されていることを確認した。
- `specdojo-lp` の `npm run build` は、executor が evidence の `validations` に `requires_human` として記録した。orchestrator が統合後の `develop`（`2270810`）で sandbox の外から実行し、1 ページの生成がエラーなく完了することを確かめた（2026-11-01）。LP のファイルは変えていないため、出力される HTML は変わらない。
- LP に対しては完了条件どおり Prettier や lint を実行していない。
- prj-0002 は `catalog_path` を設定していないため、`specdojo catalog validate` は実行していない。
- 本個票を Prettier で整形し、`node --import tsx src/specdojo.ts register build --project prj-0002` がエラーなく成功することを確認した。
- `git diff --check` および `git -C ../specdojo-lp diff --check` で差分に空白エラーがないことを確認した。
- executor は result を直接編集せず、上記判断と検証結果を本個票に記録するとともに、executor evidence の `handoff` にも記載する。

## 6. 関連ドキュメント

- [[prj-0002:pjr-hdtz-lp-v0-5-0-update]]
