---
specdojo:
  id: prj-0001:pjr-t30j-shared-scope-and-multi-feature-cycles
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: low
  owner: DEV
  registered_at: "2026-10-18T15:47:38Z"
  block_reason: "agent exited with non-zero code: parent validation failed: test-unit; rate limit fallback: sol-executor -> opus-executor at 2026-10-21T15:54:08.618Z"
  derived_from:
    - PJR-WSET
---

# PJR-T30J shared の機能固有のモジュールを戻し、3 機能以上をまたぐ循環をほどく

## 1. 概要

WSET の見直しで、src/shared/ に 1 機能からしか使われない 6 モジュール（catalog-paths・template-resolution・schedule-paths・random・yaml-schema-modeline・specdojo-gitignore）と機能固有の 2 モジュール（catalog-render・schedule-index）が残ることが分かった。あわせて schedule → dashboard → exec → schedule のような 3 機能以上をまたぐ循環が残っている。どこまで戻すか・ほどくかは完了条件を決めてから行う

## 2. 完了条件

- 0.4.2 の範囲とする（2026-10-22、利用者が承認）。
- `src/shared/` の catalog-paths・template-resolution・schedule-paths・random・yaml-schema-modeline・specdojo-gitignore・catalog-render・schedule-index について、今どの機能から import されているかを数え、result に表で書く。1 つの機能だけが使うものはその機能のディレクトリへ移し、2 つ以上の機能が使うものは `src/shared/` に残す。残したものは理由を書く。
- 移したモジュールの import をすべて直し、公開している API と CLI の動きは変えない。
- 3 つ以上の機能をまたぐ循環（schedule → dashboard → exec → schedule など）は、今ある組を洗い出して result に書く。この項目ではほどかず、組ごとに登録簿へ起票する案を result の申し送りに書く（`.github/instructions/typescript.instructions.md` の「循環する組ごとの登録簿項目で解消」の方針に従う）。
- ESLint の `no-restricted-imports` の今の規則が通ったままである。

- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- 利用者から見た動きは変わらないため、CHANGELOG には書かない。

## 3. 作業内容

| No  | 作業                                        | 担当 | 状態 | メモ         |
| --- | ------------------------------------------- | ---- | ---- | ------------ |
| 1   | shared の機能固有のモジュールを各機能へ戻す | DEV  | open | 0.4.2 の範囲 |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- PJR-WSET（循環の見直し）
