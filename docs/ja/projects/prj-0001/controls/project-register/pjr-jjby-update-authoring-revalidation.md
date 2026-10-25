---
specdojo:
  id: prj-0001:pjr-jjby-update-authoring-revalidation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: medium
  owner: DEV
  registered_at: "2026-10-24T23:47:37Z"
  due_on: "2026-10-31"
---

# PJR-JJBY authoring の kata ができた後、register update が担当や期限の変更でも止まる

## 1. 課題内容

`register update` は変更しない approach と target も毎回検証し直すため、authoring の個票は kata ができた後、担当や期限だけを変える場合も「kata id already exists」で止まる。

- 起きた条件: 利用者の project（coderdojo-lessons-specdojo の prj-0001）で、`--approach template-authoring --target edu-scratch:lsd-template` の個票（PJR-EKFP）を exec run で流し、template ができた後に `register update --owner BA --due 2026-10-31 --commit` を実行した。
- エラー: `Kata id edu-scratch:lsd-template already exists; use template-maintenance instead`
- 原因の見立て: `src/register/create-commands.ts` の update は、`--approach`・`--target` を指定しない場合も、個票にある approach と target で `validateRegisterApproachTargetsForProject` を呼ぶ。authoring の検証は「新しい kata ID がまだない」ことを求めるため、実行の後は必ず失敗する。
- 回避: `--approach - --target - --source -` で approach の記録を外して設定した。実行したときの approach は、イベントの履歴と plan・result に残る。

## 2. 影響範囲

| 観点         | 影響                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------- |
| スコープ     | authoring の個票の、実行後の `register update`（担当・期限・優先度・本文に関わる欄など） |
| スケジュール | 回避の手順を調べる手間                                                                   |
| コスト       | approach の記録を外す回避が要る                                                          |
| 品質         | 回避すると、個票の frontmatter から実行したときの approach と対象が消える                |
| 関係者       | kata を authoring で作る利用者                                                           |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                             |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | update が、変えない approach と target も検証し直す。authoring の「新しい ID がまだない」という条件は、起票時と実行前にだけ意味を持つ                                            |
| 対応策   | `--approach`・`--target`・`--source` を変えない update では、approach と target を検証し直さない。または、authoring の「まだない」の検証を、項目が `open` のときに限る           |
| 依存事項 | なし                                                                                                                                                                             |
| 完了条件 | authoring の kata ができた後も、担当・期限などだけを変える `register update` が通る。approach や target を変える update では、従来どおり検証される。これらを確かめる test がある |

### 追記（2026-10-25、利用者が承認）

- v0.4.6 の範囲とする。対応策は前者（`--approach`・`--target`・`--source` を変えない update では、approach と target を検証し直さない）を採る。
- `register add` と、`--approach`・`--target`・`--source` のいずれかを指定した update では、従来どおり検証する。
- `exec plan`・`exec run` の実行前の検証（authoring の「新しい kata ID がまだない」）は変えない。
- 回避のために approach を外した利用者向けに、外した approach と target を update で戻す手順が使えるかを確かめ、個票の対応結果と報告の `handoff` に書く。kata ができた後に authoring の approach を戻すことが検証で止まる場合は、その扱いも書く。
- 単体テストで、kata ができた後の担当・期限・優先度だけの update が通ること、approach・target・source を変える update では検証されることを確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [Unreleased]` の節に書く（なければ作る）。

## 4. 対応結果

update では `--approach`・`--target`・`--source` のいずれも指定されない場合、既存値での approach・target 検証を省略するようにした。担当・期限・優先度などの更新は通り、3項目のいずれかを指定した update は従来どおり検証する。`register add` および `exec plan` / `exec run` の実行前検証は変更していない。

単体テストでは、すでに存在する kata ID を持つ authoring 個票について、担当・期限・優先度の更新が通ること、source を明示して変更する更新が「kata id already exists」で拒否されることを確認する。approach を外した回避済み個票へ元の authoring approach と既存 kata target を戻す操作も、この検証により同じ理由で拒否される。作成済み kata の新規 authoring を再開する用途では `*-maintenance` を使う。対象以外の未解決事項はない。

## 5. 関連ドキュメント

- 報告元: 利用者の project（coderdojo-lessons-specdojo の prj-0001）の PJR-EKFP
