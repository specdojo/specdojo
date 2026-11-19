---
specdojo:
  id: prj-0001:pjr-a5fy-docs-lint-npm-audit
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  owner: ARC
  registered_at: "2026-11-19T10:03:09Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-19T11:56:23Z"
  conclusion: docs-lint の markdownlint-cli を ^0.50.0 へ上げ、配る依存の audit の high を 0 件にした。残る moderate・low は上流待ちとして記録した
  derived_from:
    - PJR-5CTM
  commit_type: fix
  commit_scope: deps
---

# PJR-A5FY docs-lint の配る依存の npm audit を解消する

## 1. 概要

別に publish する @specdojo/docs-lint の配る依存に残る npm audit の high 1 件と moderate・low を、上げる・overrides・上流待ちのどれで直すか決めて反映する

## 2. 入力

- 2026-11-19 に packages/docs-lint で npm audit --omit=dev を実行すると 16 件（low 3・moderate 12・high 1）。high は markdownlint-cli@0.49.1 が引く markdown-it@14.3.2（<=14.3.2、GHSA-vfgh-jcmw-g37q）。moderate には fast-uri・glob・js-yaml・katex・minimatch・smol-toml がある。
- ルートの npm audit は packages/docs-lint の依存を見ないため、PJR-5CTM の完了条件の確認では検出されなかった。PJR-5CTM の executor は、ルートと同じく docs-lint の markdownlint-cli を ^0.50.0 へ上げることを勧めている。
- 利用者は 2026-11-19 に、5CTM の範囲を広げず別の todo として担当 ARC・期限 11 月末で起票することを承認した。

## 3. 完了条件

- `packages/docs-lint` の配る依存（`npm audit --omit=dev` の対象）の high と moderate について、依存ごとに「上げる（版）」「`overrides`」「上流待ち（理由と追跡先）」のどれにするかを、個票の対応結果に表で書く。今より古い版へ下げる直し方は使わない。
- `packages/docs-lint/package.json`・`package-lock.json` は保護された設定のため executor は変えない。変更案（`dependencies`・`devDependencies`・`overrides` の差分）を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと orchestrator が feature ブランチで行う。
- 依存の版を上げるためにコードの変更が要る場合は、executor が `packages/docs-lint/src` と対応するテストを直す。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- 反映の後に、orchestrator が次を確かめる。`packages/docs-lint` の `npm audit --omit=dev` の high と moderate が 0、または上流待ちとして記録したものだけ。docs-lint の `npm run typecheck` と、ルートの `npm run check`・`npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run test:integration`・`npm run lint:md` が通る。
- `CHANGELOG.md` は変えず、個票の対応結果の `### <n>.<m>. CHANGELOG に書く事項`（Markdown の連番ルールに従う）に区分（追加・変更・不具合修正など）と行の文案を書く。影響がなければ「なし」と書く。

## 4. 作業内容

| No  | 作業                                                      | 担当         | 状態 | メモ                                |
| --- | --------------------------------------------------------- | ------------ | ---- | ----------------------------------- |
| 1   | 配る依存の high・moderate の直し方を決めて表に書く        | ARC          | done | 対応結果の表                        |
| 2   | `package.json`・lock の変更案を書く                       | ARC          | done | コード変更は不要                    |
| 3   | 変更案を feature ブランチで反映し、audit と検証を確かめる | orchestrator | done | 589fdf669 で反映し 2968f4be5 で統合 |

## 5. 対応結果

### 5.1. 実施内容

2026-11-19 に `npm audit --prefix packages/docs-lint --omit=dev` を実行し、入力と同じ 16 件（low 3・moderate 12・high 1）を確かめた。各依存の解決版と依存元の版指定は `packages/docs-lint/package-lock.json` で調べ、ルートで `markdownlint-cli@0.50.0` が引く版はルートの `package-lock.json` で調べた。修正版は GitHub Advisory Database で確かめた。`npm view` は sandbox で実行できなかったため、レジストリの最新版は調べていない。

### 5.2. 配る依存の直し方

| 依存                                                                                                               | 重大度   | 今の版                 | 直し方                                    | 理由・追跡先                                                                                                                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------ | -------- | ---------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `markdown-it`                                                                                                      | high     | 14.3.2                 | 上げる（`markdownlint-cli` を `^0.50.0`） | `markdownlint-cli@0.50.0` は `markdown-it` を `~15.0.3` で引く（GHSA-vfgh-jcmw-g37q・GHSA-gfr2-rv44-r23c は 14.3.2 以下）。ルートの lock で 15.0.3 に解決されている。                                                                                      |
| `js-yaml`（`markdownlint-cli` の下）                                                                               | moderate | 5.2.3                  | 上げる（同上）                            | 0.50.0 は `~5.5.0` で引く（GHSA-r3ph-w7gj-g6xm は 5.0.0〜5.4.0）。直接の依存の `js-yaml@5.4.3` は範囲の外。                                                                                                                                                |
| `smol-toml`                                                                                                        | moderate | 1.7.2                  | 上げる（同上）                            | 0.50.0 は `~1.9.1` で引く（GHSA-r4xh-jqrq-34v2 は 1.8.0 以下）。                                                                                                                                                                                           |
| `fast-uri`                                                                                                         | moderate | 3.1.8                  | 上げる（lock の解決版を 3.1.9）           | `ajv` の指定 `^3.0.1` の中に修正版 3.1.9 がある。`package.json` は変えず lock だけ更新する。                                                                                                                                                               |
| `minimatch`（`markdownlint-cli` の下）                                                                             | moderate | 10.2.6                 | 上流待ち                                  | 修正版は 11.0.1 だけ（GHSA-g3hv-75wg-m249、7.0.0〜11.0.0）。`markdownlint-cli@0.50.0` も `~10.2.6` で引く。追跡先は DavidAnson/markdownlint-cli。                                                                                                          |
| `glob`・`minimatch`（`glob`・`@npmcli/map-workspaces` の下）                                                       | moderate | 10.5.0・9.0.9          | 上流待ち                                  | 修正版は `glob` 14.0.2・`minimatch` 11.0.1 だけ（GHSA-3g3m-2fjr-6pw4、9.0.0〜14.0.1）。`unified-engine`・`@npmcli/map-workspaces`・`@npmcli/package-json` が `glob` を `^10` で引く。追跡先は unifiedjs/unified-engine と npm/cli の `@npmcli/config` 系。 |
| `unified-engine`・`unified-args`・`remark-cli`・`@npmcli/config`・`@npmcli/package-json`・`@npmcli/map-workspaces` | moderate | 11.2.2 ほか            | 上流待ち（`glob`・`minimatch` に連動）    | 自身の脆弱性ではなく `glob`・`minimatch` 起因。`npm audit fix --force` は `remark-cli@11.0.0` への格下げを示すため使わない。                                                                                                                               |
| `markdownlint-cli`                                                                                                 | moderate | 0.49.1                 | 上げる（`^0.50.0`）＋上流待ち             | 上げると `js-yaml`・`smol-toml`・`markdown-it` 起因は消え、`minimatch` 起因だけが残る。`npm audit fix --force` の `0.33.0` への格下げは使わない。                                                                                                          |
| `katex`・`micromark-extension-math`・`markdownlint`                                                                | low      | 0.16.47・3.1.0・0.41.1 | 上流待ち（完了条件の対象外の low）        | 修正版は `katex` 0.18.2（GHSA-238p-pmpm-9mq7）。`micromark-extension-math` が `^0.16.0` で引く。`markdownlint` は構文の `math()` だけを使い、`katex` の描画は呼ばない。追跡先は micromark/micromark-extension-math。                                       |

反映の後に残る見込みは、`minimatch`・`glob` 起因の moderate と `katex` 起因の low で、すべて上流待ちとして上表に記録したもの。ルートの全体の `npm audit` に残るものと同じ。

### 5.3. 変更案

`packages/docs-lint/package.json`:

```diff
   "dependencies": {
     ...
     "js-yaml": "^5.4.3",
-    "markdownlint-cli": "^0.49.1",
+    "markdownlint-cli": "^0.50.0",
     "remark": "^15.0.1",
```

`devDependencies`・`overrides` は変えない。`packages/docs-lint/package-lock.json` は `npm install --prefix packages/docs-lint` の後に `npm update fast-uri --prefix packages/docs-lint` で更新する。

### 5.4. executor が決めた点

1. `overrides` は使わない。publish したパッケージの `overrides` は利用者の環境に効かず、配る依存の audit を直せない。残る `glob`・`minimatch`・`katex` の修正版は依存元の指定と major（0.x では minor）が違い、このリポジトリの lock だけに強制すると `remark-cli`・`markdownlint` の動作を保証できない。
2. `fast-uri` はルートと違い `overrides` でなく lock の更新にする。利用者は `ajv` の `^3.0.1` で修正版を解決でき、`package.json` に書く必要がない。
3. コードの変更は要らないと判断した。markdownlint 0.42 も `parser` を持たないカスタムルールに `params.tokens`（markdown-it のトークン）を渡す。ルールの単体テスト `tests/packages/docs-lint/markdownlint-rule-no-chinese-glyphs.test.ts` は、ルートに入っている `markdownlint@0.42.2`・`markdown-it@15.0.3` で動いている。
4. ルートの `npm run lint:md` は `packages/docs-lint/node_modules/.bin` の `markdownlint` を使うため、反映後は 0.50.0 の規則で全文書を検査することになる。sandbox では実行できなかったため、反映後の `npm run lint:md` で orchestrator が確かめる。

### 5.5. CHANGELOG に書く事項

区分は `変更`。行の文案:

- `@specdojo/docs-lint の markdownlint-cli を 0.50 へ上げ、配る依存の npm audit の high（markdown-it）と moderate（js-yaml・smol-toml・fast-uri）をなくしました。glob・minimatch 起因の moderate は上流の修正を待ちます（PJR-A5FY）。`

### 5.6. 反映と確認の結果（orchestrator）

- 変更案を、利用者の承認（2026-11-19）のもと `feature/prj-0001/docs-lint-audit` の 589fdf669 で反映し、2968f4be5 で develop へ統合した。lock は `npm install` と `npm update fast-uri` で更新し、`markdown-it` は 15.0.3、`fast-uri` は 3.1.9 に解決された。
- `packages/docs-lint` の `npm audit --omit=dev` は 12 件（low 3・moderate 9）で high は 0 件。残りは上表で上流待ちとした `glob`・`minimatch`・`katex` 起因だけ。
- feature ブランチで、ルートの `npm run lint:md`（markdownlint 0.50 の規則で全文書）・`npm run check`・`npm run typecheck`・`npm run lint:ts`・`npm run test:unit`（4010 件）・`npm run test:integration`（418 件）と docs-lint の typecheck が通った。

## 6. 関連ドキュメント

- [[prj-0001:pjr-5ctm-npm-audit-high|PJR-5CTM]]（ルートの npm audit の解消。本項目の由来）
- `packages/docs-lint/package.json`
