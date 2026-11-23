---
specdojo:
  id: prj-0001:pjr-q723-reporter-format-failures
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-23T22:25:23Z"
  due_on: "2026-11-30"
  commit_type: fix
  commit_scope: exec
---

# PJR-Q723 review の段の reporter（gemma26）の出力が、形式のやり直しを 3 回しても通らない

## 1. 課題内容

- 2026-11-23〜24 の一括実行で、review の段（090）の `dmd`・`dmd-index`・`nfr-index`・`nfr-usability`・`mip-index`・`opd-access-control`・`opr`・`cpd`・`otp` の 9 件が「reporter output invalid after 3 format attempts」で止まった。
- 違反は、自由記述の欄の Markdown（コードの書式の中の空白 MD038、見出しの末尾の句読点 MD026、コードブロック）と、JSON Schema の必須の `verdict` の欠けだった。
- 9 件とも `exec resume --task ... --reporter-by sonnet-reporter` で通った。

## 2. 入力

- v0.10.0 に入れる（利用者の指定、2026-11-24）
- 2026-11-23〜24 の kata の一括実行（第 4〜6 波）で詰まった所から起票した

## 3. 影響範囲

- 小さな reporter を既定にすると、review の段がまとまって止まり、人が reporter を替えて再開する手間が要る。

## 4. 対応方針

- 形式のやり直しの上限に達したら、設定した代わりの reporter で 1 回やり直す設定を足す（rate limit のときの代わりの agent と同じ考え方）。設定の名前と既定値を個票の対応結果に書く。
- よくある違反（MD038・MD026・自由記述の中のコードブロック）は、検査の前に機械的に直せるものを直す。直してよい範囲と理由を個票の対応結果に書く。
- 今回の出力を fixture にした単体テストで、直せるものが直り、直せないものは代わりの reporter に回ることを確かめる。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証の `test-integration` を通す。

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- 関連: PJR-40EE（止まった理由の分類）。
