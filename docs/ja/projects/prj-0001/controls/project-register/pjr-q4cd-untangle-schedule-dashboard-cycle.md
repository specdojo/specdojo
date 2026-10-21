---
specdojo:
  id: prj-0001:pjr-q4cd-untangle-schedule-dashboard-cycle
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-10-21T22:08:53Z"
  completed_at: "2026-10-21T23:27:51Z"
  conclusion: schedule と dashboard が共有する Timeline index とカタログの探索を src/shared へ移し、schedule から dashboard への import をなくした。3 機能以上をまたぐ循環は 0 組になり、schedule は dashboard を import しない向きを ESLint で検査する
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
| 1   | schedule から dashboard への import を外す | DEV  | done | 0.4.2 の範囲 |

## 4. 対応結果

- `src/dashboard/timeline-build.ts` が持っていた Timeline index の型・読み込みを `src/shared/timeline-index.ts` へ、ドメイン別のカタログ探索を `src/shared/catalog-files.ts` へ移した。どちらも schedule と dashboard が共有し、shared 内のみを import する処理であるため `src/shared/` に置いた。
- `src/schedule/strategy-generate-scope.ts` の import 先を上記の shared module に変更し、schedule から dashboard への import をなくした。`src/dashboard/timeline-build.ts` は従来の関数と型を re-export するため、CLI と既存の module API は変えていない。
- ESLint の `no-restricted-imports` に「`schedule` は `dashboard` を import しない」を error として追加し、`.github/instructions/typescript.instructions.md` の解消済みの依存方向を 7 組に更新した。
- PJR-T30J と同じく、`src/shared/`・`src/commands/`・`src/specdojo.ts` を除いた `src/` 直下の機能単位で static import / re-export のグラフから単純閉路を列挙した。3 機能以上をまたぐ循環は 0 組で、PJR-T30J の 2 組はどちらも解消した。
- 利用者から見た動きは変わらないため、CHANGELOG は更新していない。残課題はない。

## 5. 関連ドキュメント

- [[prj-0001:pjr-t30j-shared-scope-and-multi-feature-cycles|PJR-T30J shared の機能固有のモジュールを戻し、3 機能以上をまたぐ循環をほどく]]
