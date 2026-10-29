---
specdojo:
  id: prj-0001:xer-pjr-wwqh-20261025t144441z-bdf55cf3
  type: exec-result
  task_id: PJR-WWQH
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-wwqh-20261025T144441Z-bdf55cf3-plan.md
  started_at: "2026-10-25T14:44:41.652Z"
  completed_at: "2026-10-25T14:58:50.933Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- 共通 setup で継承されていた `SPECDOJO_PROJECT` 環境変数を除去し、親検証時の不要な環境変数引き継ぎによるテスト失敗を解消しました。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-config-guide.md`: `SPECDOJO_PROJECT` 環境変数の扱いに関するガイド内容を更新しました。
- `tests/setup/git-environment.ts`: 共通 setup において `SPECDOJO_PROJECT` を除去するように変更し、テスト fixture の隔離を確保しました。
- `tests/vitest-config.test.ts`: `SPECDOJO_PROJECT` が設定された環境下で子プロセスが正しく project を解決できることを検証する回帰テストを追加しました。
- `tests/test-environment.integration.test.ts`: 統合テスト環境における環境変数の継承動作を検証するための修正を行いました。

## 3. 申し送り

- 共通 setup を採用した理由は、親検証とシェルからの直接実行の双方でテスト fixture を隔離し、通常の CLI の project 選択を維持できるため。runner は変更しておらず、統合後の追加 exec run 確認は非適用。
- 追加した回帰テストは両設定の setup に `SPECDOJO_PROJECT=prj-0002` を渡し、子プロセスが fixture 側の project を解決できることを検証する。全テスト・型検査・lint・schema 検証の結果は親 runner の evidence に記録する。

## 4. 進め方

テストの共通 setup において、外部から引き継がれた `SPECDOJO_PROJECT` 環境変数がテスト fixture 内のプロジェクト設定と競合し Unknown project エラーを引き起こしていたため、この変数を明示的に除去（切り離し）する実装を行いました。これにより、親プロセスに環境変数が存在する場合でも、テスト内部では定義された fixture のプロジェクトが優先されるようになります。また、同様の不具合が再発しないよう、`SPECDOJO_PROJECT=prj-0002` を設定した状態で各テスト setup が正しく動作することを検証する回帰テストを追加し、関連ガイドを更新しました。
