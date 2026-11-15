---
specdojo:
  id: prj-0001:pjr-bj7e-integration-test-paths-and-e2e-flake
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-15T10:47:44Z"
  completed_at: "2026-11-15T16:48:41Z"
  conclusion: 0.8.0 の第 1 段で直した（sample だけの変更で流れる test-integration と、負荷で揺れる pipeline-e2e のテストを見直す）。親の検証をすべて通って統合済み
  derived_from:
    - PJR-T01P
  commit_type: test
  commit_scope: exec
---

# PJR-BJ7E sample だけの変更で流れる test-integration と、負荷で揺れる pipeline-e2e のテストを見直す

## 1. 概要

test-integration を流す条件を見直し、pipeline-e2e のテストを負荷に強くする

## 2. 入力

- 2026-11-15、kata-wave-2 で sample だけを変えたタスクでも test-integration が流れ、pipeline-e2e.integration.test.ts が 30 秒の時間切れや一時ファイルの消失で 3 回落ちた（PJR-TN43 の F）
- test-integration の paths は .specdojo/exec-defaults.yaml（保護）にあり、`docs/ja/specdojo/**` を含む（PJR-T01P）

## 3. 完了条件

- test-integration を流す条件（`.specdojo/exec-defaults.yaml` の `paths`）を見直し、sample・rulebook だけの変更で流す必要があるかを決めている。統合テストが実際の型の文書を読むかを調べ、流さなくてよい範囲を変更案に書いている（保護された設定のため）。
- `tests/src/exec/pipeline-e2e.integration.test.ts` が、並べて流す負荷の下で時間切れや一時ファイルの消失（`Cannot find module '/tmp/specdojo-pipeline-e2e-*/fake-agent.mjs'`）を起こす原因を調べ、テストの作りを直している。一時ディレクトリはテストごとに作り、ほかのテストの片付けで消えない。
- 直した後、並べて流す run の親の検証で同じ揺らぎが起きないことを確かめている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。保護された設定の変更は、変更案を書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                            | 担当 | 状態 | メモ                      |
| --- | ----------------------------------------------- | ---- | ---- | ------------------------- |
| 1   | test-integration を流す条件を調べ、変更案を書く | DEV  | done | 変更案は対応結果に記載    |
| 2   | pipeline-e2e のテストの揺らぎの原因を直す       | DEV  | done | -                         |
| 3   | 並べて流す run で確かめる                       | DEV  | open | 親の検証と並走 run で確認 |

## 5. 対応結果

### 5.1. test-integration を流す条件

統合テストが本物のリポジトリの `docs/ja/specdojo` を読む経路は次の 2 つである。

- 一時リポジトリへ `docs/ja/specdojo/templates` と `docs/ja/specdojo/exec-templates` を `cpSync` で写す（`register-pipeline-e2e`・`register-resume`・`job-worktree`・`register/commit`・`cross-project`・`external-project`）。中身が plan・result・成果物の生成結果に直接効く。
- 一時リポジトリに無い資源を package 側（本物のリポジトリ）から探す経路である（`src/shared/template-resolution.ts`）。`collectDocIndexEntries` は bundled kata として、package 側の `rulebooks`・`standards`・`recipes`・`samples`・`templates` を走査する。この関数は `exec run --register`・`register` の approach・target 解決から呼ばれる。ここで使うのは frontmatter の `id` と `type` だけで、本文は読まない。

決めたこと: sample・rulebook だけの変更では test-integration を流さない。理由は次のとおり。

- sample・rulebook が統合テストに効くのは、ID を集めるときに id が重複するか、frontmatter が壊れている場合だけである。これは runner が統合の前に流す `specdojo index build`（重複 ID で失敗する）、親の検証の `lint:fm`、毎回流す `test-unit`（型のメニューや catalog のテストが本物の文書を読む）で先に見つかる。
- 統合テストは 1 回に数分かかり、並べて流す run の負荷を増やす。kata-wave-2 での揺らぎは、この負荷が引き金になっていた。

変更案（`.specdojo/exec-defaults.yaml` は保護された設定のため、人が反映する）:

```yaml
- id: test-integration # npm run test:integration（shell を介さず固定 argv で実行）
  # 統合テストは templates・exec-templates を一時リポジトリへ写して使い、defaults・schemas を
  # package 側から読む。rulebooks・samples などの型は frontmatter の id を集めるだけで、
  # 重複や不備は index build・lint:fm・test-unit が見つけるため、型だけの変更では流さない（PJR-BJ7E）。
  paths:
    - "{src,tests,tools,scripts,packages}/**"
    - "docs/ja/specdojo/{templates,exec-templates,defaults,schemas}/**"
    - "docs/specdojo/**"
    - "vitest.*"
    - "tsconfig*.json"
```

流さなくなる範囲は `docs/ja/specdojo/` 配下の `rulebooks`・`samples`・`recipes`・`standards`・`guides`・`philosophy`・`references` と `index.md` である。`templates` は sample・rulebook と同じ型の仕事でも変わるが、統合テストが一時リポジトリへ写して中身を使うため、流す範囲に残す。

### 5.2. pipeline-e2e のテストの揺らぎ

原因: 一時ディレクトリは、もともとテストごとに `mkdtempSync` で作っていた。名前の衝突や、ほかのテストの片付けで消える作りではなかった。消えていた原因は、時間切れの後片付けにある。

1. 負荷の下で 1 つの run（実 Git・worktree・tsx の子プロセスを順に起こす）が設定既定の 30 秒を超え、Vitest がテストを時間切れにする。
2. Vitest は動いている `runExec` の Promise を止めないまま `afterEach` を流し、そのテストの fixture（`fake-agent.mjs` を含む一時リポジトリ）を消す。
3. 裏で続いた run が次の stage の agent を起こすと、消えた `/tmp/specdojo-pipeline-e2e-*/fake-agent.mjs` を探して `Cannot find module` で落ちる。続いた run は `process.chdir` や出力の差し替えを通して、次のテストにも干渉しうる。

直した内容（`tests/src/exec/pipeline-e2e.integration.test.ts`）:

- 起動した `runExec` の Promise を集合で持ち、両方の `describe` の `afterEach` が、すべての run が終わるまで待ってから cwd を戻して fixture を消すようにした。待つ時間の上限として、hook の timeout にも同じ値を渡した。
- 両方の `describe` に `{ timeout: 180_000 }` を指定し、個別のテストに書いていた `30_000` を外した。並べて流す負荷の下でも、run を途中で打ち切らないようにするためである。設定ファイル全体の `testTimeout`（30 秒）はほかのテストに効くため変えていない。

### 5.3. 確認

- 並べて流す run の親の検証で揺らぎが再び起きないかは、この run の親の検証（`test-integration`）と、次の並走 run の親の検証で確かめる。executor の sandbox では統合テストを流せないため、ここでは確かめていない。
- `npx prettier --check tests/src/exec/pipeline-e2e.integration.test.ts` は通った。`typecheck`・`lint:ts`・`test:unit`・`lint:md` は親の検証が流す。

### 5.4. CHANGELOG に書く事項

- 利用者に影響する変更はない（テストの作りの変更だけである）。test-integration の `paths` の変更案を反映したら、「sample・rulebook などの型の文書だけの変更では、親の検証で test-integration を流さない」と書く。

### 5.5. 残課題

- 変更案を `.specdojo/exec-defaults.yaml` へ反映する（人が行う）。
- 並走 run の親の検証で、`pipeline-e2e` の時間切れと `Cannot find module` が再び起きないことを確かめる。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
