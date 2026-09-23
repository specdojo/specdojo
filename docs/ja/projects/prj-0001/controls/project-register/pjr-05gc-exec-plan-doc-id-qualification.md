---
specdojo:
  id: prj-0001:pjr-05gc-exec-plan-doc-id-qualification
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-09-15T12:42:16Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-15T23:16:19Z"
  conclusion: exec plan の depends_on と targets の doc id を、カタログの解決済みパスと配置（product はローカル ID、project は project 修飾）から解決するようにした。data-flow-pdca の author タスクで Unresolved ID reference が消え、targets が cdfd-action、project 文書の plan では prj-0001:dct-index になることを確認した。
---

# PJR-05GC exec plan の depends_on / targets の doc id を成果物の配置に応じて解決する

## 1. 概要

src/exec-plans.ts は depends_on と targets の doc id を常に `<project-id>`:`<local_id>` で組み立てるが、id-and-file-naming-standard ではプロダクト文書（docs/ja/product/）はローカル ID、プロジェクト文書は `<project-id>`:`<local-id>` である。product 配下の 17 文書はすべて修飾なしのため、cdfd-action など product 成果物の plan では depends_on の [[prj-0001:cdfd-overview]] が索引で解決できず executor にパスが渡らない。plan frontmatter の targets も作成される文書の ID と食い違う。旧 cdfd 10 件だけが標準に反して修飾付きだったため表面化していなかった。カタログの解決済みパスから frontmatter の id を読むか、配置で修飾の有無を決めて解決する。

### 1.1. 観測

`data-flow-pdca` track の author タスクを dry-run した際の出力。

```text
Task: T-DATA-FLOW-PDCA-cdfd-action-010 — cdfd-overview と Kata に基づく新規作成  [edit]
Unresolved ID reference(s): prj-0001:cdfd-overview
```

生成した plan の「対象成果物」節は `depends_on` を `[[prj-0001:cdfd-overview]]` として列挙するが、
[[cdfd-overview]] の ID は `cdfd-overview` であり、doc-index に `prj-0001:cdfd-overview` は無い。

### 1.2. 原因

- `src/exec-plans.ts` の `deliverableDependsOn`（`[[${projectId}:${dep}]]`）と `qualifiedDocId` が、成果物の配置に
  かかわらず project 修飾で doc id を組み立てる。`targets` も同じ関数で作られる。
- [[specdojo:id-and-file-naming-standard]] は ID を 3 種類に分け、プロダクト文書はローカル ID、プロジェクト文書は
  `<project-id>:<local-id>` とする。`docs/ja/product/` 配下の 17 文書はすべてローカル ID である。
- 旧領域別 CDFD 10 件だけが標準に反して `prj-0001:` 付きだったため、data-flow track ではこの不整合が表面化しなかった。
  10 件は [[prj-0001:pjr-6pd7-cdfd-overview]] で trash へ退避済み。

### 1.3. 影響

- product 配下の成果物（cdfd、sysd、tsd など）を対象にする plan で、`depends_on` の参照がパスへ解決されず
  executor に依存先が渡らない。
- plan frontmatter の `targets` が作成・更新される文書の ID と食い違い、`targets` から導出する commit 許可リストや
  result の対象解決が崩れる恐れがある。

### 1.4. 対処の方向

- doc id は文字列を組み立てるのではなく、カタログの解決済みパスから frontmatter の `id` を読んで決める。
  文書が未作成（author 前）の場合は、配置（`docs/ja/product/` 配下ならローカル ID、`docs/ja/projects/` 配下なら
  project 修飾）で決める。
- `depends_on`、`targets`、`based_on` 提示など、plan 内で成果物の doc id を作るすべての箇所を同じ解決関数に寄せる。
- doc-index に無い id は従来どおり `Unresolved ID reference(s)` で警告する。

## 2. 完了条件

- `exec plan --task T-DATA-FLOW-PDCA-cdfd-action-010` の出力で `depends_on` が `[[cdfd-overview]]` になり、`Unresolved ID reference(s)` が出ない。
- product 配下の成果物の plan では `targets` がローカル ID、project 配下（例: `prj-overview`）の plan では project 修飾 ID になる。
- 未作成の成果物を対象にする plan でも、配置から正しい形式の doc id が決まる。
- 単体テストに product / project の両配置、作成済み / 未作成の両状態のケースがある。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run test:integration` が成功する。

## 3. 作業内容

| No  | 作業                                                        | 担当 | 状態 | メモ                                 |
| --- | ----------------------------------------------------------- | ---- | ---- | ------------------------------------ |
| 1   | 成果物の doc id を配置と frontmatter から解決する関数を作る | ARC  | done | `exec-plans.ts`                      |
| 2   | `depends_on` / `targets` の生成をその関数に寄せる           | ARC  | done | 文字列組み立てを共通関数へ集約       |
| 3   | テストを追加し、dry-run で警告が消えることを確認する        | ARC  | done | product / project、作成済み / 未作成 |

## 4. 対応結果

- `src/exec-plans.ts` に、既存文書では frontmatter の `specdojo.id`、未作成文書では配置規約から成果物 ID を解決する共通関数を追加した。
- 通常・横断タスクの `targets`、`depends_on`、横断成果物の見出しと文書参照を共通関数へ寄せた。product 配下はローカル ID、projects 配下は project 修飾 ID になる。
- product / project の両配置と、作成済み / 未作成の両状態を対象とする単体テストを追加した。
- `T-DATA-FLOW-PDCA-cdfd-action-010` の plan を一時出力して、`targets` が `cdfd-action`、`depends_on` が `[[cdfd-overview]]` となり、dry-run で未解決警告が出ないことを確認した。
- [[specdojo:plan-result-lifecycle-guide]] の `targets` の説明を配置別 ID 規約へ更新した。
- 残課題: なし。

## 5. 関連ドキュメント

- ID の規約: [[specdojo:id-and-file-naming-standard]]
- 表面化した経緯: [[prj-0001:pjr-6pd7-cdfd-overview]]（product 文書の ID を修飾なしに統一）
- plan の設計: [[specdojo:plan-result-lifecycle-guide]]
