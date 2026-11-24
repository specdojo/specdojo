---
specdojo:
  id: prj-0001:pjr-tn64-ready-guard-non-deliverables
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  difficulty: easy
  owner: DEV
  registered_at: "2026-11-24T03:45:46Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-JA3M
  commit_type: fix
  commit_scope: exec
---

# PJR-TN64 ready への昇格の検査が、テストの fixture まで成果物として止める

## 1. 課題内容

- 2026-11-24 の `PJR-JA3M` の run が、統合の段で「Deliverable status promotion to "ready" is human-only and must not be done by an agent run: tests/fixtures/yaml-pages/ifx-cmd-ai-provider-cli.yaml, …」で止まった。
- JA3M はテストを実物の sample に頼らない形にするため、sample を `tests/fixtures/` に写した。写した fixture の frontmatter の `status: ready` を、`src/exec/worktree-ops-commit.ts` の `assertNoAgentReadyPromotion` が「新しく ready になった成果物」と見なした。
- fixture は成果物ではなく、人の確定の対象でもない。検査は成果物（`docs/` の下など）だけに向くべきである。今回は executor に fixture の `status` を `draft` にさせて避けた。

## 2. 入力

- v0.10.0 に入れる（利用者の方針、2026-11-24: 今回の実行で詰まったところを issue として起票して直す）

## 3. 影響範囲

- テストの fixture や、成果物でない YAML・Markdown の写しを足す run が、統合の段で止まる。

## 4. 対応方針

- `assertNoAgentReadyPromotion` の対象を、成果物（catalog・kata の文書など、人の確定の対象）に絞る。`tests/`・`tools/` など成果物でない場所のファイルは対象から外す。絞り方（パスの規則か、成果物の解決か）と理由を個票の対応結果に書く。
- 単体テストで、`tests/fixtures/` の `status: ready` のファイルを足しても止まらず、成果物を ready にした場合は今までどおり止まることを確かめる。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証の `test-integration` を通す。

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- 関連: PJR-JA3M（止まった run）。
