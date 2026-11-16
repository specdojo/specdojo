---
specdojo:
  id: prj-0001:pjr-97ke-night-child-run-resume
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  difficulty: hard
  registered_at: "2026-11-13T14:08:07Z"
---

# PJR-97KE 夜間の job の中で作られた子の run を、日中に --resume できない

## 1. 課題内容

子の run の plan と実行記録が job の worktree の側にしかなく、日中の exec run --register --resume が plan を見つけられない。写すと統合で重なる

## 2. 入力

- 2026-11-12〜13 の型の整備と夜間の実行で、orchestrator が手作業やシェルスクリプトで補った

## 3. 影響範囲

| 観点         | 影響                                                                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | 夜間の job（`orchestrator night`）の worktree の中で起動され、wait・block で止まった register の子の run を、主の作業ツリーから再開する場合 |
| スケジュール | 日中の再開が plan を見つけられず止まり、orchestrator が手作業で補うまで項目が進まない                                                       |
| コスト       | 記録を手で写す手間と、後の job の統合での衝突の解消に手間がかかる                                                                           |
| 品質         | 手で写した記録が job の branch の記録と重なり、統合で衝突する                                                                               |
| 関係者       | orchestrator・PO                                                                                                                            |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 子の run の wait の commit は起動元の job の branch に入り、主の作業ツリーには plan も waiting の記録も無い。exec branch は wait の後に job の branch を取り込んでいるが、再開は主の作業ツリーの plan を正本として読むため、reporter の段の再開は plan を見つけられず止まる。記録を主の作業ツリーへ写すと、job の branch と別の履歴で同じファイルを追加・変更したことになり、後の job の統合で衝突する                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 対応策   | 再開の前に、exec branch の最新の wait 後の同期 merge の第2親（wait の記録を含む job の branch の commit）が主の作業ツリーの HEAD に含まれないことを検出し、その commit を主の作業ツリーの branch へ merge してから通常の再開と統合を行う                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| 依存事項 | PJR-0X0S（子の worktree の配置と git の環境の隔離）、PJR-EWZG（再開の前の同期での個票の扱い）                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 完了条件 | job の worktree の中で作られた子の run が wait・block で止まったとき、日中に本体の作業ツリーから `exec run --register <id> --resume` で再開できる。子の run の plan と実行記録の置き場所（job の統合で本体へ入れる、子の worktree と branch を本体から辿れるようにする、など）は executor が決める。再開のために本体へ入れた記録が後の job の統合で衝突しない。再開できない場合は理由と次の手（`--force-restart` など）を出力に示す。job の worktree の中で子の run を止め、本体から `--resume` して統合まで通ることを回帰テストで確かめる。迷った点は executor が決め、決めた内容と理由を個票の対応結果に書き、報告の `handoff` にも書く。`CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く（影響がなければ「なし」、PJR-EPQ3）。保護された設定（`.specdojo/`・`package.json`・`.agents/`・`.claude/`・`.codex/`・`lefthook.yml` など）は変えず、変更が要る場合は案を個票の対応結果と `handoff` に書く。`npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通る。 |

## 5. 対応結果

### 5.1. 原因と修正

子の run の wait の commit は起動元の job の branch に入り、`syncExecBranchAfterWait` がその commit を exec branch へ取り込む。主の作業ツリーにはその記録が無いため、reporter の段の再開は plan を見つけられない。再開が再び失敗した場合は、job の branch と共通の祖先を持たない wait の commit が主の作業ツリーにでき、後の job の統合で衝突する。

修正では `src/exec/register-foreign-wait.ts` を足した。`resumeSingleRegisterItemWorktree` は再開できることを確かめた後、register の遷移と agent の起動より前に次を行う。

- exec branch の first-parent の履歴から最新の `exec(register <id>): merge <target> after wait` を探し、その第2親が主の作業ツリーの HEAD に含まれるかを確かめる。主の作業ツリーで止まった run や job が統合済みの run では含まれるため、何もしない。
- 含まれない場合は、その commit を `exec(register <id>): merge <target> records before resume` として、scheduler の lock の下で主の作業ツリーの branch へ `--no-ff` で merge し、派生ビューを作り直す。以後は通常の再開と同じ経路（同期・親検証・reporter・統合・post-review）を通る。
- merge できない場合は merge を中止して再開を拒否し、原因と次の手（解消して再開、job の worktree の中で再開、`--force-restart` で破棄）を出力する。plan・result が見つからない場合の拒否にも `--force-restart` の案内を足した。

### 5.2. 成果物と検証

- 実装: `src/exec/register-foreign-wait.ts`（新規）、`src/exec/run/register-resume.ts`。
- 回帰テスト: `tests/src/exec/register-resume.integration.test.ts` にテストを足した。job の worktree を模した branch の worktree の中で子の run を reporter の失敗で止め、job の出力を commit する。その後、主の作業ツリーから `--resume` して review・統合まで通ること、wait より後の job の出力を取り込まないこと、後で job の branch を merge しても衝突しないことを確かめる。取り込みを無効にすると同じテストが失敗することも確かめた。同じファイルと `tests/src/exec/job-worktree.integration.test.ts` の 29 件が成功した。
- 設計: [[prj-0001:sysd-job-execution|Job実行設計]] に、主の作業ツリーからの再開の段落を足した。
- `tsc -p tsconfig.build.json --noEmit` と、変更ファイルの Prettier 整形が成功した。`npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と統合テストは親 runner が実行する。

### 5.3. 判断と申し送り

- 記録の置き場所は「job の branch のうち wait の記録を含む commit を、再開するときに主の作業ツリーへ履歴として取り込む」とした。記録を複製すると後の job の統合で衝突するため、同じ commit を共有させる。exec branch の先端を取り込むと統合の段が「merge 済み」と誤認するため、第2親の commit を取り込む。
- 取り込む commit には、同じ夜にその wait より前に job の branch へ統合された他の項目の成果も含まれる。これらは項目ごとの post-review を通っているが、job 全体の review より先に主の作業ツリーへ入る。wait より後の commit にある job の出力（Run の記録・朝報告）は含まれない。取り込んだ commit 数は再開の出力に示す。job 全体の review を待つべき場合は、job を先に統合してから再開する。
- 子の run が job の branch へ統合済みで、worktree の撤去だけが残った場合は扱っていない。wait の同期 merge が無いため、取り込みの対象にならない。
- 保護された設定の変更は要らない。

### 5.4. CHANGELOG に書く事項

- 区分: 不具合修正。文案: 夜間の job の worktree の中で止まった register の子の run を、主の作業ツリーから `exec run --register <id> --resume` で再開できるようにしました。再開の前に job の branch から wait の記録を取り込むため、後で job を統合しても衝突しません。

## 6. 関連ドキュメント

- [[prj-0001:pjr-0x0s-night-register-child-run-env-isolation]]
- [[prj-0001:pjr-ewzg-register-resume-ticket-edits-lost]]
- [[prj-0001:sysd-job-execution|Job実行設計]]
