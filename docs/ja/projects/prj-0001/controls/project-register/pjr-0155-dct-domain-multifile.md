---
specdojo:
  id: prj-0001:pjr-0155-dct-domain-multifile
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  due_on: "2026-08-31"
  completed_at: "2026-08-06T12:00:00Z"
  conclusion: catalog buildで同一domainの複数dctファイルをファイル名昇順でマージする機能を実装。dct.schema.yaml・dct-rulebook（物理分割の命名/ID規約とテンプレート分割）を更新し、tests/src/catalog-merge.test.ts等を追加。全テスト通過。
  register_events:
    - v: 1
      id: reg_a524432f9c1357d0fa4995917238838f
      ts: "2026-08-06T10:56:40Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "chore(register): PJR-0155をopenで起票"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: dctカタログの1 domain複数ファイル分割（物理分割）対応
        - field: description
          from: ""
          to: 現行の dct カタログは、`catalog build` の出力が `domain` をキーに束ねられる都合上、`domain` 一意制約（`src/catalog.ts` の `validateCatalogDomains`）により 1 domain = 1 ファイルが前提となっている。`data-model` のように反復要素（業務データ辞書・概念モデルを業務領域ごとに複製）が多いカタログは単一ファイルが肥大化するため、論理 domain を維持したまま物理ファイルを分割できるよう、同一 `domain` を持つ複数 dct ファイルを build 時にマージ可能にする。
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
      legacy_commit: 8c071db4f82a2d9e81af229d28d0bf28890e0011
    - v: 1
      id: reg_c7fa5d7b7357b6f465387793ab637d50
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
          from: 現行の dct カタログは、`catalog build` の出力が `domain` をキーに束ねられる都合上、`domain` 一意制約（`src/catalog.ts` の `validateCatalogDomains`）により 1 domain = 1 ファイルが前提となっている。`data-model` のように反復要素（業務データ辞書・概念モデルを業務領域ごとに複製）が多いカタログは単一ファイルが肥大化するため、論理 domain を維持したまま物理ファイルを分割できるよう、同一 `domain` を持つ複数 dct ファイルを build 時にマージ可能にする。
          to: domain一意制約を緩和し、同一domainの複数dctファイルをbuild時にマージ可能にする
        - field: owner
          from: _TODO_
          to: ARC
        - field: due
          from: _TODO_
          to: "2026-08-31"
        - field: conclusion
          from: "-"
          to: catalog buildで同一domainの複数dctファイルをファイル名昇順でマージする機能を実装。dct.schema.yaml・dct-rulebook（物理分割の命名/ID規約とテンプレート分割）を更新し、tests/src/catalog-merge.test.ts等を追加。全テスト通過。
      legacy_commit: dbac152079df02ec9bbad154a3253c043e10655a
      previous_event_id: reg_a524432f9c1357d0fa4995917238838f
    - v: 1
      id: reg_163c82ee825cb57b120625e5c3e684d3
      ts: "2026-08-09T14:39:40Z"
      action: update
      actor: SpecDojo Test
      from_status: done
      to_status: done
      reason: "exec(register PJR-EQAQ): 登録簿日時をregistered_at・completed_atへ移行する"
      changes:
        - field: completed
          from: "-"
          to: "2026-08-06"
      legacy_commit: 38201bef867f3cc1454db6b748fc979ed3f2fa8f
      previous_event_id: reg_c7fa5d7b7357b6f465387793ab637d50
---

# PJR-0155 dctカタログの1 domain複数ファイル分割（物理分割）対応

## 1. 概要

domain一意制約を緩和し、同一domainの複数dctファイルをbuild時にマージ可能にする

現行の dct カタログは、`catalog build` の出力が `domain` をキーに束ねられる都合上、`domain` 一意制約（`src/catalog.ts` の `validateCatalogDomains`）により 1 domain = 1 ファイルが前提となっている。`data-model` のように反復要素（業務データ辞書・概念モデルを業務領域ごとに複製）が多いカタログは単一ファイルが肥大化するため、論理 domain を維持したまま物理ファイルを分割できるよう、同一 `domain` を持つ複数 dct ファイルを build 時にマージ可能にする。

## 2. 完了条件

- 同一 `domain` を持つ複数 dct ファイルが `catalog build` 時に 1 つの domain カタログへ決定的な順序でマージされる。
- `validateCatalogDomains` が同一 `domain` の複数ファイルを ERROR とせず、マージ対象として許容する。
- `local_id` のプロジェクト内一意性検証が維持され、マージ後も重複を検出できる。
- `groups` のマージ規則（章の順序・`base_path` 継承・入れ子）が再現可能で、環境差で結果が変わらない。
- 既存の単一ファイル構成が後方互換で従来どおり動作する。

## 3. 作業内容

| No  | 作業                                                                                | 担当 | 状態 | メモ                                                                  |
| --- | ----------------------------------------------------------------------------------- | ---- | ---- | --------------------------------------------------------------------- |
| 1   | 分割時の命名・マージ順序の設計方針確定（`dct-<domain>-<part>.yaml` 案の是非を含む） | ARC  | done | `dct-<domain>-<part>.yaml` を採用。マージ順序はファイル名昇順で決定的 |
| 2   | schema / rulebook の更新（同一 domain 複数ファイルの許可と命名規約の追記）          | ARC  | done | `dct.schema.yaml` の `domain` 説明と `specdojo:dct-rulebook` を更新   |
| 3   | `validateCatalogDomains` をマージ許容へ変更                                         | ARC  | done | `src/catalog-build.ts`。整合性・重複 `local_id` 検出は維持            |
| 4   | `catalog build` を domain 単位のファイル横断マージへ改修                            | ARC  | done | `src/catalog-build.ts`。`generate` は改修不要と判断（対応結果に記載） |
| 5   | テスト追加（マージ・順序・重複検出・後方互換）                                      | ARC  | done | `tests/src/catalog-merge.test.ts` 追加・既存テスト更新                |
| 6   | 検証（`npm run build` / `lint:ts` / `validate:catalog`）                            | ARC  | done | 全 781 テスト通過。実カタログ `validate` は全 OK                      |

## 4. 対応結果

- 同一 `domain` を宣言する複数の `dct-<domain>-<part>.yaml` を、`catalog build` がファイル名昇順で 1 つの `dct-<domain>.md` へ決定的にマージするよう改修した。単一ファイル構成では出力名 `dct-<domain>.md` が従来どおりで後方互換を維持する。
- `validateCatalogDomains` を「domain 重複を一律 ERROR」から「同一 domain の部分ファイルがマージ可能か（`project_id` / `base_path` 一致・`local_id` のプロジェクト内一意）を検証」する方式へ変更した。
- `catalog generate` は各ファイルの `deliverables` を個別に実体化する処理で、domain マージ対象の生成物（`dct-<domain>.md`）を作らないため改修不要と判断した。複数ファイル構成でも各ファイルの成果物が独立に生成され、`local_id` の横断重複は既存の `validateCatalogLocalIds` 警告で検知される。

## 5. 関連ドキュメント

- [[specdojo:dct-rulebook]]
- `docs/specdojo/schemas/v1/dct.schema.yaml`
- `src/catalog.ts`
- `src/catalog-build.ts`
- `src/catalog-generate.ts`
