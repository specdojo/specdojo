---
specdojo:
  id: prj-0001:pjr-1rjp-grade-stale-yaml-sample-pages
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-23T04:56:18Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-AEKE
  commit_type: fix
  commit_scope: grade
---

# PJR-1RJP rulebook の grade が YAML の sample の古い表示のページを読む

## 1. 課題内容

rulebook の grade が samples/generated の古いページを読み、sample に入っている項目を「ない」と誤って評価した

## 2. 入力

- 利用者の決定（2026-11-23）: オーケストレーターの推奨どおり起票する
- v0.10.0 に入れる（利用者の指定、2026-11-24）

## 3. 影響範囲

| 観点         | 影響                          |
| ------------ | ----------------------------- |
| スコープ     | grade の kata 参照の解決のみ  |
| スケジュール | 影響なし                      |
| コスト       | 小                            |
| 品質         | YAML の sample の誤評価を防ぐ |
| 関係者       | なし                          |

## 4. 対応方針

| 項目     | 内容                                                                                                        |
| -------- | ----------------------------------------------------------------------------------------------------------- |
| 原因     | rulebook の grade が YAML の sample を git 管理外の表示のページで読み、そのページが正本より古いまま使われる |
| 対応策   | 古い表示のページを使わないようにする（作り直すか、正本の YAML を渡す）                                      |
| 依存事項 | なし                                                                                                        |
| 完了条件 | 下の箇条書きのすべてを満たす                                                                                |

- `grade run --target kata` が rulebook を grade するとき、YAML の sample を git 管理外の表示のページ（`samples/generated/<name>.md`）で読み、そのページが古いまま使われる。2026-11-23 の PJR-AEKE の grade で、sample に入っている `info.version`・`based_on`・`info.description` が「ない」と 2 回誤って評価された。
- grade の前に、参照する表示のページが正本の YAML より古ければ作り直すか、YAML の正本を直接渡す。どちらにするかを executor が決め、理由を個票の対応結果に書く。
- 単体テストを足す（正本の YAML より古い表示のページを使わないこと）。
- 関連する設計・ガイド・CLI リファレンスを直す。
- runner の動きを変える場合は、統合の後に orchestrator が `exec smoke` を流して確かめてから close する。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。

## 5. 対応結果

- 原因: `loadKataReferences` が `samples/` 配下を再帰で走査し、git 管理外の `samples/generated/<name>.md`（YAML の表示のページ）を拾っていた。表示のページは正本の YAML と同じ id を持ち、先に走査されると id の重複で正本より優先され、古い内容が grade に渡った。
- 決定: 表示のページを作り直す案ではなく、`generated/` 配下を参照の候補から除く案にした。理由は、grade が正本（YAML）だけを読めば鮮度に依存せず、作り直しの副作用や実行順の前提も要らないため。`loadKataReferences` は `root` を引数に取れるようにした（既定は従来どおり）。
- 変更: `src/grade/targets.ts`。単体テスト `tests/src/grade/grade.test.ts` に、古い表示のページがあっても正本の YAML だけが選ばれるテストを追加した。
- 確認: `npx vitest run tests/src/grade/grade.test.ts`・`npm run typecheck`・`npm run lint:ts` を通した（エラーなし）。runner の動きは変えていないため `exec smoke` は不要。
- 設計・ガイド・CLI リファレンス: 挙動の外形（grade は正本を読む）は変わらないため修正不要。
- 保護された設定は変更していない。

### 5.1. CHANGELOG に書く事項

- 区分: Fixed
- 文案: `grade run --target kata` が、YAML の sample の古い表示のページ（`samples/generated`）を読んで項目を「ない」と誤評価する問題を修正した。

## 6. 関連ドキュメント

- なし
