---
specdojo:
  id: prj-0001:pjr-0132-detect-document-redundancy
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-0132 既存review viewpointで文書の冗長性を検出

## 1. 概要

文書の主要な目的や判断点を短時間で把握できるかという観点から、冗長性を review で検出できるようにする。類似 viewpoint を新設せず、既存の `vp-ux-readability` に、同じ主張の反復、判断に不要な一般論、表と本文の重複、正本からの過剰な再掲を確認する具体的な check / evidence を反映する。

## 2. 完了条件

- `vp-ux-readability` の責務に簡潔性を含める理由が整理され、重複する viewpoint を追加していない。
- 同じ主張の反復、判断に不要な一般論、表と本文の重複、正本からの過剰な再掲を検出できる `check` が定義されている。
- 段落・箇条書きの長さ、重複箇所、正本への参照、削除候補など、レビュー根拠となる `evidence` が具体化されている。
- 長さだけで fail とせず、必要な背景、判断理由、例外、制約、`done_criteria` を保持して判定する基準になっている。
- 通常は `minor`、冗長さによって主旨・判断点が読み取れない場合は `major` とする severity の扱いが明確である。
- project の実値と新規 project 用 template が同期し、生成ページを再生成できる。
- 代表的な文章中心の成果物に適用した review plan / result で、具体的な指摘を記録できることを確認している。

## 3. 作業内容

<!-- prettier-ignore -->
| No | 作業 | 担当 | 状態 | メモ |
| --- | --- | --- | --- | --- |
| 1 | `vp-ux-readability` と他 viewpoint の責務・重複を整理する | UX | done | 主旨・判断点の把握を妨げる冗長性は可読性、導線は `vp-ux-user-flow`、用語統一は `vp-ux-language-consistency` と整理 |
| 2 | 冗長性を検出する check / evidence と severity の扱いを定義する | UX | done | 4 種の冗長性、保持情報、具体的証拠、severity 条件を定義 |
| 3 | project の review viewpoints と template へ同じ内容を反映する | UX | done | `vp-ux-readability` の check / evidence / 判定注記を同期 |
| 4 | 代表成果物の review plan / result で検出可能性と過剰指摘を確認する | QE | done | RACI review result の具体例で確認 |
| 5 | YAML 由来の表示ページを再生成し、schema・lint を検証する | QE | done | project 実値・template の schema、生成、対象 Markdown lint を確認 |

## 4. 対応結果

- `vp-ux-readability` は、初見の読者が主旨と主要な判断を把握できるかを扱う既存責務のため、理解を妨げる冗長性も同観点へ統合した。利用者導線を扱う `vp-ux-user-flow`、用語統一を扱う `vp-ux-language-consistency` とは判定対象が異なるため、viewpoint は新設していない。
- project 実値と新規 project 用 template の `vp-ux-readability` を同期し、同じ主張の反復、判断に不要な一般論、表と本文の内容重複、正本からの過剰な再掲を `check` に追加した。PJR-0130 で追加された Why の判定基準と、構造・設定中心の成果物への適用条件も template へ反映した。
- `evidence` には、段落・箇条書きの長さと論点数、反復・重複箇所、表と本文の役割分担、正本への参照と再掲範囲、削除候補・参照置換候補を追加した。背景、判断理由、例外、制約、`done_criteria` は保持対象として明示した。
- 長さは見直しを始める手掛かりに限定し、数値だけで fail にしない。冗長箇所を特定できる通常の finding は `minor`、冗長さによって主旨または主要な判断点を読み取れない場合は `major` とする判定注記を追加した。
- [[prj-0001:xrp-t-launch-pm-raci-090|RACI の review plan]] / [[prj-0001:xrr-t-launch-pm-raci-090|review result]] を代表例として確認した。result の RVP-003 は、参照範囲の不足と `_ASSUMPTION_` の内容を `notes` 内で反復しており、「RVP-003 の `evidence` と重複する参照範囲の説明を一度にまとめ、判定理由と次の行動を残す」を `minor` の具体的な削除候補として記録できる。一方、unclear の理由、参照制約、次の確認対象は判定に必要なため保持する。この例により、長さだけに依存せず具体的な重複箇所と保持情報を区別できることを確認した。
- project 実値と template の schema 適合、project 実値からの表示ページ生成、対象 Markdown の Prettier / markdownlint 適合を確認した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-0122|launch trackの振り返り]] — 起票元
- [[prj-0001:pjr-0131-concise-documentation-policy|簡潔な文書作成の共通原則をdocumentation policyへ追加]] — 作成側の共通原則
- [[prj-0001:pm-review-viewpoints|レビュー観点一覧]] — project 実値の変更対象
- [[specdojo:pm-review-viewpoints-template]] — 新規 project 用 template の変更対象
- [[specdojo:review-guide]] — review viewpoint の運用基準
