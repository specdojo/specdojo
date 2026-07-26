---
specdojo:
  id: prj-0001:pjr-0140-register-commit-missed-paths
  type: project
  status: ready
  rulebook: pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
---

# PJR-0140 register commitがhook整形差分と失敗残骸を取りこぼす

## 1. 課題内容

2026-07-26 に `specdojo exec run --register PJR-0139 PJR-0137 --register-commit` を実行したところ、両 ID とも commit は成功したにもかかわらず、PJR-0137 が追加した `tests/src/register.test.ts` の 223 行、`pjr-index.md` の状態遷移、先行する失敗試行の plan / result が commit されず作業ツリーに残った。

commit 対象は `selectRegisterCommitPaths` が算出し、その ID の実行開始前スナップショットに無いパスだけを対象とする。利用者の変更を巻き込まないための仕様だが、runner 自身が生じさせた変更や、直前の ID の commit で取りこぼした変更も同じ判定で除外されるため、取りこぼしが次の ID へ連鎖する。

連鎖の起点は 2 つ確認できた。

- commit が `git commit -m ... -- <paths>` の pathspec 形式のため、lefthook が整形して index に載せた差分が commit されず残る。次の ID の開始前スナップショットにそのパスが載り、その ID の変更が丸ごと除外される。
- 失敗した試行が生成した plan / result と、`register start` による `pjr-index.md` の変更が残ったまま次の実行を開始すると、それらは以後どの ID でも commit されない。

いずれも警告なく成功扱いで終了するため、利用者は commit 済みだと誤認する。

## 2. 影響範囲

| 観点         | 影響                                                                                         |
| ------------ | -------------------------------------------------------------------------------------------- |
| スコープ     | `exec run --register --register-commit` の全実行。複数 ID の直列実行で連鎖しやすい           |
| スケジュール | 取りこぼしに気付くまで作業が積み上がり、後追いの切り分けと復旧が必要になる                   |
| コスト       | 手作業での差分確認と追加コミットが毎回発生する                                               |
| 品質         | 実装だけが commit されテストが残るなど、履歴が不整合な状態で残る。成功表示と実態が一致しない |
| 関係者       | register 実行者。取りこぼしを見落とすと後続の実行や他者の作業へ dirty な状態が引き継がれる   |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                    |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | pathspec commit で hook の整形差分が index に残ること、および開始前スナップショットによる除外が runner 由来の変更や前 ID の取りこぼしにも適用されること |
| 対応策   | commit 後に対象パスが残っていないか検証し、残る場合は警告または再 commit する。開始前スナップショットの対象から runner 自身が生じさせるパスを除外する   |
| 依存事項 | lefthook の整形・再ステージ挙動、`git commit -- <paths>` と index の関係                                                                                |
| 完了条件 | 下記の条件をすべて満たすこと                                                                                                                            |

完了条件の内訳。

- commit 後に対象パスが dirty のまま残っていないことを検証し、残る場合は取りこぼしとして報告する。
- hook による整形で対象パスが再び dirty になった場合も、その ID の commit に含まれる。
- 実行開始前から dirty だったパスのうち、runner 自身が生じさせるもの（`pjr-index.md` の状態遷移、当該 ID の plan / result）は除外対象から外す。
- 利用者由来の変更を巻き込まない従来の性質は維持する。
- 失敗した試行が残した plan / result を検出し、放置されていることを実行前または実行後に報告する。
- 取りこぼしが発生した ID は実行サマリで成功と区別できる。
- hook 整形あり、前 ID の取りこぼしあり、失敗残骸ありの各ケースが自動テストで確認できる。

## 4. 対応結果

- `commitRegisterItemChanges` のcommit後に対象パスを再検出し、pre-commit hookが変更・再stageした差分を同じcommitへ収束させる処理を追加した。pathspec commitが元のindexを復元して逆向き差分を残す場合も、再add後に対象差分が消えたことを確認して正常終了する。
- `pjr-index.md`、登録簿の派生ビュー、当該IDのplan/resultをrunner管理パスとして扱い、開始前からdirtyでもcommit対象に含めるようにした。その他の開始前からある利用者変更は従来どおり除外する。
- 過去のregister実行が残した未commitのplan/resultを実行前スナップショットから検出し、現在のIDへ混ぜず標準エラーへ警告するようにした。
- hook変更が規定回数で収束しないなどcommit後検証が失敗した場合は、対象IDを `waiting` へ遷移させ、実行サマリへ `failure` / `commit=incomplete` と理由を表示して終了コード1へ反映するようにした。
- hook整形後の収束、同じパスを変更する次IDのcommit、runner管理パス、利用者変更の保護、失敗残骸の検出、`incomplete` サマリを自動テストへ追加した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-0135-exec-register-multiple-ids|exec run --registerの複数ID直列実行]]
- [[specdojo-exec-operation-guide|SpecDojo exec運用ガイド]]
- [[specdojo-command-reference-guide|SpecDojoコマンドリファレンス]]
