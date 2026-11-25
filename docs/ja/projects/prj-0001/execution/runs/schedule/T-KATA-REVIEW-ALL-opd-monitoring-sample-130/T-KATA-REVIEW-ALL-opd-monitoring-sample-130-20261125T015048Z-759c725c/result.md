---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opd-monitoring-sample-130-20261125t015048z-759c725c
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opd-monitoring-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opd-monitoring-sample-130/T-KATA-REVIEW-ALL-opd-monitoring-sample-130-20261125T015048Z-759c725c/plan.md
  started_at: "2026-11-25T01:50:57.155Z"
  completed_at: "2026-11-25T02:03:33.120Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opd-monitoring-sample
    - specdojo:opd-access-control-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R3（読みやすさ）として、`docs/ja/specdojo/samples/opd-monitoring-sample.md` の文を 6 か所直した（W1・W3・W4・W5・W6・W8）。意味と判断に要る背景・例外・制約は変えていない。
- 指摘は次の表のとおり。
- | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | - | - | - | - | - | - | - | | R3-1 | R3 | 1. 概要（monitoring） | 「決まるまでは、該当する行の扱いで運用する」の主語がなく、何に従うかも読めない | 「決まるまでは、`OPS` と店番担当が表の「決まるまでの扱い」に従って運用する」にした | W1 | - | | R3-2 | R3 | 2.1. 監視対象と守る業務 | 表の KPI・SLO・RPO が初出で正式名を欠く | 表の前に「最後の列は、`opd-index` の KPI（重要業績評価指標）・SLO（サービスレベル目標）・RPO（目標復旧時点）のうち対応する目標を示す」を足した | W8 | - | | R3-3 | R3 | 2.3. 初動の時限と完了条件 | 表の前の文で係りがねじれ、長い。P1・P2 が優先度だと初出で読めない | 「優先度（P1・P2）の条件…」とし、「次の表は `opd-index` の初動を具体化し、通知を受けてから初動を終えるまでの時限と、時限までに解決しない場合の引き継ぎ先を定める」に分けた | W3, W5, W8 | - | | R3-4 | R3 | 2.3. 初動の時限と完了条件 | 15 分以内に連絡できない場合の文に読点が 3 つあり、理由と行動が 1 文に混ざっている | 「…P1 の連絡の期限を超える。このとき店番担当は、異常に気付いた時点で…エスカレーション表に従う」の 2 文にした | W3, W1 | - | | R3-5 | R3 | 2.3. 初動の時限と完了条件 | 営業時間外の通知の文で、初動を始めない主体と確かめてもらう主体が書かれていない | 「通知を受けても、`OPS` は…初動を始めない」「`OPS` は開店前に、販売・つけを記録できるかを店番担当に確かめてもらう」にした | W1, W6 | - | | R3-6 | R3 | 2.4. 閾値の見直し | 例「5 分を 10 分に延ばす」の 5 分が何を指すか読めない。改訂文の主語がなく、`opd-index` が 1 文に 3 回出る | 例を「「5 分続けて応答がない」を 10 分に延ばす」とし、「閾値は `opd-index` が統制するため、`OPS` は…`PO` の承認を得て、`opd-index` 側を改訂してから変更を適用する」にした | W4, W1, `vp-arc-conciseness` | - | | R3-7 | R3 | 3. 関連ドキュメント導線（`opr` 等） | 見出しの「等」は範囲を言い切っていない。ただし見出しは rulebook の本文構成に合わせているので直していない | 直していない。直すなら `opd-rulebook` の見出しを直す | W7 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opd-monitoring-sample.md`: 監視方針の sample の文を読みやすく直した（6 か所、6 行追加・6 行削除）。1 章の暫定運用の主語補完、2.1 章の表の前に KPI・SLO・RPO の正式名の説明を追加、2.3 章の表前の文と 15 分以内に連絡できない場合の文の分割、営業時間外通知の主体の明示、2.4 章の閾値の例と改訂文の整理を行った。

## 3. 申し送り

- R3-7（3 章見出しの「等」）は rulebook の本文構成に合わせた見出しのため直していない。要判断として、直す場合は `opd-rulebook` 側の見出しを直す必要がある。
- plan の「編集対象」は `opd-access-control-sample.md` と解決されていたが、executor はタスク名・根拠の成果物の `path`・kata-guide の「直すのは対象の kata だけ」に従い、`opd-monitoring-sample.md` のみを編集した。`opd-access-control-sample` の R3 が別に要るかは、オーケストレーターの確認が必要。
- R3-1: R3 / 1. 概要（monitoring） / 「決まるまでは、該当する行の扱いで運用する」の主語がなく、何に従うかも読めない / 「決まるまでは、`OPS` と店番担当が表の「決まるまでの扱い」に従って運用する」にした / W1 / -
- R3-2: R3 / 2.1. 監視対象と守る業務 / 表の KPI・SLO・RPO が初出で正式名を欠く / 表の前に「最後の列は、`opd-index` の KPI（重要業績評価指標）・SLO（サービスレベル目標）・RPO（目標復旧時点）のうち対応する目標を示す」を足した / W8 / -
- R3-3: R3 / 2.3. 初動の時限と完了条件 / 表の前の文で「初動を、…時限と、…引き継ぎ先へ具体化する」の係りがねじれ、長い。P1・P2 が優先度だと初出で読めない / 「優先度（P1・P2）の条件…」とし、「次の表は `opd-index` の初動を具体化し、通知を受けてから初動を終えるまでの時限と、時限までに解決しない場合の引き継ぎ先を定める」に分けた / W3, W5, W8 / -
- R3-4: R3 / 2.3. 初動の時限と完了条件 / 15 分以内に連絡できない場合の文に読点が 3 つあり、理由と行動が 1 文に混ざっている / 「…P1 の連絡の期限を超える。このとき店番担当は、異常に気付いた時点で…エスカレーション表に従う」の 2 文にした / W3, W1 / -
- R3-5: R3 / 2.3. 初動の時限と完了条件 / 営業時間外の通知の文で、初動を始めない主体と確かめてもらう主体が書かれていない / 「通知を受けても、`OPS` は…初動を始めない」「`OPS` は開店前に、販売・つけを記録できるかを店番担当に確かめてもらう」にした / W1, W6 / -
- R3-6: R3 / 2.4. 閾値の見直し / 例「5 分を 10 分に延ばす」の 5 分が何を指すか読めない。改訂文の主語がなく、`opd-index` が 1 文に 3 回出る / 例を「「5 分続けて応答がない」を 10 分に延ばす」とし、「閾値は `opd-index` が統制するため、`OPS` は…`PO` の承認を得て、`opd-index` 側を改訂してから変更を適用する」にした / W4, W1, vp-arc-conciseness / -
- R3-7: R3 / 3. 関連ドキュメント導線（`opr` 等） / 見出しの「等」は範囲を言い切っていない。ただし見出しは rulebook の本文構成に合わせているので直していない / - / W7。直すなら opd-rulebook の見出しを直す / 要判断
- 申し送り: plan の「編集対象」は rulebook frontmatter の sample 宣言から docs/ja/specdojo/samples/opd-access-control-sample.md と解決されていた。タスク名・根拠の成果物（`path`）・kata-guide の「直すのは対象の kata だけ」に従い、opd-monitoring-sample.md だけを直した。opd-access-control-sample の R3 が別に要るかは、オーケストレーターが確かめる。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ の sample 1 件だけで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

sample-maintenance の進め方に従い、kata-guide の R3（読みやすさ）の観点で W1〜W10 を確かめ、`opd-monitoring-sample.md` の文を直した。plan に展開された grade の finding と、成果物から届いた Kata が原因の finding はなかった。判断に要る背景・例外・制約は残した。`prettier --check` と `markdownlint-cli2` は executor の実行で通り、runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` も通った。変更は sample 1 件だけなので、`validate:history-links` と、`lint:ts`・`typecheck`・`test:unit`・`test:integration` などは非適用と記録されている。
