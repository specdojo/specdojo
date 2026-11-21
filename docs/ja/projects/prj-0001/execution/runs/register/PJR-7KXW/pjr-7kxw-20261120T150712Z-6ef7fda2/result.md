---
specdojo:
  id: prj-0001:xer-pjr-7kxw-20261120t150712z-6ef7fda2
  type: exec-result
  task_id: PJR-7KXW
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-7KXW/pjr-7kxw-20261120T150712Z-6ef7fda2/plan.md
  started_at: "2026-11-20T15:07:13.205Z"
  completed_at: "2026-11-20T23:00:05.960Z"
  agent: flash-high-executor
---

# Edit Result

## 1. 実施内容

- register update に --section と --section-file オプションを追加し、個票の章本文差し替え・検証・イベント記録・単体テスト・ドキュメント更新を完了しました。

## 2. 変更ファイル

- `docs/ja/specdojo/references/command-reference.md`: 変更、+14 / -0 行
- `docs/specdojo/schemas/v1/register-events.schema.yaml`: 変更、+1 / -0 行
- `src/register/command-types.ts`: 変更、+1 / -0 行
- `src/register/create-commands.ts`: 変更、+37 / -3 行
- `src/register/events.ts`: 変更、+2 / -2 行
- `src/register/renumber.ts`: 変更、+19 / -1 行
- `src/register/update.ts`: 変更、+16 / -0 行
- `src/register/section.ts`: 追加、+152 / -0 行
- `tests/src/register/section.test.ts`: 追加、+499 / -0 行

## 3. 申し送り

- 判断事項（オプション名）: --section &lt;章の名前&gt; と --section-file &lt;path&gt; を採用しました。両オプションはペア指定が必須であり、片方のみの指定はエラーになります。
- 判断事項（章の探索と置換範囲）: 見出し番号を除去した名前で検索し、個票の標準構造である H2 見出しを優先します。指定した章の見出し行を残し、次の同じ深さ（H2等）または浅い見出しの直前までの本文全体を一括して置き換えます（章内のサブ見出しも含む）。
- 判断事項（イベント記録形式）: 個票本文と監査履歴を分離する方針に基づき、イベントスキーマに section フィールドを追加して changes に { field: "section", from: "", to: &lt;章名&gt; } を記録します。また、--reason 省略時の reason は section "&lt;章名&gt;" updated となります。
- CHANGELOG に書く事項: [追加] specdojo register update に、個票の指定した章の本文をファイルから差し替える --section &lt;name&gt; と --section-file &lt;path&gt; オプションを追加した。
- 適用外の検証: `npm run validate:catalog`（変更は register コマンド実装、スキーマ、個票、リファレンス、テストであり、docs/ja/projects/ 配下の成果物カタログ管理文書（deliverables）を含まないため）

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
