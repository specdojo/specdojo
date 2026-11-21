---
specdojo:
  id: prj-0001:pjr-n2cp-strategy-kata-phases-fix
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  difficulty: hard
  owner: sol-executor
  registered_at: "2026-11-13T21:53:08Z"
  completed_at: "2026-11-15T01:18:56Z"
  conclusion: strategy generate の bootstrap-kata-set と improve-kata に rulebook・recipe・sample・template を同期する段を足した
  derived_from:
    - PJR-J0VS
  commit_type: fix
  commit_scope: schedule
---

# PJR-N2CP 型を直す intent の strategy に、recipe・template・sample の手直しの段を作る

## 1. 概要

PJR-J0VS の修正

## 2. 入力

- PJR-J0VS の修正。kata-wave-1 の後、wave-2 を作る前に流す（indie が 2026-11-14 に承認）

## 3. 完了条件

- `schedule strategy generate` が、intent `improve-kata` と `bootstrap-kata-set` で、型の手直しの段（rulebook・recipe・sample・template）を作る。今は orchestrator が T88P の phase_sets を写して手で足している。
- 型が recipe・template を持たない（`not-needed`）場合の段の扱いを決める（段を作らない、または「変えない」と書いて終える）。
- 生成される段の説明に、Rulebook 記述標準の章立て・sample の厚さ・正本を参照する方針など、T88P の段の説明にある共通の決まりを入れる。
- 生成した strategy を、手で足した `sch-strategy-kata-wave-1.yaml` と比べ、同じ段が並ぶことを確かめる。回帰テストを足す。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                      | 担当         | 状態 | メモ                                                                |
| --- | ----------------------------------------- | ------------ | ---- | ------------------------------------------------------------------- |
| 1   | 型の整備 profile と共通説明を修正         | sol-executor | done | rulebook → recipe → sample → template、suffix は 040・045・050・060 |
| 2   | 要否宣言ごとに段構成・担当ルールを分ける  | sol-executor | done | `not-needed` の見直し段を省略                                       |
| 3   | wave-1 比較と回帰テスト、利用ガイドを更新 | sol-executor | done | 生成・schema・schedule 展開の smoke 検証を実施                      |
| 4   | 親検証で失敗した2件のテスト入力を修正     | sol-executor | done | intent を補い、schema と省略後の段順・依存を再確認                  |

## 5. 対応結果

### 5.1. 実施内容

- `src/schedule/strategy-profiles.ts` の `bootstrap` に4種の見直し段を追加し、`rulebook-maintenance` も型一式を同期する構成にした。recipe・sample・template の suffix を wave-1 と同じ 045・050・060 に分け、タスク ID の重複を防いだ。
- 型の整備段に Rulebook 記述標準の章立て・見出し連番・判断基準と良い例／悪い例、完成例の外出しと厚さ、recipe／template の要否宣言、実装・schema・リファレンスの正本参照方針を含めた。
- `src/schedule/strategy-generate-document.ts` で成果物ごとに `not-needed` の段を省略し、同じ担当・approach でも有効な段構成が異なれば `owner_rules` を分けるようにした。既定の段構成と gate も省略後の構成から導出する。
- `tests/src/schedule/strategy-generate.test.ts` に、両 intent の生成、wave-1 の段順・suffix・実行属性との比較、段間依存と ID の一意性、同一担当での要否宣言の混在、型の直接指定を検証する回帰テストを追加した。利用ガイド2冊を生成動作に合わせた。
- 再開時、同一担当で要否宣言が異なる2件の回帰テストに、対応する intent と scope／target を補った。bootstrap の scope は成果物ごとの要否宣言に合わせ、rulebook の改善は共通の target を指定した。

### 5.2. 判断と理由

- 生成時に `not-needed` と判明している型の見直し段は作らない。既存の要否宣言と生成ガイドに合わせ、不要な作業を割り当てないため。bootstrap の実行で新たに不要と判断される場合もあるため、既に生成された段には「変更せず理由を result に記録して完了する」と指示した。明示的な target／scope に `not-needed` を含めた場合の生成停止は維持する。
- `improve-kata` の `kata_target: rulebook` は rulebook → recipe → sample → template の同期を行う。T88P の手修正と同じく、規則の改訂を他の型へ反映する必要があるため。recipe・sample・template の直接指定は指定した型だけを見直し、対象を限定する既存の意味を保つ。
- bootstrap は wave-1 と同じ全9段、rulebook の改善は T88P と同じ4種の見直し → レビュー → 確定とした。後者へ代表成果物の磨き込みを追加しないのは、型を直す作業範囲を守るため。prj-0001 固有のサイドバーメニュー更新指示は汎用 profile へ入れない。
- 同じ担当・approach でも、要否宣言に応じて段構成を分ける仕様を維持した。前回の親検証の2件は、段分割の判定前に空の `approach_rules` が schema の最低1件という条件に違反して失敗していたため、生成仕様や schema を緩めずテスト入力を直した。

### 5.3. 検証と残課題

- 一時 fixture で `generateStrategy` → schema 検証 → `buildScheduleTrack` を実行し、wave-1 の段順・見直し段の属性、4種の直接指定、rulebook frontmatter による recipe／template の省略、タスク suffix の一意性と順次依存を確認した。
- 再開後の一時 fixture でも、修正した intent を使い、bootstrap と rulebook の改善それぞれの schema 検証・schedule 展開が成功した。同一担当の2成果物で recipe／template の省略後の段順、担当ルールの分割、一意な suffix、段間依存を確認した。前回の全件 unit test は3498件中2件がこの入力不備で失敗していた。再開後の `npm run test:unit` は pipeline 指示に従って親 runner が全件実行する。
- Prettier・履歴リンク・カタログ整合の検査が成功した。カタログ検証には未作成文書と既存の再エクスポート参照に関する警告があるが、エラーはない。`typecheck`・`lint:ts`・`test:unit`・`lint:md` など指定の親検証は executor 終了後に runner が実行し、正本となる結果を evidence に追記する。
- 未解決の設計判断はなし。既存の wave-1 や T88P の strategy は比較用に維持し、再生成・状態遷移・result の記帳は行っていない。

### 5.4. CHANGELOG に書く事項

- 不具合修正: `schedule strategy generate` の `bootstrap-kata-set` と rulebook を改善する `improve-kata` に、rulebook・recipe・sample・template を順に同期する段を追加。`not-needed` の型は省略し、型の整備方針と一意なタスク suffix を生成する。

## 6. 関連ドキュメント

- [[prj-0001:pjr-j0vs-strategy-kata-phases-missing|元の課題]]
- [[prj-0001:sch-strategy-kata-wave-1|型の整備 第1波の戦略]]
- [[prj-0001:sch-strategy-business-specs-kata|T88P の型整備戦略]]
- [[specdojo:schedule-design-guide|Schedule設計ガイド]]
- [[specdojo:ryu-guide|実践の進め方ガイド]]
- [[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]
