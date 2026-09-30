---
specdojo:
  id: prj-0001:pjr-b7dg-rulebook-sample-coverage-check
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: ARC
  registered_at: "2026-09-30T11:39:31Z"
  block_reason: "agent exited with non-zero code: 外出し後の `grade` による比較（finding の記録）が sandbox の承認待ちにより実行できず、プランの完了条件を満たせていないため。"
---

# PJR-B7DG rulebook から削除した例が sample に含まれるかの確認と grade による比較

## 1. 概要

PJR-GWYJ で 52 件の rulebook から削除したサンプル章の要点が既存の sample に含まれるかを確かめ、欠けるものだけを反映する。外出しの前後を grade で比べ、vp-qe-kata-conformance と vp-arc-conciseness の finding を記録する

## 2. 完了条件

- PJR-GWYJ の 1 回目の実行（commit `f940b1b6`）でサンプル章を削除した rulebook のうち、sample を持つものすべてについて、削除した例の要点が対応する sample に含まれるかを確かめ、rulebook・sample・判定（含まれる / 一部欠ける / 欠ける）・対応を表で対応結果に記録する。削除前の内容は `git show f940b1b6~1:<path>` で確かめる。
- 欠けているものだけを、`sample-authoring-standard` に従って sample へ反映する。削除した章を sample の末尾へそのまま貼り付けない。既存の章番号・見出し・frontmatter を壊さず、YAML / JSON の sample の先頭のスキーマ指定を消さない。
- 外出しした rulebook のうち 3 件以上を grade で評価し、外出し前の評価結果（`execution/grade/results/` の履歴）と比べて、`vp-qe-kata-conformance` と `vp-arc-conciseness` の level と finding の件数を対応結果に記録する。実行したコマンドも記録する。
- 反映した sample が `npm run lint:md`、`npm run lint:fm`、`npm run validate:schema` を通る。
- 対象外のファイル（rulebook 本文、対象でない sample）を変更しない。

## 3. 作業内容

| No  | 作業                                         | 担当 | 状態 | メモ                                                                               |
| --- | -------------------------------------------- | ---- | ---- | ---------------------------------------------------------------------------------- |
| 1   | 削除した例が sample に含まれるかの確認と記録 | ARC  | done | 50 件を判定した。雛形の sample 43 件は欠ける                                       |
| 2   | 欠けている要点だけを sample へ反映する       | ARC  | open | otp・dmd の 2 件を反映した。雛形 43 件は判断待ち                                   |
| 3   | grade による外出し前後の比較                 | QE   | open | 外出し前の値は記録した。外出し後の grade は executor の sandbox で実行できず未実施 |

## 4. 対応結果

### 4.1. 対象の範囲

- commit `f940b1b6` で変更された rulebook は 53 件である。このうち `sysd-rulebook` は frontmatter に `sample: ""` を加えただけで、サンプル章は削除していない。サンプル章を削除したのは 52 件である。
- 52 件のうち `opd-rulebook` と `opr-rulebook` は frontmatter の `sample` が空で、sample を持たないため対象外とした。ただし `opd-sample.md` と `opr-sample.md` はリポジトリに存在し、宣言だけが空になっている。
- 確認の対象は残りの 50 件である。削除前の内容は `git show f940b1b6 -- docs/ja/specdojo/rulebooks/` で確かめた。
- `ccd-mermaid`・`cnd-mermaid`・`cpd-mermaid`・`cxd-mermaid` の `凡例` 章は削除されておらず、章番号が振り直されただけである。

### 4.2. 判定結果

判定の基準は次のとおりとした。削除した例は業種が共通サンプル文脈と異なるもの（会計確定・受注データ移行など）を含むため、記述の一致ではなく、例が示していた章構成・表の列・判断基準などの要点が sample にあるかで判定した。

| rulebook                             | sample                             | 判定       | 対応                                                                          |
| ------------------------------------ | ---------------------------------- | ---------- | ----------------------------------------------------------------------------- |
| `atc-index-rulebook`                 | `atc-index-sample`                 | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `atc-rulebook`                       | `atc-sample`                       | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `bac-rulebook`                       | `bac-sample`                       | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `bds-rulebook`                       | `bds-sample`                       | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `bes-rulebook`                       | `bes-sample`                       | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `br-rulebook`                        | `br-sample`                        | 含まれる   | 不要。概要・入力・判定・出力・例外・メモを満たす                              |
| `ccd-mermaid-rulebook`               | `ccd-sample`                       | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `cdsd-rulebook`                      | `cdsd-sample`                      | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `cld-rulebook`                       | `cld-sample`                       | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `cnd-mermaid-rulebook`               | `cnd-sample`                       | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `cnd-rulebook`                       | `cnd-sample`                       | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `cop-rulebook`                       | `cop-sample`                       | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `cpd-mermaid-rulebook`               | `cpd-sample`                       | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `cpd-rulebook`                       | `cpd-sample`                       | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `cxd-mermaid-rulebook`               | `cxd-sample`                       | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `cxd-rulebook`                       | `cxd-sample`                       | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `dmd-rulebook`                       | `dmd-sample`                       | 一部欠ける | 反映した。共通方針を `dmd-index` を正とする一文を概要へ加えた                 |
| `etc-index-rulebook`                 | `etc-index-sample`                 | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `etc-rulebook`                       | `etc-sample`                       | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `ifx-cmd-rulebook`                   | `ifx-cmd-sample`                   | 含まれる   | 不要。削除した例のキーをすべて含み、終了コードも多い                          |
| `ifx-file-rulebook`                  | `ifx-file-sample`                  | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `ifx-index-rulebook`                 | `ifx-index-sample`                 | 含まれる   | 不要。PJR-GWYJ の 2 回目の実行で例から新設した                                |
| `itc-index-rulebook`                 | `itc-index-sample`                 | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `itc-rulebook`                       | `itc-sample`                       | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `mip-index-rulebook`                 | `mip-index-sample`                 | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `mtp-rulebook`                       | `mtp-sample`                       | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `nfr-availability-rulebook`          | `nfr-availability-sample`          | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `nfr-index-rulebook`                 | `nfr-index-sample`                 | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `nfr-integrity-rulebook`             | `nfr-integrity-sample`             | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `nfr-maintainability-rulebook`       | `nfr-maintainability-sample`       | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `nfr-operations-rulebook`            | `nfr-operations-sample`            | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `nfr-performance-rulebook`           | `nfr-performance-sample`           | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `nfr-reliability-rulebook`           | `nfr-reliability-sample`           | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `nfr-security-safety-rulebook`       | `nfr-security-safety-sample`       | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `nfr-usability-rulebook`             | `nfr-usability-sample`             | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `otp-rulebook`                       | `otp-sample`                       | 一部欠ける | 反映した。リストアの完了基準とエスカレーション条件を加えた（rulebook の必須） |
| `sac-rulebook`                       | `sac-sample`                       | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `sf-rulebook`                        | `sf-sample`                        | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `sld-rulebook`                       | `sld-sample`                       | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `stc-index-rulebook`                 | `stc-index-sample`                 | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `stc-rulebook`                       | `stc-sample`                       | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `stsd-mermaid-rulebook`              | `stsd-sample`                      | 含まれる   | 不要。題材は異なるが、開始・終了と `イベント / ガード` の遷移記法を満たす     |
| `sysd-critical-flows-rulebook`       | `sysd-critical-flows-sample`       | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `sysd-cross-cutting-policy-rulebook` | `sysd-cross-cutting-policy-sample` | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `sysd-index-rulebook`                | `sysd-index-sample`                | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `tml-rulebook`                       | `tml-sample`                       | 含まれる   | 不要。PJR-GWYJ の 2 回目の実行で例から新設した                                |
| `tsp-index-rulebook`                 | `tsp-index-sample`                 | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `uis-rulebook`                       | `uis-sample`                       | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `utc-index-rulebook`                 | `utc-index-sample`                 | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |
| `utc-rulebook`                       | `utc-sample`                       | 欠ける     | 未反映。sample が雛形のため判断待ち                                           |

集計は、含まれる 5 件、一部欠ける 2 件、欠ける 43 件である。欠ける 43 件（sample は 39 ファイル）は、すべて `目的と適用範囲 / 入力情報 / 記述内容 / 最小記述例 / 未解決事項` の定型構成を持つ雛形で、削除した例の要点を 1 つも含まない。これは [[prj-0001:pjr-2w38-sample-quality-observation]] が観測した「sample が完成例になっていない」状態と同じである。

### 4.3. 雛形の sample を反映しなかった理由

_ASSUMPTION_: 雛形の sample に対する反映は、本項目の範囲では行わないと判断した。理由は次のとおりである。

- 完了条件は「既存の章番号・見出しを壊さず」に反映することを求める。一方、`sample-authoring-standard` は「章構成は対応 rulebook の本文構成に従い、sample 独自の章立てを作らない」と定める。雛形の章立てを残したまま例の要点を加えると後者に反し、PJR-GWYJ の 2 回目の実行で採用しなかった「末尾への貼り付け」と同じ結果になる。
- 規範に従って反映するには、39 ファイルを rulebook の本文構成に合わせて共通サンプル文脈で書き直す必要がある。これは「欠けるものだけを反映する」という本項目の想定を超え、PJR-2W38 が「対処方針が定まった時点で別途起票する」とした sample の作り直しそのものである。

次のアクションとして、雛形 39 ファイルの作り直しを PJR-2W38 の対処として別の todo に起票するかを人が判断する。作り直す場合は、削除した例の要点（本表の対象）を入力に含める。

### 4.4. grade による外出し前後の比較

外出し前の値は、`execution/grade/results/` にある各 rulebook の grade result サイドカー（2026-09-02 から 2026-09-03 の評価、`grade-rubric-v1`、評価者 `codex-expert-executor`）から取得した。いずれも commit `f940b1b6`（2026-09-30）より前の評価である。

| rulebook           | `vp-qe-kata-conformance` 外出し前 | `vp-arc-conciseness` 外出し前 | 外出し後                                                         |
| ------------------ | --------------------------------- | ----------------------------- | ---------------------------------------------------------------- |
| `dmd-rulebook`     | level 2、finding 1 件             | level 4、finding 0 件         | 未実施                                                           |
| `otp-rulebook`     | level 2、finding 1 件             | level 4、finding 0 件         | 未実施                                                           |
| `ifx-cmd-rulebook` | level 2、finding 1 件             | level 4、finding 0 件         | 未実施                                                           |
| `tml-rulebook`     | level 2、finding 1 件             | level 3、finding 1 件         | PJR-GWYJ の 2 回目の実行で level 2 / level 3。finding 件数は不明 |

外出し後の grade は実行できていない。grade は `tools/grade/run-per-document.sh` が codex / gemma の agent を別途起動する構成で、exec の executor の sandbox からは起動できない。次のコマンドの dry-run も sandbox の承認が必要で実行できなかった。

```sh
bash tools/grade/run-per-document.sh --run-id pjr-b7dg-dryrun --target kata --kind rulebook --path docs/ja/specdojo/rulebooks/otp-rulebook.md --path docs/ja/specdojo/rulebooks/dmd-rulebook.md --path docs/ja/specdojo/rulebooks/ifx-cmd-rulebook.md --path docs/ja/specdojo/rulebooks/tml-rulebook.md --stages 1 --dry-run
```

次のアクションとして、runner または人が上のコマンドから `--dry-run` を外して実行し、外出し後の level と finding 件数を本表へ追記する。外出し前の評価は外出し以外の変更も挟んでいるため、差分がすべて外出しによるとは限らない点に注意する。

### 4.5. 変更したファイル

- `docs/ja/specdojo/samples/otp-sample.md`: `バックアップ/リストア` 章に完了基準、`問合せ窓口/一次対応` 章にエスカレーションを加えた。
- `docs/ja/specdojo/samples/dmd-sample.md`: `概要` 章に共通方針を `dmd-index` を正とする一文を加えた。
- rulebook 本文と、対象でない sample は変更していない。

### 4.6. 2026-10-01 の利用者の判断と orchestrator の対応

- 利用者の判断: 雛形の sample の作り直し（sample の分離）は、今後 bootstrap や rulebook-maintenance などで時間をかけて進める。本項目は in-progress のまま残す。
- v0.3.0 で記述例が失われたまま配布されるのを避けるため、判定が「欠ける」の 43 件の rulebook を、PJR-GWYJ の 1 回目の実行の直前（`f940b1b6~1`）の内容へ戻し、削除したサンプル章を復元した。43 件とも PJR-GWYJ の後に別の変更はなく、PJR-GWYJ による変更だけを取り消した。frontmatter の `sample` の宣言は PJR-GWYJ の前から同じである。
- 復元後に prettier・markdownlint・`npm run lint:fm`・`npm run validate:schema`・`npm run validate:catalog` が通過した。
- 4.5. の otp・dmd の sample への追記は、利用者の判断（復元まで）に従い取り込まなかった。exec run の worktree は破棄した。
- grade による外出し前後の比較（作業 3）は、sample の分離を進める段階で行う。

## 5. 関連ドキュメント

- [[prj-0001:pjr-gwyj-rulebook-sample-chapter-extraction-phase2]]
