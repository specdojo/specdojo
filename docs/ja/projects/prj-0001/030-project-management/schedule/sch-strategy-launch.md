---
id: prj-0001:sch-strategy-launch
type: project
status: draft
rulebook: sch-strategy-rulebook
---

# ローンチフェーズのスケジュール戦略

Launch Phase Schedule Strategy

## 1. 成果物の種類

成果物の範囲は以下;

- `dct-project-definition`
- `dct-project-management`

## 2. 成果物の作成フロー

1. `docs/ja/projects/prj-0001/`配下に`document`がない場合はまずは`documentたたき台`を作成する。
   - 成果物に対応する`rulebook`, `instruction`, `sample`がある場合は参考にする。
2. `documentたたき台`を成果物カタログで定義されているdone_criteriaに基づき、`PO`, `BA`, `ARC`, `QE`のロールがレビューし、修正を依頼する。
3. レビューを踏まえて、`documentたたき台`を`document一次版`として修正する。必要に応じて2, 3を繰り返す。
4. `document一次版`を成果物カタログで定義されているdone_criteriaに基づき、`PO`, `BA`, `ARC`, `QE`のロールがレビューし承認する。
5. 対象ドメイン内のドキュメントに対して、1〜4のフローを繰り返す。
6. 5までで作成したドメイン内のドキュメントの全体整合性をdone_criteriaに基づき、`PO`, `BA`, `ARC`, `QE`のロールがレビューし、修正・承認する。
7. レビューを踏まえて、`document完成版`として整合性を合わせるための修正をおこなう。必要に応じて6, 7を繰り返す。
8. `document完成版`を成果物カタログで定義されているdone_criteriaに基づき、`PO`, `BA`, `ARC`, `QE`のロールがレビューし承認し、完成版として`ready`にする。
