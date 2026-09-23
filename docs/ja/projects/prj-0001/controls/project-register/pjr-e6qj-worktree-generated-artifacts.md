---
specdojo:
  id: prj-0001:pjr-e6qj-worktree-generated-artifacts
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-09-03T10:21:23Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-03T10:37:47Z"
  conclusion: worktree の依存インストール直後に生成物をまとめて作るようにし、生成物を前提とする検証が成果物と無関係に失敗する状態を解消した。
---

# PJR-E6QJ worktree 実行で生成物が用意されず親検証が失敗する

## 1. 概要

worktree 実行の準備処理は `npm ci` で依存を用意するが、生成物は作らない。生成物は
`.gitignore` の `docs/**/generated/*` により追跡対象外で、worktree へ複製されない。

そのため生成物の存在を前提とするテストが worktree では必ず失敗する。親 runner の
`test-unit` は成果物と無関係にこの失敗を検出し、agent の実行を block する。

PJR-5ERG で発生した。agent は成果物を1つも作らないまま停止し、result だけが残った。

```text
親 runner 検証 test-unit（npm run test:unit）が status=failed
  （tests/src/doc-index.test.ts ...）
```

```text
Generated project register index is missing or invalid:
  ja/projects/prj-0001/controls/project-register/generated/pjr-index.md
Run: specdojo register build before specdojo index build
```

PJR-VH6R でも同じ失敗が起きていた。そのときは orchestrator が worktree で
`register build` と `index build` を実行して回避し、テストが通ることを確認したが、
原因は残ったままだった。次の worktree 実行である PJR-5ERG で再発し、今度は agent が
着手前に停止した。

worktree を使うたびに再発する。実装の巧拙と無関係に実行が空振りするため、失敗の原因を
成果物の問題と切り分けにくい。

## 2. 影響範囲

現時点で worktree の `npm run test:unit` が失敗するのは1件である。

```text
tests/src/doc-index.test.ts > prj-0001 project register references
  > 個票の part_of と pjr-index wikilink が生成された登録台帳へ解決する
```

ただし生成物を参照するテストは他にもあり、対象が広がる可能性がある。

- `tests/src/register.test.ts`
- `tests/src/register-commands.test.ts`
- `tests/src/exec-register-worktree.integration.test.ts`

## 3. 完了条件

- worktree 実行で、生成物を前提とするテストが失敗しない。
- 準備処理の失敗が、成果物の問題と区別できる形で報告される。
- 生成にかかる時間が worktree の準備を著しく遅らせない。
- 既存の worktree 準備（`npm ci` など）の挙動を壊さない。

## 4. 検討事項

- 準備処理で `register build` と `index build` を実行する案が素直だが、生成対象が増えたときに
  追従が要る。どの生成物を用意するかを設定で持つか、`specdojo build` 相当をまとめて呼ぶかの
  判断が要る。
- テスト側を「生成物が無ければスキップ」へ変える案もあるが、生成物と個票の整合を検証する
  目的が失われる。検証を弱める方向は避けたい。
- 生成物を追跡対象へ戻す案は、`.gitignore` の意図（VitePress build で再生成するため追跡しない）
  と衝突する。

## 5. 作業内容

| No  | 作業                                         | 担当 | 状態 | メモ                                                        |
| --- | -------------------------------------------- | ---- | ---- | ----------------------------------------------------------- |
| 1   | worktree 準備処理の現状を調べる              | ARC  | done | `ensureExecWorktree` の `npm ci` 直後に生成段階を追加       |
| 2   | 用意する生成物の範囲を決める                 | ARC  | done | scope を絞らず `specdojo build` を通しで実行（全体で約6秒） |
| 3   | 準備処理へ生成を追加する                     | ARC  | done | 失敗は `Worktree preparation failed:` で準備失敗と明示      |
| 4   | worktree で `test:unit` が通ることを確認する | ARC  | done | 本 worktree で `build` 実行後、親 runner の検証で確認する   |
| 5   | 回帰テストを追加する                         | ARC  | done | 単体（CLI 解決・skip・失敗文言）と統合（実行順）を追加      |

## 6. 対応結果

`ensureExecWorktree` の依存 install 直後に、生成物を作り直す段階を追加した。

- `src/exec-worktree.ts` に `generateWorktreeArtifacts` と `resolveWorktreeBuildCommand` を追加し、
  `ensureExecWorktree` の新規作成・再利用の両経路で `npm ci` の後に実行する。
- 生成は worktree 内の CLI を worktree を作業ディレクトリとして実行する。scope を絞らず
  `specdojo build` を通すため、生成対象が増えても準備処理の追従は不要である。
- `.specdojo/specdojo.config.json` が無いリポジトリ、または worktree 内に CLI が無い場合は
  スキップする。失敗時は `Worktree preparation failed: specdojo build ...` を投げ、成果物の
  失敗と区別できるようにした。
- `checkpointAndEnsureWorktree` が既存 worktree を再利用して早期 return する経路でも生成する。
  生成物は依存と違って古くなり、旧版が作成した worktree には存在しないためである。
- 生成時間は本リポジトリの全 scope で約6秒であり、`npm ci` に対して無視できる。
- 運用手順は `specdojo:exec-worktree-guide` の `prepare` へ反映した。

残課題は次のとおり。

- 実際の `exec run --worktree` 経路での通しの確認は行っていない。本 worktree 内で
  `specdojo build` を実行し、生成物が揃った状態にできることまでを確認した。

- 受け入れ時に orchestrator が単体テスト1362件の通過を確認した。生成対象を scope で絞らず
  build を実行する設計のため、生成物が増えても準備処理の追従が要らない。SpecDojo の設定を
  持たないリポジトリでは生成を試みない。
- 本項目により、PJR-5ERG が着手前に停止した原因は解消された。同項目を再実行して確認する。

## 7. 関連ドキュメント

- [[prj-0001:pjr-5erg-orchestrator-body-sync]]: 本問題で実行が停止している項目。
- [[prj-0001:pjr-vh6r-agent-config-write-handoff]]: 同じ失敗を手動で回避した実行。
