---
specdojo:
  id: prj-0001:pjr-dgrz-proficiency-frontier-tier
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-16T13:05:31Z"
  commit_type: feat
  commit_scope: exec
---

# PJR-DGRZ proficiency に expert の上の段 frontier を足し、名前指定のときだけ使えるようにする

## 1. 概要

Astra・Fable のように通常は使わない最上位の agent を、自動の選択では選ばず、名前指定や明示の要求のときだけ使えるようにする

## 2. 入力

- 2026-11-16、利用者が codex の gpt-6-astra と Claude Code の fable（最新の model の別名）を、通常は使わず名前指定のときだけ使う member として足すことを依頼した
- disabled: true は --executor-by でも止まり、priority: 9 は作業中の agent を後ろに回す並べ方のため自動の選択から確実には外れない（src/exec/run/shared.ts の selectCandidates）。利用者が expert の上の proficiency を用意する案を選んだ（2026-11-16）
- proficiency の一覧は型・設定・strategy・job の検査・スキーマに重複して固定されている。codex の effort は exec-defaults.yaml の `by_proficiency` から決まる
- Astra と Fable の member は、この項目が統合されてから proficiency: frontier で名簿に足す

## 3. 完了条件

- proficiency に expert の上の段 `frontier` を足す。対象は、型・設定の読み込み・strategy の判定・job の入力の検査・proficiency を持つすべてのスキーマ・関連する文書とする。
- 自動の選択（`exec run --auto`、schedule の並列の実行、rate limit のときの代わりの選択を含む）では、frontier の member を選ばない。例外はタスクや routing が frontier を明示して求めた場合だけとし、タスクが proficiency を指定しない場合や、上位の agent がすべて作業中の場合も選ばない。
- 名前指定（`--executor-by`・`--fallback-executor-by`・routing・sch-strategy の agent・job の agent）では frontier の member を使える。
- `exec-defaults.yaml` の `by_proficiency` に frontier の対応がない provider の member は、起動の前に原因の分かるエラーにする。`config init` が作る雛形にも frontier の対応を入れる。
- 名前指定で選べること、自動の選択で選ばれないこと、`by_proficiency` の展開を回帰テストで確かめる。
- このリポジトリの `.specdojo/exec-defaults.yaml`（codex の `by_proficiency` に `frontier` を足す。例: effort `xhigh`）は、案を個票の対応結果と `handoff` に書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書き、報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。影響がなければ「なし」と書く（PJR-EPQ3）。
- 保護された設定（`.specdojo/`・`package.json`・`.agents/`・`.claude/`・`.codex/`・`lefthook.yml` など）は変えず、変更が要る場合は案を個票の対応結果と報告の `handoff` に書く。反映は利用者の承認のもと feature ブランチで行う。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                             | 担当 | 状態 | メモ |
| --- | ------------------------------------------------ | ---- | ---- | ---- |
| 1   | 段の追加と自動の選択の規則を設計する             | DEV  | open | -    |
| 2   | 型・スキーマ・検査・雛形を直し、回帰テストを足す | DEV  | open | -    |
| 3   | 文書を直し、exec-defaults の変更案を書く         | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
