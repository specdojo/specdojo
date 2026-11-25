---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pm-orchestrator-playbook-sample-120-20261125t223913z-1acddc53
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pm-orchestrator-playbook-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pm-orchestrator-playbook-sample-120/T-KATA-REVIEW-ALL-pm-orchestrator-playbook-sample-120-20261125T223913Z-1acddc53/plan.md
  started_at: "2026-11-25T22:39:42.121Z"
  completed_at: "2026-11-25T22:46:38.263Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:pm-orchestrator-playbook-sample
    - specdojo:pm-orchestrator-playbook-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）として、sample `docs/ja/specdojo/samples/pm-orchestrator-playbook-sample.md` に 2 か所の差分を入れた。
- F009 は、個票の入力・完了条件に変える対象のパスを書く決まりを「実行の運び方」から切り出し、新しい第 7 章「登録簿項目の完了条件の書き方」に移した。後ろの章は「リリースの手順」を 8、「店頭の端末との分担」を 9 に詰め直した。章の順は template と同じである。
- F006 は、目的と適用範囲の未同梱の参照名の例を、本文で使っていない `PJR-KN11` から本文で使う `PJR-KN12` に直した。
- F002・F003・F004・F007 は R1 の版で直っていることを確かめ、重ねて直していない。F001・F005・F008 は R2 の観点に当たらないため変えていない。
- sample 以外の文書は変更していない。runner の検査は、適用される `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` がすべて passed だった。executor の prettier 検査も passed だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R2 | 実行の運び方 の最後の項目（修正前の line 47）→ 新しい章「登録簿項目の完了条件の書き方」 | 個票の入力・完了条件に変える対象のパスを書く決まりが「実行の運び方」に混ざっており、template と rulebook の任意章「登録簿項目の完了条件の書き方」が受け持つ内容と章の割り当てがずれていた（F009、`vp-arc-document-structure`）。 | 決まりを第 7 章「登録簿項目の完了条件の書き方」として立てて本文の段落に移し、「リリースの手順」を 8、「店頭の端末との分担」を 9 に詰め直した。章の順は template と同じにした。 | rulebook の `本文要件` の表、template の章の並び | - |
| 2 | R2 | 目的と適用範囲 の最後の段落（line 20） | 未同梱の参照名の例に挙げた `PJR-KN11` を本文で使っておらず、読み手が参照先を探してしまう（F006、`vp-qe-omissions-consistency`）。 | 本文の agent の癖の表で使っている `PJR-KN12` に直した。 | sample の本文で使っている項目 ID は `PJR-KN12` から `PJR-KN15` だけ | - |
| 3 | R2 | finding F002・F003・F004・F007 | R1 の版で直っていることを確かめた。F003 はリリースの手順の前置きに範囲の決め方がある。F007 は「ほかに使わない agent はない」と書いてある。F002 は `PJR-KN15` を添えてある。F004 は落とし穴の章を消してある。R2 では重ねて直さない。 | - | R1 の commit ecea2c308d の差分 | - |
| 4 | R2（この段では扱わない） | Frontmatter の `based_on`（F008）、リリースの手順 3 の「全件の検査」（F005）、落とし穴の根拠の ID（F001） | F008 は `vp-qe-kata-conformance` で R5（R1）の観点、F005 は `vp-qe-verifiability` で R4 の観点に当たる。F001 は `vp-pm-dependency-risk` で、kata のレビューでは使わない観点にあたり、落とし穴の章は R1 で消えている。いずれも R2 の観点ではないため直していない。 | F008 は R5 で、`based_on` を decision の個票にするか外すか、`supersedes: []` を足すかを決める。F005 は R4 で、流す検査（例: `npm test`）を正本と照らして書く。 | kata-guide の `kata の観点の組` | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-orchestrator-playbook-sample.md`: 決まりを新しい第 7 章「登録簿項目の完了条件の書き方」に移し、後続の章番号を 8・9 に詰め直した（F009）。目的と適用範囲の参照名の例を `PJR-KN11` から `PJR-KN12` に直した（F006）。

## 3. 申し送り

- F008（Frontmatter の `based_on`）は R5 で、decision の個票にするか外すか、`supersedes: []` を足すかを決める必要がある。
- F005（リリースの手順 3 の「全件の検査」）は R4 で、流す検査を正本と照らして具体的に書く必要がある。
- F001 は落とし穴の章が R1 で消えているため、R2 では扱っていない。
- No: 1 / 段: R2 / 箇所: 実行の運び方 の最後の項目（修正前の line 47）→ 新しい章「登録簿項目の完了条件の書き方」 / 指摘: 個票の入力・完了条件に変える対象のパスを書く決まりが「実行の運び方」に混ざっており、template と rulebook の本文要件の任意章「登録簿項目の完了条件の書き方」が受け持つ内容と章の割り当てがずれていた（F009、`vp-arc-document-structure`） / 直した案: 決まりを第 7 章「登録簿項目の完了条件の書き方」として立てて本文の段落に移し、「リリースの手順」を 8、「店頭の端末との分担」を 9 に詰め直した。章の順は template と同じにした / 根拠: rulebook の `本文要件` の表、template の章の並び / 印: なし
- No: 2 / 段: R2 / 箇所: 目的と適用範囲 の最後の段落（line 20） / 指摘: 未同梱の参照名の例に挙げた `PJR-KN11` を本文で使っておらず、読み手が参照先を探してしまう（F006、`vp-qe-omissions-consistency`） / 直した案: 本文の agent の癖の表で使っている `PJR-KN12` に直した / 根拠: sample の本文で使っている項目 ID は `PJR-KN12` から `PJR-KN15` だけ / 印: なし
- No: 3 / 段: R2 / 箇所: finding F002・F003・F004・F007 / 指摘: R1 の版で直っていることを確かめた。F003 はリリースの手順の前置きに範囲の決め方がある。F007 は「ほかに使わない agent はない」と書いてある。F002 は `PJR-KN15` を添えてある。F004 は落とし穴の章を消してある。R2 では重ねて直さない / 直した案: なし / 根拠: R1 の commit ecea2c308d の差分 / 印: なし
- No: 4 / 段: R2（この段では扱わない） / 箇所: Frontmatter の `based_on`（F008）、リリースの手順 3 の「全件の検査」（F005）、落とし穴の根拠の ID（F001） / 指摘: F008 は `vp-qe-kata-conformance` で R5（R1）の観点、F005 は `vp-qe-verifiability` で R4 の観点に当たる。F001 は `vp-pm-dependency-risk` で、kata のレビューでは使わない観点にあたり、落とし穴の章は R1 で消えている。いずれも R2 の観点ではないため直していない / 直した案: F008 は R5 で、`based_on` を decision の個票にするか外すか、`supersedes: []` を足すかを決める。F005 は R4 で、流す検査（例: `npm test`）を正本と照らして書く / 根拠: kata-guide の `kata の観点の組` / 印: 要判断

## 4. 進め方と実践の型の適用

kata-guide の R2 の観点（章の順・粒度・表と本文の配置）に従い、rulebook の本文要件と template の章の並びを正として照合した。R1 後の版で、F009 は章の割り当てのずれを解消するために第 7 章を立てた。F006 は本文で使う項目 ID に合わせて参照名の例を直した。F002・F003・F004・F007 は R1 の commit ecea2c308d の差分で解消を確認した。F001・F005・F008 は別の段の観点のため、直さずに申し送った。
