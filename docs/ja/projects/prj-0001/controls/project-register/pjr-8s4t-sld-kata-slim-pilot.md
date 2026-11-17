---
specdojo:
  id: prj-0001:pjr-8s4t-sld-kata-slim-pilot
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  owner: BA
  registered_at: "2026-11-17T12:48:46Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-0T83
  commit_type: docs
  commit_scope: kata
---

# PJR-8S4T sld の rulebook と sample から文書の運用の記述を外し、共通の正本への参照にする（試行）

## 1. 概要

業務仕様までの sample の冗長さを減らす試行として、sld 1 件で運用の記述を共通の正本へ寄せ、同じ判断の言い直しを除く。効果を確かめてから他の rulebook と sample へ広げる

## 2. 入力

- PJR-0T83 の対応策 (2)・(4) の試行である。利用者が 2026-11-17 に、sld 1 件で試してから他の rulebook と sample へ広げる進め方（案 C から B）を選んだ
- orchestrator の調査（2026-11-17）: sld-sample は 40KB（空白を除いて約 10,000 字）で業務仕様までの sample で最も大きい。運用・検証の章が全体の約 28% を占める。保管場所ごとの削除の条件を、保管場所一覧の表・3 区分の判断・場面別の対処・検証手順の 4 か所で書き、CDSD・STSD・CLIS との対応も 1.1 節と 4.1 節に二重にある。冒頭に役割の段落、検証の表に prettier・lint:md の行、末尾に PO の承認と agent の draft 維持の段落がある。表のセルは 1 行 700 字前後ある
- sld-rulebook（24KB）は、BA・ARC・DEV・QE・PM・OPS・PO の役割の表と status・承認の手順を持ち、「関連仕様・実装配置との対応と検証」を必須の章、「確認事項と変更影響」を条件付きの章として求める。status・承認・改訂と廃止の正本はドキュメントメタ情報標準にある

## 3. 完了条件

- sld-rulebook から、役割の表・status と承認の手順・公開前確認など、どの成果物にも共通する運用の記述を外し、[[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] などの共通の正本への参照にする。共通の正本に足りない記述があれば、sld-rulebook ではなく共通の正本へ足す。sld 固有の判断（保管・共有・寿命・削除可否・復旧の基準）は残す。
- sld-rulebook の章の求め方を見直す。文書の品質の検査（prettier・lint など）を業務の検証に入れない。未決事項は論点と影響を書き、管理台帳の区分・担当・判断時期の列は求めない（追跡は登録簿で行う）。必須と条件付きの章を変える場合は理由を個票の対応結果に書く。
- sld-sample から次を除く: 役割の段落、末尾の承認と agent の段落、検証の表の文書の品質の行、同じ判断の言い直し。削除の条件は保管場所一覧の表を正とし、ほかの章は表を参照する。CDSD・STSD・CLIS との対応は 1 か所にまとめる。表のセルは要点にし、手順は場面別の表に寄せる。
- 結論（保管場所、置くもの、削除可否、復旧の経路と連絡先）は変えない。変える場合は理由を個票の対応結果に書く。
- 大きさの目安: sld-sample の空白を除いた文字数を、今（約 10,000 字）の 6 割以下にする。sld-rulebook も今（24KB）より小さくする。前後の大きさを個票の対応結果に書く。
- sld の recipe・template が同じ運用の記述を持っていれば、同じ方針で直す。
- 他の rulebook と sample へ広げるときに使う「外す記述・残す記述・参照の形」の一覧を、個票の対応結果に書く（PJR-0T83 の対応策 (2) の材料）。
- 型の grade（`grade run --target kata`）は orchestrator が統合の後に流し、前後の score と finding を個票に書く。executor は grade を実行せず、作業内容の該当の行を open のまま残す。grade で完了条件の外の指摘が出ても、この項目では直さず記録する。
- 読みやすさは利用者が確かめる。利用者の確認が済むまで review のままにする。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。影響がなければ「なし」と書く（PJR-EPQ3）。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                                                         | 担当         | 状態 | メモ |
| --- | ---------------------------------------------------------------------------- | ------------ | ---- | ---- |
| 1   | sld-rulebook の運用の記述を共通の正本への参照にし、章の求め方を見直す        | BA           | open | -    |
| 2   | sld-sample（と recipe・template）を直す                                      | BA           | open | -    |
| 3   | 広げるときの「外す記述・残す記述・参照の形」の一覧を書く                     | BA           | open | -    |
| 4   | 統合の後に型を grade し、前後の結果を書く（orchestrator）                    | orchestrator | open | -    |
| 5   | 読みやすさを確かめる（利用者）                                               | 利用者       | open | -    |
| 6   | 結果を見て、他の rulebook と sample へ広げる todo を起票する（orchestrator） | orchestrator | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-0t83-grade-rework-bloats-documents]]
- [[specdojo:sld-rulebook]]
- [[specdojo:sld-sample]]
- [[specdojo:document-metadata-standard]]
