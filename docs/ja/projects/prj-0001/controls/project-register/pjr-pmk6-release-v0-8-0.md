---
specdojo:
  id: prj-0001:pjr-pmk6-release-v0-8-0
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: medium
  owner: PO
  registered_at: "2026-11-11T11:58:00Z"
  depends_on:
    - PJR-M18B
    - PJR-X05N
    - PJR-Q2AT
    - PJR-1GCD
    - PJR-T4G3
    - PJR-M495
    - PJR-ED0K
    - PJR-V2GH
    - PJR-BJ7E
    - PJR-DVNV
    - PJR-D948
    - PJR-C6BA
    - PJR-KV37
    - PJR-JFRX
    - PJR-3HXQ
    - PJR-6XWP
    - PJR-W63Q
    - PJR-VEHX
    - PJR-X1RW
    - PJR-Q9DF
    - PJR-8ZX8
    - PJR-SBNB
  commit_type: chore
  commit_scope: release
---

# PJR-PMK6 0.8.0 でリリースする

## 1. 概要

0.7.0 の後の完了分（業務仕様の型の標準化・clis・uis・dss・grade の YAML 対応など）と PJR-RX14 の修正を 0.8.0 として公開する

## 2. 入力

- 範囲（indie が 2026-11-15 に決定）: 型（docs/ja/specdojo の rulebook・recipe・sample・template）は極力最新を取り込み、足元の不具合は直してから出す。0.7.0 の後に close した項目は、リリースの作業を始める時点までに close したものをすべて含める
- 足元の不具合（先に直す）: PJR-M18B・X05N（review の正しさ）、Q2AT・1GCD（止まる原因）、T4G3・M495・ED0K（立て直し）、V2GH・BJ7E・DVNV
- 型を最新にする: wave-2 の sample の手直し（PJR-D948・C6BA・KV37）、型を確定するための成果物の手直し（wave-2 の JFRX・3HXQ・6XWP・W63Q、wave-1 の VEHX・X1RW・Q9DF）と 140 の確定、template の id の直し（PJR-8ZX8）、ifx-index の schema の名前の変更（PJR-SBNB）
- 0.8.0 に入れないもの: project-kata の手直し（PJR-Y5AC・Y5XH・TVWR・CPZH）、stsd・cdsd の手直し（PJR-2C9W・PEJQ）、ifx-index の閲覧ページ（PJR-QJ41）。どれも配る型を変えない
- review で止まっている項目（PJR-B0B8 など）は、リリースの時点で close 済みなら含める
- 2026-11-16 の追加（利用者がリリースの夜までに入れた方がよい todo の選定と実行を orchestrator に依頼）: 道具の直し PJR-1ZQK（plan だけの run の記録と push の前の検査）・YYDS（grade の finding を最初から日本語で書かせる）・N6GK（作業内容の表を実績に合わせる）と、配る型の次の回 PJR-D948・C6BA・KV37・T123 を入れる。PJR-1Y1M は commit の許可リストの方針が未決のため入れない。成果物の手直しの次の回（VEHX・X1RW・JFRX・6XWP など）は配る型を変えないため 0.8.0 の後に回す
- 手順は pm-orchestrator-playbook の「リリースの手順」に従う。push・PR の merge・タグ・npm の公開の承認は利用者が行う

## 3. 完了条件

- PJR-0X0S と PJR-A7CR が close されている。review の 7 件は、利用者の確認の結果で close するか次の版に回すかが決まっている。
- 版を変更内容から決め、利用者の確認を得ている。本体は `0.8.0`。`packages/docs-site`・`packages/docs-lint` は前の公開の後に変更があるため、版を上げるかを確かめる。
- `package.json` と `package-lock.json` の版を上げ、`CHANGELOG.md` の `[Unreleased]` を版の節として日付を付けて確定している。PJR-EPQ3 の後に close した項目の個票の「CHANGELOG に書く事項」を集めて書き、close の件数と集めた件数を照合している。
- ルートと `packages/*` の `npm ci` が通り、クリーンな作業ツリーで `npm run check` が通る。
- `npm pack` の配布物を空の Git リポジトリへ入れ、`init`・`register add`・`exec run --register`（start から review まで）と、この版で変えた機能（`kata show` で dss・clis の rulebook が読める、grade の YAML 対応など）を確かめている。
- 公開候補が PR の merge commit で `main` へ入り、その commit を指すタグから npm の公開 workflow が起動する。push・PR の merge・タグ・npm の公開の承認は利用者が行う。
- 公開後に npm の `latest`、タグで起動した workflow の結果、npm から入れた版の動作を確かめている。

## 4. 作業内容

| No  | 作業                                                                   | 担当                  | 状態 | メモ                 |
| --- | ---------------------------------------------------------------------- | --------------------- | ---- | -------------------- |
| 1   | CHANGELOG の事項を集め、版を確定し、`npm ci` と `npm run check` を流す | specdojo-orchestrator | done | 4b6e47ed2・93449d3e0 |
| 2   | 配布物を空のリポジトリで試す                                           | specdojo-orchestrator | done | 2026-11-16 10:52     |
| 3   | PR・merge・タグ・公開の承認                                            | PO                    | open | -                    |
| 4   | 公開後の確認                                                           | specdojo-orchestrator | open | -                    |

## 5. 対応結果

実施内容（2026-11-16、orchestrator）:

- 範囲: 足元の不具合（M18B・X05N・Q2AT・1GCD・T4G3・M495・ED0K・V2GH・BJ7E・DVNV）、夜間に見つけた 9MWH、型を最新にする手直しと kata-wave-2 の 140 の確定に加え、利用者の依頼で 2026-11-16 に 1ZQK・YYDS・N6GK と配る型の次の回（D948・C6BA・KV37・T123）を足した。どれも close 済み。D948・C6BA・KV37・T123・AWW3 の型は再 grade で pass になった
- 版: 本体 `0.8.0`、`@specdojo/docs-site` `0.5.0`（対話の描画とメニューの自動生成）、`@specdojo/docs-lint` `0.4.1`（remark の無視対象と履歴リンクの検査の対象）。docs-site・docs-lint の版は orchestrator の提案で、利用者の確認を PR の前に得る
- CHANGELOG: `[Unreleased]` の既存の行と、0.7.0 の後に close した項目の「CHANGELOG に書く事項」（38 件）と、注記がない利用者向けの直し（YYDS・9MWH・N6GK・MERV・HQVE など）から `[0.8.0] - 2026-11-16` の節を作った（4b6e47ed2）
- 検証: ルートと 3 package の `npm ci` が成功し、リリースのブランチで `npm run check` が成功した（238 テストファイル、3,945 テスト）。3 つの tarball を空の Git リポジトリへ入れ、`init --yes --provider claude --exec`・`register add --commit`・`exec run --register`（claude の executor・reporter で start から review、統合まで）・`kata show`（clis・dss の rulebook、bds の sample）・docs-site の build と `chat` のコードブロックの描画を確かめた
- 試験のリポジトリを `~/.claude/` の下に作ると、claude の agent の書き込みが拒否されて止まった（設定の場所として守られるため）。`/workspaces` の下で作り直して通った。製品の不具合ではない
- release の feature を develop へ merge した（93449d3e0）。PR の本文は orchestrator が用意した

- 2026-11-16 昼の追加（利用者がリリースの夜までに todo を足すよう依頼）: 新しい直し 964D（index.lock の長い保持を待つ）・ZSRD（review の段の古い grade）・5QJ5（YAML の読み方）を流して close した。統合済みのまま review だった X04G・2ZN4・7RZ4・BNK5 を確かめて close し、ほかの項目で直っていた 36PW・50CF・Z4H8・5FTV を close、WQ80 を 30SA に引き継いで reject した。CHANGELOG の 0.8.0 の節に加え（7547c91d9）、`npm run check`（238 テストファイル、3,962 テスト）と pack の試験（空のリポジトリで init・register add・exec run --register が start から統合まで）をやり直して通った
- この間に、run の最中に流した grade の進み具合のファイルが ZSRD・5QJ5 の commit に紛れ込み、再開の後に個票の対応結果が消えた。本文は executor の commit から戻し（8732bdcdd）、道具の直しを PJR-EWZG として起票した。codex（sol）の利用枠が 11/20 まで尽きたため、grade は opus-review-executor で流した

残り: 利用者の確認（docs-site・docs-lint の版）、push・PR の merge・タグ・公開の承認、公開後の確認。

## 6. 関連ドキュメント

- [[prj-0001:pjr-7sea-release-v0-7-0]]
- [[prj-0001:pjr-epq3-changelog-from-register-handoff]]
- [[prj-0001:pm-orchestrator-playbook]]
