---
specdojo:
  id: prj-0001:pjr-ef7m-post-integration-log-untracked
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  difficulty: medium
  registered_at: "2026-11-22T13:42:07Z"
---

# PJR-EF7M 統合の後の検査のログ（post-integration.log）が、毎回 git の管理外に残る

## 1. 課題内容

exec run の統合の後に書く post-integration.log は、統合の commit の後に書かれるため commit に入らず、git の管理外のまま作業ツリーに溜まる。2026-11-22 の夜に 61 件が残っていた。

## 2. 入力

- 2026-11-22 の夜の確かめで、git の管理外のファイル 71 件のうち 61 件が execution/runs/register/ の下の post-integration.log だった。前の引き継ぎでも commit の対象ではないとして残していた。
- 書いているのは src/exec/run/register-worktree.ts・schedule-task.ts・job.ts の runPostIntegration の logPath（run の記録の置き場の post-integration.log）。
- 利用者の承認（2026-11-22、indie）で起票し、今晩の列に加えた。担当と期限は未定。

## 3. 影響範囲

| 観点         | 影響                                                                      |
| ------------ | ------------------------------------------------------------------------- |
| スコープ     | exec run の統合の後の検査のログ（register・schedule・job の run）         |
| スケジュール | なし                                                                      |
| コスト       | 小さい〜中（ログの扱いの修正とテスト）                                    |
| 品質         | 作業ツリーに管理外のファイルが溜まり、commit の漏れとの見分けがつきにくい |
| 関係者       | オーケストレーター、利用者のリポジトリ                                    |

## 4. 対応方針

| 項目     | 内容                                                                            |
| -------- | ------------------------------------------------------------------------------- |
| 原因     | 統合の後の検査は統合の commit の後に流れ、そのログを commit する段がない        |
| 対応策   | ログを run の記録として残すか、git の管理外に置くかを決め、作業ツリーに残さない |
| 依存事項 | なし                                                                            |
| 完了条件 | 下の箇条書きのすべてを満たす                                                    |

- 統合の後の検査のログを、次のどちらかで扱う。どちらにするかは executor が決め、理由を個票の対応結果に書く。
  - 後の記帳の commit（runner の記録の commit）に含めて残す。
  - 生成物として git の管理外の置き場に書く（`.gitignore` か、git の管理外の場所）。
- register・schedule・job のどの run でも、統合の後の検査が終わったあとに、`post-integration.log` が git の管理外のまま作業ツリーに残らない（統合テストで確かめる）。
- 統合の後の検査が失敗したときに、ログを辿れることは保つ（今の出力の案内が指す場所と合わせる）。
- 今の作業ツリーに残っている既存のログの扱い（消してよいか、移すか）を、個票の対応結果に書く。executor は既存のログを消さない。
- `.gitignore` を変える場合、利用者のリポジトリに配る雛形（init が作るもの）にも要るかを確かめ、要るなら直す。
- 保護された設定は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。
- runner の動きを変えるため、統合の後にオーケストレーターが JSEY を流して確かめてから close する。

## 5. 対応結果

### 5.1. 決定

後者（git の管理外）を採った。ログは統合の後に書かれ、冪等性の確認（`recorded`）が同じ場所を読むため、場所は変えず `.gitignore` で除外する。commit に含める案は、ログのためだけに統合の後へ commit を足す必要があり、runner の動きが増えるため採らなかった。失敗時の案内が指す場所は変わらず、作業ツリーに残って辿れる。

### 5.2. 変更

- `.gitignore` に `docs/**/execution/runs/**/post-integration.log` を追加した。register・schedule・job の run は同じ置き場に書くため、すべて覆う。
- `src/shared/specdojo-gitignore.ts` の既定パターンに同じ行を追加した。init が作る利用者のリポジトリの雛形にも配る。docs/ の外の execution_path には `<executionPath>/runs/**/post-integration.log` を派生させる。
- `tests/src/shared/specdojo-gitignore.test.ts` に、実 git で `post-integration.log` だけが管理外になることの確認と、派生パターンの期待値を足した。

### 5.3. 既存のログの扱い

executor は既存のログを消していない。`.gitignore` の追加後は git status に出なくなるため、消さずに残してよい。もし古いログが不要なら、利用者の判断で消してよい。すでに commit 済みのものがあれば `git rm --cached` で追跡を外す。

### 5.4. CHANGELOG に書く事項

- 区分: Fixed
- 文案: exec run の統合の後の検査のログ（`post-integration.log`）が git の管理外のまま作業ツリーに残る問題を、`.gitignore` と `config init` の既定の除外に加えて解消した。

### 5.5. 確認

- 保護された設定は変えていない。
- 統合テストは追加していない。除外は `.gitignore` の規則であり、実 git を使う単体テストで確かめた。runner の動きは変えていないが、完了条件に従い、統合の後にオーケストレーターが JSEY を流して確かめてから close する。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
