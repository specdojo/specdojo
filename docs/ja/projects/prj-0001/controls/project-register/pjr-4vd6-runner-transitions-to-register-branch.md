---
specdojo:
  id: prj-0001:pjr-4vd6-runner-transitions-to-register-branch
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-23T00:21:39Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-2TX0
  depends_on:
    - PJR-N5J8
  commit_type: feat
  commit_scope: exec
---

# PJR-4VD6 runner の状態遷移と対応結果を register のブランチへ書く

## 1. 概要

exec run --register の start・review・waiting と対応結果を register のブランチへ書き、exec のブランチには個票の変更を含めない

## 2. 入力

- PJR-2TX0 の決定（D、1b・2a・3a・4a）を展開する。個人の運用でも、別のプロジェクトから specdojo へ起票することが多いため、早めに着手する（利用者の依頼、2026-11-23）
- v0.10.0 に入れる（利用者の指定、2026-11-24）

## 3. 完了条件

- `exec run --register` の runner が書く状態の遷移（start・review・waiting など）と対応結果を、register のブランチを使う設定のとき register のブランチへ書いて push する。exec のブランチには個票の変更を含めない（2a）。設定がなければ今の動きを変えない。
- 個票の対応結果を executor が書く今の流れと、exec のブランチから個票を外す流れの関係を設計し、個票の対応結果に書く（executor の書いた対応結果を、統合の段で register のブランチへ移すなど）。
- 並行の run が同じ register のブランチへ書いても、lock と `pull --rebase` で失われないことを統合テストで確かめる。
- runner の動きを変えるため、統合の後に orchestrator が `exec smoke` と実際の `exec run --register` を 1 回流して確かめてから close する。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json`・`.github/` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- 関連する設計・ガイド・CLI リファレンスを直す。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                      | 担当         | 状態 | メモ                                                                                                                                                          |
| --- | ----------------------------------------- | ------------ | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | runner の状態遷移を専用ブランチへ接続     | DEV          | done | 有効時は CLI の `--commit` 経路で start・review・wait・post-review の close を記帳・push                                                                      |
| 2   | executor の個票編集の転送と commit 分離   | DEV          | done | 検証後に三方向マージで転送し、push 成功後に実行元の個票を HEAD へ戻す                                                                                         |
| 3   | 統合テストと関連文書の更新                | DEV          | done | 並行転送・rebase 再試行・競合・push 拒否、worktree／in-place・reporter 再開のテストを追加。実行は親検証に委ねる                                               |
| 4   | sandbox 内の整形・文書検査                | DEV          | done | Prettier・markdownlint・catalog・履歴リンク検査を実施。結果は executor evidence に記録                                                                        |
| 5   | 統合後の smoke と実 agent の register run | orchestrator | open | sandbox では実 agent CLI・利用枠を使う実行はできない。統合後、新しいプロセスで `exec smoke` と実際の `exec run --register` を各 1 回成功させてから close する |

## 5. 対応結果

### 5.1. 実施内容と設計判断

- `register_sync` が有効な場合、runner の遷移は既存の register CLI の `--commit` 経路へ接続する。共通の専用 worktree・lock・`pull --rebase`・push 再試行・復旧マーカーを再利用し、未設定時は既存経路を維持する。
- executor は従来どおり実行元の個票を編集する。検証成功後、exec の commit 前に、HEAD を共通祖先、専用ブランチの最新を取り込み先として三方向でマージする。状態欄は専用ブランチを正本とし、重ならない本文編集は両方残す。同一箇所の競合は停止する。push 成功後だけ実行元を HEAD へ戻すため、転送失敗で編集を失わない。
- 対象個票以外の記帳差分が exec の commit に紛れ込む場合は停止する。runner の checkpoint・review・wait・再開時の複製からも専用ブランチの個票・イベントを外す。失敗した run の未検証本文は worktree に残し、再開後に検証してから転送する。
- 成功時は register を呼び出し元へ一方向に merge し、最新の作業表と対応結果で post-review する。取り込みに失敗したときも統合再開ができるよう、worktree の撤去前に行う。run 記録・成果物は従来の exec 経路に残す。
- 並行 run の個票転送と別 clone による push の割り込みを統合テストで扱う。実 runner 経路では worktree／in-place、waiting と reporter 再開、exec の commit に個票がないことを検証する。テスト実行・型検査などの親検証は runner が実施する。
- 再開時の判断: 親の検証で落ちた E2E の 3 件は、実装ではなくテストが意図と違っていた。`--worktree`・`--in-place` は、fixture の個票 `id`（`test:pjr-ab12-topic`）がファイル名と一致せず、`--commit` 経路の記帳前の検査で start が止まっていた。fixture の `id` をファイル名に合わせる（smoke の fixture と同じ置き換え）。reporter 再開は、ヘルパー `execWorktreePath` が register 専用の worktree（`.git/specdojo/register/` 配下）を exec の worktree と取り違えていたため、専用の worktree を除外する。記帳前の id 検査は既存の register CLI の規約であり、緩めない。
- 保護された設定の変更は不要。既存の同期設定を利用し、`CHANGELOG.md`・登録簿一覧・本個票のステータス項目・result は編集していない。

### 5.2. 残る確認

orchestrator は統合後に新しい runner プロセスで `exec smoke` と実際の `exec run --register` を各 1 回実行し、状態・対応結果の公開と exec の commit 分離を確認してから close する。実 agent CLI と利用枠を使うため executor sandbox では実施できない。

### 5.3. CHANGELOG に書く事項

- 区分: 変更（v0.10.0）
- 文案: `register_sync` が有効な project の `exec run --register` は、状態遷移と検証済みの個票編集を register 専用ブランチへ commit・push し、exec の commit には個票・イベントを含めないようになりました。並行更新は共通ロックと rebase 再試行で同期し、転送に失敗した編集は再開用に保持します。

## 6. 関連ドキュメント

- [[prj-0001:pjr-2tx0-register-branch-remote-ssot|PJR-2TX0]]
- [[specdojo:git-branching-standard|Git ブランチ運用標準]]
- [[specdojo:register-operation-guide|登録簿運用ガイド]]
- [[specdojo:exec-operation-guide|exec 運用ガイド]]
- [[specdojo:exec-worktree-guide|exec worktree ガイド]]
- [[specdojo:command-reference|CLI コマンドリファレンス]]
- [[specdojo:specdojo-config-reference|設定リファレンス]]
