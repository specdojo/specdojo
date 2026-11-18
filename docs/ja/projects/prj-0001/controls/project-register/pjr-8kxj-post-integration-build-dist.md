---
specdojo:
  id: prj-0001:pjr-8kxj-post-integration-build-dist
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  difficulty: hard
  owner: ARC
  registered_at: "2026-11-17T22:57:37Z"
  due_on: "2026-11-30"
---

# PJR-8KXJ exec run の統合の後に、src が変わったら dist を自動で作り直す

## 1. 概要

src を変える項目の統合の後に dist が古くなり次の run が止まるため、exec-defaults の pipeline に統合後の処理（`post_integration`）を許可リストの ID で指定できるようにし、build-dist を流す。

## 2. 入力

- 利用者の提案（2026-11-18）: dist を自動で作り直す処理は postprocess 等で指定する
- orchestrator の調べ（2026-11-18）: `parent_validations` は固定 ID の許可リストと paths で、executor の後・統合の前に親が流す。dist が src より古いことは src/shared/dist-freshness.ts が検出して run を止めるだけで、orchestrator が統合のたびに npm run build を手で挟んでいる
- 利用者の決定（2026-11-18）: `pipeline.post_integration` に ID（最初は build-dist = npm run build）と paths を書き、統合した変更が paths に当たるときだけ、親が exec のロックを持ったまま流す。失敗しても統合は戻さず、失敗を記録して次の run は dist-freshness の判定で止める。exec-defaults.yaml と package.json は保護された設定のため、反映は変更案として個票に書き、利用者の承認のもと feature ブランチで行う

## 3. 完了条件

- `exec-defaults.yaml` の `pipeline.post_integration` に、統合の後に親が流す処理を ID と `paths` で指定できるようにする。ID は `parent_validations` と同じく固定の許可リストで決め、最初は `build-dist`（`npm run build`）だけとする。任意のコマンドや引数は受け付けない。
- 処理は、統合した変更が `paths` に当たるときだけ、親が exec のロックを持ったまま、統合の commit の後に流す。同時に流れる run と重ならない。
- 失敗しても統合は戻さない。失敗を run の記録と出力に残し、次の run は `src/shared/dist-freshness.ts` の判定で止まる。成功・失敗・流さなかった理由（`paths` に当たらない）が run の記録で分かる。
- 設定の読み込み（未知の ID・型の誤り）、`paths` の判定、成功と失敗の扱いを単体テストで確かめる。
- prj-0001 の `exec-defaults.yaml` に `build-dist` を足す変更案（`paths` は `src/**` と `tsconfig*.json` を目安とする）を個票の対応結果に書く。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。
- 設計の変更を関係する文書（`docs/ja/specdojo/references/command-reference.md`・exec の設計書など）へ反映する。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                                    | 担当 | 状態 | メモ                                                      |
| --- | ------------------------------------------------------- | ---- | ---- | --------------------------------------------------------- |
| 1   | `post_integration` の設定と許可リストを足す             | ARC  | done | `src/exec/post-integration.ts`・schema・`agent-config.ts` |
| 2   | 統合の後に親が流す処理と、失敗時の記録を実装する        | ARC  | done | register・schedule・job の worktree 統合後に実行          |
| 3   | 単体テストと文書を足し、`exec-defaults.yaml` の案を書く | ARC  | done | 案は対応結果を参照                                        |

## 5. 対応結果

### 5.1. 実施内容

- `src/exec/post-integration.ts` を追加した。`pipeline.post_integration` を `{ id, paths }` の配列として読み、ID は `build-dist` だけを許す。未知の ID・型の誤り・空の `paths`・`command` などの余分な項目・ID の重複は `loadExecDefaultsConfig` で拒否する。`exec-defaults.schema.yaml` にも同じ制約を足した。
- `build-dist` は親検証の許可リストの `build`（`npm run build` の固定 argv）で実行する。任意のコマンドや引数は受け付けない。
- 統合の commit の直前の HEAD と直後の HEAD の差分（`git diff --name-only --no-renames -z`）が `paths` に当たるときだけ流す。register（`src/exec/run/register-worktree.ts`）・schedule（`src/exec/run/schedule-task.ts`）・job（`src/exec/run/job.ts`）の worktree 統合の後、撤去の前に呼び、exec のロックを持ったまま流す。統合済みからの再開では `integratedCommitRange` で元の統合の commit を探して判定する。
- 失敗しても統合は戻さない。`dist/.specdojo-build-failed` を置き、`src/shared/dist-freshness.ts` はこの印があれば stale と判定して次の `exec` を止める。成功時と手動の `npm run build`（dist を消してから作る）で印は消える。
- 結果は run の記録の `post-integration.log`（JSON Lines、`status` は `passed` / `failed` / `skipped`）と標準出力の `[post-integration]` 行に残す。同じ統合の commit で記録済みの処理は再開時に繰り返さない。
- 単体テスト `tests/src/exec/post-integration.test.ts` と schema のテスト、register の E2E（integration）テストを足した。
- [[specdojo:command-reference]] と [[specdojo:exec-config-guide]] に設定と挙動を書いた。

### 5.2. 決めた点と理由

- 失敗の記録先は run の記録の `post-integration.log` とした。result は reporter の後に描画済みで、統合の後に書き換えると統合済みの commit と食い違うため。
- tsc は失敗しても新しい JS を出し得るため、mtime だけでは次の run が止まらない。このため失敗の印（`dist/.specdojo-build-failed`）を dist-freshness の判定に加えた。`dist/` は Git の管理外のため commit には影響しない。
- 対象は worktree 実行だけとした。in-place 実行は統合の merge を持たず、利用者が自分で build する運用と変わらないため。
- `paths` は必須とした。省略時に常に流すと docs だけの統合でも build が走り、ロックの保持が長くなるため。

### 5.3. 保護された設定の変更案

prj-0001 の `.specdojo/exec-defaults.yaml` の `pipeline` に次を足す（利用者の承認のもと feature ブランチで反映する）。`package.json` の変更は要らない。

```yaml
pipeline:
  post_integration:
    - id: build-dist
      paths: ["src/**", "tsconfig*.json"]
```

### 5.4. CHANGELOG に書く事項

- 区分: Added
- 文案: `exec run` の worktree 実行で、統合の後に `pipeline.post_integration` の固定処理（`build-dist` = `npm run build`）を、統合した変更が `paths` に当たるときだけ流せるようにした。失敗しても統合は戻さず、次の `exec` は dist-freshness の判定で止まる（PJR-8KXJ）。

### 5.5. 残課題

- 上記の `exec-defaults.yaml` の変更案の反映（利用者）。

## 6. 関連ドキュメント

- [[prj-0001:pjr-1565-orchestration-queue]]
