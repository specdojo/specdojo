---
specdojo:
  id: prj-0001:pjr-69zx-playbook-to-orchestrator-body
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  registered_at: "2026-11-24T23:02:05Z"
---

# PJR-69ZX 運用メモの一般の知見をオーケストレーターの本文へ移す

## 1. 概要

prj-0001 の運用メモ（`pm-orchestrator-playbook`）には、prj-0001 に限らず、どの利用者のオーケストレーターにも効く知見が溜まっている。配布するオーケストレーターの本文（`.agents/specdojo-orchestrator.agent.md`）へ移し、運用メモには prj-0001 に固有の事柄だけを残す。

## 2. 入力

- 利用者の要望（2026-11-25）: playbook に書いてあることで、orchestrator に反映したほうがよいものを確認して起票する
- オーケストレーターが運用メモと本文を照らした（2026-11-25）。本文にない一般の知見が 10 件ほどある
- 担当と期限は利用者の確認待ち

## 3. 完了条件

- 運用メモの次の知見を、配布するオーケストレーターの本文の該当する章へ、prj-0001 に固有の名前（PJR の ID・agent の名前・パス）を外した一般の形で移す案を作る。
  - 完了条件の書き方: 完了条件の中に、見出しの形の文字列（`### 5.1. CHANGELOG に書く事項` など）をそのまま書かない（executor が見出しと取り違えて記録を差し込む）。
  - 完了条件の書き方: 読むだけの文書をパスで書かず、名前で書く（runner がパスを変更の範囲と推定し、同じパスを書いた項目どうしを順番待ちにする）。
  - 完了条件の書き方: CHANGELOG の決まりがないときの推奨として、項目では `CHANGELOG.md` を変えず、個票の対応結果に「CHANGELOG に書く事項」の小節を作って区分と行の文案を書かせ、リリースで集める方式を示す。
  - 止まったときの対処: 再開の前に追加の指示を入れるときは plan を直さず `--resume-note` を使う。executor が完了条件を壊したときは worktree で完了条件を戻し、記録を対応結果へ移してから再開する。reporter の result の書式で waiting になったときは、worktree の result の該当行だけを直して統合だけを流し直す。schedule のタスクの再開は `exec resume --task` を使う。
  - close の前の確かめ方: `requires_human` と書かれた検証は自分で流して確かめる。外部の事実（モデルのタグ名など）は、result に確かめ方がなければ一次情報で確かめる。
  - 登録簿の使い方: 別の project への起票（`register add --project <project-id> --commit`、起票の元は `--from <project-id>:PJR-XXXX`、状態遷移はその project の作業ツリーで行う）と、`external_projects`・`register_sync` を使う場合の扱い。
  - 登録簿の使い方: 個票の本文の素の URL は `<https://...>` と書く（markdownlint の MD034）。
- 移した知見は、運用メモから消すか、本文を指す 1 行にする。運用メモの古くなった記述（第 1 章の「2026-10-20 から 2026-10-22 の運用に基づく」、第 3 章の reporter の既定、第 4 章の agent の振り分け、第 8 章の別の project への起票）を今の運用に合わせる。
- 運用メモに残すのは、prj-0001 に固有の事柄（このリポジトリがパッケージ `specdojo` 自身であることによる `npx` と dist の扱い、prj-0002 の作業ツリー、リリースの手順、セキュリティ検査、devcontainer の named volume、agent の個別の癖、型の合否の決め方など）とする。何を残したかと理由を個票の対応結果に書く。
- 配布するオーケストレーターの本文と 4 つの環境の薄いラッパーは保護された設定のため変えない。本文の変更案を差分の形で個票の対応結果と報告の `handoff` に書く。反映は利用者の承認のもとでオーケストレーターが行い、ラッパーの本文をバイト一致で揃える。
- 運用メモ（`docs/ja/projects/prj-0001/030-project-management/pm-orchestrator-playbook.md`）は executor が直してよい。`npm run lint:md`・`npm run lint:fm` を通し、親の検証を通す。
- 破壊的な変更をしない（PJR-T2X5）。本文の章の名前は変えず、足す形にする。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
