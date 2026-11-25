---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pm-plan-sample-120-20261125t224550z-c647a75b
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pm-plan-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pm-plan-sample-120/T-KATA-REVIEW-ALL-pm-plan-sample-120-20261125T224550Z-c647a75b/plan.md
  started_at: "2026-11-25T22:45:59.934Z"
  completed_at: "2026-11-25T22:54:49.773Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:pm-plan-sample
    - specdojo:pm-plan-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）レビューとして `pm-plan-sample` の章の順と表・本文の配置を `pm-plan-template` と rulebook の本文構成に照らして確認した。
- 「正本・報告・見直し」で、template の順（表、変更時の追従）に合わせて節を入れ替えた。template にない「運用前の準備」は最後の節に移した。
- 「判断ゲートとエスカレーション」の 2 つ目の表の前に説明の文を足した。
- template と rulebook の食い違い（未決事項の表の列）と、追加の節の置き場所は、sample 以外を変更しない方針のため、案を指摘として残した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 4. 正本・報告・見直し（旧 4.2 運用前の準備・旧 4.3 変更時の追従） | template は「正本・報告の表、変更時の追従」の順だが、sample は template にない「運用前の準備」を間に挟み、表から見直しへ続く流れを切っていた。 | 「4.2. 変更時の追従」「4.3. 運用前の準備」の順に入れ替え、追加の節を最後に置いた。本文は変えていない。「運用前の準備」は未決事項から章の名前で参照しているため、参照は壊れない。 | `vp-arc-document-structure`、rulebook「本文要件」（見出し順は template を正本とする）、`pm-plan-template` の「正本・報告・見直し」の構成 | - |
| R2-2 | R2 | 3. 判断ゲートとエスカレーション（場面と対応の表） | ゲートの表と場面の表が説明の文なしで続き、ゲートの判定と未達・ゲート外の対応の境目が読み取れなかった。 | 2 つ目の表の前に「ゲートでの未達と、ゲートの外で判断を上げる場面の扱いは次のとおり。」を足した。 | `vp-arc-document-structure`、Sample 記述標準の表の前の 1 文、rulebook「判断の成立条件」（未達・材料不足時の扱いを含む） | - |
| R2-3 | R2 | 5. 未決事項（表の列）と `pm-plan-template` の「未決事項」 | template の列は「論点・現状・決定時期・判断者」で、rulebook の本文要件「未決の扱い」（論点・現状、当面の扱い、決定によって変わる管理行・ゲート）と食い違う。sample は rulebook の列に従っている。 | sample は変えていない。相手側を直す案は、template の列を「論点・当面の扱い（現状を含む）・決定で変わる管理行・ゲート」にそろえること。「決定時期・判断者」を残すなら rulebook の要件にも足す。 | `vp-qe-omissions-consistency`、`vp-arc-document-structure`。plan の指示に従い rulebook を正とした。 | 要判断 |
| R2-4 | R2 | 4.3. 運用前の準備 | この節は rulebook の本文要件にも template にもない追加の節。中身は SC-04・SC-05 のベースライン記録を Schedule の先行作業にすることと M-04 の見積もり・リスク登録で、統合管理方針の M-02・M-04 の行や「正本・報告・見直し」と重なる。 | 最後の節として残した。案 A は節を外し、要点を統合管理方針の M-02・M-04 の行の根拠・確認契機へ移すこと。案 B は template に任意の節として「運用前の準備」を足すこと。 | `vp-arc-document-structure`、`vp-qe-omissions-consistency`。どちらが完成例としてよいか決められなかった。 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-plan-sample.md`: 「正本・報告・見直し」の節の順を「4.2. 変更時の追従」「4.3. 運用前の準備」に入れ替えた。「判断ゲートとエスカレーション」の 2 つ目の表の前に、ゲートでの未達とゲート外の判断の扱いを示す 1 文を追加した。

## 3. 申し送り

- runner の検証で、`lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` は成功した。他の検査は変更種別により非適用だった。
- 指摘 R2-3 と R2-4 は「要判断」である。人が template と rulebook の整合と、「運用前の準備」の扱い（案 A か案 B）を決める必要がある。
- No: R2-1 / 段: R2 / 箇所: 4. 正本・報告・見直し（旧 4.2 運用前の準備・旧 4.3 変更時の追従） / 指摘: template は「正本・報告の表 → 変更時の追従」の順だが、sample は template にない「運用前の準備」を間に挟み、表から見直しへ続く流れを切っていた / 直した案: 「4.2. 変更時の追従」「4.3. 運用前の準備」の順に入れ替え、template の順を保ったまま追加の節を最後に置いた（本文は変えていない。「運用前の準備」は未決事項から章の名前で参照しているため、参照は壊れない） / 根拠: `vp-arc-document-structure`、rulebook「本文要件」（見出し順は template を正本とする）、`pm-plan-template` の「正本・報告・見直し」の構成 / 印: -
- No: R2-2 / 段: R2 / 箇所: 3. 判断ゲートとエスカレーション（場面と対応の表） / 指摘: ゲートの表と場面の表が説明の文なしで続き、ゲートの判定と未達・ゲート外の対応の境目が読み取れなかった / 直した案: 2 つ目の表の前に「ゲートでの未達と、ゲートの外で判断を上げる場面の扱いは次のとおり。」を足した / 根拠: `vp-arc-document-structure`、Sample 記述標準の表の前の 1 文、rulebook「判断の成立条件」（未達・材料不足時の扱いを含む） / 印: -
- No: R2-3 / 段: R2 / 箇所: 5. 未決事項（表の列）と `pm-plan-template` の「未決事項」 / 指摘: template の列は「論点・現状・決定時期・判断者」で、rulebook の本文要件「未決の扱い」（論点・現状、当面の扱い、決定によって変わる管理行・ゲート）と食い違う。sample は rulebook の列に従っている / 直した案: sample は変えていない。相手側を直す案は、template の列を「論点・当面の扱い（現状を含む）・決定で変わる管理行・ゲート」にそろえること。「決定時期・判断者」を残すなら rulebook の要件にも足す / 根拠: `vp-qe-omissions-consistency`、`vp-arc-document-structure`。plan の指示に従い rulebook を正とした / 印: 要判断
- No: R2-4 / 段: R2 / 箇所: 4.3. 運用前の準備 / 指摘: この節は rulebook の本文要件にも template にもない追加の節。中身は SC-04・SC-05 のベースライン記録を Schedule の先行作業にすることと M-04 の見積もり・リスク登録で、統合管理方針の M-02・M-04 の行や「正本・報告・見直し」と重なる / 直した案: 最後の節として残した。案 A は節を外し、要点を統合管理方針の M-02・M-04 の行の根拠・確認契機へ移すこと。案 B は template に任意の節として「運用前の準備」を足すこと / 根拠: `vp-arc-document-structure`、`vp-qe-omissions-consistency`。どちらが完成例としてよいか決められなかった / 印: 要判断
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/pm-plan-sample.md だけで、plan・result・個票などの履歴ファイルを変更していないため）

## 4. 進め方と実践の型の適用

plan の指示に従い、sample 以外の rulebook と template は変更しなかった。構造と必須項目は rulebook を正とし、`vp-arc-document-structure` と `vp-qe-omissions-consistency` を根拠に章の順と表の前の説明を整えた。既存の本文は変えていない。「運用前の準備」は未決事項から章の名前で参照されており、入れ替えても参照は壊れない。plan に展開された grade の finding と condense の記録はなかった。
