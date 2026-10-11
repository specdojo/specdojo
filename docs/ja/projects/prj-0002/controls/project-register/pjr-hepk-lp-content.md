---
specdojo:
  id: prj-0002:pjr-hepk-lp-content
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: review
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

## 2. 完了条件

- LP の構成（セクションの並びと各セクションの目的）が、本個票の対応結果に記載されている。
- 原稿が `specdojo-lp:src/pages/index.astro` に反映されている。原稿は少なくとも次を含む。
  - SpecDojo が何を解決するか。
  - register の考え方（issue / decision / todo を起票して記録を集める）。
  - 導入から一覧の生成までの手順と、詳しい文書への案内。
- 「始める」セクションは、対話型オーケストレーターとの会話を主な経路とする。手順は概要の改訂の表に従い、会話の例は specdojo の README の「会話で操作する」と矛盾しない。状態を変える操作は承認を得てから実行し、`git push` などは行わないことを短く添える。
- CLI のコマンドは参考として扱い、タブを切り替えたときだけ表示する。会話タブを既定で表示する。
- タブは `role="tablist"`・`role="tab"`・`role="tabpanel"` と `aria-selected` を持ち、キーボード（左右キー）で切り替えられる。JavaScript が無効な環境では、両方のタブの内容を表示する。
- 原稿に載せるコマンド（`npx specdojo config init`、`config scaffold --provider claude`、`register scaffold`、`register add`、`register build`）の引数と、起動用 script 名（`orch:opus` など）が、CLI の `--help`、command-reference、README に一致している。
- 詳しい文書へのリンクは、公開中のドキュメントサイト（<https://specdojo.github.io/specdojo/ja/>）の実在するページを指している。
- マスコット（PJR-FSMC）の配置場所は仮の枠のみとし、デザインは PJR-CM5W で定義したテーマの class を使う。
- `specdojo-lp` で `npm run build` が成功する。agent の sandbox では npm を実行できないため、executor は evidence の `validations` でこの検証を `requires_human` と記録し、ビルドは orchestrator が sandbox の外で確認する。
- prj-0002 は `catalog_path` を設定していないため、`specdojo catalog validate` は実行しない（evidence にも記録しない）。
- Cloudflare への配置とマスコットの絵は、本項目に含めない。

## 3. 作業内容

| No  | 作業                                                                 | 担当 | 状態 | メモ                                            |
| --- | -------------------------------------------------------------------- | ---- | ---- | ----------------------------------------------- |
| 1   | LP の構成を決め、個票に記載する                                      | UX   | done | -                                               |
| 2   | 原稿を書き、コマンドとリンクが正しいか確認する                       | UX   | done | -                                               |
| 3   | `index.astro` に原稿を反映し、ビルドを確認する                       | DEV  | done | ビルドは orchestrator が sandbox の外で確認した |
| 4   | 「始める」をオーケストレーター中心に改め、コマンドをタブで切り替える | UX   | open | 概要の改訂（2026-10-12）に従う                  |

## 4. 対応結果

### 4.1. LP の構成

LP は 1 ページで、上から次の順に並べる。

| No  | セクション                               | 目的                                                                                                                               |
| --- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ヘッダー                                 | サービス名と、ドキュメントサイトへの入口を常に見せる。                                                                             |
| 2   | ヒーロー（決めて、書いて、鍛え続ける。） | SpecDojo を一文で伝え、「5 つの手順で始める」と Quick Start への導線を置く。右側にマスコットの仮の枠を置く。                       |
| 3   | こんなことはありませんか                 | 判断が散らばる・「なぜ」をたどれない・AI に前提を渡せない、の 3 つの困りごとから、SpecDojo が何を解決するかを示す。                |
| 4   | register の考え方                        | issue / decision / todo を起票し、個票（Markdown）を正本として記録を集め、一覧は個票から生成されることを説明する。                 |
| 5   | 5 つの手順で始める                       | 導入から `config init`、`register scaffold`、`register add`、`register build` までを、コマンドつきで LP だけで体験させる。         |
| 6   | 次の一歩                                 | decision から change-request までの流れを Quick Start へ、詳細を登録簿運用ガイド・コマンドリファレンス・全体概要ガイドへ案内する。 |
| 7   | フッター                                 | 著作権表示とドキュメントサイトへのリンクを置く。                                                                                   |

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

### 4.3. 統合の経緯

exec run は 2 回とも、成果物ではなく executor 検証の記録形式の判定で `waiting` に止まった。利用者の承認を得て、orchestrator が runner の代わりに統合した。

- 1 回目は、`npm --prefix specdojo-lp run build` を `not_run` と記録し、`catalog validate` を `not_applicable` と記録したため止まった。プロダクトリポジトリの検証は not_run の委譲先として満たせない（prj-0001 の PJR-2GZE）。
- 完了条件に検証の扱いを書き足し、`--force-restart` で再実行した。ビルドは `requires_human` と記録されたが、prettier と `catalog validate` の `not_applicable` の理由が判定の条件を満たさず、再び止まった（prj-0001 の PJR-WP44）。
- runner の親検証 7 種（lint-ts、lint-fm、lint-md、test-integration、validate-schema、typecheck、test-unit）は 2 回目ですべて passed だった。
- orchestrator が worktree と、統合後の `specdojo-lp` の `main` で `npm run build` を実行し、`dist/index.html` が出力されること、見出しが本書の構成のとおりに並ぶことを確認した（2026-10-12）。
- `specdojo-lp` では exec ブランチに原稿を commit し（cb7e4bb）、`main` へ `--no-ff` で merge した（ba8f1e8）。plan と result は runner の `wait` 記帳で `project/prj-0002/develop` に入っており、evidence は orchestrator が worktree から移した。

### 4.4. 残課題

- Cloudflare への配置とマスコットの絵は本項目に含めない（マスコットは PJR-FSMC）。

## 5. 関連ドキュメント

- [[prj-0002:pjr-fv3w-lp-tech-stack]]: 技術スタックの決定。
- [[prj-0002:pjr-cm5w-lp-initial-setup]]: LP の初期構成とテーマ。
- [[prj-0002:pjr-fsmc-lp-mascot]]: マスコット。配置場所の仮の枠を本項目で用意する。
