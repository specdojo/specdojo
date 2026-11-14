---
specdojo:
  id: prj-0001:pjr-t01p-exec-stage-speedup
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
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
- **reporter を速くする**：今のローカルの gemma（約 3.7 分）より速い reporter を選べるようにするか、決まった形の result は reporter なしで作れるようにする。どちらにするかは検討して理由を書く。
- **worktree の準備を速くする**：準備の中の `specdojo build` など、主の作業ツリーと同じ結果になる処理を使い回すか、要る段だけに絞る。
- 文書だけの変更とコードの変更の両方で、1 段の時間を測り、変更の前後を個票の対応結果に書く。目安は、文書だけの変更で 1 段 10〜12 分。
- 検査を減らしても、統合の後に develop の `npm run check` が通ることを確かめる（落とした検査で見逃しが出ないか）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。保護された設定の変更は、変更案を書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
