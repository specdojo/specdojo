---
specdojo:
  id: prj-0001:xer-pjr-7kxw-20261120t150712z-6ef7fda2
  type: exec-result
  task_id: PJR-7KXW
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-7KXW/pjr-7kxw-20261120T150712Z-6ef7fda2/plan.md
  started_at: "2026-11-20T15:07:13.205Z"
  completed_at: "2026-11-20T15:32:02.981Z"
  agent: flash-high-executor
  block_reason: "parent validation failed: lint-ts, lint-md"
---

# Edit Result

## 1. 実施内容

- register update コマンドに、指定した章の本文をファイルから一括で差し替える `--section &lt;name&gt;` および `--section-file &lt;path&gt;` オプションを追加しました。
- 個票の章の置換処理、イベント記録への `section` フィールドの追加、および単体テストの拡充を行いました。
- 関連するドキュメントおよびスキーマの更新を完了しました。

## 2. 変更ファイル

- `docs/ja/specdojo/references/command-reference.md`: add: `register update` コマンドへの `--section` および `--section-file` オプションの解説を追加
- `docs/specdojo/schemas/v1/register-events.schema.yaml`: add: `section` フィールドの定義を追加
- `src/register/command-types.ts`: add: `SectionUpdate` オプションの型定義を追加
- `src/register/create-commands.ts`: add: `register update` コマンドのオプションに `--section` と `--section-file` を追加
- `src/register/events.ts`: add: `section` フィールドを用いたイベント生成ロジックを追加
- `src/register/renumber.ts`: update: 章の置換に対応するための内部ロジックを整理
- `src/register/update.ts`: add: 指定された章の本文をファイルから読み込んで置換するロジックを実装
- `src/register/section.ts`: add: 章の分割と検索のためのユーティリティ関数を追加
- `tests/src/register/section.test.ts`: add: 章の置換およびイベント記録に関する単体テストを追加

## 3. 申し送り

- 判断事項（オプション名）: `--section &lt;name&gt;` と `--section-file &lt;path&gt;` を採用しました。両オプションはペア指定が必須であり、片方のみの指定はエラーになります。
- 判断事項（章の探索と置換範囲）: 見出し番号を除去した名前で検索し、個票の標準構造である `H2` 見出しを優先します。指定した章の見出し行を残し、次の同じ深さ（`H2` 等）または浅い見出しの直前までの本文全体を一括して置き換えます（章内のサブ見出しも含む）。
- 判断事項（イベント記録形式）: 個票本文と監査履歴を分離する方針に基づき、イベントスキーマに `section` フィールドを追加して `changes` に `{ field: "section", from: "", to: &lt;章名&gt; }` を記録します。また、`--reason` 省略時の `reason` は `section "&lt;章名&gt;" updated` となります。
- CHANGELOG に書く事項: [追加] specdojo `register update` に、個票の指定した章の本文をファイルから差し替える `--section &lt;name&gt;` と `--section-file &lt;path&gt;` オプションを追加した。
- 判断事項（オプション名）: --section &lt;章の名前&gt; と --section-file &lt;path&gt; を採用しました。両オプションはペア指定が必須であり、片方のみの指定はエラーになります。
- 判断事項（章の探索と置換範囲）: 見出し番号を除去した名前で検索し、個票の標準構造である H2 見出しを優先します。指定した章の見出し行を残し、次の同じ深さ（H2等）または浅い見出しの直前までの本文全体を一括して置き換えます（章内のサブ見出しも含む）。
- 判断事項（イベント記録形式）: 個票本文と監査履歴を分離する方針に基づき、イベントスキーマに section フィールドを追加して changes に { field: "section", from: "", to: &lt;章名&gt; } を記録します。また、--reason 省略時の reason は section "&lt;章名&gt;" updated となります。
- CHANGELOG に書く事項: [追加] specdojo register update に、個票の指定した章の本文をファイルから差し替える --section &lt;name&gt; と --section-file &lt;path&gt; オプションを追加した。
- 適用外の検証: `npm run validate:catalog`（変更は register コマンド実装、スキーマ、個票、リファレンス、テストであり、docs/ja/projects/ 配下の成果物カタログ管理文書（deliverables）を含まないため）

## 4. 進め方

1. `register update` コマンドに、個票の特定の章（`H2` 見出し）をファイルの内容で置き換えるためのオプション（`--section` と `--section-file`）を実装しました。 2. 章の構造を解析して、指定された見出しから次の同レベルの見出しまでの範囲を特定するロジックを `src/register/section.ts` に作成しました。 3. イベント履歴に「どの章が更新されたか」を記録するための `section` フィールドを `register-events.schema.yaml` および実装に追加しました。 4. 実装内容を検証する単体テストを `tests/src/register/section.test.ts` に記述しました。
