---
specdojo:
  id: prj-0002:pjr-hdtz-lp-v0-5-0-update
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  owner: BA
  registered_at: "2026-10-29T10:37:31Z"
  due_on: "2026-10-31"
  block_reason: "parent validation failed: lint-fm"
---

# PJR-HDTZ specdojo-lp に v0.5.0 までの変更を反映する

## 1. 概要

register の epic を含む 8 種類と `depends_on`、init の markdownlint 設定生成など、v0.5.0 までの利用者に見える変更を LP の文言・コマンド例に反映する

## 2. 完了条件

- LP の画面の文言とコマンド例を、prj-0001 の `CHANGELOG.md` の `0.5.0` までの利用者に見える変更と照合し、食い違いは LP 側を直すか、直さない理由を対応結果に書く。少なくとも次を確認する。
  - register の種類を、`epic` を含む 8 つにする（`src/components/sections/RegisterTypes.astro`・`NextSteps.astro` の「7 つ」の記述）。`epic` は track ごとの仕事をまとめ、それ自体は実行しないことが分かる説明にする。
  - 順番のある todo を `depends_on` でつなげることを載せるかを判断し、判断と理由を対応結果に書く。
  - 導入手順（`init` が `.markdownlint.yaml` を生成すること、docs-lint・docs-site を任意で入れる手順）が、現行のガイドと矛盾しない。
- 画面に表示する文言を変えた場合を除き、出力される HTML を変えない。
- 変更は `specdojo-lp` の `develop` へ統合する（prj-0002 の `integration_branch`）。
- `specdojo-lp` で `npm run build` が成功する。agent の sandbox では npm を実行できないため、executor は evidence の `validations` でこの検証を `requires_human` と記録し、ビルドは orchestrator が sandbox の外で確認する。
- prj-0002 は `catalog_path` を設定していないため、`specdojo catalog validate` は実行しない（evidence にも記録しない）。
- `specdojo-lp` には Prettier などの整形・lint の道具がないため、`specdojo-lp` のファイルに対して `prettier` などを実行しない（evidence にも記録しない）。

## 3. 作業内容

| No  | 作業                          | 担当         | 状態 | メモ                                   |
| --- | ----------------------------- | ------------ | ---- | -------------------------------------- |
| 1   | 食い違いを洗い出し、LP を直す | BA           | done | 8 種類・実行順序・導入例・起動名を更新 |
| 2   | ビルドを確認する              | orchestrator | open | 完了条件どおり sandbox 外で確認する    |

## 4. 対応結果

### 4.1. 実施内容

- prj-0001 の `CHANGELOG.md` の 0.3.0 から 0.5.0 までを LP の表示文言・コマンド例と照合した。登録簿の種類と実行順序は [[specdojo:register-operation-guide|登録簿運用ガイド]]、導入は [[specdojo:quick-start-guide|Quick Start ガイド]]・[[specdojo:command-reference|CLI コマンドリファレンス]]・[[specdojo:docs-editing-guide|ドキュメント編集ガイド]] を基準とした。LP の技術スタック定義も確認した。
- `RegisterTypes.astro` の導入文と比較表を 8 種類に更新し、既存のカードの生成処理で `epic` を表示する。track ごとの仕事をまとめ、具体的な作業は子 todo に分け、epic 自体は実行せず、子項目と schedule を材料に人が完了を判断する説明にした。`NextSteps.astro` と README の構成表も 8 種類にそろえた。
- `depends_on` は LP に載せると判断した。順番のある todo を安全に実行する利用者向けの変更であり、既存の FAQ の例で具体的に説明できるためである。登録簿の説明に先行項目が `done` / `decided` になるまで後続を実行しないことを加え、改善 todo の起票例に `--depends-on PJR-XXXX` を追加した。会話例も元の FAQ を先行に指定する内容にそろえた。`--from` は起票の由来であり、この実行順序の指定には使用していない。
- `init` が markdownlint 設定の不足時に `.markdownlint.yaml` を生成し、既存設定は保持することを明記した。通常の `init` の例として Git hook は既定の「いいえ」を選び、`--lefthook` / `--slidev` の `.markdownlintrc`・CLI2 設定と混同しないようにした。Dev Container の preset の質問は、はい・いいえではなく Enter で `recommended` を選ぶ説明に直した。
- docs-lint・docs-site が登録簿や AI 実行に必須ではないことを明記した。必要な場合だけ実行する追加例として `npm install --save-dev @specdojo/docs-lint` と YAML schema 検査、`npm install --save-dev @specdojo/docs-site` と `npx specdojo-docs-site build .` を掲載した。詳細な検査設定はドキュメント編集ガイドへ案内する。
- Codex の起動 script の旧名 `orch:terra` を `orch:luna` に更新した。日本語の起票例には英語の `--topic` を指定し、個票のファイル名を意図した名前にする運用にそろえた。

### 4.2. 照合して変更しなかった内容

| 変更点・確認対象                                                                                                                                              | 判断と理由                                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.3.0 の Node.js 22.13 以上、別リポジトリ構成、人と agent の名簿分離、worktree・executor / reporter・確認後 close、標語・用語                                 | LP の前提と手順は現行と一致する。対応済みの説明は維持した。                                                                                                                      |
| 0.3.0 以降の成果物の品質評価とタスクの完了判断、0.4.7 の `grade run`、0.5.0 の成果物の `type`・rulebook の `deliverable_type` と移行                          | LP の最初の体験は登録簿と FAQ の作業で、成果物 frontmatter や grade のコマンドを掲載していない。該当する旧値・旧コマンドはなく、詳細な移行手順の複製はしない。                   |
| 0.4.0 以降の approach・対象・手本の指定、利用者 kata の配置、0.4.7 のカタログなしの成果物実行、0.5.0 の `catalog-planning` / `strategy-planning`・TSD の kata | 最初の todo は approach を指定しない実行として有効であり、LP に旧配置やカタログ必須という説明はない。発展手順は既存の CLI リファレンスと全体概要ガイドへの導線に委ねる。         |
| `--from` による由来・外部 project への起票、並列実行・統合後 review・夜間実行・再開・fallback                                                                 | LP の基本例は単一 project の明示指名による実行と人の確認で、現在も有効。追加機能の全オプションは複製せず、既存のガイドと CLI リファレンスへの導線を維持した。                    |
| 0.5.0 のプロダクトの `integration_strategy: branch-only`                                                                                                      | 既定は従来どおり `merge`。LP の `repos` 例は既定による統合を説明しているため変更不要。PR レビューへ渡す任意の構成は基本例へ加えていない。                                        |
| Dev Container の `minimal` / `full`・Slidev・OpenCode 接続設定・常時稼働ホスト                                                                                | LP は推奨の `recommended` と Claude Code の例で、既定の選択とツールの説明は現行に合わせた。ほかの preset・任意機能や provider 固有の設定は掲載していないため、詳細を追加しない。 |
| docs-site の `.vitepress/` への生成物集約、package 同梱文書の参照、Mermaid の描画とエラー処理                                                                 | LP に旧出力先や Mermaid の挙動の説明はなく、新しく掲載した文書サイトのコマンドも現行ガイドと一致する。出力先の移行や図の詳細は文書編集ガイドに委ねる。                           |
| schedule・routine + Job・型と品質評価の「準備中」                                                                                                             | [[prj-0002:pjr-7t8x-lp-roadmap-pdca-matrix\|LP の PDCA マトリクス]] で合意した紹介範囲の表示方針を維持した。CLI に機能が存在することを、LP での提供範囲拡大の承認とは扱わない。  |
| 依存更新・生成文書・検査・履歴・runner の安定性に関する不具合修正                                                                                             | LP の操作例を無効にする変更はない。内部処理や個別障害の列挙は LP に追加せず、変更履歴を正本とする。                                                                              |

### 4.3. 変更ファイル

| ファイル                                                  | 内容                                                                        |
| --------------------------------------------------------- | --------------------------------------------------------------------------- |
| `specdojo-lp:src/components/sections/RegisterTypes.astro` | 8 種類・epic の説明・依存による実行順序を反映                               |
| `specdojo-lp:src/components/sections/NextSteps.astro`     | 登録簿運用ガイドの紹介を 8 種類と実行順序に更新                             |
| `specdojo-lp:src/components/sections/GetStarted.astro`    | init の生成設定・任意パッケージ・preset・起票と依存の例・Codex 起動名を更新 |
| `specdojo-lp:README.md`                                   | 構成表の register の種類を 8 に更新                                         |
| 本個票                                                    | 作業内容・照合結果・検証と申し送りを記録                                    |

### 4.4. 検証と申し送り

- Node.js と TypeScript によるソース確認で、3 コンポーネントのタグと属性が編集前と一致し、`GetStarted.astro`・`NextSteps.astro` の HTML テンプレート全体が不変であることを確認した。`RegisterTypes.astro` は表示文言と既存のカード生成処理への epic のデータ追加だけを変えた。8 種類の重複がないこと、frontmatter の構文、コマンド例の改行継続も確認した。実際に出力される HTML の確認は sandbox 外のビルドに引き継ぐ。
- ソース確認では Node.js から Git 子プロセスを起動すると `EPERM` になったため、shell で取得した編集前のソースを読み込む形で再実行し、成功した。
- 表示する shell コマンド例を抽出し、`bash -n` による構文検査が成功した。導入・起票・実行の例自体は実行していない。
- 本個票をプロジェクト側の Prettier で整形した。`node --import tsx src/specdojo.ts register build --project prj-0002` が成功し、個票・参照・依存・イベントを検証して派生ビューを生成できた。正本の一覧や個票のステータスは変更していない。プロジェクトと LP の `git diff --check` も成功した。親 runner に指定された整形以外の lint・schema・型・テストの検証は重複実行せず、親検証へ委ねる。
- `specdojo-lp` の `npm run build` は完了条件に従って `requires_human` とする。orchestrator が sandbox 外でビルドし、epic のカード追加、依存の説明、両タブの初期設定とコマンド例を確認する。
- LP の `package.json` と技術スタック定義には現在 Prettier・ESLint・型検査が存在するが、本個票の「LP に対して整形・lint を実行しない」という明示条件を優先し、これらを executor から追加実行していない。設定の変更もない。
- prj-0002 の `repos` の統合先が `specdojo-lp` の `develop` であることを確認した。commit・統合・状態遷移は親 runner に委ねる。executor は result を編集せず、本節の照合判断と sandbox 外の確認事項を報告の `handoff` にも渡す。

## 5. 関連ドキュメント

- [[prj-0002:pjr-1qbz-lp-stale-docs]]
