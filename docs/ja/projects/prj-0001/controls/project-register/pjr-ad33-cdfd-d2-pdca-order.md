---
specdojo:
  id: prj-0001:pjr-ad33-cdfd-d2-pdca-order
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
  registered_at: "2026-11-01T06:50:27Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-RXVC
---

# PJR-AD33 CDFD の D2 図で P・D・C・A を左から順に並べる

## 1. 概要

D2 の CDFD 図でプロセスが Orchestrator・Plan・Do・Check・Action の順に左から並ぶよう、戻りの矢印を a <- b で書く規則を cdfd-d2-rulebook に足し、全体概要の 4 つの図を直す

## 2. 入力

- 利用者は、全体概要の図のプロセスがどの図でも P・D・C・A の順に左から右へ並んでいる方が分かりやすいと考えている（2026-11-01）
- 2026-11-01 時点の ELK の配置では、register 系は Action・Plan・Do・Orchestrator・Check、routine 系は Plan・Do・Orchestrator・Check・Action の順で、図ごとに並びが違う
- 原因は Orchestrator との往復や Action から Plan への再計画要求など、ループを作る戻りの矢印で、ELK がどの矢印を逆向きとみなすかを選べない
- 戻りの矢印を a <- b と書くと、矢印の向きは同じまま、配置では a が左に来る。register 系の図で試し、Orchestrator・Plan・Do・Check・Action の順に並ぶことを確かめた
- 共通・基盤の図は Onboarding・Plan・Do・Check・Action の順にする（2026-11-01 の対話で推奨を採用）
- 利用者が VS Code の Markdown プレビューで見た目を確かめてから close する。T1D1 はこの項目の後に行う
- 1 回目の run の後、共通・基盤の図では 5 つのプロセスが同じ列に縦に積まれ、上から Check・Plan・Action・Do・Orchestrator の順になった。この図はプロセスどうしの受け渡しがなく、`a <- b` では並びを決められない。対応結果はこの図を「適合（※）」と記録しているが、規則を満たしていない（2026-11-01 に orchestrator が SVG で確認）
- 共通・基盤の図に、透明度 0 の線 `orchestrator -> plan -> do_exec -> check -> action: {style.opacity: 0}` を 1 行足すと、Onboarding・Orchestrator・Plan・Do・Check・Action の順に左から並び、`lint:d2` も通ることを orchestrator が試して確かめた。利用者はこの方法（案 A）を採用し、exec で流し直すことにした（2026-11-01）

## 3. 完了条件

- [[specdojo:cdfd-d2-rulebook]] に並び順の規則がある。プロセスは Orchestrator・Plan・Do・Check・Action の順に左から並べ、Onboarding がある図では Onboarding を Plan の左に置く。並び順に逆らう戻りの矢印は `b -> a` ではなく `a <- b` と書き、ELK に並びを決めさせない
- [[prj-0001:cdfd-overview]] の 4 つの図が、この規則に沿って書き直されている
- 4 つの図を `d2 --layout elk` で SVG に出力し、プロセスの左からの並びが規則どおりであることを確かめ、図ごとの並びを個票の対応結果に記録している
- 受け渡しの数・向き・ラベルは変えていない。変更前の図の受け渡しと一対一に対応することを個票の対応結果に記録している
- ノードの ID・名前・色の付け方と、図以外の本文は変えていない
- `npm run lint:md`・`npm run lint:d2` と親の検証が通る。文書と rulebook の status を上げていない。詳細の CDFD 8 文書（PJR-T1D1 の対象）は変えていない
- [[specdojo:cdfd-d2-rulebook]] に、プロセスどうしの受け渡しがなく `a <- b` で並びを決められない図では、並び順を固定するために透明度 0 の線（`style.opacity: 0`、ラベルなし）を使ってよいこと、その線は受け渡しではないことを直前のコメントで書くこと、が追記されている
- [[prj-0001:cdfd-overview]] の共通・基盤の図に、受け渡しではないことを示すコメントと、透明度 0 の線が 1 行足され、SVG で Onboarding・Orchestrator・Plan・Do・Check・Action の順に左から並んでいる
- 個票の対応結果の並び順の検証表を、2 回目の run で SVG から測り直した値に置き換えている。プロセスが同じ列に積まれる場合は、それを「適合」と記録しない
- 利用者が VS Code の Markdown プレビューで見た目を確かめている（orchestrator が close 前に確認する。executor の作業ではない）

## 4. 作業内容

| No  | 作業                                                                     | 担当 | 状態 | メモ                                              |
| --- | ------------------------------------------------------------------------ | ---- | ---- | ------------------------------------------------- |
| 1   | cdfd-d2-rulebook に並び順の規則を足す                                    | BA   | done | 第 1 節および第 6.3 節に規則を追記                |
| 2   | cdfd-overview の 4 つの図の戻りの矢印を `a <- b` で書き直す              | BA   | done | 4 つの図の戻り矢印を `a <- b` に修正              |
| 3   | SVG で並び順を確かめ、受け渡しの対応とあわせて対応結果に記録する         | BA   | done | `d2 --layout elk` で検証し対応を記録              |
| 4   | 共通・基盤の図に透明度 0 の線を足し、rulebook に使ってよい場合を追記する | BA   | done | rulebook 第 6.3・7 節追記および共通・基盤図に追記 |
| 5   | 4 つの図の並び順を SVG で測り直し、対応結果の検証表を置き換える          | BA   | done | 4 図の SVG 測定値を最新化し適合を記録             |

## 5. 対応結果

### 5.1. 実施内容

1. **`specdojo:cdfd-d2-rulebook` への規則追記**:
   - 第 1 節「全体方針」および第 6.3 節「エッジ」に、プロセスを左から `Orchestrator・Plan・Do・Check・Action`（Onboarding がある図では Onboarding を Plan の左）の順に並べ、並び順に逆らう戻りの矢印（Orchestrator への応答、Action から Plan への再計画要求、上流データストアへの更新など）は `b -> a` ではなく `a <- b` と記述して ELK による配置の逆転を防ぐ規則を追記した。
   - プロセスどうしの受け渡しがなく `a <- b` では並び順を決められない図（プロセスが同一列に縦に積まれる場合など）において、並び順を固定するために透明度 0 の線（`style.opacity: 0`、ラベルなし）を使って構わないこと、およびその線は受け渡しではないことを示すコメントを直前に必ず記述することを第 6.3 節および第 7 節（禁止事項の例外規定）に追記した。
   - 第 1 節の対応表に情報・実行要求の流れエッジとして戻りの矢印 `<-` を明記した。
2. **`prj-0001:cdfd-overview` の 4 つの図の書き直し**:
   - 5.1 register 系の流れ: Orchestrator への応答 4 本、`exec_plan` から Orchestrator への参照 1 本、`exec_log` から Orchestrator への参照 1 本、Action から register / `exec_log` / plan への戻り 3 本の計 9 本を `a <- b` 記法に書き直した。
   - 5.2 schedule 系の流れ: Orchestrator への応答 4 本、strategy / catalog / `exec_plan` / `exec_log` から Orchestrator への参照 4 本、Action から catalog / `exec_log` / plan への戻り 3 本の計 11 本を `a <- b` 記法に書き直した。
   - 5.3 routine 系の流れ: Orchestrator への応答 4 本、routine / `exec_log` から Orchestrator への参照 2 本、Action から `exec_log` への戻り 1 本の計 7 本を `a <- b` 記法に書き直した。
   - 5.4 共通・基盤の流れ: Action から config / kata への戻り 2 本を `a <- b` 記法に書き直した。さらにプロセス間の受け渡しが存在せず同一列に縦積みされていた課題に対し、受け渡しではないことを示すコメント（`# 配置制御用（受け渡しではない）`）とともに透明度 0 の線（`orchestrator -> plan -> do_exec -> check -> action: {style.opacity: 0}`）を 1 行追加した。
3. **ノード・本文・詳細 CDFD の保全**:
   - 各図のノード ID・表示ラベル・色の指定（`classes`）および図以外の本文は一切変更していない。
   - 各文書の frontmatter の `status` は変更していない（`draft` または `ready` を維持）。
   - 詳細 CDFD 8 文書（PJR-T1D1 の対象）は変更していない。

### 5.2. SVG 出力による並び順の検証結果

4 つの図を `d2 --layout elk` で SVG にコンパイルし、各プロセスノードの水平位置（中心 x 座標）を検証した。結果は以下の通りであり、すべての図で規則通りの並び順になっていることを確認した。

<!-- prettier-ignore -->
| 図 | 系統 | プロセスの左からの並び順 | プロセスノードの中心 x 座標（SVG） | 判定 |
| --- | --- | --- | --- | --- |
| 5.1 | register 系 | Orchestrator・Plan・Do・Check・Action | Orchestrator (93.0) <br>Plan (791.0) <br>Do (1809.5) <br>Check (3009.0) <br>Action (4173.0) | 適合 |
| 5.2 | schedule 系 | Orchestrator・Plan・Do・Check・Action | Orchestrator (93.0) <br>Plan (898.0) <br>Do (2144.5) <br>Check (3398.0) <br>Action (4761.0) | 適合 |
| 5.3 | routine 系 | Orchestrator・Plan・Do・Check・Action | Orchestrator (93.0) <br>Plan (752.0) <br>Do (1855.5) <br>Check (2885.0) <br>Action (3949.0) | 適合 |
| 5.4 | 共通・基盤 | Onboarding・Orchestrator・Plan・Do・Check・Action | Onboarding (88.5) <br>Orchestrator (1241.0) <br>Plan (1490.0) <br>Do (1713.5) <br>Check (1917.0) <br>Action (2194.0) | 適合 |

※ 1 回目の run では、共通・基盤の図にプロセス相互間の受け渡しエッジが存在しなかったため、5 つのプロセス（Orchestrator、Plan、Do、Check、Action）が同一の x 列（x=1194.0）に縦積みされていた。2 回目の run において、配置制御用の透明度 0 の線（`orchestrator -> plan -> do_exec -> check -> action: {style.opacity: 0}`）を追加したことで、Onboarding・Orchestrator・Plan・Do・Check・Action の順に左から右へ正しく並び、全ノードが異なる x 座標に単調増加で配置されることを確認した。

### 5.3. 受け渡しの数・向き・ラベルの一対一対応の検証結果

変更前の全 94 エッジ（重複を除く 57 エッジ）と変更後の全 95 エッジ（配置制御用 1 本を含む）を照合し、業務受け渡しエッジの送信元ノード・送信先ノード・エッジラベルのすべてにおいて一対一に完全一致することを確認した。

<!-- prettier-ignore -->
| 図 | 変更前エッジ数 | 変更後エッジ数 | `a <- b` に書き直したエッジ数 | 配置制御線（透明度 0） | 一対一対応の照合結果 |
| --- | --- | --- | --- | --- | --- |
| 5.1 register 系 | 27 | 27 | 9 | 0 | 完全一致（欠落・追加・向きの誤りなし） |
| 5.2 schedule 系 | 35 | 35 | 11 | 0 | 完全一致（欠落・追加・向きの誤りなし） |
| 5.3 routine 系 | 19 | 19 | 7 | 0 | 完全一致（欠落・追加・向きの誤りなし） |
| 5.4 共通・基盤 | 13 | 14 | 2 | 1 | 業務受け渡し 13 本は完全一致（追加された 1 行は受け渡しではない配置制御線） |
| 合計 | 94 | 95 | 29 | 1 | 業務受け渡し 94 本は完全一致 |

### 5.4. 残課題・申し送り

- 本タスクの完了条件である「利用者が VS Code の Markdown プレビューで見た目を確かめている」については、close 前に対話型オーケストレーターまたは人間が確認を行う。

## 6. 関連ドキュメント

- [[specdojo:cdfd-d2-rulebook]]
- [[prj-0001:cdfd-overview]]
