---
specdojo:
  id: prj-0001:pjr-vqb5-agent-grade-comparison
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: note
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-08-29T13:44:25Z"
  due_on: "2026-09-30"
  register_events:
    - v: 1
      id: reg_ff0f15ca90c84752bb54c675a9c19ac7
      ts: "2026-08-29T13:44:26Z"
      action: add
      actor: manual
      from_status: null
      to_status: open
      reason: item added
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: grade 判定の agent 比較結果（gemma / claude / qwen）
        - field: description
          from: ""
          to: 同一の grade plan を gemma-expert-executor、claude-expert-executor、qwen-expert-executor へ渡して判定結果を比較した実測記録。kata 4 件を対象とし、level 分布、finding の件数と質、grade apply の受理可否、指摘の正確性を評価した。claude のみが実用条件を満たし、gemma は finding の message が空で apply に拒否され、qwen は JSON を出力できなかった。バッチと単体の prompt サイズを変えた比較も行い、gemma の問題がコンテキスト量に起因しないことを確認した。
        - field: type
          from: ""
          to: note
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: _TODO_
        - field: registered
          from: ""
          to: "2026-08-29"
        - field: due
          from: ""
          to: _TODO_
    - v: 1
      id: reg_f730d723f99444e18308158c23b20fe6
      ts: "2026-08-29T13:56:32Z"
      action: update
      actor: manual
      from_status: open
      to_status: open
      reason: 担当と期限を確定
      changes:
        - field: owner
          from: _TODO_
          to: ARC
        - field: due
          from: _TODO_
          to: "2026-09-30"
      previous_event_id: reg_ff0f15ca90c84752bb54c675a9c19ac7
---

# PJR-VQB5 grade 判定の agent 比較結果（gemma / claude / qwen）

## 1. メモ

同一の grade plan を3つの agent へ渡し、判定結果を比較した実測記録である。対象は kata 4 件、agent が判定する viewpoint は7件で、合計 28 判定を比較した。

### 1.1. 実行条件

| 項目           | 内容                                                                                                       |
| -------------- | ---------------------------------------------------------------------------------------------------------- |
| 対象文書       | `dec-rulebook.md`（60 行）、`opr-rulebook.md`（483 行）、`pjr-rulebook.md`、`opr-batch-sample.md`（22 行） |
| plan           | 同一。964 行・46,673 文字                                                                                  |
| 判定 viewpoint | 7 件（決定的観点は CLI が判定するため plan に含まれない）                                                  |
| 実行日         | 2026-08-29                                                                                                 |

対象は性質を意図的に分散させた。`opr-rulebook.md`（483 行）と `opr-batch-sample.md`（22 行）は対応関係にあり、規範に対して完成例が明らかに不足しているため、成果物間整合の判定能力を見る材料とした。

### 1.2. 総合比較

| 項目                   | gemma                   | claude        | qwen                 |
| ---------------------- | ----------------------- | ------------- | -------------------- |
| モデル                 | gemma4:31b-mlx-work-64k | claude-opus-5 | opencode 経由の Qwen |
| JSON 出力              | あり                    | あり          | **なし**             |
| 判定件数               | 28                      | 28            | 判定不能             |
| level 平均             | 3.82                    | 2.36          | -                    |
| level 4（指摘なし）    | 25 / 28                 | 4 / 28        | -                    |
| finding 件数           | 3                       | 47            | -                    |
| finding の message 空  | 3 / 3                   | 0 / 47        | -                    |
| `grade apply` の受理   | **拒否**                | **受理**      | **不可**             |
| 所要時間               | 10 分超                 | 数分          | 10 分超              |
| ファイル読み取りツール | 不明                    | 使用せず      | 使用した             |

`grade apply` は level 3 以下に根拠となる finding を要求し、finding には非空の message を要求する。gemma は message が空のため `severity and non-empty message are required` で拒否された。

### 1.3. 文書別の level 比較

`dec-rulebook.md` に対する判定を viewpoint 別に示す。括弧内は finding 件数である。

| viewpoint                           | gemma | claude |
| ----------------------------------- | ----- | ------ |
| `vp-arc-cross-document-consistency` | 4 (0) | 2 (3)  |
| `vp-arc-conciseness`                | 4 (0) | 3 (1)  |
| `vp-qe-verifiability`               | 4 (0) | 2 (2)  |
| `vp-qe-omissions-consistency`       | 4 (0) | 2 (2)  |
| `vp-qe-kata-conformance`            | 4 (0) | 3 (2)  |
| `vp-ux-readability`                 | 4 (0) | 3 (2)  |
| `vp-ux-language-consistency`        | 4 (0) | 3 (1)  |

claude は文書の質に応じて level を分散させた。整備済みの `pjr-rulebook.md` には 4,3,3,3,4,4,4、内容の薄い `dec-rulebook.md` には 2,3,2,2,3,3,3、規範と乖離した `opr-batch-sample.md` には 1,2,2,1,1,2,2 を与えており、事前の想定と一致する。gemma は `pjr-rulebook.md` と `opr-rulebook.md` を同じ level 4 と判定し、弁別できていない。

### 1.4. プロンプトサイズの影響

gemma の判定がコンテキスト量に起因するかを確かめるため、`dec-rulebook.md` 単体（7,271 文字。バッチの約6分の1）で再実行した。

| 条件             | level 4 の数 | finding | message 空 | `grade apply` |
| ---------------- | ------------ | ------- | ---------- | ------------- |
| バッチ（4 文書） | 7 / 7        | 0       | -          | 拒否          |
| 単体（1 文書）   | 6 / 7        | 2       | 2 / 2      | 拒否          |

改善は1観点のみで、message が空である問題は解消しなかった。**gemma の限界はコンテキスト量ではなく、指摘内容を言語化する能力または指示遵守にある。**

### 1.5. 指摘の正確性

実データと突き合わせて検証した。

| agent  | 指摘                                                                                                | 検証結果 |
| ------ | --------------------------------------------------------------------------------------------------- | -------- |
| claude | `dec-rulebook.md` に同一主張の反復がある                                                            | 事実     |
| qwen   | `opr-batch-sample.md` の Frontmatter が `opd-rulebook` を指すが本文は `opr-rulebook` を参照している | 事実     |
| qwen   | `opr-rulebook.md` の template 宣言が `opq-template` である                                          | 誤り     |

qwen は実在する不整合を発見した。`opr-batch-sample.md` の Frontmatter は運用方針（opd）の rulebook を指す一方、本文は運用手順（opr）の rulebook を参照しており、系統が食い違っている。一方で存在しない `opq-template` への言及という誤認も含んでいた。

### 1.6. qwen が JSON を出力できなかった経緯

実行ログのタスクリストは、判定まで完了していたことを示す。

```text
[✓] 対象4文書を読み本文行番号を確定する
[✓] 関連設計書を確認しクロスドキュメント整合をチェック
[✓] 各文書×7viewpointで0-4判定とfindingを作成
[•] GradeSubmission JSONを出力し、変更ファイル/検証結果を最終応答へ残す
```

最終ステップに到達せず散文で応答を終えている。分析能力ではなく出力形式の問題である。

## 2. 背景・文脈

kata 285 件を定期評価するにあたり、ローカルモデルで運用できれば API コストなしで全件を回せる。その可否を判断するために比較した。

結論として、現時点で `grade apply` を通過する出力を返せるのは claude のみである。gemma は不採用とする。qwen は分析品質が claude に匹敵するため、出力形式を強制できれば候補となる。

## 3. フォローアップ

- qwen の JSON 出力問題は PJR-AKJ4 で扱う。
- grade の評価単位を1文書へ変更し plan として保存する変更は PJR-4TZ7 で扱う。本比較で用いた plan の再利用や `exec trial` による agent 比較は、その実装後に仕組みとして実行できる。
- 合格閾値 70 の妥当性は未確定である。claude の判定では 4 件中 `pjr-rulebook.md` のみが閾値に近く、他は下回った。全件評価の結果を見て確定する。

## 4. 関連ドキュメント

- [[prj-0001:pjr-49d2-quality-assessment]]: grade の設計と実装。本比較はその agent 選定にあたる。
- [[prj-0001:pjr-4tz7-grade-per-document]]: 評価単位の見直し。本比較で判明したコンテキスト膨張の問題を扱う。
- [[prj-0001:pjr-akj4-qwen-json-output]]: qwen の出力形式問題。
