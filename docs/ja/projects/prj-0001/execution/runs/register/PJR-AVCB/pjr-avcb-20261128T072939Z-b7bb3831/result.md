---
specdojo:
  id: prj-0001:xer-pjr-avcb-20261128t072939z-b7bb3831
  type: exec-result
  task_id: PJR-AVCB
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-AVCB/pjr-avcb-20261128T072939Z-b7bb3831/plan.md
  started_at: "2026-11-28T07:29:44.566Z"
  completed_at: "2026-11-28T07:40:42.545Z"
  agent: sol-executor
  block_reason: "parent validation failed: test-unit"
---

# Edit Result

## 1. 実施内容

- `register close` で note を `done` にできるよう CLI を修正し、`pjr-rulebook`（日英）、登録簿運用ガイド、コマンドリファレンスを PJR-CA6G の決定に合わせて更新した。
- note の close は `--conclusion` を必須とし、`--status` 省略時は `done` にする。`decided`・`rejected`・`deferred` は note に使えない。
- executor 側の検査（prettier、markdownlint、`register build`、履歴リンク、`git diff --check`）は成功した。runner の検査は、`test:unit` を除きすべて成功または適用外だった。
- runner の `npm run test:unit` は失敗した。`tests/src/register/commands.test.ts` の 1685 行付近で、`register reopen` 後の `process.exitCode` が `undefined` にならなかった。証拠の出力は途中で省略されており、2 件中 1 件目しか確認できないため、2 件目は不明。原因の切り分けと修正が必要で、このままでは完了とは言えない。

## 2. 変更ファイル

- `docs/en/specdojo/rulebooks/pjr-rulebook.md`: 英語版 `pjr-rulebook` の note の扱いを、done で close できる内容に更新した。
- `docs/ja/specdojo/guides/register-operation-guide.md`: 登録簿運用ガイドの note の扱いを、done での close に合わせて更新した。
- `docs/ja/specdojo/references/command-reference.md`: `register close` のコマンドリファレンスを、note の close 仕様に合わせて更新した。
- `docs/ja/specdojo/rulebooks/pjr-rulebook.md`: 日本語版 `pjr-rulebook` の type 別の扱いで、note を done で close できるようにし、reject・defer を使わない旨を反映した。
- `src/register/transition-commands.ts`: close コマンドの処理を、note の close に対応させた。
- `src/register/update.ts`: note の close を拒否していた処理を直した。note は `done` のみ許可し、`--conclusion` を必須にした。空文字・空白だけ・`-` は未記入として拒否する。
- `tests/src/register/commands.test.ts`: note の close に関するテストを追加・更新した。

## 3. 申し送り

- runner の `npm run test:unit` が失敗している（`tests/src/register/commands.test.ts:1685` の `register reopen` 後の `exitCode` 検証）。出力が省略されていて 2 件中 2 件目は不明なため、`parent-validation-attempt-1-test-unit.log` を確認し、失敗を解消してから先へ進める。
- runner が管理する個票 `pjr-avcb-note-close-support.md` は、executor が作業内容・対応結果を更新した。
- 保護設定の変更案を個票 5.2 に記録した。承認後、`.agents/specdojo-orchestrator.agent.md` の type 表の note 行を「| `note` | 記録として残す観測・分析 | `done` |」へ置換する。note の段落案:「`note` の `open` は継続して更新できる記録を表す。使い終わった note（内容を別の項目・文書・運用メモへ移した、または古くなった）は `register close --conclusion &lt;text&gt;` で `done` にし、移した先または古くなった理由を必ず書く。`--status` を省いた場合も `done` とし、`decided`・`rejected`・`deferred` は使わない。必要になれば `register reopen` で `open` に戻す。対応や判断が必要になった場合は、目的に合う別の type で起票し、note を参照元とする（`pjr-rulebook` の type 別の扱い）。」反映時に `npm run orchestrator:sync` と `npm run lint:orchestrator-sync` を実行する。
- 判断: 結論の空文字・空白だけ・未設定値を表す `-` も未記入として拒否する。既存の結論があっても、今回使い終わった根拠を残すため `--conclusion` の明示を必須にした。個票 5.1 にも記録した。
- 確認したステータス定義（登録項目個票）には note の旧い業務遷移と close 拒否の説明が残る。本項目指定の規範 3 文書とは別に、PJR-CA6G に合わせた設計更新を後続で扱う。個票 5.3 にも記録した。
- CHANGELOG 文案を個票 5.4 に記録した。区分は不具合修正（v0.10.0）。文案: `register close` で使い終わった note を `done` にできるようにした。移した先または古くなった理由を `--conclusion` に必須とし、必要になれば `register reopen` で再開できる。note の reject・defer は引き続き拒否する。
- 適用外の検証: `npm run validate:schema:file`（executor が変更した成果物に YAML・YML ファイルがないため。）

## 4. 進め方

個票と PJR-CA6G の決定に沿って、CLI（`update.ts`、`transition-commands.ts`）、単体テスト、規範文書（日英の `pjr-rulebook`、運用ガイド、コマンドリファレンス）を修正した。整形と静的検査は executor が実施し、型チェック・単体テスト・統合テストなどは親 runner が実施した。
