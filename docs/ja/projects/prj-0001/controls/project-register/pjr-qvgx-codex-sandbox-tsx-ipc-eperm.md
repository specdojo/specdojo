---
specdojo:
  id: prj-0001:pjr-qvgx-codex-sandbox-tsx-ipc-eperm
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-08-23T07:24:17Z"
  due_on: "2026-08-31"
---

# PJR-QVGX codex sandboxで子プロセスが成立せず検証が常に失敗する問題を解消する

## 1. 概要

codex-expert-executor の sandbox 内では tsx が IPC ソケット `/tmp/tsx-1000/<pid>.pipe` を作成できず EPERM となり、`npm run validate:schema` が成果物の内容と無関係に常に failed となる。PJR-K4TA では reporter のブロック理由の一つになった。

起票後の実行で、同種の事象が検証コマンド全般に及ぶことが分かった。いずれも子プロセスの生成・通信・終了が sandbox 内で成立しない点が共通する。

| 実行     | 検証                      | 事象                                                   |
| -------- | ------------------------- | ------------------------------------------------------ |
| PJR-K4TA | `npm run validate:schema` | tsx の IPC ソケットが `EPERM` で作成できない           |
| PJR-K9KG | `npm run test:unit`       | Vitest が起動後5分間出力も終了もしない                 |
| PJR-KAQV | `npm run test:unit`       | `git check-ignore -z --stdin` の子プロセスが終了しない |

これらは成果物の内容と無関係に失敗するため、reporter が正当にブロックし、オーケストレーターが最終状態で再実行して確認する往復が毎回発生している。個別のコマンドへの対処ではなく、sandbox 内で子プロセスが成立しない条件を特定して扱う。

現在の起動設定は `codex exec --ephemeral --sandbox workspace-write -c approval_policy="never" -c sandbox_workspace_write.network_access=false` である。

## 2. 完了条件

- sandbox 内で子プロセスの生成・通信・終了が失敗する条件が特定され、記録されている。上表の3事象が同じ原因によるものか、別々かが判別できている。
- 原因に応じた対処が実施されている。sandbox 設定で許可する、検証コマンドの実行方式を変える、executor の検証対象から外して親 runner の `parent_validations` へ移す、のいずれか、または組み合わせを選ぶ。選んだ理由が記録されている。
- 対処後、`npm run validate:schema` と `npm run test:unit` が executor の sandbox 内で成功する。成功させられない場合は、その検証を executor では実行せず親 runner が実行する構成へ移し、二重実行にならないようにする。
- 秘匿や隔離を弱める対処を行う場合は、緩和する範囲とその影響が明示されている。sandbox の目的は agent の実行範囲を限定することであり、検証を通すために不必要に広げない。
- 対処が効いていることを、実際の exec 実行または自動テストで確認できる。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run test:integration` が成功する。

## 3. 作業内容

| No  | 作業                                                               | 担当 | 状態 | メモ                                           |
| --- | ------------------------------------------------------------------ | ---- | ---- | ---------------------------------------------- |
| 1   | 上表3事象の再現条件を確認し、同一原因か別々かを判別する            | ARC  | open | 子プロセスの生成・通信・終了のどこで失敗するか |
| 2   | 対処方針を選び、理由を記録する                                     | ARC  | open | sandbox 設定 / 実行方式 / 親 runner への移動   |
| 3   | 対処を実装する                                                     | ARC  | open | 隔離を不必要に弱めない                         |
| 4   | 実際の exec 実行または自動テストで、対処が効いていることを確認する | ARC  | open | 二重実行にならないことも確認する               |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- exec の設定: [[specdojo:exec-config-guide|exec設定ガイド]]
- exec の運用: [[specdojo:exec-operation-guide|exec運用ガイド]]
- 同じ詰まりに寄与する規約: [[prj-0001:pjr-0fct-test-unit-rerun-after-fix|PJR-0FCT test:unitの1回限定規約に修正後の再実行例外を追加する]]
- 親 runner の再検証: [[prj-0001:pjr-q828-reporter-revalidation|PJR-Q828 reporterが解消済みの検証失敗を再評価できない問題を解消する]]
- 1件目の発生: [[prj-0001:pjr-k4ta-kata-not-needed-declaration|PJR-K4TA 実践の型の要否宣言]]
- 3件目の発生: [[prj-0001:pjr-kaqv-agent-raw-stderr-retention|PJR-KAQV agent失敗時の生のstderrを保全する]]
