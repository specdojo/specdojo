---
specdojo:
  id: prj-0001:xer-t-kata-review-all-bes-sample-120-20261125t155528z-609d0486
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-bes-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-bes-sample-120/T-KATA-REVIEW-ALL-bes-sample-120-20261125T155528Z-609d0486/plan.md
  started_at: "2026-11-25T15:55:38.098Z"
  completed_at: "2026-11-25T16:02:28.546Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:bes-sample
    - specdojo:bes-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）として `docs/ja/specdojo/samples/bes-sample.md` を見直した。`_UNDECIDED_` 注記が「発生条件」の末尾にあり、次章で初めて出るデータモデルの項目名を先に参照していた。この注記を「事実データ」の表の後（5.1 の前）へ移し、前提から結論の順に読めるようにした。
- rulebook など sample 以外は変更していない。F009 は Sample 記述標準が本文への役割割当・承認状況の記述を禁じているため sample には足さず、template を直す案を指摘として残した。
- 検証では executor の prettier と markdownlint、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通った。変更種別により対象外となった検査は runner が `not_applicable` と記録している。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 4. 発生条件（末尾）→ 5. 事実データ | `_UNDECIDED_` が「発生条件」の末尾にあり、次の章で初めて出るデータモデル `bdd-sales-record` の項目名の未照合を先に参照していた。前提から結論の順に読めない。 | 注記を「事実データ」の表の後（5.1 の前）へ移した。対象を状態定義 `cdsd-order-status` とデータモデル `bdd-sales-record` と書き、見直す範囲を「発生条件」の条件 1 と本章の項目とした。 | `vp-arc-document-structure`。`specdojo:bes-rulebook` の本文要件「未決事項と承認条件」（関連する章に論点と利用への影響を置く）。 | 要判断（template の未決事項の記入指示は第4章にある。ただし同じ指示が「関連する章に」と書いているので、両方の章に関わる注記は、仮置き ID がすべて出た後の第5章に置いた。章ごとに注記を分ける案は、当面の扱いと見直しの記述が重なるため選ばなかった） |
| R2-2 | R2 | 4. 発生条件 の `_UNDECIDED_`（grade F009） | template の第4章の記入指示は、未決事項に決定者・確認担当・判断時期・記録先を書くよう求めている。一方、Sample 記述標準は本文に役割の割り当てや承認の進み具合を書くことを禁じており、sample では指示どおりに書けない。 | sample は直していない。`docs/ja/specdojo/templates/bes-template.md` の第4章の記入指示から「決定者、確認担当、判断時期、記録先」を除き、「登録簿の個票へ引き継ぐ」に直す案を出す。R1 の No 3 の第1章の承認者の指示と合わせて判断する。 | `vp-qe-omissions-consistency`。`specdojo:sample-authoring-standard` の記述ガイドと禁止事項。`specdojo:bes-rulebook` の全体方針（共通の運用）。 | 要判断（sample に Role code で足す案は、Sample 記述標準に当たるため選ばなかった） |
| R2-3 | R2 | 4. 発生条件（委ねる先の文と場面の表の順） | 条件のリストと場面の表の間に委ねる先の文があり、表の前に置く 1 文がない。ただし、場面の表の判断根拠「照合は販売プロセスで行う」は、委ねる先の文で出てくる販売プロセスを前提にしている。 | 順を入れ替えると後の文を先に参照することになるため、今のままにした。表の前の 1 文は R3 で扱う。 | `vp-arc-document-structure` | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/bes-sample.md`: `_UNDECIDED_` 注記を「発生条件」の末尾から「事実データ」の表の後へ移した（2 行追加、2 行削除）。対象を状態定義 `cdsd-order-status` とデータモデル `bdd-sales-record` と明記し、見直す範囲を「発生条件」の条件 1 と本章の項目とした。

## 3. 申し送り

- R2-1 と R2-2 は「要判断」の印を付けた。人間が確認する場合は、template の第4章の記入指示と Sample 記述標準の整合を見て判断する。
- grade の F001〜F004、F006、F009、F012、F013 は、確認担当・Role code・判断時期・記録先を求めている。ただし Sample 記述標準は本文にそれらを書くことを禁じている。executor はこれらを sample に足していない。template 側の修正は人間が判断する。
- grade の F005、F007、F008、F010、F011 は executor evidence に対応する記述がない。R2 の観点外か、未対応かは evidence から判断できない。
- No: R2-1 / 段: R2 / 箇所: 4. 発生条件（末尾）→ 5. 事実データ / 指摘: `_UNDECIDED_` が「発生条件」の末尾にあり、次の章で初めて出てくるデータモデル `bdd-sales-record` の項目名の未照合を先に参照していた。前提から結論の順に読めない / 直した案: 注記を「事実データ」の表の後（5.1 の前）へ移した。対象を状態定義 `cdsd-order-status` とデータモデル `bdd-sales-record` と書き、見直す範囲を「『発生条件』の条件 1 と本章の項目」とした / 根拠: `vp-arc-document-structure`。`specdojo:bes-rulebook` の本文要件「未決事項と承認条件」（関連する章に論点と利用への影響を置く） / 印: 要判断（template の未決事項の記入指示は第4章にある。ただし同じ指示が「関連する章に」と書いているので、両方の章に関わる注記は、仮置き ID がすべて出た後の第5章に置いた。章ごとに注記を分ける案は、当面の扱いと見直しの記述が重なるため選ばなかった）
- No: R2-2 / 段: R2 / 箇所: 4. 発生条件 の `_UNDECIDED_`（grade F009） / 指摘: template の第4章の記入指示は、未決事項に決定者・確認担当・判断時期・記録先を書くよう求めている。一方、Sample 記述標準は本文に役割の割り当てや承認の進み具合を書くことを禁じており、sample では指示どおりに書けない / 直した案: - （sample は直していない。相手側の `docs/ja/specdojo/templates/bes-template.md` の第4章の記入指示から『決定者、確認担当、判断時期、記録先』を除き、『登録簿の個票へ引き継ぐ』に直す案を出す。R1 の No 3 の第1章の承認者の指示と合わせて判断する） / 根拠: `vp-qe-omissions-consistency`。`specdojo:sample-authoring-standard` の記述ガイドと禁止事項。`specdojo:bes-rulebook` の全体方針（共通の運用） / 印: 要判断（sample に Role code で足す案は、Sample 記述標準に当たるため選ばなかった）
- No: R2-3 / 段: R2 / 箇所: 4. 発生条件（委ねる先の文と場面の表の順） / 指摘: 条件のリストと場面の表の間に委ねる先の文があり、表の前に置く 1 文がない。ただし、場面の表の判断根拠「照合は販売プロセスで行う」は、委ねる先の文で出てくる販売プロセスを前提にしている / 直した案: - （順を入れ替えると後の文を先に参照することになるため、今のままにした。表の前の 1 文は R3 で扱う） / 根拠: `vp-arc-document-structure` / 印: -

## 4. 進め方と実践の型の適用

sample-maintenance の R2（構成）として、章の順と、前提から結論の順に読めるかを確認した。根拠は `vp-arc-document-structure` と、`specdojo:bes-rulebook` の本文要件「未決事項と承認条件」。矛盾する箇所は rulebook と Sample 記述標準を正とした。sample に入れたのは注記の位置の移動だけである。template の指示と標準の食い違いは sample では解消できないため、template を直す案として報告した。
