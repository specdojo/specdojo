---
specdojo:
  id: prj-0001:pjr-rvtb-cdfd-overview-vertical-trial
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-01T08:50:42Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-T1D1
---

# PJR-RVTB 全体概要の CDFD を縦向きにし、系統ごとの入口のイベントを描いて試す

## 1. 概要

詳細の CDFD を作らず全体概要と BPS で表す案の判断材料として、cdfd-overview の 4 つの図を direction: down にし、系統ごとの入口の起点イベントを 1〜3 個描いて試す。rulebook は変えず、ずれを記録する

## 2. 入力

- 利用者は、残りの CDFD 8 文書を作らず、cdfd-overview と BPS で表す案（D）を検討している。判断の前に、縦向きと入口のイベントを描いた cdfd-overview を見たい（2026-11-01）
- D 案では起点イベントが図から抜けるため、系統ごとの図にその系統を始めるイベントだけを 1〜3 個描く（D-2）を試す（2026-11-01 の対話で利用者が選択）
- 横向きの register 系の図は 4432×864px で、文書の幅では約 16% に縮む。direction: down にすると 2108×2791px になり、今の a <- b の書き方と透明度 0 の線のまま、上から Orchestrator・Plan・Do・Check・Action の順に並ぶことを orchestrator が 4 つの図で確かめた
- cdfd-d2-rulebook は direction: down を階層構造の図に限り、cdfd-overview-rulebook は起点イベントを図に描かないと定めている。試行では rulebook を変えず、ずれを記録する。採用する場合は decision を記録してから rulebook を直し、採用しない場合は書き直しの commit を戻す
- 担当と期限は、CDFD の項目について利用者が決めた値（担当は BA、期限は 11 月末）にそろえる

## 3. 完了条件

- [[prj-0001:cdfd-overview]] の 4 つの図が `direction: down` になっている。プロセスは上から Orchestrator・Plan・Do・Check・Action の順に並び、共通・基盤の図では Onboarding が Orchestrator の上にある。`a <- b` の書き方と、共通・基盤の図の透明度 0 の線は保つ
- 各図に、その系統を始める起点イベントが 1〜3 個、`event` class の六角形で描かれ、始まるプロセスへラベル付きの線でつながっている。イベントの文言は「プロセス領域」の表の「起点イベント」列と同じである。選んだイベントと理由を個票の対応結果に記録している
- イベントの線のほかは受け渡しを変えていない。変更前の 57 本が向き・ラベルを含めてすべて残ることを確かめ、個票の対応結果に記録している
- 「概念データフロー（概要）」の図の説明と「凡例（本プロダクト共通）」の説明が、縦向きとイベントの描き方に合っている。「プロセス領域」と「データストア」の表は変えていない
- rulebook は変えていない。rulebook とのずれ（`direction: down`、図に描いたイベントなど）を、個票の対応結果に一覧で記録している
- 4 つの図を `d2 --layout elk` で SVG に出力し、上からのプロセスの並びを図ごとに測って個票の対応結果に記録している。プロセスが同じ行に横に並ぶ場合は規則どおりと記録しない
- `npm run lint:md`・`npm run lint:d2` と親の検証が通る。文書の status を変えていない。詳細の CDFD 8 文書は変えていない
- 利用者が VS Code の Markdown プレビューで見た目を確かめている（orchestrator が close 前に確認する。executor の作業ではない）

## 4. 作業内容

| No  | 作業                                                                | 担当 | 状態 | メモ                                                        |
| --- | ------------------------------------------------------------------- | ---- | ---- | ----------------------------------------------------------- |
| 1   | 4 つの図を `direction: down` にする                                 | BA   | done | 4 図を `direction: down` に変更し上からの並び順を保持       |
| 2   | 系統ごとに入口の起点イベントを 1〜3 個描く                          | BA   | done | 各系統に 1〜2 個の起点イベントを描画し開始プロセスへ接続    |
| 3   | 図と凡例の説明を直し、受け渡し・並び順・rulebook とのずれを記録する | BA   | done | 説明文整合、57 本の受け渡し保全、SVG 測定、ずれの一覧を記録 |

## 5. 対応結果

### 5.1. 実施内容

1. **全体概要の 4 つの図の縦向き化（`direction: down`）**:
   - `docs/ja/product/010-business-specs/010-data-flow/cdfd-overview.md` の 5.1 register 系、5.2 schedule 系、5.3 routine 系、5.4 共通・基盤の 4 つの D2 コードブロックについて、`direction: right` を `direction: down` に変更した。
   - プロセス間の戻りの矢印（`a <- b`）および共通・基盤の図の配置制御線（透明度 0 の線）をそのまま保持し、プロセスが上から順に並ぶようにした。
2. **系統ごとの入口起点イベントの描画**:
   - 4 つの図それぞれの `classes` に `event` class（六角形、橙色 `#fff3e0` / `#fb8c00`）を追加した。
   - 各系統の開始契機となる起点イベントを 1〜2 個描画し、始まるプロセスへラベル付きのエッジで接続した。
   - イベントの表示ラベルには凡例の絵文字方針に従って先頭に絵文字 `⚡` を付与し、文言本体は「プロセス領域」の表の「起点イベント」列と完全に一致させた。
3. **図と凡例の説明文の整合**:
   - 第 5 章「概念データフロー（概要）」冒頭に、縦向き（`direction: down`）および系統入口の起点イベント描画の試行に関する説明を追記した。
   - 5.1〜5.4 の各図の注記において、系統入口の起点イベントを図示している旨を明記した。
   - 第 7 章「凡例（本プロダクト共通）」の冒頭および末尾において、試行として全体概要の図が縦向き配置および系統入口の起点イベント描画を適用している旨を明記した。
   - 「プロセス領域」および「データストア」の各表は一切変更していない。
4. **rulebook・status・詳細 CDFD の保全**:
   - `specdojo:cdfd-d2-rulebook` および `specdojo:cdfd-overview-rulebook` は一切変更していない（ずれを本項に記録）。
   - 本個票および `cdfd-overview.md` の frontmatter `status` は変更していない（`draft` / `ready` を維持）。
   - 詳細 CDFD 8 文書は一切変更していない。

### 5.2. 系統ごとの起点イベント選定と理由

<!-- prettier-ignore -->
| 系統 | イベント ID | 描画文言 | 接続先プロセス | エッジラベル | 選定理由 |
| --- | --- | --- | --- | --- | --- |
| 5.1 register 系 | `ev_register` | `⚡ タスクや課題等が判明した、意思決定した` | `plan`（Plan: P-02〜P-06） | `起票契機` | register 系はタスクや課題の判明または意思決定を契機として登録項目（ticket）を起票することから始まるため、P-02（登録簿定義）の起点イベントを選定した。 |
| 5.2 schedule 系 | `ev_catalog`<br>`ev_schedule` | `⚡ 何を成果物として管理するかの判断が確定した`<br>`⚡ 成果物カタログが整備された` | `plan`（Plan: P-02〜P-06） | `カタログ定義契機`<br>`計画展開契機` | schedule 系は、まず成果物として管理する対象が確定した契機（P-03 成果物カタログ定義）から始まり、カタログ整備完了を受けてスケジュール展開（Schedule track の生成、P-04 スケジュール計画展開）へと進む二段階の計画入口を持つため、P-03 および P-04 の 2 個を選定した。 |
| 5.3 routine 系 | `ev_routine`<br>`ev_job` | `⚡ 定期的に確認・実行する事項が判明した`<br>`⚡ 定型的に実行する処理の手順が定まった` | `plan`（Plan: P-02〜P-06） | `定期実行定義契機`<br>`ジョブ定義契機` | routine 系は、定期的に確認・実行する事項の定義（P-05 定期実行定義）と定型処理手順のジョブ定義（P-06 ジョブ定義）の双方が運用の計画入口となるため、P-05 および P-06 の 2 個を選定した。 |
| 5.4 共通・基盤 | `ev_onboarding` | `⚡ PO が新しいプロジェクトを立ち上げた` | `onboarding`（Onboarding: P-01） | `立ち上げ契機` | 共通・基盤の流れの最上流であり、プロジェクト推進環境の整備を行う Onboarding（P-01 プロジェクト初期セットアップ）の入口となるため、P-01 の起点イベントを選定した。 |

### 5.3. SVG 出力によるプロセスの並び順の検証結果

4 つの図を `d2 --layout elk` で SVG にコンパイルし、各プロセスノードの垂直位置（中心 y 座標）を検証した。
結果は以下の通りであり、すべての図で上から Orchestrator・Plan・Do・Check・Action の順（共通・基盤では Onboarding が Orchestrator の上）に配置され、同一行に横並びになるノードが存在しないことを確認した。

<!-- prettier-ignore -->
| 図 | 系統 | viewBox | プロセスの並び順（上から） | プロセスノードの中心 y 座標（SVG） | 判定 |
| --- | --- | --- | --- | --- | --- |
| 5.1 | register 系 | 0 0 2294 2941 | Orchestrator・Plan・Do・Check・Action | Orchestrator (53.0)<br>Plan (566.0)<br>Do (1226.0)<br>Check (2054.0)<br>Action (2702.0) | 適合 |
| 5.2 | schedule 系 | 0 0 3294 3111 | Orchestrator・Plan・Do・Check・Action | Orchestrator (53.0)<br>Plan (666.0)<br>Do (1436.0)<br>Check (2164.0)<br>Action (2872.0) | 適合 |
| 5.3 | routine 系 | 0 0 2565 2731 | Orchestrator・Plan・Do・Check・Action | Orchestrator (53.0)<br>Plan (616.0)<br>Do (1226.0)<br>Check (1894.0)<br>Action (2492.0) | 適合 |
| 5.4 | 共通・基盤 | 0 0 1397 2398 | Onboarding・Orchestrator・Plan・Do・Check・Action | Onboarding (283.0)<br>Orchestrator (1082.0)<br>Plan (1294.0)<br>Do (1514.0)<br>Check (1692.0)<br>Action (1870.0) | 適合 |

### 5.4. 受け渡しの数・向き・ラベルの一対一対応の検証結果

変更前の全 95 本（業務 94 本 + 配置制御線 1 本、重複を除くユニーク 57 本）のエッジと変更後のエッジを照合した。
その結果、変更前の 57 本の業務受け渡しエッジが送信元ノード・送信先ノード・エッジラベルを含めてすべて完全に残っており、追加されたのは系統入口の起点イベントからのエッジ 6 本のみであることを確認した。

<!-- prettier-ignore -->
| 図 | 変更前エッジ数 | 変更後エッジ数 | 起点イベントエッジ（追加分） | 変更前受け渡しの完全一致確認 |
| --- | --- | --- | --- | --- |
| 5.1 register 系 | 27 | 28 | 1（`ev_register -> plan: "起票契機"`） | 完全一致（欠落・変更なし） |
| 5.2 schedule 系 | 35 | 37 | 2（`ev_catalog -> plan: "カタログ定義契機"`、`ev_schedule -> plan: "計画展開契機"`） | 完全一致（欠落・変更なし） |
| 5.3 routine 系 | 19 | 21 | 2（`ev_routine -> plan: "定期実行定義契機"`、`ev_job -> plan: "ジョブ定義契機"`） | 完全一致（欠落・変更なし） |
| 5.4 共通・基盤 | 14 | 15 | 1（`ev_onboarding -> onboarding: "立ち上げ契機"`） | 完全一致（欠落・変更なし） |
| 合計 | 95 | 101 | 6 | 変更前の全 57 業務受け渡しが完全一致 |

### 5.5. rulebook とのずれ一覧

試行にあたり、既存の rulebook（`specdojo:cdfd-d2-rulebook` および `specdojo:cdfd-overview-rulebook`）は変更せず、以下のずれを記録した。

<!-- prettier-ignore -->
| No | 項目 | rulebook の規定 | 本試行での実装（ずれ） | 理由・背景 |
| --- | --- | --- | --- | --- |
| 1 | 図の方向 | `cdfd-d2-rulebook` 第 1 節: 方向は CDFD を問わず `direction: right` を基本とし、`direction: down` は階層構造（組織・分類など）を表す場合に限る。 | 全体概要の 4 つの図を `direction: down` とした。 | 横向きの図（register 系で 4432×864px）は文書幅で約 16% に縮小し視認性が低下するため、縦向き（2294×2941px）による視認性向上の効果を検証するため。 |
| 2 | 起点イベントの図示 | `cdfd-overview-rulebook` 第 1・2・5 節および `cdfd-d2-rulebook` 第 5 節: 起点イベントはプロセス領域の表に記載し、全体概要の図には描かない。 | 系統ごとの図に入口となる起点イベントを 1〜2 個描画し、開始プロセスへラベル付きエッジで接続した。 | 残りの CDFD 8 文書を作らず全体概要と BPS で表す案（D 案）の検討において、起点イベントが図から抜ける課題を補うための試行（D-2）として配置した。 |

### 5.6. 残課題・申し送り

- 本タスクの完了条件である「利用者が VS Code の Markdown プレビューで見た目を確かめている」については、close 前に対話型オーケストレーターまたは人間が確認を行う。

## 6. 関連ドキュメント

- [[prj-0001:cdfd-overview]]
- [[specdojo:cdfd-overview-rulebook]]
- [[specdojo:cdfd-d2-rulebook]]
