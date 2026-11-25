---
specdojo:
  id: prj-0001:xer-t-kata-review-all-ifx-file-sample-110-20261125t103624z-6081b0d7
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-ifx-file-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-ifx-file-sample-110/T-KATA-REVIEW-ALL-ifx-file-sample-110-20261125T103624Z-6081b0d7/plan.md
  started_at: "2026-11-25T10:36:37.708Z"
  completed_at: "2026-11-25T10:52:13.692Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:ifx-file-sample
    - specdojo:ifx-file-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1（目的の過不足）として `ifx-file-sample.md` を修正した。正本スキーマの全文掲載を、`required_fields` で表せない制約だけの箇条書きに置き換えた（F005・F001）。
- 文書の承認や `status: ready` への昇格の担当を述べる記述を削除した（F003）。F007 と F008 の状態表記の食い違いも、この削除で解消した。
- 文書を確かめる役割を並べた章「利用目的と対象ユーザー」と、進み具合だけを書いた将来課題 2 行を削った。
- YAML 形式への再構成（F004）は、R1 の差分の範囲を超えるため直していない。「要判断」として handoff に残した。
- F002 は R4、F006 は R3 に任せた。
- executor の検査結果は次のとおり。prettier、markdownlint-cli2、`lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` は passed。ts・integration・typecheck・unit などの検査は、変更種別により `not_applicable`。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/ifx-file-sample.md`: 正本スキーマ 2 件の JSON Schema 全文を削り、`additionalProperties: false`、`status` の 2 値、`payment_requested` での `line_items` 1 件以上、`TX-*.json` の `print_status` の組み合わせといった制約だけを箇条書きにした。小節名を「参照する正本スキーマの制約と検証」に改め、YAML コメントの参照先も合わせた。概要の `_UNDECIDED_` 段落と、ARC の管理・PO の ready 昇格に触れたコメントを削除した。週次発注のコメントは業務上の未決事項だけにした。章「利用目的と対象ユーザー」を削り、責務境界の段落は「概要」へ移して章番号を振り直した。将来課題のうち、ローカル JSON スキーマ正本の配置と Schedule・登録簿への接続の 2 行を削り、週次発注連携と本部 API 照合の 2 行を残した。

## 3. 申し送り

- 要判断（R1-5）: 本 sample は `.md` だが、rulebook の `target_format` は yaml で、ほかの ifx sample も `.yaml` である（F004）。案 A は、`ifx-file-sample.yaml` に 1 契約へ絞り、補足を YAML コメントへ移す方法である。案 B は、2 契約の見本を残すため、`.md` とする例外を ifx-file-rulebook に宣言する方法である。どちらも `dct-kata.yaml` の `path` と rulebook の `sample` 宣言の確認が要るため、R1 では直していない。
- 要判断（R1-6）: 章「異常時の判断と利用者の次の手」は rulebook にない章で、内容の多くは YAML の `error_handling` の言い直しである。形式の判断（R1-5）の結論に合わせて残すかを決める。重複は R3（`vp-arc-conciseness`）で詰める案である。
- F008 の観点 `vp-ops-release-readiness` は kata のレビューでは使わない。R1-2 の削除で解消した。
- R1-1: R1 / 2.3. 参照する正本スキーマの制約と検証 / rulebook の禁止事項（正本スキーマの全文の再掲）に当たる JSON Schema 2 件の全文を載せていた / 全文を削り、`required_fields` で表せない制約（`additionalProperties: false`、`status` の 2 値と `payment_requested` での `line_items` 1 件以上、`TX-*.json` の `line_items` 1 件以上と `print_status` の組み合わせ）だけの箇条書きにした。小節名を「参照する正本スキーマの制約と検証」に改め、YAML コメントの参照先も合わせた / `vp-qe-kata-conformance`（F005・F001） / -
- R1-2: R1 / 1. 概要、2.1・2.2 の YAML コメント / 本文と YAML コメントに文書の承認・`status: ready` への昇格の担当を書いていた（Sample 記述標準の禁止事項） / 概要の `_UNDECIDED_` 段落を削った。週次発注のコメントは「問屋と接続先・ACK の形式を合意すれば解消する」という業務の未決事項だけにし、取引状態のコメントからは ARC の管理と PO の ready 昇格の文を削った。これで F007・F008 の状態表記の食い違いもなくなった / `vp-qe-kata-conformance`（種別の責務、F003） / -
- R1-3: R1 / （旧）2. 利用目的と対象ユーザー / rulebook にない章で、文書を確かめ・合意する役割の割り当て（公開採否を含む）を並べており、ファイル受け渡し契約の例という目的に要らない / 章を削った。CLI 仕様・ifx-cmd・ifx-index との責務境界の段落は「概要」へ移し、後ろの章番号を振り直した / `vp-po-purpose-alignment`、`vp-arc-single-responsibility` / -
- R1-4: R1 / 4. メモ / 将来課題 / 「ローカル JSON スキーマ正本の配置」と「Schedule・プロジェクト登録簿への接続」の行は、作業の割り当てと進み具合（未登録・未実施）で、契約の未決事項ではない / 2 行を削り、業務・契約の未決事項（次期の週次発注連携、本部 API との照合）の 2 行を残した / `vp-qe-kata-conformance`（種別の責務） / -
- R1-5: R1 / ファイル全体（形式） / rulebook の `target_format` は yaml で、ほかの ifx sample（ifx-api・ifx-cmd・ifx-index・ifx-msg）も `.yaml` だが、本 sample は `.md` で rulebook にない章を持つ（F004） / - / Sample 記述標準の「出力フォーマットと命名」。YAML にすると成果物カタログ `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-kata.yaml` の `path` と rulebook の `sample` 宣言の確かめが要り、R1 の sample の差分の範囲を超えるので直していない。案 A: 2 つの契約を `ifx-file-sample.yaml`（1 契約）に絞り、補足は YAML コメントへ移す。案 B: 2 つの契約の見本を残すため、`.md` とする例外を ifx-file-rulebook に宣言する / 要判断
- R1-6: R1 / 3. 異常時の判断と利用者の次の手 / rulebook にない章で、内容の多くは YAML の `error_handling` の言い直しである / - / `vp-po-purpose-alignment`。店頭の次の手は契約の外の利用者の手順として読む価値があり、形式の判断（R1-5）次第で残すかが変わるので削っていない。R1-5 の結論に合わせて残すかを決め、重複は R3（`vp-arc-conciseness`）で詰める案 / 要判断
- この段で扱わない finding: F002（`vp-qe-verifiability`）は R4、F006（`vp-ux-language-consistency`）は R3 に任せた。F007（`vp-ux-language-consistency`）と F008（`vp-ops-release-readiness`、kata のレビューでは使わない観点）は R1-2 の削除で解消した。

## 4. 進め方と実践の型の適用

根拠は、`docs/ja/specdojo/guides/kata-guide.md` の R1 の観点、`docs/ja/specdojo/standards/sample-authoring-standard.md`、および ifx-file-rulebook とした。矛盾する箇所は rulebook を正とした。扱った finding は次のとおり。F001・F005 は正本スキーマ全文を制約抜粋に置き換えて解消した。F003・F007・F008 は承認・昇格の記述を削除して解消した。F004 は R1 の範囲を超えるため見送り、案 A・B を示して要判断とした。F002（R4）と F006（R3）は段を分けて任せた。成果物の `status` は変更していない。根拠不足で見送った finding はない。
