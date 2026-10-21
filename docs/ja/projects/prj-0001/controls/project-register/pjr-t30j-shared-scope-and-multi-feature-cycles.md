---
specdojo:
  id: prj-0001:pjr-t30j-shared-scope-and-multi-feature-cycles
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: low
  owner: DEV
  registered_at: "2026-10-18T15:47:38Z"
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
| 1   | shared の機能固有のモジュールを各機能へ戻す | DEV  | done | 0.4.2 の範囲 |

## 4. 対応結果

### 4.1. shared の 8 モジュールの利用元

`src/` の相対 import（型だけの import と re-export を含む）を数えた。「機能」は `src/` 直下のディレクトリとし、`src/shared/` 内の別モジュールからの利用は別の列に書いた。

| モジュール             | 利用する機能                                                                   | `src/shared/` 内の利用元            | 判断                 |
| ---------------------- | ------------------------------------------------------------------------------ | ----------------------------------- | -------------------- |
| `catalog-paths`        | catalog（`catalog/paths.ts` が re-export）                                     | `catalog-render`                    | 残す                 |
| `template-resolution`  | docs（`docs/template-resolution.ts` が re-export。ほかの機能はこれを経由する） | `plan-templates`                    | 残す                 |
| `schedule-paths`       | exec（`exec/shared.ts` が re-export）                                          | `schedule-index`                    | 残す                 |
| `random`               | exec（`exec/shared.ts` が re-export）                                          | `cross-process-lock`                | 残す                 |
| `yaml-schema-modeline` | kata                                                                           | なし                                | `src/kata/` へ移した |
| `specdojo-gitignore`   | commands（`init.ts`）                                                          | `specdojo-config`                   | 残す                 |
| `catalog-render`       | catalog・docs                                                                  | `schedule-index`（型 `DctSection`） | 残す                 |
| `schedule-index`       | dashboard・exec・grade                                                         | なし                                | 残す                 |

残した 7 つの理由は次のとおり。

- `catalog-paths`・`template-resolution`・`schedule-paths`・`random`・`specdojo-gitignore`: 利用する機能は 1 つだが、`src/shared/` の別のモジュールも使っている。`src/shared/` から機能を import できない（`no-restricted-imports`）ため、機能のディレクトリへ移すと規則を破る。
- `catalog-render`: catalog と docs の 2 つの機能が使い、`schedule-index` も型を使っている。
- `schedule-index`: dashboard・exec・grade の 3 つの機能が使っている。

### 4.2. 実施内容

- `src/shared/yaml-schema-modeline.ts` を `src/kata/yaml-schema-modeline.ts` へ移し、`src/kata/kata.ts` の import を直した。ほかに利用元はなく、公開 API と CLI の動きは変わらない。
- 利用者から見た動きは変わらないため、CHANGELOG には書いていない。

### 4.3. 3 つ以上の機能をまたぐ循環

`src/shared/`・`src/commands/`・`src/specdojo.ts` を除いた機能単位の import グラフで単純閉路を洗い出した。2 つの機能の間の循環はなく、3 つ以上をまたぐ循環は次の 2 組だった。この項目ではほどいていない。

| No  | 循環                                             | 循環を作っている import                                                                                                                                                     |
| --- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | schedule → dashboard → exec → schedule           | `schedule/strategy-generate-scope.ts` → `dashboard/timeline-build.ts`、`dashboard/dashboard*.ts` → `exec/types.ts` ほか、`exec/**` → `schedule/phase-sets.ts`（6 ファイル） |
| 2   | schedule → dashboard → routine → exec → schedule | No.1 の辺に加え、`dashboard/routines.ts` → `routine/routine.ts`、`routine/routine.ts` → `exec/run/lock.ts`                                                                  |

どちらも `schedule → dashboard`（`strategy-generate-scope.ts` が `dashboard/timeline-build.ts` を使う 1 か所）を通る。この 1 本を外すと 2 組とも解消する見込み。

### 4.4. 残課題

- 循環ごとに登録簿へ起票する案: (1) 「schedule → dashboard → exec → schedule の循環をほどく」、(2) 「schedule → dashboard → routine → exec → schedule の循環をほどく」。どちらも `schedule → dashboard` の 1 本を外せば解消する見込みなので、1 件にまとめてもよい。解消したら、その依存の向きを ESLint の `no-restricted-imports` に追加する。

## 5. 関連ドキュメント

- PJR-WSET（循環の見直し）
