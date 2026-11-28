---
specdojo:
  id: prj-0001:pjr-qcj5-kata-review-report-table
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-24T13:32:47Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-0BGE
  commit_type: docs
  commit_scope: kata
---

# PJR-QCJ5 段のレビューの指摘の表を result に表として 1 回だけ書かせる

## 1. 概要

段の result で指摘の表が 1 行に詰められ重なる問題を、kata-guide と段の指示で直す

## 2. 入力

- 担当は BA、期限は 2026-11-30（利用者、2026-11-24）
- PJR-0BGE の段取りとして 2026-11-24 の晩の実行の前に行う（利用者、2026-11-24）

## 3. 完了条件

- 2026-11-24 の目合わせ（PJR-F4TG）で、段の result の指摘の表が Markdown の表にならず、申し送りの 1 行に詰めて書かれ、同じ表が 2 回重なった。executor の `handoff` の表の文字列を reporter がそのまま写したためである。
- [[specdojo:kata-guide|実践の型活用ガイド]] の `人への報告の形` に、executor が報告の `handoff` に指摘を 1 件ずつ（1 件 1 項目、列は No・段・箇所・指摘・直した案・根拠・印）書くこと、reporter が result の `実施内容` に Markdown の表として 1 回だけ書き、申し送りに表を重ねないことを定める。
- `docs/ja/projects/prj-0001/schedule/sch-strategy-kata-review-calibration.yaml` の 5 段の `description` の報告の指示を、上の決まりに合わせて直す（全 sample の strategy はこれを写して作る）。
- reporter の agent の定義など保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- strategy は `npm run validate:schema:file`（sch-strategy の schema）で確かめる。
- 統合の後に、オーケストレーターが段を 1 件流し、result の指摘の表が表として 1 回だけ書かれることを確かめてから close する。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 2 回目の実行（2026-11-28）: 目合わせの R5（opr-sample）を流し直したところ、指摘の表は result の `実施内容` の後に 1 回だけ描かれたが、`申し送り` に同じ指摘（R5-01〜R5-14）が 1 件 1 行の箇条書きで重なった。reporter が executor の報告の `handoff` の指摘をそのまま申し送りへ写したためとみられる。track の指示（summary と handoff に指摘を重ねない）が守られていない。
  - reporter が守らなくても、result の申し送りに findings と同じ指摘が重ならないようにする。runner の側で重なりを取り除くか、reporter の出力の検査で重なりを書式の誤りとして差し戻すかは executor が決め、理由を個票の対応結果と報告の `handoff` に書く。指摘でない申し送り（検証の結果、要判断の理由など）は消さない。
  - 単体テストで、findings と同じ指摘を含む handoff から result を描いたとき、申し送りに指摘が重ならないこと、指摘でない申し送りが残ることを確かめる。
  - reporter の agent の定義など保護された設定は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
  - `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。
  - 統合の後に、オーケストレーターが目合わせの R5（opr-sample）を流し直し、申し送りに指摘が重ならないことを確かめてから close する。

## 4. 作業内容

| No  | 作業                                                | 担当 | 状態 | メモ                                                                                                                                      |
| --- | --------------------------------------------------- | ---- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | kata-guide の `人への報告の形` に報告の決まりを追記 | BA   | done | executor の `handoff` と reporter の表を定めた                                                                                            |
| 2   | strategy の 5 段の `description` を直す             | BA   | done | R4 にも指摘の報告の指示を足した。schema 検査 valid                                                                                        |
| 3   | 統合後に R5（opr-sample）を流して確かめる           | BA   | open | 実 agent の起動は executor の sandbox 外。統合後にオーケストレーターが表 1 回・申し送りの重複なしを確認してから close する                |
| 4   | runner で指摘の申し送りの重複を除く                 | BA   | done | executor・reporter 双方の `handoff` を No・段と指摘書式で照合し、表へ移した項目だけ除く                                                   |
| 5   | 重複除去と申し送りの保持を単体テストに加える        | BA   | done | 両方の `handoff`、言い換え、番号への言及、別番号・別段、検証注記、`findings` なし・空を対象に追加。実行は親 runner の `npm run test:unit` |
| 6   | ホスト側で `exec refresh` を完了する                | BA   | open | sandbox では検証は合格したが、共有 Git ディレクトリ内のロック作成が EROFS で拒否された。track 再生成後にホスト側で再実行する              |

## 5. 対応結果

- `docs/ja/specdojo/guides/kata-guide.md` の `人への報告の形` に、executor は `handoff` に指摘を 1 件 1 項目で書き、reporter は `実施内容` に表として 1 回だけ書いて申し送りに重ねない決まりを追記した。
- `sch-strategy-kata-review-calibration.yaml` の R1〜R5 の `description` を同じ決まりに合わせた。R4 は確かめの表の指示に指摘の報告を足した。
- `sch-track-kata-review-calibration.yaml` は生成物のため直接編集していない。反映は track の再生成が要る（オーケストレーターへの申し送り）。
- 保護された設定（reporter の agent の定義など）は変更していない。変更案はなし。
- 決めた点: 項目の書式を `No: 段 / 箇所 / 指摘 / 直した案 / 根拠 / 印` とした。理由は 1 件 1 項目で、reporter が表へ写しやすいため。
- 2 回目の対応（2026-11-28）: `src/exec/results.ts` で、executor・reporter の `handoff` のうち規定の指摘書式で No・段が `findings` と一致する項目を、result の申し送りの描画時に除くようにした。元の evidence と reporter 出力は変更しない。表にない指摘、番号への言及、検証結果や要判断の理由、runner が加える検証の注記は残す。
- 決めた点: reporter の差し戻しではなく runner の描画時の除去を選んだ。reporter が指摘を再掲しなくても executor の `handoff` が機械的に転記されるため、両方の経路を同じ箇所で処理する必要がある。指摘本文の言い換えに左右されないよう No・段で照合し、誤って通常の申し送りを消さないよう指摘書式の項目に限定した。
- kata-guide と strategy の R1〜R5 に runner の除去と指摘以外の申し送りの保持を反映し、`src/exec/reporter.ts` のプロンプトにも転記の例外を明記した。保護された設定の変更案はなし。
- `tests/src/exec/results.test.ts` に重複除去・申し送り保持・入力非変更の回帰テストを、`tests/src/exec/reporter.test.ts` にプロンプトの例外の確認を追加した。型検査・TS lint・単体テストなど指定された検査は親 runner が実行する。
- 整形、対象 Markdown の lint、strategy の schema 検査、catalog 検査（警告のみ）、履歴リンク検査、`register build` は合格した。`exec refresh` は検証部分に合格したが、共有 Git ディレクトリの `specdojo/register/lock/slot-1` の作成が EROFS で停止した。sandbox 外のホスト側で track を再生成し、`exec refresh` を完了する必要がある。
- 統合後の確認は未実施。オーケストレーターが目合わせの R5（opr-sample）を流し直し、表が 1 回だけで申し送りに同じ指摘がなく、指摘以外の申し送りが残ることを確認してから close する。

### 5.1. CHANGELOG に書く事項

- 区分: Fixed
- 文案: kata レビューの指摘表と申し送りに同じ指摘が重複する問題を修正。runner が表へ移した指摘を申し送りから除き、検証結果や要判断の理由を保持する。

## 6. 関連ドキュメント

- [[specdojo:kata-guide|実践の型活用ガイド]]
