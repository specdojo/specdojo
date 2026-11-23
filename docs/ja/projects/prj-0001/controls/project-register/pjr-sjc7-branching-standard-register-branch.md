---
specdojo:
  id: prj-0001:pjr-sjc7-branching-standard-register-branch
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-23T00:21:30Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-2TX0
  commit_type: docs
  commit_scope: standard
---

# PJR-SJC7 git-branching-standard を register のブランチの方式（PJR-2TX0）に改訂する

## 1. 概要

標準が置き換え前の PJR-11EX の方式（統合専用 actor）のままなので、2TX0 の方式に直し、11EX に置き換えを記録する

## 2. 入力

- PJR-2TX0 の決定（D、1b・2a・3a・4a）を展開する。個人の運用でも、別のプロジェクトから specdojo へ起票することが多いため、早めに着手する（利用者の依頼、2026-11-23）

## 3. 完了条件

- `git-branching-standard` を PJR-2TX0 の決定（D、1b・2a・3a・4a）に合わせて改訂する。register を専用のブランチ（`project/<project-id>/register`）に置いてリモートを正本とすること、そこに置くもの（登録簿の個票とイベント、schedule の実行のイベント）、runner が状態の遷移をそのブランチへ書くこと、develop へ一方向に merge すること、`register ... --commit` が push まで行うことを書く。
- 「developへ入る3層の変更経路」の層 3 と、「運用規模ごとの必須条件」の統合専用 actor の記述を、2TX0 の方式に直す。PJR-11EX の方式（GitHub App の統合専用 actor）を前提にした記述を残さない。
- 単独の運用の間は今の方式（develop への直接の記帳）でよいこと、移る準備の項目（PJR-2TX0 の後続）が終わってから既定を切り替えることを書く。
- 別のプロジェクトから `external_projects` で specdojo へ起票する場合も、register のブランチへ push する経路になることを書く。
- PJR-11EX の個票の対応結果（または関連ドキュメント）に、PJR-2TX0 で置き換えたことを書く。11EX の状態は変えない。
- 標準のほかに、同じ前提で書かれたガイド（`register-operation-guide` など）があれば、食い違う箇所の一覧を個票の対応結果に書く。直すのは標準だけとする。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json`・`.github/` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `npm run lint:md`・`npm run lint:fm` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                                                    | 担当 | 状態 | メモ                    |
| --- | ----------------------------------------------------------------------- | ---- | ---- | ----------------------- |
| 1   | 標準の改訂（register ブランチ、層3、運用規模の条件、external_projects） | DEV  | done | 3・4.1・4.2・5 章を改訂 |
| 2   | PJR-11EX に置き換えの記録を追記                                         | DEV  | done | 状態は変えない          |
| 3   | 関連ガイドの食い違いの洗い出し                                          | DEV  | done | 下記の一覧              |

## 5. 対応結果

### 5.1. 実施内容

`specdojo:git-branching-standard` を PJR-2TX0（D、1b・2a・3a・4a）に合わせて改訂した。

- 3 章: ブランチ表に `project/<project-id>/register` を追加した。
- 4 章: 経路図に register から develop への一方向 merge を追加した。
- 4.1: 層1を「単独運用は runner が merge、複数人運用は PR」、層3を「単独運用は develop へ直接、複数人運用は register ブランチへ push して develop へ一方向 merge」に直した。置くもの、runner の書き込み先、push のやり直し、CI、`external_projects` からの起票も register ブランチへ push する経路になることを書いた。
- 4.2: 統合専用 actor の行を register ブランチの行に置き換えた。単独運用は今の方式でよく、準備の項目が終わってから既定を切り替えることを書いた。
- 5 章: 統合専用 actor による bypass の記述を除いた。
- PJR-11EX の個票に、2TX0 で置き換えたことを追記した（状態は不変）。

### 5.2. 決めた点と理由

- 層1（exec の成果）は、2TX0 の「exec の成果の自動の統合は PR に置き換わる」に従い、複数人運用では PR で統合すると書いた。単独運用の `--no-ff` merge は残した。
- register から develop への merge の仕組み（Actions か runner と CLI か）は、2TX0 が後続へ回したため標準では固定せず「一方向に merge」とだけ書いた。

### 5.3. ガイドとの食い違い（直さない）

- `branch-workflow-guide.md` 7.1 付近（`project/<project-id>/develop` の保護）: 「統合専用 GitHub App または service account だけを bypass actor に指定」と、確認手順 4「統合専用 actor による通常の `exec → develop` だけが bypass できる」が 11EX の前提のまま。
- `branch-workflow-guide.md` 161 行付近: exec の記帳が exec ブランチに残るとの説明が、2a（個票は register ブランチ）と食い違う（複数人運用の既定に切り替えた後）。
- `register-operation-guide.md` 93 行付近: 別 project への起票を `integration_branch`（develop）の worktree で行うとの説明が、register ブランチへ push する経路と食い違う（切り替え後）。
- `register-operation-guide.md`: `external_projects` の説明にも同じ食い違いがある（切り替え後）。

### 5.4. CHANGELOG に書く事項

- 区分: Changed（Documentation）
- 文案: `git-branching-standard` を register 専用ブランチ（`project/<project-id>/register`）の方式（PJR-2TX0）へ改訂し、統合専用 actor の方式（PJR-11EX）を置き換えた。

### 5.5. 保護された設定

変更なし。

## 6. 関連ドキュメント

- [[prj-0001:pjr-2tx0-register-branch-remote-ssot|PJR-2TX0]]
- [[prj-0001:pjr-11ex-multi-user-integration-actor|PJR-11EX]]
- [[specdojo:git-branching-standard|Git ブランチ運用標準]]
