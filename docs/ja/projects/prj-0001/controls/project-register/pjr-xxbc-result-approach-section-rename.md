---
specdojo:
  id: prj-0001:pjr-xxbc-result-approach-section-rename
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: low
  owner: ARC
  registered_at: "2026-08-08T23:29:02Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-09T10:55:22Z"
  conclusion: xer-template.md 第4章を「進め方と実践の型の適用」へ改称し、本文も両者を求める記述へ調整。plan テンプレート9ファイル26箇所とテスト3箇所を追随、旧名称の残存0件
  register_events:
    - v: 1
      id: reg_01ccf8e5d8438d91c73bac5038f99ff1
      ts: "2026-08-08T23:29:02Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs(prj-0001): add PJR-XXBC ticket for result section rename"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: result の「実践の型の活用」を「進め方と実践の型の適用」へ改称する
        - field: description
          from: ""
          to: edit result テンプレート `docs/ja/specdojo/templates/xer-template.md` の第4章「実践の型の活用」を「進め方と実践の型の適用」へ改称し、これを参照する plan テンプレートおよびテストの文言を追随させる。
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: _TODO_
        - field: registered
          from: ""
          to: _TODO_
        - field: due
          from: ""
          to: _TODO_
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: af5bbf6d463ede96292b2ba3047657a61b1b3036
    - v: 1
      id: reg_fab8a920bd21a3320ee4fac006bf7749
      ts: "2026-08-09T10:55:22Z"
      action: close
      actor: SpecDojo Test
      from_status: open
      to_status: done
      reason: "exec(register PJR-9P5Q): 既存登録項目を個票 frontmatter へ一括移行する"
      changes:
        - field: status
          from: open
          to: done
        - field: description
          from: edit result テンプレート `docs/ja/specdojo/templates/xer-template.md` の第4章「実践の型の活用」を「進め方と実践の型の適用」へ改称し、これを参照する plan テンプレートおよびテストの文言を追随させる。
          to: xer-template.md の見出しと、それを参照する xep-\* テンプレート10ファイル・テストの文言を改称する。approach 由来の記録（retrofit の実装参照、freeform のプロジェクト文脈優先など）を名称で包含できるようにする
        - field: priority
          from: medium
          to: low
        - field: owner
          from: _TODO_
          to: ARC
        - field: due
          from: _TODO_
          to: "2026-08-31"
        - field: conclusion
          from: "-"
          to: xer-template.md 第4章を「進め方と実践の型の適用」へ改称し、本文も両者を求める記述へ調整。plan テンプレート9ファイル26箇所とテスト3箇所を追随、旧名称の残存0件
      legacy_commit: dbac152079df02ec9bbad154a3253c043e10655a
      previous_event_id: reg_01ccf8e5d8438d91c73bac5038f99ff1
    - v: 1
      id: reg_6c305a4d0c0a06bf30acc4fb2e56f164
      ts: "2026-08-09T14:39:40Z"
      action: update
      actor: SpecDojo Test
      from_status: done
      to_status: done
      reason: "exec(register PJR-EQAQ): 登録簿日時をregistered_at・completed_atへ移行する"
      changes:
        - field: registered
          from: _TODO_
          to: "2026-08-09"
        - field: completed
          from: "-"
          to: "2026-08-09"
      legacy_commit: 38201bef867f3cc1454db6b748fc979ed3f2fa8f
      previous_event_id: reg_fab8a920bd21a3320ee4fac006bf7749
---

# PJR-XXBC result の「実践の型の活用」を「進め方と実践の型の適用」へ改称する

## 1. 概要

xer-template.md の見出しと、それを参照する xep-\* テンプレート10ファイル・テストの文言を改称する。approach 由来の記録（retrofit の実装参照、freeform のプロジェクト文脈優先など）を名称で包含できるようにする

edit result テンプレート `docs/ja/specdojo/templates/xer-template.md` の第4章「実践の型の活用」を「進め方と実践の型の適用」へ改称し、これを参照する plan テンプレートおよびテストの文言を追随させる。

同章が記入を求めている内容は `approach` に従った進め方の記録であり、実践の型（rulebook / recipe / sample / template）の活用に限定されない。たとえば `retrofit` では参照した実装パス・抽出した現在動作・未確認範囲を、`freeform` では実践の型より優先した実例やプロジェクト文脈を記録させる。後者は実践の型を使わなかった記録であり、「実践の型の活用」という名称とは向きが逆になる。名称と記入内容の不一致は、agent が章の趣旨を取り違えて記入範囲を狭める要因になるため、内容を包含する名称へ改める。

章そのものは廃止しない。plan テンプレートが判断根拠・逸脱の記録先として明示的に参照しており、実施内容・変更ファイルでは代替できない追跡情報を保持しているためである。

## 2. 完了条件

- `xer-template.md` の第4章見出しが「進め方と実践の型の適用」になっている。
- 第4章の本文が、`approach` に沿った進め方の記録と実践の型の適用状況の双方を求める記述になっている。
- `実践の型の活用` を参照している plan テンプレート10ファイルの文言が新名称へ追随している。
- `tests/src/exec-results.test.ts` の該当アサーションが新名称で成功する。
- 名称が内容と合っている章（`xrr-template.md` の「実践の型との整合確認」、`xer-human-bootstrap-finalize-template.md` の「実践の型の確認」）は変更していない。
- `npm run lint:md`、`npm test` が成功する。

## 3. 作業内容

| No  | 作業                                                | 担当 | 状態 | メモ                                                   |
| --- | --------------------------------------------------- | ---- | ---- | ------------------------------------------------------ |
| 1   | `xer-template.md` の見出しと本文の改称              | ARC  | done | 本文も進め方と実践の型の双方を求める記述へ調整する     |
| 2   | plan テンプレート9ファイルの参照文言の追随          | ARC  | done | 参照は合計26箇所。文脈に応じて自然な日本語へ整える     |
| 3   | `tests/src/exec-results.test.ts` のアサーション更新 | ARC  | done | human finalize に載せない検証（2箇所）も新名称へ       |
| 4   | 変更対象外の章に手を入れていないことの確認          | ARC  | done | review result と human finalize の章は名称と内容が一致 |
| 5   | 検証（`npm run lint:md` / `npm test`）              | ARC  | done | テンプレートとテストの変更は pre-commit の `test` 対象 |

## 4. 対応結果

- `xer-template.md` の第4章を「実践の型の活用」から「進め方と実践の型の適用」へ改称した。本文は `approach` に沿った進め方と実践の型の適用状況の双方を求める記述にし、実践の型を基準にしなかった場合の判断と代替根拠も記入対象であることを明記した。
- `xep-*` テンプレート9ファイル（bootstrap / fully-guided / recipe-guided / freeform / recipe-maintenance / rulebook-maintenance / sample-maintenance / template-maintenance / xep-template）の参照文言26箇所を新名称へ追随させた。当初「10ファイル・27箇所」と見積もったが、10ファイルは `xer-template.md` を含む変更対象ファイル総数であり、参照側の plan テンプレートは9ファイル・26箇所であることを実地の確認で確定した。
- `tests/src/exec-results.test.ts` の2箇所（human finalize に載せない検証、汎用 edit テンプレートの見出し検証）を新名称へ更新した。
- 変更対象外とした `xrr-template.md` の「実践の型との整合確認」と `xer-human-bootstrap-finalize-template.md` の「実践の型の確認」は据え置いた。`src/` には章名をハードコードした箇所がないことを確認済みで、実装側の追随は不要だった。
- `docs/ja/specdojo/guides/kata-guide.md` および `ryu-guide.md` の「実践の型の活用方法」は review guide の説明文であり、本章名の参照ではないため据え置いた。
- 既存の result 履歴ファイルと本個票・登録簿の記述に含まれる旧名称は、履歴および改称対象の説明として残した。

## 5. 参考情報

### 5.1. 変更対象ファイル

- `docs/ja/specdojo/templates/xer-template.md`（見出しと本文）
- `docs/ja/specdojo/templates/xep-bootstrap-template.md`（3箇所）
- `docs/ja/specdojo/templates/xep-fully-guided-template.md`（4箇所）
- `docs/ja/specdojo/templates/xep-recipe-guided-template.md`（4箇所）
- `docs/ja/specdojo/templates/xep-freeform-template.md`（3箇所）
- `docs/ja/specdojo/templates/xep-recipe-maintenance-template.md`（3箇所）
- `docs/ja/specdojo/templates/xep-rulebook-maintenance-template.md`（3箇所）
- `docs/ja/specdojo/templates/xep-sample-maintenance-template.md`（3箇所）
- `docs/ja/specdojo/templates/xep-template-maintenance-template.md`（3箇所）
- `docs/ja/specdojo/templates/xep-template.md`（1箇所）
- `tests/src/exec-results.test.ts`（2箇所）

### 5.2. 変更対象外

| ファイル                                   | 章                   | 据え置く理由                                    |
| ------------------------------------------ | -------------------- | ----------------------------------------------- |
| `xrr-template.md`                          | 実践の型との整合確認 | review result が実践の型そのものと照合する章    |
| `xer-human-bootstrap-finalize-template.md` | 実践の型の確認       | human finalize が実践の型の整備状況を確認する章 |

既存の result 履歴ファイルは履歴として蓄積されたものであり、遡及的な改称は行わない。

### 5.3. 名称の選定理由

採用する名称は「進め方と実践の型の適用」とする。`approach` の訳語として plan テンプレートが既に「進め方」を用いており語彙が揃うこと、「適用」が進め方と実践の型の双方へ自然に係ることによる。検討した代替案は「実践の型と進め方の活用」および「進め方と実践の型の記録」である。
