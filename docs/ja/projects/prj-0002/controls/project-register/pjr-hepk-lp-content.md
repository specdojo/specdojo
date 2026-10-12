---
specdojo:
  id: prj-0002:pjr-hepk-lp-content
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: UX
  registered_at: "2026-10-11T06:37:19Z"
---

# PJR-HEPK ランディングページの構成と原稿を作る

## 1. 概要

すぐに register を使い始められるよう、やさしく解説する構成と原稿を作り、詳細は VitePress のドキュメントへ案内する

読み手は SpecDojo を初めて知る開発者とし、プロジェクトを管理する立場の人は副次的な読み手とする。LP だけで「導入して最初の項目を起票し、一覧を作る」までを体験できるようにし、その先（decision から change-request までの流れ）は Quick Start（<https://specdojo.github.io/specdojo/ja/specdojo/guides/quick-start-guide.html>）へ案内する。

_ASSUMPTION_: LP の言語は、ドキュメントサイトに合わせて日本語のみとする。

### 1.1. 改訂（2026-10-12）

利用者のレビューを受け、「始める」セクションを対話型オーケストレーター中心に改める。やりたいことを会話で伝えるだけで始められることを主な経路とし、CLI のコマンドは参考としてタブを切り替えたときに表示する。会話の流れは specdojo の README の「会話で操作する」に合わせ、例に使う provider は Claude Code とする。

| 手順                        | 会話タブ（既定で表示）                                                                                   | コマンドタブ（参考）                 |
| --------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| 1. 導入                     | `npm install --save-dev specdojo` と `npx specdojo config init`                                          | 同じ                                 |
| 2. オーケストレーターの配置 | `npx specdojo config scaffold --provider claude`                                                         | 不要（会話タブのみの手順と明記する） |
| 3. 起動                     | `npm run orch:opus`。他の provider（opencode・codex・antigravity）の起動は表か注記で補う                 | 不要                                 |
| 4. 起票                     | 「最初の作業を todo として起票して」などの会話例と、オーケストレーターがコマンドを示して承認を求める流れ | `register scaffold` → `register add` |
| 5. 一覧                     | 「一覧を作って」「今の状況は？」などの会話例                                                             | `register build`                     |

### 1.2. 再改訂（2026-10-12）

LP の手順を新しいディレクトリで実際に実行して確認した結果と、利用者のレビューを受けて次を改める。

- 手順の確認: npm で公開中の specdojo 0.2.1 では、`config scaffold --provider claude` が `orch:opus` の script を追加しないため、手順 3 の `npm run orch:opus` が失敗する。リポジトリの 0.3.0 を `npm pack` で入れた場合は、config init から register build まで通り、`orch:opus` と `orch:sonnet` が追加された。利用者の判断により、LP の公開より先に 0.3.0 を公開する（公開の判定は prj-0001 の PJR-P8TK に従う）。LP の公開（Cloudflare への配置）は 0.3.0 の公開を待つ。
- 前提の明記: オーケストレーターの起動には Claude Code の導入とログインが必要で、`orch:opus` は `specdojo orchestrator launch --provider claude` を経由して `claude` を起動する。Node.js の必要な版とあわせて、「始める」の前に前提として書く。
- register の考え方: 最初の一歩として入りやすい `todo` を先頭にし、register の 7 種類をすべて載せる。順序は `todo`（やること）→ `decision`（選択肢から方針を決める）→ `issue`（解決すべき問題）→ `question`（判断を保留し後で決める）→ `risk`（将来の不確実性）→ `change-request`（合意済み範囲の変更要求）→ `note`（記録として残す観測・分析。終端させない）とする。先頭の 3 種類を大きく、残りの 4 種類を小さく見せる。

### 1.3. 再々改訂（2026-10-12）

利用者のレビューを受けて次を改める。PDCA で見せる「これから」の節は別の todo で扱う。

- 標語: 「記して、形にして、磨き続ける。」に改める。いつでも、どこからでも気軽に始めて、育てていけることを伝える。全体概要ガイドの標語の変更は prj-0001 の decision で扱う。
- 「設計書」と書かない: SpecDojo のプロダクト文書は要求・要件・仕様が中心のため、「仕様書」または「要求・要件・仕様」と書く。
- 別リポジトリ構成の図: 親ディレクトリを `app1-workspace/` とし、プロダクトごとに分けられるようにする。Quick Start とディレクトリレイアウトリファレンスの `workspace/` との差は、prj-0001 の decision で解消する。

## 2. 完了条件

- LP の構成（セクションの並びと各セクションの目的）が、本個票の対応結果に記載されている。
- 原稿が `specdojo-lp:src/pages/index.astro` に反映されている。原稿は少なくとも次を含む。
  - SpecDojo が何を解決するか。
  - register の考え方（項目を起票して記録を集める）。type は概要の再改訂の順序で 7 種類すべてを載せ、先頭の `todo`・`decision`・`issue` を大きく、`question`・`risk`・`change-request`・`note` を小さく見せる。各 type の説明は pjr-rulebook の定義と矛盾しない。
  - 「始める」の前に置く前提（Node.js の必要な版、Claude Code の導入とログイン）。Node.js の版は specdojo の `package.json` の `engines` に合わせる。
  - 導入から一覧の生成までの手順と、詳しい文書への案内。
- 「始める」セクションは、対話型オーケストレーターとの会話を主な経路とする。手順は概要の改訂の表に従い、会話の例は specdojo の README の「会話で操作する」と矛盾しない。状態を変える操作は承認を得てから実行し、`git push` などは行わないことを短く添える。
- CLI のコマンドは参考として扱い、タブを切り替えたときだけ表示する。会話タブを既定で表示する。
- 標語「記して、形にして、磨き続ける。」を `<title>` とヒーローの見出しに使い、ヒーローの説明文で「いつでも、どこからでも始められ、使うほど育つ」ことを伝える。
- 原稿に「設計書」という語がない。プロダクト文書は「仕様書」または「要求・要件・仕様」と書く。
- 「始める」の前提の次に、`app1-workspace/` の下に `app1/`・`app1-specdojo/`・`app1-specdojo-worktrees/` が並ぶ図を、両タブに共通して置く。次の 3 点を添える。
  - register だけなら `app1-specdojo/` だけで始められる。
  - worktree は exec で作業を隔離するときに作られる。
  - 詳しくはディレクトリレイアウトリファレンス（<https://specdojo.github.io/specdojo/ja/specdojo/references/directory-layout-reference.html>）へ案内する。
- 手順 1 のコマンドを、`app1-workspace/` の下に `app1-specdojo/` を作る形に合わせる。
- タブは `role="tablist"`・`role="tab"`・`role="tabpanel"` と `aria-selected` を持ち、キーボード（左右キー）で切り替えられる。JavaScript が無効な環境では、両方のタブの内容を表示する。
- 原稿に載せるコマンド（`npx specdojo config init`、`config scaffold --provider claude`、`register scaffold`、`register add`、`register build`）の引数と、起動用 script 名（`orch:opus` など）が、CLI の `--help`、command-reference、README に一致している。
- 詳しい文書へのリンクは、公開中のドキュメントサイト（<https://specdojo.github.io/specdojo/ja/>）の実在するページを指している。
- マスコット（PJR-FSMC）の配置場所は仮の枠のみとし、デザインは PJR-CM5W で定義したテーマの class を使う。
- `specdojo-lp` で `npm run build` が成功する。agent の sandbox では npm を実行できないため、executor は evidence の `validations` でこの検証を `requires_human` と記録し、ビルドは orchestrator が sandbox の外で確認する。
- prj-0002 は `catalog_path` を設定していないため、`specdojo catalog validate` は実行しない（evidence にも記録しない）。
- Cloudflare への配置とマスコットの絵は、本項目に含めない。

## 3. 作業内容

| No  | 作業                                                                       | 担当 | 状態 | メモ                                            |
| --- | -------------------------------------------------------------------------- | ---- | ---- | ----------------------------------------------- |
| 1   | LP の構成を決め、個票に記載する                                            | UX   | done | -                                               |
| 2   | 原稿を書き、コマンドとリンクが正しいか確認する                             | UX   | done | -                                               |
| 3   | `index.astro` に原稿を反映し、ビルドを確認する                             | DEV  | done | ビルドは orchestrator が sandbox の外で確認した |
| 4   | 「始める」をオーケストレーター中心に改め、コマンドをタブで切り替える       | UX   | done | ビルドは orchestrator が sandbox の外で確認する |
| 5   | register の 7 種類を todo から並べ、前提（Node.js・Claude Code）を書き足す | UX   | done | ビルドは orchestrator が sandbox の外で確認した |
| 6   | 標語・「設計書」の語・別リポジトリ構成の図を改める                         | UX   | done | ビルドは orchestrator が sandbox の外で確認する |

## 4. 対応結果

### 4.1. LP の構成

LP は 1 ページで、上から次の順に並べる。

| No  | セクション                                 | 目的                                                                                                                                                                 |
| --- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ヘッダー                                   | サービス名と、ドキュメントサイトへの入口を常に見せる。                                                                                                               |
| 2   | ヒーロー（記して、形にして、磨き続ける。） | SpecDojo を一文で伝え、いつでも、どこからでも始められ、使うほど育つことを示す。「5 つの手順で始める」と Quick Start への導線を置き、右側にマスコットの仮の枠を置く。 |
| 3   | こんなことはありませんか                   | 判断が散らばる・「なぜ」をたどれない・AI に前提を渡せない、の 3 つの困りごとから、SpecDojo が何を解決するかを示す。                                                  |
| 4   | register の考え方                          | 7 種類を todo から並べて起票の考え方を示し、個票（Markdown）を正本として記録を集め、一覧は個票から生成されることを説明する。                                         |
| 5   | 5 つの手順で始める                         | 前提（Node.js・Claude Code）と別リポジトリ構成の図を示し、導入から起票・一覧までを会話で体験させる。CLI のコマンドは参考としてタブで切り替えて見せる。               |
| 6   | 次の一歩                                   | decision から change-request までの流れを Quick Start へ、詳細を登録簿運用ガイド・コマンドリファレンス・全体概要ガイドへ案内する。                                   |
| 7   | フッター                                   | 著作権表示とドキュメントサイトへのリンクを置く。                                                                                                                     |

### 4.2. 実施内容

- 上記の構成で原稿を書き、`specdojo-lp:src/pages/index.astro` の仮ページを差し替えた。
- 原稿のコマンドは次のとおりで、CLI の `--help` と [[specdojo:command-reference]] の `init / config / project` と `register` の表に一致することを確認した。
  - `npx specdojo config init`（引数なし。`prj-0001` の最小設定を作る）
  - `npx specdojo register scaffold --project prj-0001`
  - `npx specdojo register add --project prj-0001 --type issue --title "初期スコープが決まっていない"`
  - `npx specdojo register build --project prj-0001`
- 導入手順（`mkdir` から `npm install --save-dev specdojo` まで）と、登録簿・一覧の配置先は [[specdojo:quick-start-guide]] に合わせた。登録簿の配置先は `config init` の雛形（`project_register_path: controls/project-register`）とも一致する。
- 詳しい文書へのリンクは、公開中のドキュメントサイトで次の 5 ページが表示されることを確認した。
  - <https://specdojo.github.io/specdojo/ja/>
  - <https://specdojo.github.io/specdojo/ja/specdojo/guides/quick-start-guide.html>
  - <https://specdojo.github.io/specdojo/ja/specdojo/guides/register-operation-guide.html>
  - <https://specdojo.github.io/specdojo/ja/specdojo/references/command-reference.html>
  - <https://specdojo.github.io/specdojo/ja/specdojo/guides/specdojo-overview-guide.html>
- マスコットは、ヒーロー右側に `data-placeholder="mascot"` の点線の枠だけを置いた。色・文字・角丸・影は PJR-CM5W の `global.css` で定義したテーマの class（`bg-primary-container`、`text-headline-medium`、`rounded-extra-large`、`shadow-elevation-1` など）だけを使った。

### 4.3. 改訂の実施内容（2026-10-12）

- 「5 つの手順で始める」を、既定で表示する「会話で始める」タブと、参考の「コマンドで始める（参考）」タブに分けた。手順は概要の改訂の表に従い、導入・オーケストレーターの配置・起動・起票・一覧の 5 つとした。
- 会話の例は、specdojo の `README.md` の「会話で操作する」に合わせた。起票はあなたの依頼、オーケストレーターの「次を実行します。よろしいですか。」とコマンドの提示、あなたの承認の順で示し、一覧も同じ流れで示した。「今の状況は？」は一覧の手順の説明文で添えた。
- 状態を変える操作は承認を得てから実行し、`git push` や破壊的な操作は行わないことを、セクションの冒頭に短く書いた。
- コマンドタブでは、オーケストレーターの配置と起動を「コマンドで進める場合は不要（会話で進める場合だけの手順）」と明記した。起票は `register scaffold` と `register add`（`--type todo`）、一覧は `register build` とした。
- 起動の手順に provider ごとの表を置き、`orch:opus`（`orch:sonnet` も追加される）、`orch:opencode`、`orch:codex`、`orch:agy` を示した。script 名は `src/exec-provider-scaffold.ts` の `ORCHESTRATOR_NPM_SCRIPTS` と `README.md` の表に一致する。`config scaffold --provider` の引数は `--help` の選択肢（antigravity / claude / codex / copilot / opencode）に含まれる。
- 会話タブの末尾から、公開中の オーケストレーター運用ガイド（<https://specdojo.github.io/specdojo/ja/specdojo/guides/orchestrator-operation-guide.html>）へ案内した。ページが表示されることを確認した。
- タブは `role="tablist"`・`role="tab"`・`role="tabpanel"` と `aria-selected`・`aria-controls`・`aria-labelledby` を持ち、左右キー（と Home / End）で切り替えられる。タブの一覧は `hidden` で出力し、インラインの script が表示してから非選択のパネルを隠す。JavaScript が無効な環境では、タブを出さずに両方のパネルを見出しつきで表示する。
- 色・文字・角丸・影は PJR-CM5W の `global.css` で定義したテーマの class だけを使った。

### 4.4. 再改訂の実施内容（2026-10-12）

- 「register の考え方」に 7 種類すべてを、`todo` → `decision` → `issue` → `question` → `risk` → `change-request` → `note` の順で載せた。先頭の 3 種類は 3 列の大きいカード（`text-title-large`）、残りの 4 種類は 4 列の小さいカード（`text-title-small`・`text-body-small`）で見せる。
- 各 type の説明は、[[specdojo:pjr-rulebook]] の `item_type` 別の終端基準（`note` は終端させず追記する、`risk` は消滅または対応完了まで追う など）と、[[specdojo:register-operation-guide]] の種類の表に合わせた。
- 「5 つの手順で始める」の冒頭、タブの前に「始める前に用意するもの」を置き、次の 2 点を書いた。
  - Node.js 22.13 以上（specdojo の `package.json` の `engines` の `>=22.13` に合わせた）と Git。
  - Claude Code の導入とログイン。`npm run orch:opus` が `specdojo orchestrator launch --provider claude` を経由して `claude` を起動すること（`src/exec-provider-scaffold.ts` の script 定義に一致）と、コマンドで始める場合は不要であることを添えた。
- 「次の一歩」の登録簿運用ガイドの説明を、7 つの種類に合わせて改めた。
- 色・文字・角丸・影は PJR-CM5W の `global.css` で定義したテーマの class だけを使った。

### 4.5. 再々改訂の実施内容（2026-10-12）

- `<title>` とヒーローの見出しを「記して、形にして、磨き続ける。」へ改めた。ヒーローの説明では、いつでも、どこからでも小さく始められ、記録は使うほど育つことを伝えた。
- 原稿中の「設計書」を「仕様書」または「要求・要件・仕様」へ置き換えた。
- 「始める前に用意するもの」の直後に、`app1-workspace/` の下へ `app1/`・`app1-specdojo/`・`app1-specdojo-worktrees/` を並べる図を置いた。register だけなら `app1-specdojo/` だけで始められること、worktree は exec で作業を隔離するときに作られること、詳しくはディレクトリレイアウトリファレンスを参照することを添えた。
- 手順 1 のコマンドを、`app1-workspace/` の下へ `app1-specdojo/` を作成して初期化する形に改めた。
- 色・文字・角丸・影は PJR-CM5W の `global.css` で定義したテーマの class だけを使った。

### 4.6. 統合の経緯

exec run は 2 回とも、成果物ではなく executor 検証の記録形式の判定で `waiting` に止まった。利用者の承認を得て、orchestrator が runner の代わりに統合した。

- 1 回目は、`npm --prefix specdojo-lp run build` を `not_run` と記録し、`catalog validate` を `not_applicable` と記録したため止まった。プロダクトリポジトリの検証は not_run の委譲先として満たせない（prj-0001 の PJR-2GZE）。
- 完了条件に検証の扱いを書き足し、`--force-restart` で再実行した。ビルドは `requires_human` と記録されたが、prettier と `catalog validate` の `not_applicable` の理由が判定の条件を満たさず、再び止まった（prj-0001 の PJR-WP44）。
- runner の親検証 7 種（lint-ts、lint-fm、lint-md、test-integration、validate-schema、typecheck、test-unit）は 2 回目ですべて passed だった。
- orchestrator が worktree と、統合後の `specdojo-lp` の `main` で `npm run build` を実行し、`dist/index.html` が出力されること、見出しが本書の構成のとおりに並ぶことを確認した（2026-10-12）。
- `specdojo-lp` では exec ブランチに原稿を commit し（cb7e4bb）、`main` へ `--no-ff` で merge した（ba8f1e8）。plan と result は runner の `wait` 記帳で `project/prj-0002/develop` に入っており、evidence は orchestrator が worktree から移した。
- 再改訂（概要の再改訂）は 3 回目の exec run で `waiting` に止まらず、runner が `specdojo-lp` の `main` へ統合した（454595b）。orchestrator が 454595b で `npm run build` を実行し、`dist/index.html` が出力されること、見出しと register の 7 種類が本書の構成のとおりに並ぶことを確認した（2026-10-12）。

### 4.7. 残課題

- Cloudflare への配置とマスコットの絵は本項目に含めない（マスコットは PJR-FSMC）。

## 5. 関連ドキュメント

- [[prj-0002:pjr-fv3w-lp-tech-stack]]: 技術スタックの決定。
- [[prj-0002:pjr-cm5w-lp-initial-setup]]: LP の初期構成とテーマ。
- [[prj-0002:pjr-fsmc-lp-mascot]]: マスコット。配置場所の仮の枠を本項目で用意する。
