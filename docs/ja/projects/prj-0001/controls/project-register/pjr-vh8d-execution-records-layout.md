---
specdojo:
  id: prj-0001:pjr-vh8d-execution-records-layout
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  registered_at: "2026-11-05T22:17:27Z"
  derived_from:
    - PJR-2WC2
---

# PJR-VH8D 実行記録のディレクトリ体系と配置を決める

## 1. 背景

exec の plan・result・evidence とジョブの記録の置き場所と命名を決め、混在・散在・ガイドとの食い違いを直す方針を定める

## 2. 入力

- 由来: PJR-2WC2 で利用者が、ディレクトリ体系とファイルの配置のおかしい箇所を直すと決めた（2026-11-06）
- orchestrator の調査 (1): exec/plans と exec/results はどちらも 1 ディレクトリに約 1,170 件。`pjr-*` 772 件・`T-*` 268 件・`JBR-grade-*` 約 100 件が混ざる（2026-11-06）
- orchestrator の調査 (2): exec/plans/done/ は空で、plan-result-lifecycle-guide の「完了した plan を移す」と食い違う（2026-11-06）
- orchestrator の調査 (3): exec/evidence は `PJR-*` 533・`T-*` 64・`JBR-grade-*` 96 のほか、`JBR-...-review` が本体と同じ階層に並び、成果物名の `stsd-register-entry` が 1 件ある。命名が 3 通り混ざる（2026-11-06）
- orchestrator の調査 (4): ジョブの定義は prj-0001/jobs/、実行記録は execution/jobs/runs/、評価の結果は execution/grade/results/、evidence と plan は execution/exec/ の下にあり、1 回のジョブの記録が 4 か所に散る（2026-11-06）
- orchestrator の調査 (5): result のない plan が 2 件、plan のない result が 16 件ある（2026-11-03 の数え）。全 plan に共通の規約（約 3 KB）が埋め込まれ、合計約 3.3 MB が重複する（2026-11-06）
- 決めること: plan・result の分け方（出どころ別か種類別か）、done/ をやめるか移す実装をするか、ジョブの記録を寄せるか、既存のファイルを動かすか新しい分だけにするか、動かす場合に `evidence.json` の `log_refs` などパスを持つ記録をどう扱うか（2026-11-06）
- 制約: 生のログは全文を Git に残す（PJR-2WC2 の決定）。履歴の書き換えは git-branching-standard で禁止されている（2026-11-06）
- orchestrator の調査 (8): 定期処理の実行状態 `routine-state.json` と実行の履歴 `routine-runs.jsonl`（2026-09-19 以降 1,127 件。success 1,092・failure 22・skipped 13、うち job を起動したのは 73 件）が `routines/generated/` にあり、`.gitignore` の `docs/**/generated/*` で無視される。stsd-routine-run が管理場所とする記録の正本が生成物の扱いになっている。Git に残すか、端末の手元の状態として置き場所を変えるかを先に決める（2026-11-06）
- orchestrator の調査 (9): 実行時のロック `routines/.locks/` が文書のツリーにあり無視されていない。`execution/exec/.locks/` は無視されており扱いが揃わない（2026-11-06）
- orchestrator の調査 (10): docs-structure-guide の構成図と `job-weekly-report.yaml` は `reporting/progress-reports` を出力先とするが、prj-0001 に `reporting/` がない（2026-11-06）
- orchestrator の調査 (11): docs-structure-guide は `controls/reviews/` を挙げるが実物はなく、`controls/generated/` がある（2026-11-06）
- orchestrator の調査 (12): 廃棄した文書 22 件が `docs/ja/product/trash/` にあり、プロダクトの文書のツリーの中で公開や索引の対象になりうる。ガイドに置き場所の記載がない（2026-11-06）
- orchestrator の調査 (13): `schedule/assessments/generated/` だけ `generated/` が 1 段深い。ほかの横断ディレクトリは直下に `generated/` を置く（2026-11-06）
- orchestrator の調査: 定期処理の失敗 22 件のうち 21 件、skip 13 件のうち 1 件は job の実行記録が Git にある。Git に跡がないのは失敗 1 件と skip 12 件で、skip 12 件は job の `precondition` が対象なしと判定した正常な「何もしない」。job を使わない定期処理（dashboard の更新）は無視される生成物だけを作り直す。job が動いて何も変えなかった実行は 6 件で、すべて `precondition` の導入前（2026-09）。`precondition` を持つのは job-grade-kata と job-grade-deliverable だけで、ほかの job は動いた記録がない（2026-11-06）
- 利用者の決定 (#8): 定期処理の実行状態と履歴は Git の外に置き、置き場所を `generated/` から端末の状態を置く場所へ移す。Git に残すのは、job の実行記録を残さずに失敗した定期処理の実行だけとする。正常に何もしなかった実行（skip を含む）は残さない（2026-11-06）
- 利用者の決定: `precondition` を持たない job が動いて何も変えなかった場合も、実行記録を commit しない方針とする。実現の方法（`precondition` を全 job に求めるか、runner が変更の有無で判定するか）は設計で決める（2026-11-06）

## 3. 検討した選択肢

| 選択肢 | 内容                                                                                                                                                                                                      | 利点                                                                                          | 懸念                                                                                                                                     |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| A      | plan・result・evidence の 3 つの木を、出どころ別（register・schedule・jobs）に分ける。`done/` はやめてガイドを実物に合わせる                                                                              | 変更が小さい。今の混在はなくなる                                                              | 1 回の run の記録が 3 つの木に分かれたままで、片方だけ残る plan や名前の揺れが再発する。置き場所の決め方が分散し、食い違いを検出できない |
| B      | 1 回の run を 1 つのディレクトリにし（R1）、置き場所を決める処理をコードの 1 か所にまとめ（R2）、`exec validate` と CI で置き場所を検査し（R3）、ガイドの構成図をそのモジュールと照らすテストを置く（R4） | 3 つの原因（記録の分断、決め方の分散、検査の欠如）をなくす。項目ごとに全 run の記録がまとまる | パスを扱う箇所すべて（plan の生成・`--resume`・reporter・validate・dashboard・job）が変わり、既存の約 3,000 件を移す                     |
| C      | 配置は変えず、ガイドを実物に合わせる                                                                                                                                                                      | 手間が最小                                                                                    | 混在と散在が残り、増え続ける                                                                                                             |

## 4. 決定内容

B を採択する。

- R1: 1 回の run の記録は `execution/runs/<出どころ>/<項目 ID>/<run ID>/` に置き、`plan.md`・`result.md`・`evidence.json`・ログを同じディレクトリに入れる。出どころは `register`・`schedule`・`job` の 3 つとする。review の run も元の項目の下に置く。`plans/done/` は廃止する。
- R2: 実行記録の置き場所を決める処理をコードの 1 つのモジュールにまとめ、runner・reporter・validate・dashboard・job はそこを通す。
- R3: `exec validate` と CI で、決まった場所の外のファイル、run のディレクトリで欠けているファイル、無視されていない lock などを検出する。
- R4: ガイドの構成図（docs-structure-guide・plan-result-lifecycle-guide など）を R2 のモジュールと照らすテストを置く。
- 評価の結果（`grade/results/`）は成果物ごとの出力として R1 の外に残す。ジョブの定義（`jobs/`）も残す。
- 既存のファイル: すべて `git mv` で新しい配置へ移し、記録の中のパスの欄（`log_refs` など）だけを機械的に書き換える。ログの本文は変えない。plan・result の id は変えない。
- 細かい置き場所: `routines/.locks/` を Git の無視の対象にして exec の `.locks/` とそろえる。ガイドの `controls/reviews/` を実物の `controls/generated/` に直す。`schedule/assessments/generated/` をほかと同じ深さにそろえる。
- `reporting/` がない件は、出力の時に作られるのかジョブの出力先が誤っているのかを実装で調べてから直す。`docs/ja/product/trash/` の 22 件は project の外の archive へ移し、サイトと索引から外す。
- 定期処理: 入力の利用者の決定（#8、何もしなかった job の記録を commit しない）を合わせて実装する。

## 5. 採択理由

- 13 点の多くは、1 回の run の記録が 3 つの木に分かれること、置き場所の決め方がコードに分散していること、置き場所を確かめる仕組みがないことの 3 つから出ている。A はこのうち 1 つ目を細かく分けるだけで、原因が残る（2026-11-06 orchestrator の分析）。
- 実行記録は毎月ほぼ倍に増えるため、増え方が小さいうちに形を決める（PJR-2WC2）。
- 評価の結果は成果物ごとに参照される出力で、実行の記録とは参照のされ方が違う。

## 6. 承認

| 項目     | 内容                        |
| -------- | --------------------------- |
| 決定者   | indie                       |
| 決定日   | 2026-11-07                  |
| 承認方式 | commit                      |
| 証跡     | 本個票の決定の記帳の commit |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 7. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                                                                                                                                 |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 影響範囲   | exec の plan の生成・run・`--resume`・reporter・validate・refresh、dashboard、job、routine、文書サイトの索引、ガイド（docs-structure-guide・plan-result-lifecycle-guide など）、prj-0001 の既存の実行記録約 3,000 件 |
| 必要な対応 | R1〜R4、既存のファイルの移動、細かい置き場所、#8 の定期処理を todo に分けて起票する。移動の run のあいだはほかの run を止める                                                                                        |
| 追跡先     | PJR-2WC2（増え方の抑制と plan の共通の規約の参照化）と、派生の todo                                                                                                                                                  |

## 8. 関連ドキュメント

- [[specdojo:docs-structure-guide]]: 構成図の正本
- [[specdojo:plan-result-lifecycle-guide]]: plan と result の扱い
