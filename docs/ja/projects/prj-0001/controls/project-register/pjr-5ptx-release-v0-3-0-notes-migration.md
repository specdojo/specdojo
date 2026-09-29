---
specdojo:
  id: prj-0001:pjr-5ptx-release-v0-3-0-notes-migration
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  owner: DEV
  registered_at: "2026-09-29T11:48:49Z"
  block_reason: "agent exited with non-zero code: agent exited with non-zero code: agent-config-write: protected configuration changes detected; paths=package.json; agent must record the required change in the result …"
---

# PJR-5PTX v0.3.0 のリリースノートと移行ガイドを作成し版を 0.3.0 に上げる

## 1. 概要

`v0.2.1` から develop までに 424 commit があり、登録簿の項目で 63 件が関係する。その中に、利用者の設定や記録に影響する破壊的変更がある。WPWB と K351 では「`package.json` の版はリリースのときに判断する」として据え置いた。

| 項目     | 変更                                                                                                                           | 影響を受ける利用者                                   |
| -------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| PJR-WPWB | 観点の `evaluation` を `agent` / `human` から `deterministic` / `referential` / `discretionary` に改名した。旧値はエラーになる | 観点定義を overlay している利用者                    |
| PJR-K351 | `continuous` を廃止し、28 観点を grade の対象にした。rubric を v2（9 category）にし、`pass_score` を 75 にした                 | 観点定義を overlay している利用者、既存の grade 結果 |
| PJR-XTAN | review の判定語彙を 6 値に統一した。旧値はエラーになる                                                                         | `verdict_definitions` を overlay している利用者      |
| PJR-N22N | review テンプレート（`xrp-*` / `xrr-*`）を改訂し、観点別詳細テンプレートを削除した                                             | review テンプレートを eject している利用者           |

追加された主な機能として、並行実行と再開（3HHW、R0XA、CTV4、36CN、4HBG の `--join`、E2Q3）、commit 範囲の絞り込み（FFPK）、grade の契機と `--rubric-outdated`（N03W、2F3Y、Z47X、BVPS）、`config init` の `.gitignore`（HG98）、記帳コマンドの `--commit`（9XG4）、`devcontainer scaffold`（2H5F）、`config scaffold --global`（0FK2）、docs サイトの軽量化（E8FY、QQXP、SJ3X）などがある。

## 2. 完了条件

- リリースノートがある。置き場所は、リポジトリ直下の `CHANGELOG.md` とする（npm package の慣例に合わせ、package にも同梱する）。0.3.0 の節に、破壊的変更・追加機能・不具合修正を分けて書く。
- 移行ガイドがある（`docs/ja/specdojo/guides/` 配下）。上表の破壊的変更ごとに、旧値と新値の対応、エラーになったときの直し方、eject・overlay した利用者の手順を書く。既存の grade 結果は rubric v2 と比べられず、`--rubric-outdated` で評価し直せることを書く。
- README の「使い始める」から、リリースノートと移行ガイドへ辿れる。
- `package.json` の `version` が `0.3.0` になっている。0.2.1 と同じ方法（版を上げる commit）で上げる。`packages/*` の版は、変更があるものだけを判断し、判断の結果を対応結果に記録する。
- 記述は各項目の個票を正とし、推測で変更点を書かない。
- `npm run check` と `npm run docs:build` が成功する。
- main への PR 作成・merge・npm 公開は人の作業として残し、手順を対応結果に記録する。

## 3. 作業内容

| No  | 作業                                          | 担当 | 状態 | メモ                            |
| --- | --------------------------------------------- | ---- | ---- | ------------------------------- |
| 1   | v0.2.1 以降の変更を個票から洗い出し、分類する | PM   | done | 個票を正として分類              |
| 2   | `CHANGELOG.md` を作成する                     | PM   | done | package に同梱                  |
| 3   | 移行ガイドを作成する                          | DEV  | done | 破壊的変更ごと                  |
| 4   | 版を 0.3.0 に上げる                           | DEV  | done | `packages/*` は変更の有無で判断 |
| 5   | PR・公開の手順を記録する                      | PM   | done | 人の作業                        |

## 4. 対応結果

- `v0.2.1` 以降の個票を正として、破壊的変更、追加機能、不具合修正を `CHANGELOG.md` の
  0.3.0 節へ分類した。利用者の移行に直接関係する PJR-WPWB、PJR-K351、PJR-XTAN、PJR-N22N
  は破壊的変更として明示し、主要な追加・修正には根拠となる PJR-ID を併記した。
- [[specdojo:release-v0-3-0-migration-guide|v0.3.0 移行ガイド]]を作成した。
  `evaluation` の再分類、`continuous` の削除、rubric v2、review verdict の 6 値、コピー済み
  review テンプレートと既存 plan、`--rubric-outdated` による再評価の手順を記載した。
- README の「使い始める」から `CHANGELOG.md` と移行ガイドへ辿れるようにした。
- root の `package.json` と `package-lock.json` を `0.3.0` へ更新し、`CHANGELOG.md` を npm package
  の同梱対象へ追加した。`v0.2.1` と同じく manifest と lockfile の版をそろえている。
- `packages/*` は `v0.2.1` からの差分を確認した。機能変更がある
  `@specdojo/docs-site` は `0.1.0` から `0.2.0` へ更新した。差分のない
  `@specdojo/docs-lint` と `vscode-specdojo` は `0.1.0` のまま据え置いた。
- リリース前の `npm run lint:ts` で検出した PJR-2H5F の lint 不備を修正した。
  `devcontainer-command.ts` の型専用 import と、`devcontainer-scaffold.test.ts` の mock 型を
  明示し、未使用 import と `any` を除いた。動作やテスト条件は変更していない。
- main への Pull Request 作成・merge、npm staged release の tarball 確認と 2FA 承認、
  `v0.3.0` tag と GitHub Release の作成は maintainer が行う。具体的なコマンドと順序は移行
  ガイドの「リリース作業の境界」に記載した。本作業では PR、merge、npm 公開、tag 作成を
  実行していない。

## 5. 関連ドキュメント

- PJR-WPWB、PJR-K351、PJR-XTAN、PJR-N22N（破壊的変更）
- `package.json`、`README.md`、`.github/workflows/publish-specdojo.yml`
