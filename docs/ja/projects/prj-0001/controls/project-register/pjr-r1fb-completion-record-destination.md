---
specdojo:
  id: prj-0001:pjr-r1fb-completion-record-destination
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: medium
  owner: DEV
  registered_at: "2026-10-24T22:28:40Z"
  due_on: "2026-10-31"
---

# PJR-R1FB orchestrator が register の完了条件で executor の記録の書き先を誤る

## 1. 課題内容

orchestrator の指示文は、完了条件で「result に書く」と指示させる。一方、executor/reporter の pipeline では executor の記録は result の申し送りに届かず、条件が果たせない。書き先の指示・close の確かめ方・報告の形式・plan の雛形を直す。

- 指示文（`.claude/agents/specdojo-orchestrator.md`）の該当箇所は次の3か所である。
  - 「完了条件の書き方」の「保護された設定に触れる場合は、案を result に書き…」
  - 同じ章の「…executor に決めさせて理由を result に書かせるかを明記する」
  - 止まったときの対処の「完了条件で『案を result に書く』と指示し…」
- register の plan の雛形（`xep-register-template.md`）は、executor に「個票の作業内容・対応結果セクションを実施内容で更新する」と指示している。
- result の申し送りは reporter が executor の報告から書く。その報告（`src/exec/evidence.ts` の `final_message`・`validations`・`target_coverage`）には、申し送りの専用の欄がない。
- 利用者の project（coderdojo-lessons-specdojo の prj-0001）で起きたこと:
  - orchestrator が、完了条件に「判断できない点を result の申し送りに書く」と書いた。
  - 3件（PJR-BR5A・PJR-0BVZ・PJR-DVMM）とも、result の申し送りには書かれなかった。
  - BR5A と DVMM では、executor が個票の対応結果に書いていた。orchestrator は result だけを見て、BR5A を未達と判定した。

## 2. 影響範囲

| 観点         | 影響                                                                     |
| ------------ | ------------------------------------------------------------------------ |
| スコープ     | register の項目を pipeline で流すときの、完了条件の書き方と close の判定 |
| スケジュール | 果たせない条件のために、差し戻しや流し直しを検討する手間が生じる         |
| コスト       | 未達の判定の調査と、close の対応結果の書き直し                           |
| 品質         | 書かれている記録を見落として未達とし、close の記録が実態と食い違う       |
| 関係者       | 対話型オーケストレーターを使う利用者                                     |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | 指示文の完了条件の書き方が、executor が result を書けない pipeline の実行を想定していない。報告の形式にも申し送りの欄がない                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 対応策   | 1. 指示文の「完了条件の書き方」と止まったときの対処の3か所で、書き先を実行の仕組みに合わせる。register の項目では「個票の対応結果に書く」とし、「result に書く」は executor が result を書ける実行の形に限る。<br>2. 指示文の close の前の確かめ方に「完了条件の記録は、個票の対応結果と result の両方を見る」と加える。<br>3. executor の報告の形式に `handoff`（申し送り）の欄を加え、reporter が result の申し送りに載せる。<br>4. register の plan の雛形に「個票の完了条件が result への記載を求める場合は、個票の対応結果と報告の `handoff` に書く」と加える |
| 依存事項 | 1・2 は指示文の SSOT を直し、各 provider の版へ同期する                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 完了条件 | 1〜4 が入っている。3 で、executor の `handoff` が result の申し送りに載ることを確かめる test がある                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

### 追記（2026-10-25、利用者が承認）

- v0.4.6 の範囲とする。上の表の対応策 1〜4 を満たす。
- 対応策 1・2（オーケストレーターの本文の「完了条件の書き方」・止まったときの対処・close の前の確かめ方）は、本文の正本 `.agents/specdojo-orchestrator.agent.md` が保護された設定のため、executor は直す文の案を result と個票の対応結果に書く。反映と 10 か所の写しへの同期はオーケストレーターが行う。
- 対応策 3・4（executor の報告の形式に申し送りの欄を足し、reporter がそれを result の申し送りに載せる。register の plan の雛形の書き先の指示を合わせる）は executor が実装する。報告の形式を変えるときは、既存の executor の報告（欄がないもの）もそのまま受け付ける。
- runner のコードを変えるため、統合の後に `exec run --register` を 1 回流して動作を確かめる（PJR-JSEY）。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [Unreleased]` の節に書く（なければ作る）。

## 4. 対応結果

### 実施内容

- executor の報告と evidence に、省略可能な文字列配列 `handoff` を追加した。保存前に秘匿処理し、先頭 100 件・各 4,000 文字に制限する。不正な型・空文字列は除外し、欄のない既存の報告・evidence も引き続き受け付ける。
- reporter へ `handoff` を渡し、edit result の申し送りには runner が reporter の補足と合わせて機械的に転記する。reporter が空配列を返しても executor の記録は残し、同じ文字列の重複は除く。
- executor の prompt と register plan の雛形に、result への記録を求める完了条件は個票の対応結果と報告の `handoff` の両方へ書くことを明記した。完了条件の仮説・判断理由・未解消 finding の記録も同じ書き先に合わせた。
- schema、運用ガイド、CHANGELOG の `Unreleased` を更新した。
- 回帰テストを追加した。報告から evidence・reporter 向けの入力を経由して result の申し送りに届くこと、reporter による省略と重複、再描画の冪等性、既存形式との互換性、秘匿処理・件数と文字数の上限を確認する。テストの実行結果は親 runner の検証記録を参照する。

### オーケストレーター本文の修正案（反映は後続作業）

対象は本文の正本 `.agents/specdojo-orchestrator.agent.md`。保護された設定のため、この executor は本文と写しを編集していない。2026-10-25 の承認済みの分担に従い、オーケストレーターが次の文案を反映する。

1. 「完了条件の書き方」の保護設定に関する箇条書きを次に置き換える。

   > 保護された設定に触れる場合、register の項目では案を個票の対応結果に書き、pipeline では報告の `handoff` にも書く。反映は利用者の承認のもとで行うと書く。「result に書く」は executor が result を直接書ける実行形式に限る。

2. 同じ章の未決点に関する箇条書きを次に置き換える。

   > 未決の点は `_UNDECIDED_` で残すか、executor に決めさせて理由を記録させるかを明記する。register の項目では個票の対応結果に書かせ、pipeline では報告の `handoff` にも書かせる。「result に書く」は executor が result を直接書ける実行形式に限る。

3. 「止まったときの対処」の保護設定に関する箇条書きを次に置き換える。

   > 保護された設定（agent の定義・名簿・`exec-defaults.yaml`・`package.json` など）は、executor が書き換えると統合の前に止まる。register の完了条件では「案を個票の対応結果に書き、pipeline では報告の `handoff` にも書く」と指示する。「案を result に書く」は executor が result を直接書ける実行形式に限る。反映は利用者の承認のもと feature ブランチで行う。

4. 「close の前の確かめ方」の最初の箇条書きを次に置き換える。

   > 完了条件を 1 項目ずつ、差分（`git show`）と個票の対応結果と result の両方に照らして確かめる。完了条件が求める記録を result だけで未達と判定せず、個票の対応結果にもあるかを確認する。親の検証が通っただけで close しない。

反映後に `npm run orchestrator:sync` で 10 か所の写しへ同期し、`npm run lint:orchestrator-sync` で一致を検証する。文案は reporter が result の申し送りにも記録する。

### 検証と残る作業

- 型検査、TypeScript・frontmatter・Markdown の lint、unit・integration test、schema の検証は、この pipeline の指定に従い親 runner に委ねる。executor が同じ検証を重複実行しない。
- executor で変更ファイルの Prettier 整形と `git diff --check` が成功した。hook が求める `node --import tsx src/specdojo.ts register build` と `node --import tsx tools/catalog-validate-if-configured.mjs` も終了コード 0 で成功した。catalog の検証には未作成文書への参照に関する警告がある。検証結果は最終 evidence にも記録する。
- 統合後はオーケストレーターが上記本文案の反映・同期を行い、[[prj-0001:pjr-jsey-exec-run-split-smoke|PJR-JSEY]] の動作確認を実施してから close を判断する。実 agent を起動するため、この executor 内では実行しない。
- 登録簿の行、個票のステータス、result はこの executor では変更していない。

## 5. 関連ドキュメント

- 報告元: 利用者の project（coderdojo-lessons-specdojo の prj-0001）の PJR-BR5A・PJR-0BVZ・PJR-DVMM
