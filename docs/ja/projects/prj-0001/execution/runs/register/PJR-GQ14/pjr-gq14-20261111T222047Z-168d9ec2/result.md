---
specdojo:
  id: prj-0001:xer-pjr-gq14-20261111t222047z-168d9ec2
  type: exec-result
  task_id: PJR-GQ14
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-GQ14/pjr-gq14-20261111T222047Z-168d9ec2/plan.md
  started_at: "2026-11-11T22:20:47.926Z"
  completed_at: "2026-11-11T22:34:45.985Z"
  agent: flash-executor
---

# Edit Result

## 1. 実施内容

- ユースケース別ガイド（`docs/ja/specdojo/guides/use-case-guide.md`）内の対話例を chat コードブロックに改訂し、LP・Next.js・Unity の各プロダクト作成における相談から成果物作成・検証・運用までの対話フローおよび現行仕様（CLI 引数や実行経路など）に適合する記述に更新した。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/use-case-guide.md`: ユースケース別ガイド内の対話例を chat コードブロックに改訂し、現行仕様（`repos` の配列形式、`schedule build --track`、`exec run --worktree` の対象引数指定、`register add` の各引数指定など）との整合、および自動生成やコミット・検証経路の正確な説明に更新した。

## 3. 申し送り

- PJR-RTD5 に基づく用途別ひな型（LP）の公開後に実物を確認し、複製、project ID・名前の初期化、追加設定、SpecDojo 接続、対話開始、プレビューと検証の手順をユースケース別ガイドへ追記する。
- Next.js + Cloudflare ひな型の提供後に、公式生成・追加設定・SpecDojo 設定の境界と build・動作確認手順を検証して追記する（ガイド内の Vercel は架空の選択例）。
- ひな型複製で引き継がれないブランチ保護・セキュリティ等の設定と初期化手順を確認し、実物で有効性を確認して追記する。
- Unity スターターの採用・提供が確定した場合に限り、LFS、アセット・.meta 管理、エディタ・ライセンス・テスト環境、AI と人の作業境界を確認して追加の起票・追記範囲を検討する。
- 適用外の検証: `npm run validate:schema:file`（No changed `*.yaml` or `*.yml` files in deliverable changes）

## 4. 進め方

PJR-GQ14 の計画および個票の入力前提に基づき、`docs/ja/specdojo/guides/use-case-guide.md` の対話表現を chat コードブロックに改訂し、現行の CLI オプションや設定仕様、タスク実行・検証経路との整合性を確保した上で、Prettier および各種検証スクリプトを実行して整合性を確認した。
