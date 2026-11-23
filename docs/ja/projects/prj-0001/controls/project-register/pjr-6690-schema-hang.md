---
specdojo:
  id: prj-0001:pjr-6690-schema-hang
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-23T22:24:22Z"
  due_on: "2026-11-30"
  commit_type: fix
  commit_scope: validate
---

# PJR-6690 親の検証の validate-schema が、並べて流したときに固まり時間切れになる

## 1. 課題内容

- 2026-11-23〜24 の kata の一括実行（`exec run --auto --parallel 5 --loop`）で、`T-KATA-WAVE-5-otp-sample-040`・`T-KATA-WAVE-5-opr-sample-060`・`T-KATA-WAVE-6-DESIGN-mm-sample-040`・`T-KATA-WAVE-6-PROJECT-pm-risk-register-sample-060` が「parent validation failed: validate-schema」で止まった。
- 4 件とも、一括実行が終わって負荷が下がった後に `exec resume --task` で流し直すと通った（2026-11-24 01:42〜01:52）。成果物の誤りではなかった。

## 2. 入力

- v0.10.0 に入れる（利用者の指定、2026-11-24）
- 2026-11-23〜24 の kata の一括実行（第 4〜6 波）で詰まった所から起票した

## 3. 影響範囲

- 並べて流す一括実行のたびに、検証の失敗ではないのにタスクが止まり、人が再開する手間が要る。
- 原因が分からないまま、検証の失敗と見分けにくい。

## 4. 対応方針

- 5 本を同時に流したときの `npm run validate:schema` を測り、固まる箇所（どの段・どのファイル）と原因を特定して、個票の対応結果に書く。
- 原因を直し、同時に 5 本流しても時間内に終わることを、測った時間とともに個票の対応結果に書く。直せない場合は、並べる数の上限か待ち合わせで避け、その理由を書く。
- 時間切れのときは、止まった検査の段と経過時間を block の理由に出す。
- 再現のテスト（または計測のスクリプト）を残す。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証の `test-integration` を通す。

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- 関連: PJR-40EE（止まった理由の分類）。今回の一括実行の記録は PJR-8X86。
