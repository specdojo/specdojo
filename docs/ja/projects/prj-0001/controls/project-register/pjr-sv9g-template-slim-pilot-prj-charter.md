---
specdojo:
  id: prj-0001:pjr-sv9g-template-slim-pilot-prj-charter
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  difficulty: medium
  owner: BA
  registered_at: "2026-11-17T23:24:32Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-WYTX
  depends_on:
    - PJR-7M9J
---

# PJR-SV9G prj-charter の template から文書の運用の記述を外す試行をし、template の一覧を作る

## 1. 概要

template には簡潔にする手本がないため、rulebook と sample を見直し済みの prj-charter で試行し、外す記述・残す記述・参照の形の一覧を作る。

## 2. 入力

- 利用者の決定（2026-11-18）: template は schedule に入れる前に prj-charter で試行する。手本は PJR-8S4T の rulebook と sample の一覧と、PJR-7M9J の recipe の一覧

## 3. 完了条件

- `prj-charter-template` から、どの成果物にも共通する文書の運用の記述（役割の割り当て、`status` の昇格と承認、公開の承認条件、改訂と廃止の手順、文書の品質の検査など）と、rulebook の言い直しを外す。手本は PJR-8S4T の「他の型へ広げるときの一覧」と PJR-7M9J の「他の recipe へ広げるときの一覧」とする。
- template に残すのは、章の骨組み・表の列・記入の目印など、成果物を作るときに埋める枠とする。章の構成は rulebook と合わせたまま保つ。
- 前後の大きさ（空白を除いた文字数）を、個票の対応結果に書く。
- 個票の対応結果に、ほかの template へ広げるときの「外す記述・残す記述・参照の形」の一覧を書く。schedule の段の指示にそのまま使える形にする。
- 直すのは template だけとする。rulebook・recipe・sample は変えず、合わせて直すべき点は変更案として個票の対応結果に書く。
- 型の grade は統合の後に orchestrator が流す。executor は grade を実行しない。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `npm run lint:md`・`npm run lint:fm` を通し、親の検証を通す。
- 2 回目の実行（2026-11-23）。1 回目の後の型の grade（2026-11-22、opus-review-executor）は `prj-charter-template` が needs-work 84 だった。2 回目では次を直す（利用者の決定、2026-11-23、indie）。直すのは引き続き template だけとし、合わせてほかの型に直すべき点があれば変更案を個票の対応結果に書く。
- 1 回目で外しすぎた目印を戻す。「権限委譲」の `_TODO_` に、rulebook が明示を求める留保の範囲（予算枠の新設・確定・増額、公開可否、ライセンス方針、主要スコープ変更、GO / Not GO 判断）が記入の目印として分かる形を戻す。「主要前提・制約」に、rulebook が求める予算枠・公開適性・人間の判断責任の 3 つを記入できる行を用意する。どちらも rulebook の言い直しにならない、短い目印にする。
- 個票の対応結果の「他の template へ広げるときの一覧」を直す。「外す: 任意の例示」と「残す」の境目に、「rulebook が記載を求める項目（列挙された必須の項目）の目印は、例示に見えても残す」を足す。1 回目の外しすぎの例として、この 2 か所を一覧の下に書く。
- 「本格実行開始の GO / Not GO 判断」の表に、rulebook と sample に合わせて「合格条件」の列を足す。
- 「ハイレベルスコープ」に、AI Agent を利用する場合の支援対象の活動と委譲範囲を書く記入の目印を足す。利用しない場合は記載を要しない旨は rulebook に任せ、目印は短くする。
- `frontmatter_template` の生成物の `specdojo.status` を `ready` から `draft` に直す。template 自身の `specdojo.status` は変えない。ほかの template で `frontmatter_template`（YAML なら `metadata_template`）の `status` が `draft` 以外のものを `rg` で探し、一覧を個票の対応結果に書く。ほかの template はこの項目では直さない。
- 前後の大きさ（空白を除いた文字数）を、1 回目の後と 2 回目の後で個票の対応結果に書く。

## 4. 作業内容

| No  | 作業                                         | 担当         | 状態 | メモ                                                      |
| --- | -------------------------------------------- | ------------ | ---- | --------------------------------------------------------- |
| 1   | prj-charter の template から運用の記述を外す | BA           | done | 2739 → 2265 文字                                          |
| 2   | template へ広げるときの一覧を書く            | BA           | done | 5.4 に記載                                                |
| 3   | 統合の後に型を grade し、結果を書く          | orchestrator | open | 統合の後に orchestrator が実行する。executor は実行しない |

## 5. 対応結果

### 5.1. 実施内容

`prj-charter-template` の `_TODO_` 注記から、rulebook の言い直しと他文書の内容の再掲を外した。章構成、表の列（「未決事項」を除く）、記入の目印は変えていない。

- 冒頭文: 記述する内容の要点だけを残した。
- 「認可条件」行の注記、「目的」の背景再掲、「主要前提・制約」の正本の説明、「承認」の運用説明を削除または短縮した。
- 「権限委譲」の承認事項の例示 5 項目を削除した。
- 「未決事項」表の列を `論点`・`影響`・`当面の扱い` に直した（rulebook と sample の列に合わせた）。

### 5.2. 前後の大きさ

空白と表の区切り行を除いた文字数は、変更前 2739、変更後 2265（474 減）。

### 5.3. 迷った点

- 未決事項の列: template は `期限`・`担当`・`対応方針` で、rulebook と sample の `影響`・`当面の扱い` とずれていた。章の構成を rulebook に合わせる条件に従い、rulebook 側に合わせた。
- 承認事項の例示: 項目はプロジェクトごとに決まる内容で、rulebook にも書かれるため削除した。

### 5.4. 他の template へ広げるときの一覧

| 区分 | 記述                                                                        | 扱い                                       |
| ---- | --------------------------------------------------------------------------- | ------------------------------------------ |
| 外す | rulebook の記述ルールの言い直し（「〜を明示する」など書き方の指示）         | 削除。`_TODO_` は何を書くかの 1 文に縮める |
| 外す | 他文書が正本の内容の再掲（背景、数値目標、前提・制約の全量）                | 削除。正本への参照だけにする               |
| 外す | 承認・`status` 昇格・公開条件など文書の運用の説明                           | 削除。運用の文書を正とする                 |
| 外す | 任意の例示（承認事項の箇条書きなど）                                        | 削除。sample に置く                        |
| 外す | 行・列の削除条件の注記                                                      | 削除。rulebook の記述に任せる              |
| 残す | 章の骨組みと見出しの連番                                                    | rulebook と一致させる                      |
| 残す | 表の列と記入の目印（`_NAME_`）                                              | rulebook・sample の列と一致させる          |
| 残す | 正本への参照の定型文（`prj-scope` など `詳細化先` 列、カタログ参照の 1 文） | 参照の形は `id` をインラインコードで書く   |
| 残す | 埋める内容の要点を示す `_TODO_` 1 文                                        | 1 文に収める                               |

### 5.5. 変更案（template 以外）

- rulebook・sample・recipe の変更は不要。未決事項の列は template を合わせたため、3 者は一致した。

### 5.6. 保護された設定の変更

なし。

### 5.7. CHANGELOG に書く事項

- 区分: 変更
- 文案: `prj-charter-template` の記入注記を簡潔にし、未決事項表の列を rulebook に合わせた。

### 5.8. 残課題

- 作業内容 No.3: 統合の後に orchestrator が型を grade する。executor は実行しない。

## 6. 関連ドキュメント

- [[prj-0001:pjr-8s4t-sld-kata-slim-pilot]]
