---
specdojo:
  id: prj-0001:pjr-qqrh-runner-false-success
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-18T12:17:56Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-20T22:53:06Z"
  conclusion: 権限で拒否された出力やプロダクトの変更なしを runner が検出し、review に進めず waiting と block_reason を残す。exec status に警告を出す
  derived_from:
    - PJR-08EK
---

# PJR-QQRH executor が編集を拒まれたまま完了と報告すると、runner が成功として review に進める

## 1. 課題内容

権限で拒まれた出力や、プロダクトの変更がないことを見落とし、waiting にせず review へ進めてしまう

executor が、ツールの権限でプロダクトのファイルの編集を拒まれ続けたまま「直した」と報告した。runner はそれを成功として受け取り、プロダクトの統合を「変更なし」で飛ばして、項目を `review` に進めた。誤りに気づけるのは、人が差分を見たときだけだった。

直接のきっかけは、opencode の executor がプロダクトの worktree を編集できない問題（PJR-08EK）だが、どの provider でも、executor が編集できないまま完了と報告すれば同じことが起こりうる。

## 2. 入力

- opencode の executor（Ollama のローカルモデル）はプロダクトの worktree への Edit を 20 回拒まれたあと、直したと報告した
- evidence.json は stage.status succeeded、`exit_code` 0、`completion_status` complete で、changes は登録簿のイベントの 1 件だけだった
- executor が報告した検証 npm run test:browser は passed と記録されたが、ログ上はルートの npm test（no test specified）が走っていた
- runner のログは integrate で no changes; skipped のあと review へ進んだ
- 環境: specdojo 0.7.0、opencode 1.19.5、Linux（devcontainer）
- 起票案は利用者が作成した tmp/specdojo-issue-2-runner-false-success.md

## 3. 影響範囲

| 観点         | 影響                                                                                                                                    |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | exec の executor/reporter pipeline（register の worktree・in-place・executor の再開）の executor の段の成功判定と、`exec status` の表示 |
| スケジュール | 影響なし                                                                                                                                |
| コスト       | 影響なし                                                                                                                                |
| 品質         | 編集を拒まれた executor や、プロダクトを変えなかった executor の「完了」が review に進まず、`waiting` と理由が残る                      |
| 関係者       | `repos` を宣言した project の利用者と、プロダクトを対象にする項目を流す orchestrator                                                    |

## 4. 対応方針

| 項目     | 内容                                                                                                                           |
| -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | runner は executor の終了コードと `completion_status` だけで成功を決め、出力の権限拒否とプロダクトの変更の有無を見ていなかった |
| 対応策   | 次のどれかに当たる場合は成功とせず `waiting` にし、`block_reason` に理由を残す（下記の内訳）                                   |
| 依存事項 | PJR-08EK（直る前は、再現の材料に使える）                                                                                       |
| 完了条件 | 下記の条件をすべて満たすこと                                                                                                   |

対応策の内訳。

- executor の出力に、ツールの権限による拒否（`external_directory`・`edit` の deny など）がある。
- 項目がプロダクトリポジトリの変更を求めている（`repos` が宣言され、`target_path` が `<repo>:` で始まる、または plan がプロダクトを対象にしている）のに、プロダクトの worktree に変更がない。
- 少なくとも、runner の要約と `exec status` で「プロダクトの変更なし」を警告として目立たせる。

完了条件の内訳。

- 対応策の 2 つの場合のどちらに当たっても、項目が `review` に進まず、`waiting` と `block_reason` が残る。統合テストで確かめる
- プロダクトを対象にしない項目と、通常の成功の動きは変わらない
- 「プロダクトの変更なし」が runner の要約と `exec status` に警告として出る
- 検証の主張と実際の食い違い（入力の `npm run test:browser` の件）を、この項目で扱うか別に起票するかは executor が決め、理由を個票の対応結果と報告の `handoff` に書く
- `CHANGELOG.md` は変えず、個票の対応結果の `### <n>.<m>. CHANGELOG に書く事項` に区分（追加・変更・不具合修正など）と行の文案を書く。影響がなければ「なし」と書く
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` と親の検証が通る
- 統合の後、PJR-JSEY で runner の動きを確かめてから close する

## 5. 対応結果

### 5.1. 解決内容

- `src/exec/executor-outcome-checks.ts` を新設した。executor の出力からツールの権限による拒否の行を拾う処理（報告のタグの中は除く）、項目が対象にするプロダクトリポジトリを決める処理、理由の文言を組み立てる処理、`exec status` の警告の行を作る処理を置いた。
- 拒否として数える文言は、opencode の permission rule の拒否（`The user has specified a rule which prevents you from using this specific tool call`、`"permission":"…","action":"deny"`）と、Claude Code の拒否（`Permission to use … has been denied`、`requested permissions to … but you haven't granted it`）に限った。シェルの `Permission denied` はテストの出力などにも出るため数えない。
- プロダクトを対象にする項目の判定: plan の frontmatter の `targets`、個票の `target_path` と `targets` に `<repo>:<path>` がある場合と、approach の無い plan の本文が `<repo>:<path>` を参照する場合（入力の行など）。approach の plan は、本文の `<repo>:<path>` が読み取り専用の手本（`sources`）のこともあるため、本文からは判定しない。
- `runAgentPipeline`（`src/exec/run/agent-pipeline.ts`）は、edit の executor が成功して complete と報告した後に上の 2 点を確かめる。対象のプロダクトの worktree に未 commit の変更も exec branch の commit も無い場合（`productHasPendingWork` を `src/exec/task-repos.ts` に追加）か、拒否の行がある場合は、approach の契約違反と同じ扱いにする。evidence を `completion_status: incomplete` と `block_reason` にし、executor の段を `blocked` にして reporter を起動しない。register は `waiting` になり、`block_reason` が残る。再開は executor の段から。
- `block_reason` は `no product changes in <repo> although the plan targets it; N tool permission denial(s) in executor output (first: …); executor reported complete; next: <再開の操作>` の形にした。register の `block_reason` は 200 文字で切られるため、`exec status` が探す目印（`no product changes`）を先頭に置いた。
- register の worktree・in-place・executor の再開の 3 つの呼び出しで、個票の `target_path` と `targets` を `productTargetHints` として渡す（`registerProductTargetHints` を `src/exec/register.ts` に追加）。
- 警告の表示: runner は理由を `Warning:` の行と、要約（`Register run summary`）の `reason=` に出す。`exec status` は、どの `--state` でも末尾に `warnings (no product changes):` の節を出し、`waiting` の register 項目と `blocked` の schedule タスクのうち理由に目印のあるものを並べる。そのため `RegisterItemDoc` に `blockReason` を足した（`src/register/item.ts`）。
- 文書: `[[specdojo:exec-config-guide]]` の `completion_status` の説明の後に、この判定の説明を 1 項目足した。
- 検証の主張と実際の食い違い（入力の `npm run test:browser` の件）は、この項目では扱わず、別の項目として起票することにした。理由: 検出には executor が報告したコマンドと実際に走ったコマンドを突き合わせる仕組みが要り、権限拒否・変更の有無の検出とは材料も直し方も違う。runner が検証を自分で流し直すのは親の検証（`parent_validations`）だけで、executor の報告の検証は記録を写すだけのため、どこまで信じるか（親の検証へ寄せる、ログと照合する、など）の設計の判断が要る。起票の案: 「executor が報告した検証が実際に走ったコマンドと違っても、runner は passed として記録する」（issue、DEV）。

### 5.2. 確認結果

- 単体テスト: `tests/src/exec/executor-outcome-checks.test.ts` を新設した（拒否の行の検出と除外、対象のプロダクトの判定、理由の文言、`exec status` の警告の行）。vitest で 10 件が通った。
- 統合テスト: `tests/src/exec/register-pipeline-e2e.integration.test.ts` に 3 件を足した。プロダクトを対象にする項目でプロダクトを変えない executor は `waiting` と `block_reason`（`no product changes in app1`）が残り、要約と `exec status` に警告が出ること。拒否の行を出す executor は `waiting` と `block_reason`（`tool permission denial`）が残ること。プロダクトを対象にしない項目は、プロダクトを変えなくても `review` に進むこと。この 3 件を vitest で流し、通った。既存の統合テストの全件と `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` は親の検証に任せた。
- 統合の後、PJR-JSEY で runner の動きを確かめてから close する（未実施。executor の範囲外）。

### 5.3. 再発防止策

- executor の報告を、runner が観測した事実（出力の拒否、プロダクトの変更）と突き合わせてから成功とする。判定を 1 つのモジュールにまとめ、単体テストと統合テストで固定した。
- 注意: PJR-08EK の確認（PJR-NHV9）のように、拒否されることを確かめる項目も、今後は拒否の行があるため `waiting` になる。その場合は理由を見て人が判断する。

### 5.4. CHANGELOG に書く事項

- 区分: 不具合修正
- 文案: executor が編集を拒まれたまま、またはプロダクトリポジトリを変えないまま完了と報告すると、runner が成功として review に進めていた問題を修正。edit の executor の出力にツールの権限による拒否がある場合と、プロダクトを対象にする項目でプロダクトの worktree に変更が無い場合は、項目を `waiting` にして `block_reason` に理由を残す。「プロダクトの変更なし」は runner の要約と `exec status` の `warnings (no product changes):` にも出る（PJR-QQRH）

## 6. 関連ドキュメント

- [[specdojo:exec-config-guide]]
- [[prj-0001:pjr-08ek-opencode-extra-roots]]
