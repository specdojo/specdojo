---
specdojo:
  id: prj-0001:pjr-qw5t-protect-main-push-and-merge-method
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  owner: ARC
  registered_at: "2026-08-28T12:10:09Z"
  due_on: "2026-09-30"
  block_reason: "agent exited with non-zero code: agent exited with non-zero code: agent-config-write: protected configuration changes detected; paths=lefthook.yml; agent must record the required change in the result …"
  register_events:
    - v: 1
      id: reg_56845a9469a241f2b318c30d24703491
      ts: "2026-08-28T12:10:09Z"
      action: add
      actor: manual
      from_status: null
      to_status: open
      reason: item added
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: mainへの直接pushとsquash/rebase mergeを機械的に禁止する
        - field: description
          from: ""
          to: 規約は develop から main への昇格で merge commit を必須とし squash / rebase merge を禁止したが、GitHub のリポジトリ設定は squash と rebase を許可したままであり PR 画面から選べる。選ばれた時点で祖先関係が失われ、規約が警告するとおり次回の昇格で競合が繰り返される。またローカルの pre-push フックは lefthook のスタブが置かれているだけで定義がなく実質無効であり、main への直接 push を止める手段がローカルに存在しない。CLI 自体は push を一切実行せず、agent も provider ごとに deny されているが、provider 設定に依存しない一律の防護柵がない。
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: "2026-08-28"
        - field: due
          from: ""
          to: "2026-09-30"
    - v: 1
      id: reg_169a4d307696403798442f55b01beb9c
      ts: "2026-08-28T13:23:50Z"
      action: start
      actor: codex-expert-executor
      from_status: open
      to_status: in-progress
      reason: work started
      changes:
        - field: status
          from: open
          to: in-progress
      previous_event_id: reg_56845a9469a241f2b318c30d24703491
    - v: 1
      id: reg_91713be970b444f3a9fdb64fc2d620b3
      ts: "2026-08-28T13:30:25Z"
      action: wait
      actor: codex-expert-executor
      from_status: in-progress
      to_status: waiting
      reason: "agent exited with non-zero code: agent exited with non-zero code: agent-config-write: protected configuration changes detected; paths=lefthook.yml; agent must record the required change in the result …"
      changes:
        - field: status
          from: in-progress
          to: waiting
        - field: block_reason
          from: "-"
          to: "agent exited with non-zero code: agent exited with non-zero code: agent-config-write: protected configuration changes detected; paths=lefthook.yml; agent must record the required change in the result …"
      previous_event_id: reg_169a4d307696403798442f55b01beb9c
---

# PJR-QW5T mainへの直接pushとsquash/rebase mergeを機械的に禁止する

## 1. 概要

規約は develop から main への昇格で merge commit を必須とし squash / rebase merge を禁止したが、GitHub のリポジトリ設定は squash と rebase を許可したままであり PR 画面から選べる。選ばれた時点で祖先関係が失われ、規約が警告するとおり次回の昇格で競合が繰り返される。またローカルの pre-push フックは lefthook のスタブが置かれているだけで定義がなく実質無効であり、main への直接 push を止める手段がローカルに存在しない。CLI 自体は push を一切実行せず、agent も provider ごとに deny されているが、provider 設定に依存しない一律の防護柵がない。

## 2. 完了条件

- **GitHub のリポジトリ設定で squash merge と rebase merge が無効になっている**。`gh repo view --json squashMergeAllowed,rebaseMergeAllowed,mergeCommitAllowed` で確認できる。設定変更はリポジトリ管理者が行う。**この条件は 2026-08-28 に PO が実施し充足済みである**。再確認したうえで、その事実を記録する。
- 無効化の影響が確認されている。`exec → develop` の統合はローカルの merge であり PR を使わないため、PR 経由のマージは実質 `develop → main` に限られる。他の用途で squash merge を使っていないことを確認する。
- **`pre-push` フックが `main` への直接 push を拒否する**。`lefthook.yml` へ定義を追加する。現在フックファイルは存在するが定義がなく、何もしていない。
- 拒否の範囲が明確である。`main` への直接 push を止め、`develop` や `feature` / `exec` への push は妨げない。リモート名と ref の判定方法（`refs/heads/main` への更新か）を実装で明示する。
- **拒否メッセージが次の行動を示す**。単に失敗させるのではなく、PR 経由で昇格すること、base を `main`・head を `develop` にすること、merge 方式は merge commit であることを示す。
- **これが防護柵であって境界ではないことが記録されている**。`--no-verify` で迂回でき、フックが導入されていない環境では動かない。実際の境界はサーバ側の branch protection であることを明記する。
- 手元での動作確認を行う。`main` への push が拒否され、`develop` への push が通ることを、実際に push せずに確認できる方法（`--dry-run` など）を含めて記録する。
- [[specdojo:git-branching-standard|Gitブランチ標準]] へ、機械的な強制が入ったことと、その限界を反映する。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run test:integration` が成功する。

### 調査済みの事実

- **作業1は完了済みである**。2026-08-28 に PO が GitHub 設定を変更し、`gh repo view --json squashMergeAllowed,rebaseMergeAllowed,mergeCommitAllowed` の実測値は `{"mergeCommitAllowed":true,"rebaseMergeAllowed":false,"squashMergeAllowed":false}` になった。起票時点は3つとも `true` であった。残る作業は2以降である。
- specdojo CLI には `git push` の呼び出しが**1箇所も存在しない**（`src/` と `tools/` を全走査）。CLI 経由で push されることはない。
- agent は provider ごとに push を禁じている。claude は `.claude/settings.json` の deny、copilot は `--deny-tool 'shell(git push)'`、codex は sandbox の `network_access=false` による。**provider 設定に依存しない一律の手段がない**のが穴である。
- `.git/hooks/pre-push` は lefthook のスタブが置かれているが、`lefthook.yml` に `pre-push` の定義がないため何も実行しない。
- **今回の履歴汚染（`b4203fc0`、2026-08-22）は branch protection 導入（PJR-BJ97、2026-08-26）より前に起きている**。現在は `main` への直接 push が PR 必須のため、同じ経路は塞がっている。
- PR で base を `main`、head を `develop` にすると、merge commit の第1 parent が `main`、第2 parent が `develop` となり、**マージの向きは構造的に正しくなる**。向きの誤りを防ぐための昇格コマンドは必要ない。残る危険は merge 方式の選択だけである。

## 3. 作業内容

| No  | 作業                                                    | 担当 | 状態 | メモ                                |
| --- | ------------------------------------------------------- | ---- | ---- | ----------------------------------- |
| 1   | GitHub 設定で squash / rebase merge を無効化する        | PO   | done | 2026-08-28 に PO が実施済み         |
| 2   | 無効化が他の用途を妨げないことを確認する                | ARC  | done | PR 経由は実質 `develop → main` のみ |
| 3   | `lefthook.yml` へ `pre-push` を追加し `main` を拒否する | ARC  | done | ref 判定と拒否メッセージを実装      |
| 4   | 防護柵と境界の違いを Gitブランチ標準へ記録する          | ARC  | done | `--no-verify` での迂回可能性を明記  |

## 4. 対応結果

- GitHub の merge 設定は、2026-08-28 に PO が取得した `{"mergeCommitAllowed":true,"rebaseMergeAllowed":false,"squashMergeAllowed":false}` を確認した。executor からの再取得は実行環境のネットワーク制限で GitHub API に接続できなかったが、リポジトリ内の変更がこの外部設定へ影響する経路はない。
- PR を使用する経路を確認した。feature / exec は project `develop` へローカル統合され、通常の登録項目の承認も commit ベースであるため、merge 方式の無効化が影響する実質的な経路は `develop → main` の昇格 PR である。squash merge を前提とする他用途は確認されなかった。
- `tools/protect-main-push.mjs` を追加し、Git の `pre-push` 標準入力に含まれる remote ref が `refs/heads/main` の場合だけ終了コード1にした。リモート名を判定条件にしないため、`origin` 以外のリモートでも main の更新を拒否する。他の ref は終了コード0とする。
- `lefthook.yml` に `pre-push` を定義し、標準入力を判定スクリプトへ引き継ぐようにした。拒否メッセージは base `main`、head `project/<project-id>/develop` の Pull Request と merge commit 方式を案内する。
- [[specdojo:git-branching-standard|Gitブランチ標準]] に、GitHub 側で merge commit だけを許可すること、ローカルフックの判定範囲、実 push を伴わない確認手順、`--no-verify` とフック未導入環境では迂回できる限界、実際の境界が branch protection であることを追記した。
- `tests/tools/protect-main-push.test.ts` で main の拒否、develop / feature / exec の許可、複数 ref に main を含む push の拒否、次の行動を示すメッセージを検証する。

## 5. 関連ドキュメント

- 昇格方式の決定: [[prj-0001:pjr-199g-promotion-commit-consolidation|PJR-199G develop から main への昇格時にコミットをまとめる方式を確定する]]
- サーバ側の保護（実際の境界）: [[prj-0001:pjr-bj97-codeowners-and-branch-protection]]
- 反映先の規約: [[specdojo:git-branching-standard|Gitブランチ標準]]
- 昇格手順: [[specdojo:branch-workflow-guide|ブランチワークフローガイド]]
