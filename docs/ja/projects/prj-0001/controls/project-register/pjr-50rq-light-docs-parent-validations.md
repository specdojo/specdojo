---
specdojo:
  id: prj-0001:pjr-50rq-light-docs-parent-validations
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
  registered_at: "2026-11-21T11:49:51Z"
  completed_at: "2026-11-22T03:20:21Z"
  conclusion: 文書だけを変えた run の親の検証を、変えた Markdown だけの lint と文書を読むテストの分離、軽い lint の並列で軽くした。文書だけの run の検証は 83〜87 秒から 11.6 秒になった。
---

# PJR-50RQ 文書だけを変えた run の親の検証を軽くし、並列を増やせるようにする

## 1. 概要

文書だけを変えた run でも test-integration・test-unit の全体とリポジトリ全体の lint が 1 本ずつ流れ、1 件あたり約 4 分かかる。文書を読むテストへの絞り込み、変えたファイルだけの lint、lint の並列化で縮め、exec の並列を 4 以上にできるようにする

## 2. 入力

- 2026-11-21、第 3 波と register の run の 46 回分の parent-validation-metrics.jsonl で測った中央値（最大）: test-integration 140 秒（869 秒）、test-unit 48 秒（119 秒）、lint-md 18 秒（90 秒）、lint-fm 17 秒（32 秒）、lint-mermaid・lint-d2・validate-schema は合わせて約 15 秒
- exec-defaults は `parent_validation_concurrency:` 1。test-integration の paths に `docs/ja/specdojo/**` が入り、test-unit は paths がなく毎回流れる。lint:md と lint:fm はリポジトリ全体を検査する
- 文書のパスを含む integration テストは 10 ファイルあるが、多くは fixture の文字列と見ている（未確認）
- コンテナのメモリーは 16GB で、測定時に swap を 2.5GB 使っていた。割り当ての変更は利用者がホストで行う
- 利用者の決定（2026-11-21、indie）: 文書を読むテストへの絞り込み、lint を変えたファイルだけにする、lint の並列化をこの項目で行い、確かめてから 4 列目を増やす

## 3. 完了条件

- 変える前に、文書だけを変えた run（第 3 波の型の run など）の親の検証の時間を、`parent-validation-metrics.jsonl` から検証ごとに集計して個票の対応結果に書く。
- test-integration のうち、実際の文書（`docs/ja/specdojo/**`・`docs/specdojo/**`）を読むテストを確かめて一覧にし、個票の対応結果に書く。文書のパスを fixture の文字列として持つだけのテストは、一覧に含めない。
- 実際の文書を読むテストを、unit と integration のどちらからも別の検証（例: `test-docs`。名前は executor が決め、理由を対応結果に書く）として流せるようにし、`package.json` の script の案を作る。文書だけを変えた run では、test-integration と test-unit の全体ではなく、この検証が流れるようにする。src・tests・tools・scripts・packages・vitest の設定・tsconfig を変えた run では、今までどおり test-integration と test-unit の全体が流れる。
- lint-md と lint-fm を、変えたファイルだけに流せるようにする（統合の commit の hook と同じ範囲）。設定や lint の規則のファイルを変えた run では、今までどおり全体に流す。
- 軽い lint の検証は並べて流し、test の検証は 1 本ずつにできるようにする。runner の側に必要な仕組み（検証ごとに並べてよいかを書くキーなど）を足し、schema と `exec-config-guide` を直す。
- 保護された設定（`.specdojo/exec-defaults.yaml`・`package.json`）は変えない。変える案を個票の対応結果と報告の `handoff` に書く。反映は利用者の承認のもと feature ブランチで行う。
- 単体テストで、文書だけの変更と src の変更のそれぞれで、どの検証が選ばれるかを確かめる。
- `CHANGELOG.md` は変えない。個票の対応結果の `### 5.1. CHANGELOG に書く事項` に、区分と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。
- 統合と保護された設定の反映の後に、オーケストレーターが文書だけを変える run を 1 回流し、検証の合計の時間を変える前と比べて個票に書く。

## 4. 作業内容

| No  | 作業                                        | 担当 | 状態 | メモ                                                             |
| --- | ------------------------------------------- | ---- | ---- | ---------------------------------------------------------------- |
| 1   | 今の検証の時間を集計する                    | DEV  | done | run 219 回分の metrics を集計した                                |
| 2   | 実際の文書を読むテストを分ける              | DEV  | done | `vitest.docs.config.ts` と `test-docs` を追加した                |
| 3   | lint を変えたファイルだけに流せるようにする | DEV  | done | `tools/lint-changed.mjs` と `*-changed` の ID を追加した         |
| 4   | lint を並べて流せるようにする               | DEV  | done | `parallel` キーを runner・schema・guide に追加した               |
| 5   | 保護された設定の案と CHANGELOG の文案を書く | DEV  | done | 案を対応結果に記載した                                           |
| 6   | 検証を通す                                  | DEV  | done | typecheck・lint:ts・単体テストは通した。親の検証は runner が流す |

## 5. 対応結果

変更前後の合計時間の比較（完了条件の最後の項目）は、統合後にオーケストレーターが行う。

### 5.1. CHANGELOG に書く事項

- 区分: Added
- 文案: `pipeline.parent_validations` の要素に `parallel` を追加し、検証 ID `lint-md-changed`・`lint-fm-changed`・`test-docs` を追加した。文書だけを変えた run の親の検証を軽くできる。

### 5.2. 変更前の検証時間

`parent-validation-metrics.jsonl` の `validation-end`（passed のみ、219 ファイル）から集計した。run を並べて流した時間を含むため、個票の入力の値より大きい。

| 検証             | 件数 | 中央値（秒） | 最大（秒） |
| ---------------- | ---- | ------------ | ---------- |
| test-integration | 217  | 182          | 532        |
| test-unit        | 231  | 88           | 179        |
| lint-md          | 232  | 107          | 353        |
| lint-fm          | 235  | 38           | 284        |
| lint-mermaid     | 235  | 16           | 218        |
| validate-schema  | 233  | 8            | 150        |
| lint-d2          | 235  | 3            | 229        |

### 5.3. 実際の文書を読むテストの一覧

`docs/ja/specdojo/**`・`docs/specdojo/**` を `readFileSync` などで読むテストを grep で確かめた。fixture の文字列として持つだけのテストは含めない。`vitest.docs.config.ts` に 14 件を並べ、`npx vitest run --config vitest.docs.config.ts` は 19 ファイル 474 件が約 2.5 秒で通った。

- `tests/docs/specdojo/schemas/` の 2 件（`exec-defaults-schema`・`job-schema`）
- `tests/packages/docs-lint/` の 3 件（`deliverable-type`・`rulebook-schema-enums`・`yaml-deliverable-type`）
- `tests/packages/docs-site/kata-staging.test.ts`
- `tests/src/catalog/index.test.ts`・`tests/src/docs/template-resolution.test.ts`
- `tests/src/exec/` の 4 件（`plans`・`plan-conventions`・`register-plan-escape`・`run-records`）
- `tests/src/grade/grade.test.ts`・`tests/src/kata/command.test.ts`・`tests/src/register/item.test.ts`

_ASSUMPTION_: 名前は `test-docs` とした。unit と integration のどちらにも属さない文書の検証だと分かる名前にしたため。一覧は grep による確認で、文書を読む経路の全数確認ではない。integration テストが `cp` で文書を fixture へ複製する経路は、`src` の変更と同時に流れるため含めていない。

### 5.4. 保護された設定の案

`package.json` の scripts に次を追加する。

```json
"test:docs": "vitest run --config vitest.docs.config.ts",
"lint:md:changed": "node tools/lint-changed.mjs md",
"lint:fm:changed": "node tools/lint-changed.mjs fm"
```

`.specdojo/exec-defaults.yaml` の `pipeline.parent_validations` を、lint の 5 件を軽い順に並べて `parallel: true` を付け、test を 1 本ずつにする。`parent_validation_concurrency` は今は 1 のままにし、確かめた後に `parent_validation_concurrency` を 4 へ上げる。

```yaml
parent_validations:
  - id: lint-ts
    paths: ["{src,tests,tools,packages}/**/*.{ts,js,mjs,cjs}", "eslint.config.js"]
  - { id: lint-md-changed, parallel: true }
  - { id: lint-fm-changed, parallel: true }
  - id: lint-md
    paths: ["packages/docs-lint/**", ".markdownlint*", "package.json"]
    parallel: true
  - id: lint-fm
    paths: ["packages/docs-lint/**", ".remarkrc*", "package.json"]
    parallel: true
  - { id: lint-mermaid, parallel: true }
  - { id: lint-d2, parallel: true }
  - id: test-docs
    paths: ["docs/ja/specdojo/**", "docs/specdojo/**"]
  - id: test-integration
    paths: ["{src,tests,tools,scripts,packages}/**", "vitest.*", "tsconfig*.json"]
  - validate-schema
  - id: typecheck
    paths:
      [
        "{src,tests,scripts,tools}/**",
        "packages/docs-lint/**",
        "packages/docs-site/**",
        "tsconfig*.json",
      ]
  - id: test-unit
    paths: ["{src,tests,tools,scripts,packages}/**", "vitest.*", "tsconfig*.json"]
```

反映時の注意: `.markdownlint*`・`.remarkrc*` の実在を確かめる。`commit_hook_skips` は今のままでよい。

### 5.5. 実施内容

- `src/exec/parent-validation.ts`: 検証 ID 3 件と、要素の `parallel` を追加した。`parallel: true` が続く要素は同時に流し、結果は設定の並びで記録する。
- `docs/specdojo/schemas/v1/exec-defaults.schema.yaml`・`exec-config-guide`: 追加した ID と `parallel` を記載した。
- `tools/lint-changed.mjs`・`vitest.docs.config.ts` を追加した。
- 単体テスト: 文書だけの変更と `src` の変更で選ばれる検証、並列の同時実行と記録順、不正な `parallel` を `tests/src/exec/parent-validation.test.ts` に、`selectFiles` を `tests/tools/lint-changed.test.ts` に追加した。

### 5.6. 残課題

- 保護された設定の反映と、文書だけを変える run 1 回の合計時間の比較は、統合後にオーケストレーターが行う。
- 4 列目への引き上げは、その計測の後に判断する。

### 5.7. 反映の後の比較

オーケストレーターが 2026-11-22 に確かめた。5.4 の案を indie の承認で develop へ入れた（d6bc768bb）後、文書だけを変える PJR-JSEY を `exec smoke` で 1 回流した。

| run                            | 流れた検証                                                               | 検証の時間（開始から終了） |
| ------------------------------ | ------------------------------------------------------------------------ | -------------------------- |
| 変える前: PJR-RPNF（文書だけ） | lint-fm・lint-md・lint-mermaid・lint-d2・validate-schema・test-unit      | 83 秒                      |
| 変える前: PJR-6Y05（文書だけ） | 同上                                                                     | 87 秒                      |
| 変えた後: PJR-JSEY（文書だけ） | lint-md-changed・lint-fm-changed・lint-mermaid・lint-d2・validate-schema | 11.6 秒                    |

- 変えた後は、lint の 4 件が並べて流れ、test の 4 件は `paths` に合わず流れなかった。
- `lint-md-changed` と `lint-fm-changed` は、worktree の HEAD からの差分と未追跡の Markdown を見る。新しい run では executor の変更は統合まで commit されないため、変えた文書を検査する。再開の run で runner の checkpoint の commit が executor の変更を含む場合に検査が空にならないかは、まだ確かめていない。
- `parent_validation_concurrency` は 1 のままにした。4 へ上げるかは、並べた run での負荷を見てから決める。

## 6. 関連ドキュメント

- `exec-config-guide`（`docs/ja/specdojo/guides/exec-config-guide.md`）に、追加した検証 ID と `parallel` を記載した。
