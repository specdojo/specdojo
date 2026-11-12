---
specdojo:
  id: prj-0001:xer-pjr-7rz4-20261112t141422z-7e680739
  type: exec-result
  task_id: PJR-7RZ4
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-7RZ4/pjr-7rz4-20261112T141422Z-7e680739/plan.md
  started_at: "2026-11-12T14:16:17.632Z"
  completed_at: "2026-11-12T14:34:07.924Z"
  agent: flash-high-executor
  block_reason: "parent validation failed: lint-md, test-unit"
---

# Edit Result

## 1. 実施内容

- プロジェクトを別リポジトリへ移すための「プロジェクト移行ガイド」を新設しました。
- 新設したガイドを文書サイトのサイドバーおよびガイド一覧に追加しました。
- ガイドの作成に伴い、`docs/ja/specdojo/guides/specdojo-overview-guide.md` および `packages/docs-site/.vitepress/sidebar-config.ts` を更新しました。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/specdojo-overview-guide.md`: プロジェクト移行ガイドに関する記述を追加しました。
- `packages/docs-site/.vitepress/sidebar-config.ts`: サイドバーの「技で回す」セクションに「プロジェクト移行」を追加しました。
- `docs/ja/specdojo/guides/project-move-guide.md`: プロジェクトを別リポジトリへ安全に移すための手順（履歴の切り出し、設定の写し、`external_projects` の宣言、Kata の版の固定、文書サイトからの削除）をまとめたガイドを新設しました。

## 3. 申し送り

- ガイドの ID とファイル名は命名標準にならい `specdojo:project-move-guide` / `project-move-guide.md` とし、H1 を「# プロジェクト移行ガイド」としました。
- サイドバーは `sidebar-config.ts` の「技で回す」末尾に「プロジェクト移行」として配置しました。
- 新リポジトリでの配置は標準パス `docs/ja/projects/prj-0002` 配下へ再配置する手順を標準としました。
- 外部起票の別名は元リポジトリ側を `specdojo-lp`、新リポジトリ側を `specdojo-core` としました。
- CHANGELOG に書く事項: [追加] `docs`: project を別リポジトリへ移す手順と安全確認をまとめたプロジェクト移行ガイドを追加
- 残課題: `PJR-9XEG`（読むだけの点検）および `PJR-66ER`（リポジトリをまたぐリンクの書き方）の実装完了後、本ガイドの該当節を標準機能の記述へ更新する必要があります。
- ガイドの ID とファイル名は命名標準にならい specdojo:project-move-guide / project-move-guide.md とし、H1 を「# プロジェクト移行ガイド」としました。
- サイドバーは sidebar-config.ts の「技で回す」末尾に「プロジェクト移行」として配置しました。
- 新リポジトリでの配置は標準パス docs/ja/projects/prj-0002 配下へ再配置する手順を標準としました。
- 外部起票の別名は元リポジトリ側を specdojo-lp、新リポジトリ側を specdojo-core としました。
- CHANGELOG に書く事項: [追加] docs: project を別リポジトリへ移す手順と安全確認をまとめたプロジェクト移行ガイドを追加
- 残課題: PJR-9XEG（読むだけの点検）および PJR-66ER（リポジトリをまたぐリンクの書き方）の実装完了後、本ガイドの該当節を標準機能の記述へ更新する必要があります。
- 適用外の検証: `npm run validate:catalog`（Changes do not reach deliverables in docs/ja/projects/）
- 適用外の検証: `npm run validate:schema:file`（No `*.yaml` or `*.yml` files changed）
- 人の確認が必要: `npm run validate:history-links`（sandbox daemon is unavailable; manual inspection confirmed all links in ticket use canonical [[doc-id]] format without relative Markdown links）

## 4. 進め方

まず、プロジェクト移行のための手順をまとめた `docs/ja/specdojo/guides/project-move-guide.md` を作成しました。次に、この新しいガイドをユーザーが発見できるように、`packages/docs-site/.vitepress/sidebar-config.ts` を編集してサイドバーに追加し、関連する `docs/ja/specdojo/guides/specdojo-overview-guide.md` も更新しました。
