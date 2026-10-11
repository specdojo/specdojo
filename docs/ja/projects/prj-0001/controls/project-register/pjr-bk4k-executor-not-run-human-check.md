---
specdojo:
  id: prj-0001:pjr-bk4k-executor-not-run-human-check
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-07T11:43:26Z"
  due_on: null
  completed_at: "2026-10-07T12:21:38Z"
  conclusion: executor の検証の状態に requires_human を加えた。sandbox の外で人が行う確認に限って使い、機械判定で block せず、result の申し送りに「人の確認が必要」として機械的に載せる。failed と runner が満たさない not_run は従来どおり block する
---

# PJR-BK4K sandbox の外で行う確認を executor が not_run と記録すると完了できない

## 1. 課題内容

executor が実 agent CLI の起動など sandbox の外で人が行う確認を not_run と正しく記録すると、runner が同じコマンドを実行しないため、親検証がすべて通っても必ず waiting になる。PJR-69VP の 3 回目の実行で発生し、orchestrator が確認を実行して手で取り込んだ。人の確認として申し送る区分か、reporter 段の再開前に人の確認の結果を記録する手段が要る。

## 2. 影響範囲

| 観点         | 影響                                                                                                             |
| ------------ | ---------------------------------------------------------------------------------------------------------------- |
| スコープ     | executor / reporter pipeline の機械判定（`deriveReporterFacts`）、executor の evidence の契約、result の申し送り |
| スケジュール | 親検証がすべて通っても waiting になり、orchestrator が確認と取り込みを手で行う必要がある                         |
| コスト       | PJR-69VP では、確認の実行・手作業の取り込み・worktree の強制削除が発生した                                       |
| 品質         | runner を経ない取り込みになり、executor に「not_run を書かない」よう促すと検証の記録が不正確になる               |
| 関係者       | 実 agent CLI の起動、利用枠の消費、認証情報、ホスト側の操作などを含む項目を exec で流す利用者                    |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                       |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | executor の検証の状態は `passed` / `failed` / `not_run` の 3 つで、`not_run` は runner が同じコマンドを実行して通した場合だけ満たされる（PJR-979N）。sandbox の外で人が行う確認を表す区分がない                                                            |
| 対応策   | executor の検証の状態に、人が行う確認を表す区分（例: `requires_human`）を加える。この区分の検証は機械判定で block せず、runner が result の申し送りに「人の確認が必要」として機械的に載せる。項目は従来どおり review へ遷移し、人が確認してから close する |
| 依存事項 | PJR-GBEV（事実項目の機械生成）、PJR-979N（委譲した検証の扱い）                                                                                                                                                                                             |
| 完了条件 | 下記の「完了条件の詳細」を満たす                                                                                                                                                                                                                           |

### 3.1. 完了条件の詳細

- executor の evidence の検証の状態に、人が行う確認を表す区分を加える（名前は既存の命名に合わせて決めてよい）。evidence の schema、executor への prompt の契約（`<specdojo_executor_evidence>` の例と説明）、evidence の読み込みの検証を合わせて直す。
- executor への prompt で、この区分は「agent の sandbox から実行できない確認（実際の agent CLI の起動、利用枠や課金を伴う操作、認証情報やホスト側の操作が必要なもの）」に限って使い、実行できるのに省いた検証には使わないことを明記する。
- `deriveReporterFacts` は、この区分の検証を block の理由にしない。`failed` と、runner が満たさない `not_run` は、従来どおり block する。
- この区分の検証は、runner が result の申し送りに「人の確認が必要: <コマンド>（<要約>）」の形で機械的に載せる。reporter の文章に頼らない。
- `exec trial` の比較記録と `trial status` で、この区分の件数を `not_run` と分けて数える。
- unit test で、この区分だけが残る場合に complete になり申し送りに載ること、`failed` や runner が満たさない `not_run` と混在する場合は block されること、evidence の読み込みで受け付けることを確かめる。
- exec 設定ガイドと exec 運用ガイドの機械判定の説明に、この区分を追記する。
- `npm run check` が通る。

## 4. 対応結果

- executor evidence の検証状態へ `requires_human` を追加した。evidence schema と読み込み処理を更新し、executor prompt では実 agent CLI の起動、利用枠・課金を伴う操作、認証情報・ホスト側の操作など、sandbox から実行できない確認だけに使用を限定した。
- `deriveReporterFacts` は executor の `requires_human` を block 理由から除外した。`failed` と、親 runner が同じコマンドを成功させていない `not_run` は従来どおり block する。
- runner は `requires_human` を edit result の申し送りへ「人の確認が必要: `<コマンド>`（<要約>）」として機械的に追記する。reporter の文章には依存しない。
- `exec trial` の比較記録と `trial status` に `validations_requires_human` の独立した件数を追加し、`not_run` と区別した。
- evidence の読み込み、完了判定、他の失敗状態との混在、result の申し送り、trial 集計、prompt 契約を unit test で確認できるようにした。exec 設定ガイドと exec 運用ガイドにも新しい区分と機械判定を反映した。
- executor 内では Prettier、register build、catalog validate、index build、履歴リンク検証が成功した。typecheck、lint、schema 検証、unit / integration test は親 runner の固定検証で実行する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-69vp-multi-repo-e2e-docs]]（発生した実行）
- [[prj-0001:pjr-979n-delegated-validation-block]]（委譲した検証の扱い）
- [[prj-0001:pjr-gbev-exec-reporter-machine-facts]]（事実項目の機械生成）
