---
specdojo:
  id: prj-0001:pjr-zfca-exec-release-force-orchestrator-idle-claim
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-26T22:16:41Z"
  due_on: "2026-12-31"
  derived_from:
    - PJR-E189
---

# PJR-ZFCA exec release の --force を、動いていない run の claim に限ってオーケストレーターに許す

## 1. 概要

PJR-E189 の決定（候補 A）を実装する。specdojo-orchestrator の --force は、claim を持つ run が動いていないと CLI が確かめられるときだけ通し、判定できないときは断る。--reset-worktree と --all-blocked は利用者の承認を得て使う運用のまま。

## 2. 入力

- PJR-E189 で候補 A を採った（indie、2026-11-26）
- いまの CLI は、--force を人の actor のときだけ通す（src/exec/events.ts の canOverrideCrossActor）
- 2026-11-26 に、opus-executor が claim したまま止まった review 9 件と imp-interface-140 を、indie が --force で戻した
- 担当 DEV・期限 2026-12-31 は indie の指示（2026-11-26）

## 3. 完了条件

- `exec release --force` を、actor が `specdojo-orchestrator` のときも、次の条件をすべて満たす場合に通す（PJR-E189 の候補 A）。
  - claim を持つ run が動いていないと CLI が確かめられる。判定には、その task の run の lock・記録した PID・`src/exec/stop-request.ts` の `isProcessAlive` など、既にある手段を使う。どの手段で何を見るかは executor が決め、理由を個票の対応結果に書く。
  - 判定できない（lock や PID の記録がない、読めないなど）ときは、今と同じく断る。断るときのメッセージに、動いているか判定できなかった理由と、人が `--force` で戻せることを書く。
  - run が動いていると判定したときは断り、その run の PID と task を示す。
- 人の actor の `--force` の動きは変えない。`specdojo-orchestrator` 以外の agent の actor は、今と同じく `--force` を通さない。
- `--reset-worktree` と `--all-blocked` は、`specdojo-orchestrator` が使う場合も今の扱いを変えない（利用者の承認を得て使う運用のまま。CLI で止める必要はない）。
- `exec release` を `specdojo-orchestrator` が `--force` で通した場合は、イベントの記録から、オーケストレーターが動いていない run の claim を戻したと分かる（理由の文など）。
- 単体テストで、動いていない run の claim を `specdojo-orchestrator` の `--force` で戻せること、動いている run と判定できない run では断ることを確かめている。
- コマンドリファレンスとオーケストレーターの運用の説明（`docs/ja/specdojo/` の該当箇所）に、この条件を書いている。配布するオーケストレーターの本文（`.agents/`）は保護された設定のため変えず、変更案を個票の対応結果と報告の `handoff` に書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                                 | 担当 | 状態 | メモ                                                                                                                 |
| --- | ---------------------------------------------------- | ---- | ---- | -------------------------------------------------------------------------------------------------------------------- |
| 1   | claim と runner の対応記録、停止確認と解除の排他制御 | DEV  | done | 単独解除・一括解除で同じ判定を使用。人の強制解除は従来どおり                                                         |
| 2   | 単体テストの追加                                     | DEV  | done | 停止・生存・不明・権限エラー、再開した別 PID、イベント証跡、一括解除、dry-run を追加。実行は親 runner の `test-unit` |
| 3   | リファレンスと運用ガイドの更新                       | DEV  | done | 例外の条件、旧 claim の制約、人への引き継ぎ、承認が必要なオプションを記載                                            |
| 4   | 検査と保護設定の申し送り                             | DEV  | done | sandbox の検査結果は executor evidence に記録。親検証と統合後の実動確認、配布本文の変更案を下記へ引き継ぎ            |

## 5. 対応結果

### 5.1. 実装と判定の根拠

- `src/exec/release-safety.ts` で、claim に `meta.claim_run`（runner PID と lock token）を記録する。継承した `SPECDOJO_EXEC_RUN_LOCK_TOKEN` が現在の primary / join lock の所有者記録と一致し、生存する場合だけ採用する。短命な claim CLI の PID や、利用者が `--meta` で渡した未確認情報は使わない。executor 切り替え時の再 claim でも記録を更新する。
- release は現在の所有者を確定した最後の claim を event 列から取得する。snapshot の `meta` は block や note で置き換わるため判定に使わず、人の take-over 後に以前の claim の PID を流用しない。
- `kill(pid, 0)` の `ESRCH` だけを終了の根拠にする。既存の `isProcessAlive` は `EPERM` 以外の例外をすべて終了扱いするため、判定不能を拒否する本用途では同じ手段を厳密に扱う。`EPERM` は生存、その他のエラーは判定不能として拒否する。PID の再利用も生存扱いとなるため安全側に拒否する。
- heartbeat の古さだけでは停止と判断しない。元の PID が終了していても、同じ claim を維持した再開があり得るため、project の primary / join lock の生存 PID または読めない記録があれば拒否する。task ごとの対応がない既存 lock では、無関係な生存 run があっても安全側に拒否する。
- 停止確認後は既存の exec-run lock を取得し、release event の保存と任意の worktree 処理が終わるまで保持して、新規 run / resume との競合を防ぐ。終了済みでも lock が新しい間は既存の stale 待ちを変えず拒否する。正常終了で lock が削除されていても、claim に検証済みの対応記録が残り PID が終了していれば判定できる。対応記録のない旧 claim と手動 claim は人の `--force` に引き継ぐ。
- `canReleaseTask` の例外を `specdojo-orchestrator` の強制解除だけに限定した。`complete`・`block`、他の agent、人の `--force` の条件は維持する。単独・一括・dry-run で同じ確認を使い、成功した release event に `meta.release_stopped_claim_run` と `meta.release_claim_owner` を保存する。

### 5.2. 検証と後続確認

整形・Markdown・カタログ・履歴リンクの検査結果は executor evidence を参照する。`typecheck`・`lint-ts`・`test-unit` を含む親検証は、この executor の終了後に runner が実行する。executor 内で同じ検査を重複実行しない。

統合後は運用メモ第 6.1 節に従い、PJR-JSEY を `--targets PJR-ZFCA` で実行してから close を判断する。実 agent の起動を伴うため、この sandbox では実施していない。

### 5.3. 保護された設定の変更案

`.agents/specdojo-orchestrator.agent.md` の「止まったときの対処」に次の行を加える案を、利用者の承認後に反映する。本 executor は配布本文を変更しない。

| 止まった理由                     | 対処                                                                                                                                                                                                                                                         |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 別の agent が claim したまま停止 | `exec release --by specdojo-orchestrator --force` を使う。CLI が runner の停止を確認できない場合や実行中の場合は拒否理由を示し、人の `--force` に引き継ぐ。`--by` に人の名前を代用しない。`--reset-worktree` と `--all-blocked` は利用者の承認を得てから使う |

反映後は `npm run orchestrator:sync` と `npm run lint:orchestrator-sync` でラッパー・配布テンプレートへの反映を確認する。

### 5.4. CHANGELOG に書く事項

- 区分: 変更
- 文案: `exec release --force` は、claim の runner が停止したと CLI が確認できる場合に限り `specdojo-orchestrator` からも使えるようになりました。実行中・判定不能の run は拒否し、停止を確認した PID と元の所有者を release event に記録します。

## 6. 関連ドキュメント

- [[prj-0001:pjr-e189-exec-release-force-reserved-actor|PJR-E189 の決定]]
- [[specdojo:command-reference|CLIコマンドリファレンス]]
- [[specdojo:exec-operation-guide|exec運用ガイド]]
- [[specdojo:orchestrator-operation-guide|オーケストレーター運用ガイド]]
- [[prj-0001:pm-orchestrator-playbook|prj-0001 のオーケストレーター運用メモ]]
