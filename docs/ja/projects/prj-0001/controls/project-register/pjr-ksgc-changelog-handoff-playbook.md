---
specdojo:
  id: prj-0001:pjr-ksgc-changelog-handoff-playbook
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: easy
  registered_at: "2026-11-08T04:04:24Z"
  derived_from:
    - PJR-EPQ3
---

# PJR-KSGC 運用メモの完了条件とリリースの手順を、CHANGELOG を個票の申し送りからまとめる形に直す

## 1. 概要

PJR-EPQ3 の決定に合わせ、運用メモの完了条件の書き方・衝突の対処・リリースの手順を直し、配布するオーケストレーターの本文の変更案を作る

## 2. 入力

- PJR-EPQ3（indie が決定、2026-11-08）: 各項目は CHANGELOG.md を変えず、個票の対応結果の「### CHANGELOG に書く事項」に区分と文案を書く。リリースの todo が close 済みの項目から集める。
- .agents/specdojo-orchestrator.agent.md は保護された設定で、4 つの環境の薄いラッパーと本文をそろえて保守している。executor は変更案を個票の対応結果と報告の handoff に書き、反映は利用者の承認のもと feature ブランチで行う。

## 3. 完了条件

- [[prj-0001:pm-orchestrator-playbook]] に、次を書いている。
  - 登録簿項目の完了条件では「CHANGELOG.md は変えず、個票の対応結果の `### CHANGELOG に書く事項` に区分と文案を書く。影響がなければ『なし』と書く」と指示する。
  - リリースの手順に、前のリリースの後に close した項目の個票からこの節を集め、CHANGELOG の版の節を書く段を足している。集める範囲の決め方（前のリリースの日時と close の記録）と、漏れを確かめる方法を書いている。
  - 並べて流す列の注意や、止まったときの対処の表にある CHANGELOG の衝突の記述を、新しいやり方に合わせて直している。新しいやり方の前に書かれた行が残る間の扱いも書いている。
- 配布するオーケストレーターの本文（`.agents/specdojo-orchestrator.agent.md` の「完了条件の書き方」と「止まったときの対処」）の変更案を、個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`.github/agents/` などの保護された設定は executor が変えない。
- CHANGELOG.md の既存の行は変えていない。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の `### CHANGELOG に書く事項` の節に、区分（追加・変更・不具合修正など）と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `npm run lint:md` が通っている。

## 4. 作業内容

| No  | 作業                                                         | 担当     | 状態 | メモ                                                                                  |
| --- | ------------------------------------------------------------ | -------- | ---- | ------------------------------------------------------------------------------------- |
| 1   | 運用メモの完了条件の書き方・衝突の対処・リリースの手順を直す | executor | done | `pm-orchestrator-playbook.md` に第 2 節を追加し、第 3・5・7・9 節を直した             |
| 2   | オーケストレーターの本文の変更案を書く                       | executor | done | `.agents/specdojo-orchestrator.agent.md` の変更案を本節に記す（保護設定のため個票へ） |
| 3   | 検査を流し、対応結果に書く                                   | runner   | open | 親 runner が lint-md・lint-fm・prettier などを実行して検証する                        |

## 5. 対応結果

### 5.1. 実施内容

`pm-orchestrator-playbook.md`（[[prj-0001:pm-orchestrator-playbook|prj-0001 のオーケストレーター運用メモ]]）を PJR-EPQ3 に合わせて直した。

- 第 2 節「登録簿項目の完了条件の書き方（CHANGELOG を個票の申し送りでまとめる）」を新設。完了条件で「`CHANGELOG.md` は変えず、個票の対応結果の `### CHANGELOG に書く事項` に区分と文案を書く。影響がなければ『なし』と書く」と指示する旨を明記。
- 第 3 節（実行の列の組み方）の `CHANGELOG.md` の衝突注意を新方に合わせ、旧方の行が残っている場合の扱いを追加。
- 第 5 節（止まったときの再開の使い分け）の「統合先と同期できない」「統合で `CONFLICT`」の 2 行に、新方では個別の `CHANGELOG.md` 衝突は起きない旨と旧方の行を混ぜて集める点を追記。
- 第 7 節（落とし穴）の保護された設定の項目を、個票の対応結果と報告の `handoff` への書き先へ修正。
- 第 9 節（リリースの手順）に、close 済み項目の個票から `### CHANGELOG に書く事項`を集めて版節を書く段を追加。集める範囲の決め方（前のリリースの日時と close の記録）と漏れ確認（register event の `close` 件数と集めた個票の照合）を明記。旧方の行は先に `## [Unreleased]` に集めた上で取り込む。

### 5.2. 配布するオーケストレーター本文の変更案（`.agents/specdojo-orchestrator.agent.md` と 4 つの環境の薄いラッパー）

`.agents/specdojo-orchestrator.agent.md` は保護された設定のため、executor は変えない。次の変更案を、利用者の承認を得て feature ブランチで 4 環境（`templates/codex/agents/specdojo-orchestrator.toml`、`templates/antigravity/orchestrator.md`、`templates/opencode/agents/specdojo-orchestrator.md`、`templates/claude/agents/specdojo-orchestrator.md` と sync させる本体）の本文へ反映する。

**（A）「完了条件の書き方」節の一項目を差し替える**

- 旧: `CHANGELOG は未公開の版の節に書き、公開済みの版の節を変えないと書く。`
- 新: `CHANGELOG.md は変えず、個票の対応結果の \`### CHANGELOG に書く事項\` に区分（追加・変更・不具合修正など）と行の文案を書く。影響がなければ『なし』と書く。公開済みの版の節を変えない。`

**（B）「止まったときの対処」表の 1 行を差し替える**

- 旧: `統合での衝突（CHANGELOG の同じ節など）| 両方の行を残す形に exec ブランチ側をそろえてから \`--resume\` する。記帳のファイルの衝突は runner に任せ、手で解かない`
- 新: `統合での衝突（該当の個票・実装ファイルの同じ行など）| 両方の行を残す形に exec ブランチ側をそろえてから \`--resume\` する。各項目が \`CHANGELOG.md\` を書かないため、個別の \`CHANGELOG.md\` の衝突は起きない。記帳のファイルの衝突は runner に任せ、手で解かない`

### 5.3. ### CHANGELOG に書く事項

なし。このタスクは prj-0001 の運用メモ（内部文書）の編集と、配布本文の変更案の記録であり、SpecDojo npm パッケージの利用者に直接影響する変更はない。配布本文の反映自体は派生 todo で別途実施し、そのときの利用者への影響は当該個票で記す。

## 6. 関連ドキュメント

- 決定: [[prj-0001:pjr-epq3-changelog-from-register-handoff]]
- 運用メモ: [[prj-0001:pm-orchestrator-playbook]]
