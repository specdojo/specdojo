---
specdojo:
  id: prj-0001:pjr-ta6w-resume-new-layout-drops-evidence
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-06T17:26:33Z"
  due_on: null
  derived_from:
    - PJR-Z0XR
---

# PJR-TA6W 古い配置の run を新しい配置で再開すると、evidence とログが commit されない

## 1. 課題内容

PJR-Z0XR の統合後、古い配置で始まった PJR-PZBP を executor から再開すると、新しい配置に run のディレクトリができ、統合の commit には pipeline-state.json しか入らなかった。evidence.json・executor のログ・親の検証のログが消えた

## 2. 入力

- 2026-11-07 の PJR-PZBP の再開（commit 9a08a55c0）。最初の run は古い配置（exec/evidence/PJR-PZBP/20261106T160500718Z-12a595ba/、exec/plans・exec/results）に記録した。Z0XR の入った dist で --resume --resume-from executor を流すと、execution/runs/register/PJR-PZBP/20261106T165603146Z-2fcac83e/ に記録が書かれた（worktree で parent-validation-attempt-1-lint-ts.log を読めた）。続く --resume で統合すると、Git に入ったのは新しいディレクトリの pipeline-state.json だけで、ほかは worktree ごと消えた。run の要約は success だった（2026-11-07 orchestrator の確認）
- Z0XR の個票は、再開を同じ run として扱い、前回の記録を同じディレクトリへ `*.attempt-N.*` として退避すると書くが、古い配置で始まった run では新しいディレクトリが別にできた（2026-11-07）
- 関連: PJR-BRN4（統合が許可外の追加を黙って落とす）。commit の許可リストが HEAD 側の plan（古い配置）から導かれ、新しいディレクトリのファイルが外れた可能性がある。原因は未確認（2026-11-07）

## 3. 影響範囲

| 観点         | 影響                                                                                                                                                           |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | `exec run --register --worktree` と `exec resume` の統合で、run の記録（evidence・ログ・state）を commit の対象に入れる判定と、古い配置で始まった run の再開先 |
| スケジュール | PJR-Z0XR の close、PJR-BVS9・PJR-9BY9 の実行が、この項目の後になる                                                                                             |
| コスト       | runner の commit の対象の判定と再開処理、統合テストの修正                                                                                                      |
| 品質         | 監査証跡（evidence とログ）が警告なしに失われる。PJR-PZBP の再開分の記録は worktree ごと消え、戻せない                                                         |
| 関係者       | DEV、run を再開する orchestrator と利用者                                                                                                                      |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `isCommitTargetPath` は `isOtherRunRecord(path, resultRel)` で、result と別のディレクトリにある新しい配置の記録を「ほかの run の記録」として外す。再開した run は result が古い配置（`exec/results/`）のままで、evidence とログだけが新しいディレクトリ（`runs/register/PJR-PZBP/<run-id>/`）に書かれたため、自分の記録が外れた。外した記録は許可外の一覧にも出ないため、警告が残らない。`pipeline-state.json` は統合の段が別の経路で書いたため残った（2026-11-07 orchestrator が `isCommitTargetPath` を直接呼んで確認） |
| 対応策   | 今の run の記録を、result の置き場所にかかわらず commit の対象にする。古い配置で始まった run の再開は、元のディレクトリへ書き続ける（A 案、2026-11-07 indie が決定）                                                                                                                                                                                                                                                                                                                                                      |
| 依存事項 | なし。PJR-BRN4 も同じ `src/exec/worktree-ops-commit.ts` を変えるため、この項目の統合の後に流す                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 完了条件 | 下記の条件をすべて満たすこと                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

完了条件の内訳。

- 今の run の記録（今の run ID のディレクトリの中の evidence・ログ・state・`*.attempt-N.*`）は、result が古い配置にあっても新しい配置にあっても、統合の commit に入る。ほかの run の記録を外す動きは変えない。
- 古い配置（`exec/evidence/<task-id>/<run-id>/`）で始まった run を `--resume`（`--resume-from executor` を含む）で再開すると、新しい配置にディレクトリを作らず、元のディレクトリへ書き続ける。前回の記録の退避（`*.attempt-N.*`）も元のディレクトリで行う。
- 統合が run の記録を commit の対象から外したときは、ほかの許可外と同じく `integrate.log` と標準出力に一覧を書く。
- 実際の worktree を使う統合テストで、次を確かめる。
  - 古い配置で始まった run を executor から再開して統合すると、evidence・executor のログ・親の検証のログ・state がすべて commit される。
  - 新しく始めた run（新しい配置）を統合すると、plan・result・evidence・ログ・state がすべて commit される。
- 原因と、PJR-PZBP の再開分の記録が戻せないことを、個票の対応結果に記録する。
- 動きの説明が変わる場合は、`exec-operation-guide` を実際の動きに合わせる。CHANGELOG は未公開の版の節に書き、公開済みの版の節は変えない。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` が通り、親の検証（`test-integration`）が通る。

## 5. 対応結果

- 原因: register の executor 再開で以前の run ID を引き継がず、state と evidence の保存先を新配置で生成していた。統合の除外判定も result の親ディレクトリだけを基準にしていたため、新配置へ分かれた自分の記録を別 run として黙って除外した。
- 修正: 再開元の run ID を pipeline へ渡し、旧 checkpoint がある場合は state・evidence・ログと `*.attempt-N.*` の保存先を元のディレクトリへそろえた。配置の決定は共有モジュールに集約し、schedule の再開でも同じ方針を使う。
- 統合: 新配置の result から run ID を、旧配置の result からは checkpoint の成果物参照を使って現在の run を特定する。成果物参照のない旧 checkpoint では再開処理と同じく最新 run を使う。commit 処理に渡る plan の stem と、frontmatter の `task_id` を区別し、同じ run の新旧両配置の記録を許可リストにも含める。別 run の除外は維持し、除外した記録を標準出力と `integrate.log` に表示する。
- 回帰テスト: 実 worktree を使い、旧配置の通常再開・executor 再開と続く reporter 再開、同一 run が新旧両配置に分かれた場合の commit、別 run の除外と警告、新配置の plan・result・evidence・ログ・state の commit を確認するケースを追加した。旧 checkpoint の長い task ID、result の配置別の判定、試行退避も単体テストで扱う。単体・統合テスト、型検査、各 lint の実行は親 runner が担当する。
- 再開時の修正: 前回の統合テストは、成功した親検証にもログが作られると誤認していた。失敗時だけログを保存する実装に合わせ、初回と executor 再実行では親検証を失敗させ、最後の再開で成功させる fixture に直した。退避した親検証ログの commit、最終 evidence の run ID と親検証の成功、ログ参照先の存在も検査する。前回の frontmatter 検査失敗に対しては、現在の HEAD の `.remarkrc.yaml` に新配置の plan・result 用 schema ルールが既にあることを確認した。設定や result は変更せず、親 runner の再検証に委ねる。
- executor の検証: Prettier、`git diff --check`、`npm run validate:history-links`、`node --import tsx tools/catalog-validate-if-configured.mjs`、`node --import tsx src/specdojo.ts register build --project prj-0001` が成功した。catalog の既存の参照先不足・再エクスポート参照の警告は残る。executor の変更に YAML はなく、ファイル単位の schema 検査は適用外である。
- 運用ガイドを再開時の保存先と除外警告に合わせ、CHANGELOG の未公開節へ記載した。PJR-PZBP の再開分の evidence・ログは既に worktree とともに削除されており、この修正では復元できない。
- 統合後の確認: runner の実動作確認は [[prj-0001:pm-orchestrator-playbook|オーケストレーター運用メモ]] に従い、PJR-JSEY で実施する。

## 6. 関連ドキュメント

- [[prj-0001:pjr-z0xr-exec-run-record-layout|PJR-Z0XR 実行記録の配置の共通化]]
- [[prj-0001:pjr-brn4-integrate-drops-unlisted-additions|PJR-BRN4 統合が許可外の追加を黙って落とす]]
- [[specdojo:exec-operation-guide|exec 運用ガイド]]
