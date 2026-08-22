---
specdojo:
  id: prj-0001:xer-pjr-zwmh-20260822t140937z-7efd
  type: exec-result
  task_id: PJR-ZWMH
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-zwmh-20260822T140937Z-7efd-plan.md
  started_at: "2026-08-22T14:09:38.053Z"
  completed_at: "2026-08-22T14:40:09.998Z"
  agent: codex-expert-executor
---

# Edit Result

## 1. 実施内容

- PJR-ZWMH に対応し、登録簿の索引生成（`src/register.ts`）でセル出力時に山括弧プレースホルダをインラインコード化する処理を追加した。
- remark ルール `tools/docs/src/remark-no-unescaped-angle-placeholder.ts` を拡張し、本文の html ノードだけでなく個票 frontmatter の文字列値も未エスケープの山括弧プレースホルダとして検知できるようにした。
- 個票 `pjr-zwmh-register-index-angle-placeholder-escape.md` の完了条件・作業内容・対応結果セクションを実施内容に基づき更新した（作業内容6件はすべて done、対応結果に変換規則・frontmatter検知・読み戻し互換・残課題なしを記載）。
- 事象が確認された個票 `pjr-wvns-planning-artifacts-catalog-scope.md` の frontmatter `conclusion` にあった素の `dct-&lt;domain&gt;.yaml` 相当のプレースホルダをインラインコード化し、本タスクが解消すべき実例そのものを是正した。
- `register build` で登録簿と派生ビューを再生成し、`remark --frail` で生成物側に未エスケープの山括弧が残っていないことを確認した。
- `npm run typecheck`、`npm run lint:ts`、`npm run lint:md` は成功。`npm run validate:schema` は sandbox 内の tsx IPC ソケット作成 EPERM により npm script 経由では失敗したが、各 validator を `node --import tsx` で個別実行しすべて成功したことで代替確認済み。
- 関連する unit test（`tests/src/register.test.ts`、`tests/tools/docs/src/remark-no-unescaped-angle-placeholder.test.ts`、`tests/src/doc-index.test.ts` の計95件）は成功。`npm run test:unit`（全件）は本タスクと無関係な既存の `exec-agent-protected-config` テストの `git check-ignore --stdin` が sandbox 内で停止したため中断しており、完走はできていない。
- 親 runner による `npm run test:integration`（source=runner, id=test-integration）は passed で、認証済みの唯一の runner 検証は成功している。

## 2. 変更ファイル

- `src/register.ts`: 登録簿の表セル生成処理に、コードスパン外の山括弧プレースホルダ（英数字・ハイフン・アンダースコアと連結する範囲を含む）をインラインコード化する変換を追加した。
- `tools/docs/src/remark-no-unescaped-angle-placeholder.ts`: 既存の本文 html ノード検査に加え、Markdown frontmatter（YAML）の文字列値に含まれる未エスケープの山括弧プレースホルダも検知対象へ拡張した。
- `tests/src/register.test.ts`: 表セルへのインラインコード化変換（連結範囲の一括変換、既存コードスパンの二重化防止、`parsePjrIndex` の読み戻し互換）を検証する unit test を追加した。
- `tests/tools/docs/src/remark-no-unescaped-angle-placeholder.test.ts`: frontmatter 側の山括弧プレースホルダ検知（新規検査対象）を検証する unit test を追加した。
- `docs/ja/projects/prj-0001/controls/project-register/pjr-zwmh-register-index-angle-placeholder-escape.md`: 完了条件・作業内容（6件 done）・対応結果セクションを実施内容に基づき記入した。
- `docs/ja/projects/prj-0001/controls/project-register/pjr-wvns-planning-artifacts-catalog-scope.md`: frontmatter `conclusion` にあった素の山括弧プレースホルダ（`dct-&lt;domain&gt;.yaml` 相当）をインラインコードへ修正した（本タスクが解消対象とする実例）。

## 3. 申し送り

- `npm run validate:schema` は npm script 経由では sandbox の tsx IPC ソケット EPERM で失敗する。各 validator を `node --import tsx` で個別実行するワークアラウンドで全対象成功を確認済みだが、sandbox 側の script 実行方式自体の恒久対応は未着手。
- `npm run test:unit`（全件）は本タスクと無関係な既存の `exec-agent-protected-config` テストの `git check-ignore --stdin` が sandbox 内で停止し完走していない。本タスク関連の unit test（register / remark 山括弧検査 / doc-index）は個別実行で95件成功済み。既存テストの sandbox ハング自体は別課題として切り出しの要否を検討されたい。

## 4. 進め方と実践の型の適用

登録簿生成（`src/register.ts`）の表セル出力へ、コードスパン外の山括弧プレースホルダ（連結範囲を含む）をインラインコード化する変換を実装し、既存の remark 検査ルール（本文の html ノードのみ対象）を frontmatter の文字列値にも適用できるよう拡張することで、生成物側の無害化と frontmatter 側の早期検知を両立させた。`parsePjrIndex` の読み戻しはコードスパンを剥がさず表示値として保持する方針とし、再生成時の二重変換を防いだ。実装後は関連 unit test・`register build`・`remark --frail`・`catalog validate`・`index build` で動作確認し、個票の完了条件・作業内容・対応結果を実施内容に基づき更新した。あわせて本事象の実例であった `pjr-wvns` 個票 frontmatter の未エスケーププレースホルダも是正した。`validate:schema` の npm script 実行不可は sandbox 制約によるものと判断し、`node --import tsx` による個別実行で代替検証した。`npm run test:unit` の全件失敗は既存テストの sandbox 依存によるものと判断し、影響範囲のテストを個別実行して確認した。親 runner の `test-integration` 検証は passed。
