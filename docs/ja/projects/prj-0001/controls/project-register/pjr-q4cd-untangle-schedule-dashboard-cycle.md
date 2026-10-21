---
specdojo:
  id: prj-0001:pjr-q4cd-untangle-schedule-dashboard-cycle
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-10-21T22:08:53Z"
  derived_from:
    - PJR-T30J
---

# PJR-Q4CD schedule から dashboard への import を外し、3 機能をまたぐ循環をほどく

## 1. 概要

PJR-T30J で、schedule → dashboard → exec → schedule と schedule → dashboard → routine → exec → schedule の 2 組の循環が見つかった。どちらも schedule/strategy-generate-scope.ts から dashboard/timeline-build.ts への import 1 か所を通るため、これを外して 2 組をほどき、依存の向きを ESLint で検査する

## 2. 完了条件

- 0.4.2 の範囲とする（2026-10-22、利用者が承認）。
- `src/schedule/strategy-generate-scope.ts` が `src/dashboard/timeline-build.ts` から使っているものを、`src/schedule/` か `src/shared/` へ移すなどして、schedule から dashboard への import をなくす。PJR-T30J の個票の対応結果にある 2 組の循環（schedule → dashboard → exec → schedule、schedule → dashboard → routine → exec → schedule）が解消する。
- 移したものの置き場の判断（`src/shared/` へ置く場合は、`src/shared/` から機能を import しない規則を守る）と理由を result に書く。
- ESLint の `no-restricted-imports` に「`schedule` は `dashboard` を import しない」を error として加える（`.github/instructions/typescript.instructions.md` の循環の解消の方針に従い、解消した組の向きを検査に加える）。同じ文書の該当の行も更新する。
- 機能の間の循環が残っていないことを、PJR-T30J と同じ数え方で確かめ、result に書く。
- CLI と公開 API の動きは変えない。利用者から見た動きは変わらないため、CHANGELOG には書かない。

- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。

## 3. 作業内容

| No  | 作業                                       | 担当 | 状態 | メモ         |
| --- | ------------------------------------------ | ---- | ---- | ------------ |
| 1   | schedule から dashboard への import を外す | DEV  | open | 0.4.2 の範囲 |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- PJR-T30J（循環の洗い出し）
