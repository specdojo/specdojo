---
specdojo:
  id: prj-0001:pjr-ah2p-cdfd-overview-rulebook-findings
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-09-13T21:55:54Z"
  due_on: "2026-09-30"
---

# PJR-AH2P cdfd-overview-rulebook の grade finding 8 件（sample との保管先重複・完成判定の網羅性・用語）を解消する

## 1. 概要

9/14 0 時の定期再評価で cdfd-overview-rulebook が needs-work 66 点となった。codex の 3 段目の finding 8 件はいずれも実在する不整合で、(a) rulebook の「保管先は別のデータストアと重ならない」という判定基準を cdfd-overview-sample の「顧客台帳」「つけ台帳」（どちらも常連客ノート）が満たしていない、(b) 完成判定が「他節の条件をここに集約」と宣言しながら Frontmatter 必須キー・導入文・対象者・領域表の必須列・データストアの区分・詳細 CDFD 一覧の列・PO 承認記録を欠く、(c) ノード総数の数え方が rulebook（代表ノード＋データストア）と sample（外部主体を含め 16）で一致しない、(d) STSD / CSTD / PO / retrofit / Orchestrator が定義なしで使われている。rulebook と sample を局所修正して解消する。

### 1.1. finding の内訳（`JBR-grade-kata-f41e0255f31d`、codex-expert-executor）

<!-- prettier-ignore -->
| ID | severity | rule | 指摘 | 確認 |
| --- | --- | --- | --- | --- |
| F001 / F006 | major | cross-document-consistency / kata-conformance | 「主な保管先」の判定基準「別のデータストアの保管先と重ならない」を sample の「顧客台帳」「つけ台帳」（保管先がどちらも「常連客ノート（現行）」）が満たさない | sample 141・151 行で確認 |
| F004 / F005 | major | verifiability / omissions-consistency | 完成判定が「本節をチェックリストの正本とし、他節の条件はここに集約」と宣言しながら、Frontmatter 必須キー、導入文・目的・適用範囲、領域表の必須列、データストアの区分、詳細 CDFD 一覧の列、PO の承認記録を欠く | 完成判定は 11 項目で網羅していない |
| F002 | minor | cross-document-consistency | ノード総数の定義が rulebook（代表ノード＋データストア）と sample（外部主体を含め 16）で不一致 | sample の記述は 14 が正しい |
| F003 / F007 | minor | conciseness / readability | 名称一致、一対一対応、`subgraph` 禁止、ノード数閾値が記述ガイド・完成判定・禁止事項で反復し、完成判定側が一部欠ける | 正本の所在が読み手に伝わらない |
| F008 | minor | language-consistency | `STSD`、`CSTD`、`PO`、`retrofit`、`Orchestrator` が定義・参照先なし | 用語表に無い |

category は consistency 50 / quality 50 / usability 75 / architecture 100。PJR-V8FV の章名統一が原因ではなく、
9/13 の全面改訂時からの不整合である。`cdfd-rulebook` と `cdfd-uc-rulebook` には同じ「集約」の宣言はない。

### 1.2. 対処の方向

- 保管先の重複: 現行の物理帳簿 1 冊を複数の論理データストアが共有する場合を rulebook で条件付きに許す（注記を必須にする）か、sample の保管先を「常連客ノート（顧客欄）」「常連客ノート（つけ欄）」のように分ける。前者は現実の業務に合う。
- 完成判定: 宣言どおり全必須条件を集約する。rulebook-authoring-standard の意図に合わせ、Frontmatter、導入文、各章の必須要素、データストアの区分、詳細 CDFD 一覧の列、`ready` 昇格に必要な承認記録を項目化する。記述ガイドと禁止事項の反復は理由と参照に絞る。
- ノード総数: sample の記述を 14 に直し、外部主体を含めないことを rulebook で明記する。
- 用語: 用語表に STSD / CSTD / retrofit / Orchestrator を追加し、Role code は `pm-roles` の参照を付ける。

### 1.3. 追加（2026-09-14）: `cdfd-overview` 本体の finding から見えた規則の不足

9/14 6 時枠の成果物評価で [[cdfd-overview]] が needs-work 72 となった。完了条件の不整合（DC-001 / DC-003）は
`dct-data-flow.yaml` を現行モデルへ更新して対処済み。残りは rulebook の規則に起因するため本項目で扱う。

<!-- prettier-ignore -->
| finding | 指摘 | rulebook で決めること |
| --- | --- | --- |
| F004（major） | Onboarding の「目的・文脈、メンバーとロール、agent・provider」、Plan の「判明した事項と意思決定」、Action の「構成変更要求と承認結果、非推奨化の判断」、Orchestrator の「参加者の意図」に対応するエッジがない | 参加者は外部主体として描かないため、参加者由来の入力は構造的にエッジを持てない。箇条書きで「参加者から」と明記し、エッジとの相互対応の対象外とする規則を加える |
| F005（major） | 成果物の保管先 `docs/ja/product/` が保管庫 `docs/ja/product/trash/` を包含し、評価結果の「成果物 Frontmatter の `grade`」も成果物と重複 | 保管先の一意性の規則に、包含・共有を注記付きで許す条件を加える（本項目 1.2 の保管先重複と同じ論点） |
| F006 / F007（minor） | STSD / CSTD の参照先なし、担当列に「運用担当」「タスク owner」「レビュー担当者」「runner」と Role code が混在 | 用語表の補完と、担当列は Role code へ統一し呼称との対応を示す規則 |

## 2. 完了条件

- `cdfd-overview-sample` のデータストア表が rulebook の保管先の判定基準を満たしている（規則の条件付き緩和か sample の分離のいずれか）。
- `cdfd-overview-rulebook` の完成判定が、`ready` 昇格に必要な全必須条件を項目化し、他節はその参照に絞られている。
- ノード総数の数え方が rulebook と sample で一致している。
- 用語表に STSD / CSTD / retrofit / Orchestrator があり、Role code の参照先が示されている。
- rulebook / sample の authoring standard の最終チェックを満たし、`npm run lint:md` と `npm run lint:fm` が成功する。
- 次回の `rtn-grade-recheck` で `cdfd-overview-rulebook` と `cdfd-overview-sample` が再評価され、上記 8 件の finding が解消している。

## 3. 作業内容

| No  | 作業                                                     | 担当 | 状態 | メモ                                 |
| --- | -------------------------------------------------------- | ---- | ---- | ------------------------------------ |
| 1   | 保管先の共有条件を rulebook に定めるか sample を分離する | ARC  | open | F001 / F006                          |
| 2   | 完成判定を全必須条件に拡充し、反復を参照に絞る           | ARC  | open | F003 / F004 / F005 / F007            |
| 3   | ノード総数の定義を揃え、sample を 14 に直す              | ARC  | open | F002                                 |
| 4   | 用語表を補い、finding コメントを解消する                 | ARC  | open | F008。再評価は次回の定期実行に任せる |
| 5   | 参加者由来の入力の扱いを rulebook に規定する             | ARC  | open | overview 本体の F004                 |
| 6   | 保管先の包含・共有の条件を rulebook に規定する           | ARC  | open | overview 本体の F005（1 と同じ論点） |
| 7   | overview 本体の担当列を Role code に統一し参照を付ける   | ARC  | open | F006 / F007                          |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- 対象: [[specdojo:cdfd-overview-rulebook]]、[[specdojo:cdfd-overview-sample]]
- 規範: [[specdojo:rulebook-authoring-standard]]、[[specdojo:sample-authoring-standard]]
- 直前の改訂: [[prj-0001:pjr-6pd7-cdfd-overview]]、[[prj-0001:pjr-v8fv-cdfd-common-chapter-skeleton]]
