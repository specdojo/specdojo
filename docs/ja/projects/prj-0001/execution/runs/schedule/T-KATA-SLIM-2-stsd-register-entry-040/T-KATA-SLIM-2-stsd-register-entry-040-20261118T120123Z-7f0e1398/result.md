---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-stsd-register-entry-040-20261118t120123z-7f0e1398
  type: exec-result
  task_id: T-KATA-SLIM-2-stsd-register-entry-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-stsd-register-entry-040/T-KATA-SLIM-2-stsd-register-entry-040-20261118T120123Z-7f0e1398/plan.md
  started_at: "2026-11-18T12:01:42.526Z"
  completed_at: "2026-11-18T12:32:37.889Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - stsd-register-entry
    - specdojo:stsd-rulebook
---

# Edit Result

## 1. 実施内容

- `stsd-rulebook` と `stsd-mermaid-rulebook` から、どの成果物にも共通する運用の記述を外し、共通の正本への参照に置き換えた。
- `stsd-rulebook` に「共通の運用」を 1 項目置き、status・承認・改訂と廃止・役割・未決事項の決定者と決定時期の扱いを `document-metadata-standard` への参照にした。
- grade の指摘 F001（値の一意性の重複を「ファイル命名・ID規則」への参照へ）と F002（分岐に「同じイベントによる」の限定を追加）に対応した。
- `stsd-rulebook` の空白を除く文字数は、表の区切り行を除いて 7,313 字から 5,824 字（79.6%）になった。区切り行を含めると 8,534 字から 7,024 字（82.3%）になった。`stsd-mermaid-rulebook` は区切り行を除いて 4,131 字から 3,956 字になった。章名と必須・条件付きの区分は変えていない。
- executor の `prettier --check` と、runner の `lint:fm`・`lint:md`・`lint:mermaid`・`lint:d2`・`validate:schema`・`test:unit`・`test:integration` は通った。`lint:ts` と `typecheck` は変更種別により対象外だった。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/stsd-mermaid-rulebook.md`: 位置づけの段落に、分岐は同じイベントによるものに限るという限定を足した。本文を言い直すだけの用語の表の行（状態・初期点・終了点・遷移）を外した。全体方針などとの重複は、「完成判定」と「図の分割」を参照する形にまとめた。
- `docs/ja/specdojo/rulebooks/stsd-rulebook.md`: 役割と status・承認・改訂と廃止などの共通の運用を外し、全体方針の「共通の運用」とメタ情報標準への参照にした。6.4 の値の一意性の言い直しを「ファイル命名・ID規則」への参照にし、`-` が複数行で使えることだけを残した。6.5.1 の分岐を「同じ遷移元から同じイベントで分岐する場合」に限定した。6.8 の役割ごとの確認と PM への引き継ぎ、6.6 と本文要件の決定者・決定時期を外した。列の定義を言い直す用語の表の行を削り、重複していた禁止事項を 1 か所にまとめた。

## 3. 申し送り

- condense から届いた Kata が原因の 4 件は `retain` とした。遷移表を正本とし図をその投影とする規定と、分割した図で共有する状態の宣言は、図と表の対応に必要なため残した。分割の閾値（`stsd-mermaid-rulebook` の 6.3）は、変える根拠が足りないため変えていない。
- recipe の変更案（commit の対象外のため未実施）: `docs/ja/specdojo/recipes/stsd-recipe.md` の遷移 ID の振り直しの説明（42 行目付近）を rulebook の「ファイル命名・ID規則」に揃えて短くする。決定者・決定時期（125・174 行目付近）を「影響する状態・遷移 ID と決まるまでの扱い」に替える。PO による公開判断、`ready` 昇格の条件、`draft` の維持（175〜176 行目付近）は共通の運用なので外す。
- template の変更案: `docs/ja/specdojo/templates/stsd-template.md` の未決事項の表（78 行目付近）で、「決定者」「決定時期」の列を「決まるまでの扱い」の列に替える。sample には運用の記述がなく、変更は要らない。
- 共通の正本への追記は要らない。`document-metadata-standard` の「文書の改訂・廃止とライフサイクル変更管理」と「成果物の値制約」で、外した記述を賄える。
- 変更したファイル: docs/ja/specdojo/rulebooks/stsd-rulebook.md、docs/ja/specdojo/rulebooks/stsd-mermaid-rulebook.md。章名と必須・条件付きの区分は変えていない。
- 文字数（空白を除く）: stsd-rulebook は表の区切り行を除いて 7,313 字から 5,824 字（79.6%）、区切り行を含めて 8,534 字から 7,024 字（82.3%）、バイト数は 22,828 B から 18,310 B。stsd-mermaid-rulebook は区切り行を除いて 4,131 字から 3,956 字、区切り行を含めて 4,378 字から 4,200 字。
- F001 への対応: 6.4 で値の一意性を言い直していた箇所を「ファイル命名・ID規則」への参照に置き換え、`-` を複数行で使えることだけを残した。F002 への対応: 6.5.1 の分岐を「同じ遷移元から同じイベントで分岐する場合」に限定し、異なるイベントで出る遷移は分岐として扱わないと明記した。stsd-mermaid-rulebook の位置づけの段落にも同じ限定を足した。
- condense から届いた Kata が原因の 4 件（`retain`）: 遷移表を正本とし図をその投影とする規定と、分割した図で共有する状態の宣言は、図と表の対応に必要なため規定として残した。6.5 に「冗長さは図表をなぞる本文から削る」と明記した。分割の閾値（stsd-mermaid-rulebook の 6.3）は根拠が足りないため変えていない。
- 外した記述: Frontmatter の `status: draft` と人の承認の行、6.8 の役割ごとの確認と PM への引き継ぎ、6.6 と本文要件の決定者・決定時期、用語の表のうち列の定義を言い直す行（stsd では管理場所・イベント・遷移条件、mermaid では状態・初期点・終了点・遷移）。全体方針・記述ガイド・禁止事項の間の重複（複合状態、`&lt;&lt;choice&gt;&gt;`、遷移ラベル、到達性）は 1 か所にまとめ、stsd-mermaid-rulebook の「完成判定」と「図の分割」を参照する形にした。
- recipe の変更案（commit の対象外のため今回は直していない）: docs/ja/specdojo/recipes/stsd-recipe.md の 42 行目の遷移 ID の振り直しの長い説明を、rulebook の「ファイル命名・ID規則」に揃えて短くする。125 行目と 174 行目の決定者・決定時期を「影響する状態・遷移 ID と決まるまでの扱い」に替える。175〜176 行目の PO による公開判断、`ready` 昇格の条件、`draft` の維持は共通の運用なので外す。
- template の変更案: docs/ja/specdojo/templates/stsd-template.md の 78 行目、未決事項の表の「決定者」「決定時期」の列を「決まるまでの扱い」の列に替える。sample には運用の記述がなく、変更は要らない。
- 共通の正本への追記: 要らない。ドキュメントメタ情報標準の「文書の改訂・廃止とライフサイクル変更管理」と「成果物の値制約」で、外した記述を賄える。
- 適用外の検証: `npm run validate:history-links`（変更したのは rulebook 2 件だけで、pjr 個票・plan・result は変更していない）
- rate limit後に sol-executor から opus-executor へ切り替え、2026-11-18T12:03:41.600Z に再開

## 4. 進め方と実践の型の適用

根拠にしたのは、grade の指摘 F001・F002、condense から届いた Kata が原因の 4 件、手本の sld の試行、およびドキュメントメタ情報標準である。F001・F002 は rulebook の該当箇所を直し、解消した。condense の 4 件は、図と表の対応に必要な規定のため `retain` とした。6.5 には、冗長さは図表をなぞる本文から削ると明記した。分割の閾値は根拠が足りないため推測で変えていない。記述が矛盾する場合は rulebook を正とし、recipe と template は変更案として申し送った。
