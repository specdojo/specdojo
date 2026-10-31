---
specdojo:
  id: prj-0001:pjr-790t-register-input-heading-number
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: easy
  owner: DEV
  registered_at: "2026-10-31T02:43:14Z"
  due_on: "2026-11-30"
---

# PJR-790T 入力の章がない種類の個票で入力の見出しに番号を付ける

## 1. 概要

decision など `入力` の章がない種類の個票へ `--input` を書くと、番号のない `## 入力` が末尾に足されるため、番号付きの章として適切な位置に入れる。

## 2. 入力

- src/register/input.ts の setRegisterInput は、入力の章がない個票では本文の末尾に番号のない ## 入力 を足す。Markdown の規約では ## 以下の見出しに連番が要る。todo は 2 章に入るが、decision（PJR-BNMV で発生）では末尾に足された

## 3. 完了条件

- `入力` の章がない個票へ `--input` を書くときは、番号付きの章として入れる。入れる位置は、最初の章（`概要` や `背景`）の直後とし、後ろの章の番号を 1 つずつ繰り下げる。章の番号の振り直しは見出しの番号だけに行い、本文の章の参照は章のタイトルで書かれている前提とする。
- 番号のない `## 入力` がすでにある個票へ `--input` を書くときは、その章を番号付きの章に直して同じ位置へ移す。
- `--input -` で入力を消すときの扱い（章を残して `-` にする今の動き）は変えない。
- register のすべての項目の type（`issue`・`decision`・`todo`・`question`・`risk`・`change-request`・`note`・`epic`）の雛形について、`入力` の章があるかを確かめ、ないものでも上の扱いになることを単体テストで確かめる。
- prj-0001 と prj-0002 の個票で、番号のない `## 入力` が残っているもの（PJR-BNMV など）を直す。直したものを本個票の対応結果に書く。
- `CHANGELOG.md` の `## [Unreleased]` 節に追記する。`0.5.0` と公開済みの版の節は変えない。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` と、変更した文書で `npm run lint:md`・`npm run lint:fm` を流して通し、親の検証も通る。
- 設計で決めることは executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。
- 保護された設定（`.specdojo/`・`package.json` など）に触れる必要がある場合は、変更せずに案を本個票の対応結果と報告の `handoff` に書く。

## 4. 作業内容

| No  | 作業                                                              | 担当     | 状態 | メモ                                                   |
| --- | ----------------------------------------------------------------- | -------- | ---- | ------------------------------------------------------ |
| 1   | `setRegisterInput` で番号付きの章として入れ、後ろの章を繰り下げる | executor | done | 第 1 章直後に `## 2. 入力` を挿入し後続章を繰り下げ    |
| 2   | テストを足し、既存の個票を直す                                    | executor | done | 全 8 種のテンプレート検証テスト追加、PJR-BNMV 個票修正 |

## 5. 対応結果

### 5.1. 実施内容

1. **`setRegisterInput` の改修 (`src/register/input.ts`)**:
   - `findInputSection` を新設し、番号付きの `## 2. 入力` と番号なしの `## 入力` を区別して検出できるようにした。
   - すでに番号付きの入力章がある場合は、既存位置・番号のまま中身を置換する。
   - 番号なしの `## 入力` がある場合はその節を除去し、第 1 章（`## 1. 概要` や `## 1. 背景` など）の直後へ `## 2. 入力` として番号付きで挿入する。
   - 入力章がない場合も、第 1 章の直後に `## 2. 入力` として挿入する。
   - 第 2 章以降の後続の H2 見出し番号を 1 つずつ繰り下げる（例: `## 2. ...` -> `## 3. ...`）。
   - 親章の番号で始まっている配下のサブ見出し（例: `### 2.1. ...`）も、親章の繰り下げに合わせて追従させる（`### 3.1. ...`）。
   - コードブロック内の見出しは AST（remark-parse）により誤判定・誤置換されないようにした。
   - `--input -` による全削除時（空配列）も、章を残して中身を `-` にする挙動を維持した。

2. **テストの更新・拡充 (`tests/src/register/input.test.ts`)**:
   - 既存テストの期待値を新仕様に合わせて更新した。
   - 番号のない `## 入力` が既にある個票から番号付きの章への移動テストを追加した。
   - サブ見出し（H3）の親章連動繰り下げおよびコードブロック内保護のテストを追加した。
   - register の全 8 種類の項目 type（`issue`・`decision`・`todo`・`question`・`risk`・`change-request`・`note`・`epic`）の雛形を読み込み、入力章の有無（あるもの: `issue`, `todo`, `question`, `risk`, `change-request` / ないもの: `decision`, `note`, `epic`）を確認するパラメーター化テストを追加した。全 H2 の位置・番号、Frontmatter の保持、再更新の冪等性、追加前と追加後それぞれでの `--input -` による削除を検証する。
   - 番号なし入力章が本文途中にある場合の移動、引用内の見出し・本文参照の保持、後続章がない場合と H2 がない場合の挿入を検証するテストを追加した。

3. **既存個票の修正**:
   - 末尾に番号のない `## 入力` が残っていた [[prj-0001:pjr-bnmv-product-repo-git-workflow|PJR-BNMV]] の個票を修正した。第 1 章直後に `## 2. 入力` として移動し、`## 2. 検討した選択肢` 〜 `## 7. 関連ドキュメント` の章番号を `## 3.` 〜 `## 8.` に繰り下げた。本作業ツリーの `docs/ja/projects` には prj-0001 のみがあり、prj-0002 の個票は含まれていない。作業ツリー内の個票には、修正後に番号なし入力章が残っていないことを確認した。prj-0002 は別作業ツリーを担当するオーケストレーターによる確認が必要である。

4. **CHANGELOG への追記 (`CHANGELOG.md`)**:
   - `## [Unreleased]` の `### 不具合修正` に PJR-790T の修正内容を追記した。

5. **前回の親検証失敗の修正**:
   - remark の `Heading`・`RootContent` に沿って見出しを絞り込み、開始・終了オフセットの存在を型で保証した。不完全な型述語による型エラー、未定義オフセットの型エラー、および `any` による ESLint エラーの原因を除去した。
   - 検証の実行結果は executor evidence に記録する。`typecheck`・`lint:ts`・`test:unit`・`test:integration`・`lint:md`・`lint:fm`・`validate:schema` は親 runner が再実行する。

### 5.2. 設計上の決定事項

- **サブ見出し（H3〜H6）の連動**: H2 の章番号が繰り下がった際、その配下のサブ見出しが `### <旧親番号>.<節番号>.` で始まっている場合は、整合性を保つため `### <新親番号>.<節番号>.` に自動更新する設計とした。親番号を含まないサブ見出しや番号なしの節はそのまま維持する。
- **後方からの編集適用**: AST から取得したオフセットに基づいて見出し番号を置換する際、テキスト後方（末尾）から前方へ向かって置換を適用することで、前方のオフセット位置のズレを完全に排除した。
- **H2 がない個票への挿入**: 最初の章が存在しない場合は末尾へ `## 1. 入力` を追加し、章番号を 1 から始める。章がある通常の個票は、従来の第 1 章直後に第 2 章として入力を挿入する。
- **設定の変更**: 保護された設定の変更は不要である。

### 5.3. 成果物・変更ファイル

- `src/register/input.ts`
- `tests/src/register/input.test.ts`
- `docs/ja/projects/prj-0001/controls/project-register/pjr-bnmv-product-repo-git-workflow.md`
- `CHANGELOG.md`
- `docs/ja/projects/prj-0001/controls/project-register/pjr-790t-register-input-heading-number.md`
- `events/pjr-790t.yaml` は再開時点で既に存在していた runner の再開イベントを保持し、executor による状態遷移は行っていない。

### 5.4. 残課題

本作業ツリー内の実装・テスト・個票修正は完了した。親 runner による検証結果の確定と、別作業ツリーにある prj-0002 の個票の確認を申し送る。result への記入は reporter と runner が行う。

## 6. 関連ドキュメント

- [[prj-0001:pjr-bnmv-product-repo-git-workflow]]
