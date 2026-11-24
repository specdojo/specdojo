---
specdojo:
  id: prj-0001:pjr-6xg2-docs-site-next-prj-0002
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-24T13:59:40Z"
  due_on: "2026-11-30"
  commit_type: ci
  commit_scope: docs-site
---

# PJR-6XG2 文書サイトの開発中の版に prj-0002 の project の文書を出す

## 1. 概要

公開の workflow で prj-0002 のブランチから project の文書だけを重ね、開発中の版のサイトに出す

## 2. 入力

- v0.10.0 に入れる（利用者の指定、2026-11-24）
- prj-0002 の project の文書を重ねて開発中の版に出す案 A にする（利用者の判断、2026-11-24）
- 担当と期限は PJR-FZQA と同じ DEV・2026-11-30 とした（オーケストレーターの推奨。利用者の確認待ち）
- specdojo-lp は 2026-11-25 に public になった（利用者）。workflow の変更案に、token なしで specdojo/specdojo-lp を checkout し、ビルドの間だけの設定で prj-0002 の repos として宣言し、PJR-FZQA の仕組みで product の文書を取り込む手順を含める。FZQA が統合されるまでは、その手順は FZQA の統合の後に有効になる形で書く

## 3. 完了条件

- 文書サイトの開発中の版（`/specdojo/next/`）に、prj-0002 の project の文書（`project/prj-0002/develop` の `docs/ja/projects/prj-0002/`）を出す。prj-0002 のブランチの `docs/ja/product/` など、project の文書のほかはそのブランチから取り込まない。
- 公開の workflow（`.github/workflows/deploy.yml`）で、開発中の版のビルドの前に `origin/project/prj-0002/develop` から `docs/ja/projects/prj-0002/` だけを取り出して重ねる。project の一覧のページとサイドバーに prj-0002 が出るよう、ビルドの間だけ使う設定（`.specdojo/specdojo.local.config.json` など、commit しないもの）で prj-0002 を足す。どの設定をどう足すかを決め、理由を個票の対応結果と報告の `handoff` に書く。
- サイトの上のメニューの project の入口（`packages/docs-site/.vitepress/config.mts` の prj-0001 に固定した入口）を、出す project に合わせる。
- `.github` は保護された設定のため変えない。workflow の変更案を、差分の形で個票の対応結果と報告の `handoff` に書く。反映は利用者の承認のもとでオーケストレーターが行う。
- specdojo-lp（2026-11-25 に public）の product の文書も出す。workflow で token なしに `specdojo/specdojo-lp` を checkout し、ビルドの間だけの設定で prj-0002 の `repos` として宣言して、PJR-FZQA の仕組みで取り込む。FZQA が統合される前は、その段を FZQA の統合の後に有効になる形で書く。
- 反映の前に、オーケストレーターが手元で同じ重ね方をしてサイトをビルドし、prj-0002 のページが出て、wikilink の解決と登録簿の表示ページの生成でビルドが止まらないことを確かめる。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。

## 4. 作業内容

| No  | 作業                                                                | 担当 | 状態 | メモ                                                               |
| --- | ------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------------------ |
| 1   | 上のメニューの project の入口を、出す project に合わせる            | DEV  | done | `config.mts` に `projectNavItem` を追加                            |
| 2   | `deploy.yml` の変更案を差分で書く                                   | DEV  | done | 対応結果に記載。`.github` は保護のため変えない                     |
| 3   | CHANGELOG に書く事項の案を書く                                      | DEV  | done | 対応結果に記載                                                     |
| 4   | 手元で同じ重ね方をしてサイトをビルドし、prj-0002 のページを確かめる | DEV  | open | executor は実行しない。反映前にオーケストレーターが行う            |
| 5   | 変更案を `.github/workflows/deploy.yml` へ反映する                  | DEV  | open | 保護された設定のため、利用者の承認のもとでオーケストレーターが行う |

## 5. 対応結果

### 5.1. 実施内容

- `packages/docs-site/.vitepress/config.mts` の上のメニューを `projectNavItem()` にした。`docs/ja/projects/` に prj-0001 以外の project が無いときは従来どおり prj-0001 の概要への単一リンクにする。あるときは「プロジェクト」をドロップダウンにし、prj-0001 は概要、ほかは `/ja/projects/<id>/` へ向ける。本番の版は prj-0002 を重ねないため表示は変わらない。
- project の一覧のページとサイドバーは `docs/ja/projects/` 配下のディレクトリから自動で作るため、prj-0002 の文書を重ねれば出る。

### 5.2. 決めた内容と理由

- 重ねる範囲: `git checkout FETCH_HEAD -- docs/ja/projects/prj-0002/` だけを使う。`docs/ja/product/` などはそのブランチから取り込まない。
- 設定の足し方: `.specdojo/specdojo.local.config.json` は使わない。local config は共有設定に無い project を足せない（CLI は `project is not declared` で拒否する）。docs-site の `loadProductRepos` と `readProjectEntries` も共有設定の `projects` だけを走査する。そこで、ビルド用の detached worktree（commit せず捨てる複製）の `.specdojo/specdojo.config.json` に prj-0002 の項目を足す。足すのは `base_path`・`project_register_path` と、`repos` の `specdojo-lp` だけである。
- `specdojo-assets` は public でないため宣言しない。
- `specdojo-lp` は `repos[].path`（`../specdojo-lp`）が指す `$RUNNER_TEMP/specdojo-lp` へ token なしで clone する（next の worktree は `$RUNNER_TEMP/next`）。`actions/checkout` の `path` は `GITHUB_WORKSPACE` の下に限られるため `git clone` にした。
- PJR-FZQA の仕組みが無い `site/next` でも落ちないよう、`product-repos.ts` の有無で `specdojo-lp` の段を有効にする。FZQA が入るまでは prj-0002 の project の文書だけが出る。
- prj-0002 のブランチを fetch できない場合は、重ねずに進める。

### 5.3. workflow の変更案（`.github/workflows/deploy.yml`）

`Build the next site` の `cd "$RUNNER_TEMP/next"` の直後、`npm ci` の前に次の段を足す。

```diff
           git worktree add --detach "$RUNNER_TEMP/next" "$NEXT_REF"
           cd "$RUNNER_TEMP/next"
+
+          # prj-0002 の project の文書だけを重ねる（PJR-6XG2）。ブランチが無ければ重ねない。
+          if git fetch origin project/prj-0002/develop 2>/dev/null; then
+            git checkout FETCH_HEAD -- docs/ja/projects/prj-0002/
+            node -e '
+              const fs = require("node:fs");
+              const file = ".specdojo/specdojo.config.json";
+              const config = JSON.parse(fs.readFileSync(file, "utf8"));
+              config.projects["prj-0002"] = {
+                base_path: "docs/ja/projects/prj-0002",
+                project_register_path: "controls/project-register",
+              };
+              // PJR-FZQA が入っている版だけ、specdojo-lp（public）の product の文書も出す。
+              if (fs.existsSync("packages/docs-site/.vitepress/product-repos.ts")) {
+                config.projects["prj-0002"].repos = [{ name: "specdojo-lp", path: "../specdojo-lp" }];
+              }
+              fs.writeFileSync(file, JSON.stringify(config, null, 2) + "\n");
+            '
+            if [ -f packages/docs-site/.vitepress/product-repos.ts ]; then
+              git clone --depth 1 https://github.com/specdojo/specdojo-lp.git "$RUNNER_TEMP/specdojo-lp"
+            fi
+          fi
+
           npm ci
```

### 5.4. CHANGELOG に書く事項

- 区分: Added（文書サイト）
- 案: `文書サイトの開発中の版（/specdojo/next/）に prj-0002 の project の文書と specdojo-lp の product の文書を出す。上のメニューの「プロジェクト」は、文書のある project が複数あるときドロップダウンになる。`

### 5.5. 残課題

- 作業 4（手元ビルドの確認）と作業 5（`deploy.yml` への反映）は、オーケストレーターが利用者の承認のもとで行う。重ねた文書で wikilink の解決や登録簿の表示ページの生成が止まるかは未確認。
- 担当 DEV・期限 2026-11-30 は利用者の確認待ち。
- `specdojo-lp` の clone は既定ブランチを取る。`develop` の文書を出す場合は `--branch develop` を足す（要判断）。

## 6. 関連ドキュメント

- [[prj-0001:pjr-index]]
