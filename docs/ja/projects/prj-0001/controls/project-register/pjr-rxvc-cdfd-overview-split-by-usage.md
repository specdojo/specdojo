---
specdojo:
  id: prj-0001:pjr-rxvc-cdfd-overview-split-by-usage
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
  registered_at: "2026-10-31T23:32:43Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-8TQJ
  depends_on:
    - PJR-TE2N
---

# PJR-RXVC 全体概要の CDFD を使い方の流れで 4 つに分け、D2 で描き直す

## 1. 概要

cdfd-overview.md の図は今、トランザクションデータとマスタ・構成データで分けている。LP の Roadmap の register・schedule・routine + Job の 3 行に合わせ、register 系・schedule 系・routine 系と、どれにも属さない Onboarding・稼働構成管理・非推奨化をまとめた共通・基盤の 4 つの図に分け、D2 で描き直す。rulebook は使い方の流れで分ける方式も選べるようにする

## 2. 入力

- 利用者は、全体概要の図を LP の分割に合わせて register 系・schedule 系・routine 系に分けたい（2026-11-01）
- どれにも属さない Onboarding（P-01）・稼働構成管理（P-12）・非推奨化（P-13）・Kata・稼働構成は共通・基盤の図にまとめる（2026-11-01 の対話で推奨を採用）
- データストアの表のマスタ・構成データとトランザクションデータの分類と色分けは残し、変えるのは図の分け方だけとする
- cdfd-overview-rulebook は全体概要をトランザクションデータとマスタ・構成データの図に分けると定めている。rulebook は他のプロダクトでも使うため、使い方の流れで分ける方式も選べる形にする
- 図は D2 に移行する。Mermaid で分け直してから D2 に移すと二度手間になるため、CDFD の D2 版の rulebook（PJR-TE2N）の後に行う
- LP の Roadmap の行は specdojo-lp の src/components/sections/Roadmap.astro にある

## 3. 完了条件

- [[specdojo:cdfd-overview-rulebook]] で、全体概要の図を「データストアの区分で分ける」か「使い方の流れで分ける」かを選べる。宣言しない場合は今の分け方（データストアの区分）として扱う
- [[prj-0001:cdfd-overview]] の図が register 系・schedule 系・routine 系・共通の 4 つに分かれ、[[specdojo:cdfd-d2-rulebook]] に従って D2 で描かれている。凡例で記法を D2、分け方を使い方の流れと宣言している
- 共通の図に Onboarding（P-01）・稼働構成管理（P-12）・非推奨化（P-13）が入っている
- 変更前の図にある受け渡し（エッジ）が、4 つの図のどれかに必ず残っている。対応を個票の対応結果に記録する
- データストアの表の分類（マスタ・構成データとトランザクションデータ）と、PJR-8TQJ で決めた文章の密度（表中心で、流れは図を正とする）を保っている
- ノードの ID を日本語にするか英語にするかを executor が決め、理由を個票の対応結果に記録している
- `npm run lint:md`・`npm run lint:d2`・`npm run lint:mermaid` と親の検証が通る
- rulebook と文書の status を上げていない。詳細の CDFD 8 文書（PJR-T1D1 の対象）は変えていない

## 4. 作業内容

| No  | 作業                                                    | 担当 | 状態 | メモ |
| --- | ------------------------------------------------------- | ---- | ---- | ---- |
| 1   | cdfd-overview-rulebook に使い方の流れで分ける方式を足す | BA   | done | -    |
| 2   | cdfd-overview の図を 4 つに分け、D2 で描き直す          | BA   | done | -    |
| 3   | エッジの対応と ID の判断を対応結果に記録し、lint を通す | BA   | done | -    |

## 5. 対応結果

### 5.1. 実施内容

1. **`[[specdojo:cdfd-overview-rulebook]]` の改定**:
   - 全体概要の図のノード数が 16 を超える場合の分割方式として、従来の「データストアの区分で分ける（トランザクションデータとマスタ・構成データ）」に加え、「使い方の流れで分ける（主要な利用シナリオや機能系統別の図と共通・基盤の図）」を選択できるように改定した。
   - 凡例または図の冒頭で宣言しない場合は既定の「データストアの区分」として扱う方針を規定した。
   - 本文要件、凡例要件、完成判定のチェック項目を追記・整合させた。
2. **`[[prj-0001:cdfd-overview]]` の図の分割と D2 移行**:
   - LP の Roadmap（register・schedule・routine + Job）に合わせて、第 5 章の概念データフロー図を以下の 4 つの図に分割し、`[[specdojo:cdfd-d2-rulebook]]` に従って D2 で描き直した。
     - 5.1. register 系の流れ: 登録簿起票を起点とするタスク実行・評価・完了
     - 5.2. schedule 系の流れ: カタログ・スケジュール戦略からのタスク展開・実行・評価・進捗報告
     - 5.3. routine 系の流れ: 定期実行定義・ジョブ定義に基づく自動実行・評価・記録
     - 5.4. 共通・基盤の流れ: Onboarding（`P-01`）、Kata・稼働構成管理（`P-12`）、非推奨化保管（`P-13`）
   - 第 7 章「凡例（本プロダクト共通）」の図も D2 で描き直し、記法に D2 を採用すること、および全体概要の図を「使い方の流れ」に沿って 4 つの系統に分割することを明示的に宣言した。
   - データストアの表（マスタ・構成データとトランザクションデータ）の分類と文章密度（表中心、流れは図が正本）を完全に維持した。
3. **ノード ID の言語方針決定とエッジ対応の記録**:
   - ノード ID の命名方針および変更前の全 57 エッジの対応先を以下に記録した。

### 5.2. ノード ID の言語方針と決定理由

- **決定**: ノード ID には**英語の英数字・スネークケース**（`orchestrator`、`plan`、`do_exec`、`register`、`exec_plan` など）を採用し、表示ラベルに日本語および絵文字（`"🎛️ Orchestrator\nP-14"` など）を記述する。
- **理由**:
  1. `[[specdojo:cdfd-d2-rulebook]]` 第 2 節において「ノード ID には日本語文字や記号を避け、`sales_record` や `sales_ledger` のような英数字・スネークケースを基本とします」と規定されており、rulebook の標準方針に準拠するため。
  2. D2 コード内でマルチバイト文字や空白・記号をノード ID に使用した場合、将来のパーサー更新、CLI ツール連携、SVG 出力時のアンカーリンク生成等において予期せぬ不具合や文字化けが生じるリスクを排除するため。
  3. 表示ラベル（`"..."`）側に業務上の名称・領域 ID・絵文字を記述することで、図の可読性を保ちつつ、コードとしての保守性・安定性を両立できるため。

### 5.3. 変更前エッジ（全 57 本）と 4 つの図への対応表

変更前の Mermaid 図（トランザクションデータ 35 本、マスタ・構成データ 22 本の計 57 本）に存在したすべての受け渡しエッジが、4 つの図のいずれか（または複数）に確実に保持されていることを確認した。

<!-- prettier-ignore -->
| No | 変更前エッジ | 送信元 | 送信先 | エッジラベル | 移行先の図 |
| --- | --- | --- | --- | --- | --- |
| 1 | Orchestrator --> Plan | Orchestrator | Plan | 計画要求 | register 系、schedule 系、routine 系 |
| 2 | Orchestrator --> Do | Orchestrator | Do | 実行要求 | register 系、schedule 系、routine 系 |
| 3 | Orchestrator --> Check | Orchestrator | Check | 評価・報告・生成要求 | register 系、schedule 系、routine 系 |
| 4 | Orchestrator --> Action | Orchestrator | Action | 完了・改善要求 | register 系、schedule 系、routine 系 |
| 5 | Plan --> Orchestrator | Plan | Orchestrator | 計画要求への応答 | register 系、schedule 系、routine 系 |
| 6 | Do --> Orchestrator | Do | Orchestrator | 実行状態・判断依頼 | register 系、schedule 系、routine 系 |
| 7 | Check --> Orchestrator | Check | Orchestrator | 評価・報告・生成結果 | register 系、schedule 系、routine 系 |
| 8 | Action --> Orchestrator | Action | Orchestrator | 完了・改善判断 | register 系、schedule 系、routine 系 |
| 9 | ExecLog --> Orchestrator | ExecLog | Orchestrator | 記録済みの実行状態 | register 系、schedule 系、routine 系 |
| 10 | Orchestrator --> ExecLog | Orchestrator | ExecLog | サイクルの実行記録 | register 系、schedule 系、routine 系 |
| 11 | ExecPlan --> Orchestrator | ExecPlan | Orchestrator | 対象・手順・完了条件 | register 系、schedule 系 |
| 12 | Plan --> Register | Plan | Register | 登録項目・決定記録 | register 系 |
| 13 | Plan --> Schedule | Plan | Schedule | Schedule（track） | schedule 系 |
| 14 | Plan --> ExecPlan | Plan | ExecPlan | 実行計画 | register 系、schedule 系 |
| 15 | ExecPlan --> Do | ExecPlan | Do | 実行計画 | register 系、schedule 系 |
| 16 | Schedule --> Do | Schedule | Do | タスク・担当・依存 | schedule 系 |
| 17 | Deliverables --> Do | Deliverables | Do | 対象成果物 | register 系、schedule 系 |
| 18 | Register --> Do | Register | Do | 対象登録項目 | register 系 |
| 19 | Do --> Register | Do | Register | 登録項目の状態遷移 | register 系 |
| 20 | Do --> Deliverables | Do | Deliverables | 作成・更新した成果物 | register 系、schedule 系 |
| 21 | Do --> ExecLog | Do | ExecLog | 実行記録・実行状態 | register 系、schedule 系、routine 系 |
| 22 | Deliverables --> Check | Deliverables | Check | 評価・派生生成の対象 | register 系、schedule 系 |
| 23 | Schedule --> Check | Schedule | Check | Schedule（track） | schedule 系 |
| 24 | Register --> Check | Register | Check | 登録簿 | register 系 |
| 25 | ExecLog --> Check | ExecLog | Check | 実行記録・実行状態 | register 系、schedule 系、routine 系 |
| 26 | Check --> Grade | Check | Grade | grade・finding | register 系、schedule 系、routine 系 |
| 27 | Check --> Report | Check | Report | 進捗報告 | schedule 系 |
| 28 | Check --> Derived | Check | Derived | 派生ビュー・索引 | schedule 系 |
| 29 | Grade --> Action | Grade | Action | 最新の grade・finding（確定済みの事実） | register 系、schedule 系、routine 系 |
| 30 | Report --> Action | Report | Action | 判断事項 | schedule 系 |
| 31 | Action --> Register | Action | Register | 完了・決定の記録 | register 系 |
| 32 | Action --> ExecLog | Action | ExecLog | 完了記録 | register 系、schedule 系、routine 系 |
| 33 | Action --> Deliverables | Action | Deliverables | 非推奨化した文書 | 共通・基盤 |
| 34 | Action --> Trash | Action | Trash | 保管した文書 | 共通・基盤 |
| 35 | Action --> Plan | Action | Plan | 再計画要求 | register 系、schedule 系 |
| 36 | Kata --> Onboarding | Kata | Onboarding | provider 別雛形 | 共通・基盤 |
| 37 | Onboarding --> Kata | Onboarding | Kata | 配置した Kata | 共通・基盤 |
| 38 | Onboarding --> Config | Onboarding | Config | 稼働構成の初期状態 | 共通・基盤 |
| 39 | Config --> Orchestrator | Config | Orchestrator | agent 定義・実行既定値 | 共通・基盤 |
| 40 | Config --> Do | Config | Do | agent 定義・権限 | 共通・基盤 |
| 41 | Config --> Plan | Config | Plan | メンバー・ロール | 共通・基盤 |
| 42 | Kata --> Plan | Kata | Plan | rulebook・template | 共通・基盤 |
| 43 | Kata --> Do | Kata | Do | rulebook・recipe・template | 共通・基盤 |
| 44 | Kata --> Check | Kata | Check | rubric・評価観点 | 共通・基盤 |
| 45 | Plan --> Catalog | Plan | Catalog | 成果物カタログ | schedule 系 |
| 46 | Catalog --> Check | Catalog | Check | 成果物カタログ | schedule 系 |
| 47 | Catalog --> Orchestrator | Catalog | Orchestrator | 完了条件・rulebook 参照 | schedule 系 |
| 48 | Catalog --> Action | Catalog | Action | 完了条件 | schedule 系 |
| 49 | Plan --> Strategy | Plan | Strategy | 既定値・タスク生成戦略 | schedule 系 |
| 50 | Strategy --> Orchestrator | Strategy | Orchestrator | phase の作業要件 | schedule 系 |
| 51 | Plan --> Routine | Plan | Routine | 定期実行定義 | routine 系 |
| 52 | Plan --> Job | Plan | Job | ジョブ定義 | routine 系 |
| 53 | Routine --> Orchestrator | Routine | Orchestrator | 定期実行定義 | routine 系 |
| 54 | Job --> Do | Job | Do | ジョブ定義 | routine 系 |
| 55 | Action --> Config | Action | Config | 更新した稼働構成 | 共通・基盤 |
| 56 | Action --> Kata | Action | Kata | バージョン更新 | 共通・基盤 |
| 57 | Action --> Catalog | Action | Catalog | 更新した成果物カタログ | schedule 系 |

### 5.4. 成果物一覧

- `[[specdojo:cdfd-overview-rulebook]]`（`docs/ja/specdojo/rulebooks/cdfd-overview-rulebook.md`）
- `[[prj-0001:cdfd-overview]]`（`docs/ja/product/010-business-specs/010-data-flow/cdfd-overview.md`）
- `[[prj-0001:pjr-rxvc-cdfd-overview-split-by-usage]]`（`docs/ja/projects/prj-0001/controls/project-register/pjr-rxvc-cdfd-overview-split-by-usage.md`）

### 5.5. 残課題

- なし。完了条件をすべて満たしている。

## 6. 関連ドキュメント

- [[specdojo:cdfd-overview-rulebook]]
- [[specdojo:cdfd-d2-rulebook]]
- [[prj-0001:cdfd-overview]]
