---
specdojo:
  id: prj-0001:pjr-2ht5-yaml-pages-table-view
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
  registered_at: "2026-11-17T22:38:22Z"
  due_on: "2026-11-30"
---

# PJR-2HT5 YAML が正本の文書を、VitePress で表＋YAML 正本（折りたたみ）の形で表示する

## 1. 概要

業務データ辞書・ロール定義・メンバー定義などの表示用ページが YAML の丸写しになっているため、用語集と同じく表と折りたたんだ YAML 正本の形にする。

## 2. 入力

- 利用者の要望（2026-11-18）: 業務データ辞書・ロール定義・メンバー定義は VitePress で YAML をそのまま HTML にした形で表示される。用語集のように表＋YAML 正本（折りたたみ）にしたい。ほかの YAML が正本の文書も洗い出して対応する
- orchestrator の洗い出し（2026-11-18）: 表示用ページ 223 件のうち、表＋折りたたみは用語集・ifx-index・dct テンプレートだけで、ほかは YAML の丸写し（src/docs/yaml-pages.ts の renderYamlPage）
- 対象の候補: bdd（bdd-register-entry・bdd-sample）、pm-roles（本番・sample）、pm-members（本番・sample）、pm-review-viewpoints（project・defaults）、ifx-cmd（ifx-cmd-ai-provider-cli・ifx-cmd-sample）、ifx-file-agent-evidence、tml（tml-index・tml-sample）、dct カタログのインスタンス 9 件と dct-sample・dct-index-sample、sch-milestones
- 対象外の案: grade の判定基準・job・routine・schedule の track/strategy/defaults/assessment、schema、YAML の template、OpenAPI/AsyncAPI の sample（ifx-api-sample・ifx-msg-sample）

## 3. 完了条件

- 入力の「対象の候補」の型ごとに、表示用ページの本文を表で描く処理を `src/docs/yaml-pages.ts` に足す（1,000 行を超える場合は型ごとのモジュールへ分ける）。形は用語集と ifx-index にそろえ、表の後に YAML の正本を `<details>` で折りたたんで添える。表の列は各型の rulebook と schema の主要な項目から選び、選んだ理由を個票の対応結果に書く。
- 入力の「対象外の案」は今の YAML の丸写しのまま変えない。対象と対象外の最終の線引きは executor が決め、型ごとの判断と理由を個票の対応結果に書く。dct カタログのインスタンスを表で描き直すか `catalog build` の表のページへ案内するか、OpenAPI と AsyncAPI の sample の扱いもここで決める。
- YAML の正本の内容が表示用ページに全部残る（折りたたみの中にそのまま入る）。表は正本から生成し、手で直さない。
- 型ごとに `tests/` へ単体テストを足し、本番の文書と sample の両方で表示用ページを生成して、表と折りたたみが出ることを確かめる。生成した表示用ページの差分を commit に含める。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通る。`npm run docs:build` で表示用ページが描けることを確かめる。

## 4. 作業内容

| No  | 作業                                                    | 担当 | 状態 | メモ |
| --- | ------------------------------------------------------- | ---- | ---- | ---- |
| 1   | 対象と対象外の線引きを決め、型ごとの表の列を決める      | DEV  | open | -    |
| 2   | 型ごとの表の描き方を足し、YAML の正本を折りたたみで残す | DEV  | open | -    |
| 3   | 型ごとの単体テストを足し、表示用ページを生成し直す      | DEV  | open | -    |
| 4   | 検証を流し、対応結果と CHANGELOG の文案を書く           | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:bdd-rulebook]]
- [[specdojo:pm-roles-rulebook]]
- [[specdojo:pm-members-rulebook]]
