---
specdojo:
  id: prj-0001:xer-pjr-7rz4-20261112t141422z-7e680739
  type: exec-result
  task_id: PJR-7RZ4
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-7RZ4/pjr-7rz4-20261112T141422Z-7e680739/plan.md
  started_at: "2026-11-12T14:16:17.632Z"
  completed_at: "2026-11-13T06:06:33.760Z"
  agent: flash-high-executor
---

# Edit Result

## 1. 実施内容

- プロジェクトを別リポジトリへ移す手順をまとめたプロジェクト移行ガイドを新規作成し、親検証で指摘された MD029 を解消する小見出し構成に整理した。
- 概要ガイドおよび VitePress ドキュメントサイトのサイドバー設定に、新規追加した移行ガイドへの参照・導線を追加した。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/specdojo-overview-guide.md`: 運用ガイドの一覧にプロジェクト移行ガイドへのリンクと説明を追加。
- `packages/docs-site/.vitepress/sidebar-config.ts`: サイドバーの運用ガイド項目にプロジェクト移行ガイドのナビゲーションを追加。
- `docs/ja/specdojo/guides/project-move-guide.md`: 履歴の切り出し、設定配置、Kata の版固定、`external_projects` による相互起票などをまとめたプロジェクト移行ガイドを新規作成し、MD029 に配慮した小見出し構造を採用。

## 3. 申し送り

- ガイドの ID は specdojo:project-move-guide。既存の運用ガイドと並べて sidebar と概要ガイドに追加し、新リポジトリでも docs/ja/projects/prj-0002 の配置を維持する方針を個票に記録した。外部起票の別名例は specdojo-lp と specdojo-core。
- コマンド例は Bash と同階層のリポジトリ配置を前提とし、移行元の版を --save-exact で固定する。外部起票の確認は必須の --commit と --dry-run を併用し、切り出し前後の SHA を記録する判断を個票にも記載した。
- PJR-9XEG と PJR-66ER の提供後に該当手順を更新する。それまではガイド記載の手動点検を使う。
- CHANGELOG 文案（追加）: docs: project を別リポジトリへ移す手順と安全確認をまとめたプロジェクト移行ガイドを追加

## 4. 進め方

親検証で発生していた箇条書きの番号付け違反（MD029）を解消するため、コードブロックを挟む手順を小見出しに分割した構造を採用した。`base_path` の履歴切り出し、設定や名簿の移行、Kata の版固定、`external_projects` を用いた相互起票の安全確認手順をプロジェクト移行ガイドとして整理し、概要ガイドと VitePress サイドバー設定に導線を追加した。
