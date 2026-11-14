---
specdojo:
  id: prj-0001:pjr-t01p-exec-stage-speedup
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  difficulty: hard
  owner: sol-executor
  registered_at: "2026-11-14T03:31:40Z"
  commit_type: perf
  commit_scope: exec
---

# PJR-T01P agent の 1 段を速くする（親の検証の選び方・統合の commit・reporter・worktree の準備）

## 1. 概要

1 段に 20〜30 分かかっている内訳を減らし、10〜12 分程度にする

## 2. 入力

- 2026-11-14 の kata-wave-1 の実績（cpd-specdojo-cli-050）: worktree の準備 1.7 分、executor 6.8 分、親の検証 5.2 分、reporter（ローカルの gemma）3.7 分、統合 0.25 分。統合の commit のときに lefthook がテスト全体を流し直すと 7.8 分かかり、負荷で時間切れになって統合が止まることもあった（sysd-cross-cutting-policy-005）
- 親の検証の順番待ちは、`parent_validation_concurrency` を 2 にして先に解消した（2026-11-14）

## 3. 完了条件

- **親の検証を変更の種類で選ぶ**：executor の変更が文書だけ（`docs/`・Markdown・YAML の文書）のときは、統合テスト・型検査・TypeScript の lint など、コードに効く検査を流さない。どの変更でどの検査を流すかを `exec-defaults.yaml` の `pipeline.parent_validations` で宣言でき、迷う場合は今までどおり全部流す。文書だけの変更でも、型のメニュー・schema・カタログに効く検査（sidebar のテスト・`validate:schema`・`catalog validate`）は流す。
- **統合の commit で検査を流し直さない**：runner の統合の commit で、親の検証で済んだ検査（lefthook の `test` など）を流し直さない。流し直さない理由と、親の検証が通った証跡の関係を設計に書く。人が手で commit するときの hook は変えない。
- **reporter を速くする**：reporter には、これからもローカル LLM を使う（indie の方針、2026-11-14）。速いクラウドのモデルへの切り替えはしない。代わりに、決まった形の result（executor の報告と証跡から機械的に埋められる項目）は、runner が reporter なしで作る。reporter は、要約や判断が要る項目だけに使う。どの項目を runner が作り、どの項目を reporter に任せるかを設計に書き、reporter なしで作った result も result の schema と検査に通ることを確かめる。
- **worktree の準備を速くする**：準備の中の `specdojo build` など、主の作業ツリーと同じ結果になる処理を使い回すか、要る段だけに絞る。
- 文書だけの変更とコードの変更の両方で、1 段の時間を測り、変更の前後を個票の対応結果に書く。目安は、文書だけの変更で 1 段 10〜12 分。
- 検査を減らしても、統合の後に develop の `npm run check` が通ることを確かめる（落とした検査で見逃しが出ないか）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。保護された設定の変更は、変更案を書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                                                             | 担当         | 状態 | メモ                                        |
| --- | -------------------------------------------------------------------------------- | ------------ | ---- | ------------------------------------------- |
| 1   | 親の検証を `paths` で変更の種類から選ぶ                                          | sol-executor | done | `src/exec/parent-validation.ts`             |
| 2   | 統合の commit で親の検証で済んだ hook を `LEFTHOOK_EXCLUDE` で外す               | sol-executor | done | `src/exec/commit-hook-skips.ts`             |
| 3   | 決まった形の edit result を reporter なしで runner が作る                        | sol-executor | done | `src/exec/mechanical-result.ts`             |
| 4   | worktree の準備の `npm ci` から網越しの問い合わせを減らす                        | sol-executor | done | `src/exec/worktree.ts`                      |
| 5   | 設計・ガイド・schema・テストを更新する                                           | sol-executor | done | 関連ドキュメントを参照                      |
| 6   | 文書だけ・コードの変更で 1 段の時間を測り、develop の `npm run check` を確かめる | indie        | open | 設定を反映した後の実 run が要る（申し送り） |

## 5. 対応結果

### 5.1. 実施内容

- 親の検証: `pipeline.parent_validations` の要素に `paths`（glob）を書けるようにした。executor が変えたファイルが合わない検証は流さず、runner の `not_applicable` として記録する。`paths` が無い検証、変更一覧が無いか上限で切れた場合、統合先を取り込んだ後の再検証では今までどおりすべて流す。runner の `not_applicable` は失敗として扱わず、executor の同じ検証の `not_run` も満たしたものとする。`{ id, paths }` のように `repo` を省いた書き方も受け付ける。
- 統合の commit: `pipeline.commit_hook_skips`（`{ hook, covered_by }`）で、`covered_by` の親の検証がその run ですべて `passed` のときだけ、runner の統合の commit を `LEFTHOOK_EXCLUDE` 付きで実行する。流し直さない理由と証跡の関係は [[prj-0001:sysd-agent-settings|エージェント実行・共通設計]] の「1 段の所要時間を減らす処理」に書いた。手動の commit とプロダクトリポジトリの commit の hook は変えない。
- reporter: `pipeline.mechanical_result: true` のとき、完了で `final_message` のある edit result を runner が作る。どの項目を runner が作り、どの項目を reporter に任せるかも同じ節に書いた。reporter なしで作った出力が reporter の JSON Schema に通り、result に描画しても frontmatter を変えず、markdownlint と未記入の検査に通ることをテスト（`tests/src/exec/mechanical-result.test.ts`）で確かめた。
- worktree の準備: `npm ci` を `--prefer-offline --no-audit --no-fund` で流す。`specdojo build` はコードの注記どおり数秒で、生成物は worktree の tree に依存するため使い回さなかった。
- テスト: `tests/src/exec/parent-validation.test.ts`・`tests/src/exec/commit-hook-skips.test.ts`・`tests/src/exec/mechanical-result.test.ts`・`tests/src/exec/reporter.test.ts` に追加し、`tests/src/exec/agent-config.test.ts`・`tests/src/exec/task-repos.integration.test.ts` の期待値を新しい書き方とエラー文言に合わせた。

### 5.2. 決めた内容と理由

- `paths` の glob は lefthook と同じ書き方（`**`・`*`・`?`・入れ子のない `{a,b}`）だけを扱う自前の照合にした。Node 22.13 では `path.matchesGlob` が実験的で、依存も増やさないため。
- 統合の commit で hook を外す条件は、親の検証の `passed` だけにした。`not_applicable` で外すと、hook の glob が合う変更（例: `docs/ja/specdojo/templates/**`）でテストが一度も流れないまま統合されるため。
- 統合先を取り込んだ後の再検証では、executor の変更以外も入るため変更の種類で選ばない。
- reporter なしの result でも pipeline state の reporter の actor は割り当てた reporter を記録する。統合の段の再開が register の遷移の実行者としてその actor を使い、`runner` は名簿に無く再開を止めるため。runner が作ったことは result の「進め方」とログに残す。
- `gitResult` の `env` は、`extraEnv` の有無で分けず常に `{ ...gitEnvironment(), ...extraEnv }` にした。三項演算では git 起動の隔離の静的検査が `gitEnvironment()` 由来と判定できず、`extraEnv` が undefined でも結果は同じため（再開時の指示、2026-11-15）。
- `mechanical_result` の既定は `false` にした。既存の利用者の result の書き手を黙って変えないため。

### 5.3. 保護された設定の変更案

`.specdojo/exec-defaults.yaml` は agent が変えられないため、次の変更案を人が反映する。`test-unit` は sidebar の型のメニューのテストや catalog のテストが実際の文書を読むため `paths` を書かず毎回流す。`validate-schema` も毎回流す。`catalog validate` は lefthook の `catalog-validate` のまま統合の commit で流す。

```yaml
pipeline:
  parent_validation_concurrency: 1
  parent_validations:
    - {
        id: lint-ts,
        paths: ["{src,tests,tools,packages}/**/*.{ts,js,mjs,cjs}", "eslint.config.js"],
      }
    - lint-fm
    - lint-md
    - lint-mermaid
    - lint-d2
    - id: test-integration
      paths:
        [
          "{src,tests,tools,scripts,packages}/**",
          "docs/ja/specdojo/**",
          "docs/specdojo/**",
          "vitest.*",
          "tsconfig*.json",
        ]
    - validate-schema
    - id: typecheck
      paths: ["{src,tests,scripts,tools}/**", "packages/docs-lint/**", "tsconfig*.json"]
    - test-unit
  commit_hook_skips:
    - { hook: typecheck, covered_by: [typecheck] }
    - { hook: test, covered_by: [test-unit, test-integration] }
  mechanical_result: true
```

### 5.4. CHANGELOG に書く事項

- `pipeline.parent_validations` の要素に `paths` を書くと、executor が変えたファイルに合う検証だけを親 runner が流す。流さなかった検証は `not_applicable` として evidence に残る。
- `pipeline.commit_hook_skips` で、親の検証が通った検査に対応する Git hook を、runner の統合の commit で流し直さないようにできる。
- `pipeline.mechanical_result: true` で、完了した edit result を reporter の agent を起動せずに runner が作る。
- task worktree の準備の `npm ci` に `--prefer-offline --no-audit --no-fund` を付けた。

### 5.5. 残課題

- 1 段の時間の変更の前後は、上の変更案を反映した後の実 run（文書だけの変更とコードの変更の各 1 件）で測り、ここに書く。変更の前は個票の入力の kata-wave-1 の実績（準備 1.7 分・executor 6.8 分・親の検証 5.2 分・reporter 3.7 分・統合 0.25 分、hook が流れると統合 7.8 分）とする。executor の sandbox では agent と run を起動できないため、未測定である。
- 統合の後に develop で `npm run check` が通ることを確かめる（落とした検査の見逃しの確認）。

## 6. 関連ドキュメント

- [[prj-0001:sysd-agent-settings|エージェント実行・共通設計]]: 1 段の所要時間を減らす処理の設計。
- [[specdojo:exec-config-guide|exec設定ガイド]]: `paths`・`commit_hook_skips`・`mechanical_result` の設定。
- [[specdojo:exec-worktree-guide]]: worktree の準備の `npm ci` の引数。
