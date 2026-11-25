---
specdojo:
  id: prj-0001:xer-t-kata-review-all-tsd-sample-120-20261125t062118z-180f0db3
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-tsd-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-tsd-sample-120/T-KATA-REVIEW-ALL-tsd-sample-120-20261125T062118Z-180f0db3/plan.md
  started_at: "2026-11-25T06:21:28.017Z"
  completed_at: "2026-11-25T06:35:20.851Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:tsd-sample
    - specdojo:tsd-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）として `tsd-sample` の章構成を rulebook の本文要件に合わせて組み替えた。接続設定と秘密情報の扱いを独立章にし、5 章を「導入と変更の手順」に改題して章番号を 10 章まで振り直した。
- R2 の観点に当たる F005（ダンプの日付の基準）と F006（復元前のアプリ停止とダンプの順序）を修正した。
- 指摘の一覧は次の表のとおり。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R2-1 | R2 | 4.3 接続情報と秘密情報の管理 → 5. 接続設定と秘密情報の扱い | 接続文字列と秘密情報の保存先が「採用技術と設定値」の下位節に入っており、rulebook の本文要件で独立した内容と粒度が合わない | 独立した章 5 に出し、以降を 6〜10 章に振り直した。6.2 手順 3 の参照も新しい題に直した | `vp-arc-document-structure`（`tsd-rulebook` の本文要件と記述ガイド） | - | | R2-2 | R2 | 5. 導入と初期設定 → 6. 導入と変更の手順 | 章の題が初期設定だけを示すが、配下のスキーマ変更とマイグレーションの運用は稼働中の変更を扱い、題と中身の粒度がずれる | 章の題を「導入と変更の手順」に改めた（rulebook の記述ガイド「導入・変更手順」に合わせた） | `vp-arc-document-structure` | 要判断: スキーマ変更を独立章「更新・復旧・撤去」に出し、8.3 復元と合わせる案もあった。6.2 手順 5 が直前の節として参照し、復元は 8.2 のバックアップ取得と続けて読む方が前提から結論の順になるため採らなかった | | R2-3 | R2 | 7.1 動作確認一覧・8.2 バックアップの取得・8.3 復元の手順 | F005: `backup.sh` は JST 03:00 にその日の日付で作成するのに、開店時の確認が「前日の日付のダンプ」で、日付の基準が食い違う | 動作確認 7 の期待結果と 8.2 の検知を「当日の日付」に、実施状況の行を「初回の取得の後の開店時に確認する」に、8.3 手順 5 を「ダンプの日付（`&lt;TARGET_DATE&gt;`）の前日の販売件数がその日の日次締め記録と一致」に直した | `vp-qe-omissions-consistency` | - | | R2-4 | R2 | 8.3 復元の手順・8.1 データの永続化と再起動時の挙動 | F006: 現状のダンプ（手順 1）をアプリ停止（手順 2）より前に取っており、その間の書き込みが切り戻し用ダンプに入らない | 手順を「1. アプリを止める → 2. 現状のダンプを取る」に入れ替えた。切り戻しの参照を手順 2 に、8.1 の参照を「手順 1 と 2」に直した | `vp-qe-omissions-consistency` | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/tsd-sample.md`: 章構成を rulebook の本文要件に沿って組み替えた。接続設定と秘密情報の扱いを独立章（5 章）に出し、「導入と変更の手順」への改題と 10 章までの章番号の振り直しを行った。ダンプの日付の基準を「当日」にそろえ（動作確認 7、8.2、8.3 手順 5）、復元手順を「アプリ停止 → 現状のダンプ取得」の順に入れ替えた。

## 3. 申し送り

- R2 の観点に当たらない finding は直していない。F002（`vp-arc-conciseness`）は R3 で扱う。F003（`vp-dev-implementation-readiness`）と F004（`vp-qe-verifiability`）は R4 で扱う。F001（`vp-pm-dependency-risk`）は executor が kata の観点の組から外れると判断して扱っていない。`tsd-hosting.md` と `tsd-ci.md` の作成担当・期日が未記載である点は残っている。
- R2-1: R2 / 4.3 接続情報と秘密情報の管理 → 5. 接続設定と秘密情報の扱い / 接続文字列と秘密情報の保存先が「採用技術と設定値」の下位節に入っており、rulebook の本文要件で独立した内容（接続設定と秘密情報の扱い）と粒度が合わない / 独立した章 5 に出し、以降の章番号を 6〜10 に振り直し、6.2 手順 3 の参照を新しい題に直した / vp-arc-document-structure（tsd-rulebook の「本文要件」と「記述ガイド」の「接続設定と秘密情報の扱い」） / -
- R2-2: R2 / 5. 導入と初期設定 → 6. 導入と変更の手順 / 章の題が初期設定だけを示すが、配下の「スキーマ変更とマイグレーションの運用」は稼働中の変更を扱い、題と中身の粒度がずれる / 章の題を「導入と変更の手順」に改めた（rulebook の記述ガイド「導入・変更手順」に合わせた） / vp-arc-document-structure / 要判断: 「スキーマ変更とマイグレーションの運用」を独立した章「更新・復旧・撤去」に出し、8.3 復元の手順と合わせる案もあった。採らなかったのは、6.2 手順 5 が直前の節として参照しており、復元は 8.2 のバックアップの取得と続けて読む方が前提から結論の順になるため
- R2-3: R2 / 7.1 動作確認一覧・8.2 バックアップの取得・8.3 復元の手順 / grade F005: backup.sh は JST 03:00 にその日の日付で作成するのに、開店時の確認が「前日の日付のダンプ」としており、日付の基準が食い違う / 動作確認 7 の期待結果と 8.2 の検知を「当日の日付」に、実施状況の行を「初回の取得の後の開店時に確認する」に、8.3 手順 5 を「ダンプの日付（`&lt;TARGET_DATE&gt;`）の前日の販売件数がその日の日次締め記録と一致」に直した / vp-qe-omissions-consistency / -
- R2-4: R2 / 8.3 復元の手順・8.1 データの永続化と再起動時の挙動 / grade F006: 現状のダンプ（手順 1）をアプリ停止（手順 2）より前に取っており、その間の書き込みが切り戻し用のダンプに入らない / 手順を「1. アプリを止める → 2. 現状のダンプを取る」に入れ替え、切り戻しの参照を手順 2 に、8.1 の参照を「手順 1 と 2 でアプリを止めてダンプを取る」に直した / vp-qe-omissions-consistency / -
- 申し送り（R2 の観点に当たらない finding は直していない）: F001（`vp-pm-dependency-risk`、tsd-hosting.md・tsd-ci.md の作成担当と期日）は kata の観点の組から外れる観点のため扱わない。F002（`vp-arc-conciseness`、3 章の図をなぞる箇条書き）は R3 へ、F003（`vp-dev-implementation-readiness`、本番の DB 環境とバックアップ環境の作成手順の参照先）と F004（`vp-qe-verifiability`、動作確認 7 のサイズの閾値）は R4 へ渡す。

## 4. 進め方と実践の型の適用

sample-maintenance の進め方で R2（構成）を行った。根拠は `tsd-rulebook` の本文要件と記述ガイド、および kata-guide の R2 の観点である。R1 の指摘は繰り返していない。plan に展開された finding のうち R2 の観点に当たる F005 と F006 は、判定根拠に照らして解消した。F001〜F004 は他の段または観点の扱いとして見送り、理由と次の段を handoff に記録した。rulebook など sample 以外は変更していない。検査は次のとおり。Prettier、markdownlint-cli2、`npm run lint:md:changed`、`npm run lint:fm:changed`、`npm run lint:mermaid`、`npm run lint:d2`、`npm run test:docs`、`npm run validate:schema` は passed。ts・型・単体/統合テスト・全件 md/fm lint は変更種別により `not_applicable`。
