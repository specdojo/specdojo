---
specdojo:
  id: prj-0001:pjr-08k1-deliverable-grade-done-criteria
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-09-10T11:42:54Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-11T22:37:28Z"
  block_reason: rate limit reached
  conclusion: grade --target deliverable が成果物カタログの done_criteria を条件別に評価し、Frontmatter に要約、grade/criteria/ に成果物別の詳細 YAML を保存するようにした。score/verdict と条件充足は独立した軸として保ち、content_hash で変更検知して rtn-grade-deliverable-recheck から毎日最大 5 件を再評価する。既存の review result は合意形成履歴として維持し、最新状態は grade で判定する。
---

# PJR-08K1 成果物の評価を grade へ寄せ review result の同期問題を解消する

## 1. 概要

kata は grade が定期的に変更を検知し、出来栄えの確認から次のアクションへ繋がる。成果物には
同じ循環がない。review は一度きりで、対象が後から変わっても気づけない。

## 2. 現状の問題

### 2.1. review result が成果物と同期しない

review result に `content_hash` がない。対象成果物が後から変更されても検知できない。

実例を確認した。

```text
review 完了      : 2026-08-12T03:52:22Z
成果物の最終更新 : 2026-08-13T20:34:04+09:00
```

`cdfd-agent-config-operation` は review の翌日に更新されている。この review result が現在の
成果物を評価したものかを判定する手段がない。

| 記録    | `content_hash` | 変更検知 |
| ------- | -------------- | -------- |
| `grade` | あり           | 可能     |
| review  | **なし**       | **不可** |

grade が `content_hash` で解いた問題を、review は抱えたままである。

### 2.2. 実行ごとにファイルが増え、最新が判別できない

review result は実行ごとに別ファイルとして残る。同じ成果物を再 review すれば別ファイルが増え、
古い result が有効に見え続ける。現在 26 件あり、どれが最新の評価かを知る手段がない。

### 2.3. 成果物側に評価の手がかりがない

成果物の frontmatter には review の結果が一切記録されない。成果物を読む人が、評価済みか、
いつの評価か、現在の内容に対するものかを判断できない。

## 3. 接続できる根拠

grade は `--target deliverable` に対応し、catalog から成果物を収集する。

```typescript
for (const loaded of loadCatalogDocs(resolve(root, catalog))) {
  collectResolvedDeliverables(..., resolved);
  for (const item of resolved) {
    ... item.resolvedPath ...
  }
}
```

`item` の型は `DctDeliverableItem` で `done_criteria?: CriteriaItem[]` を持つ。grade は
**この情報を手にしながらパスだけを使い、残りを捨てている**。

```typescript
export type CriteriaItem = {
  text: string;
  roles: string[];
  viewpoint: string;
};
```

`viewpoint` が両者を繋ぐ。grade は観点別に判定して `specdojo.grade.viewpoints` へ記録するため、
`done_criteria` の `viewpoint` と照合すれば、どの完了条件が満たされたかが分かる。新しい観点
体系を作る必要はない。

## 4. 分量の制約

`done_criteria` の結果を frontmatter へ全量書き込むことはできない。

| 項目                  | 行数 |
| --------------------- | ---: |
| `specdojo.grade` 全体 |   58 |
| うち `viewpoints`     |   10 |
| 本文（`br-sample`）   |   65 |

既にメタ情報が本文とほぼ同量である。`done_criteria` は成果物あたり平均 5 件、最大 80 件あり、
全量を加えると本文より長いメタ情報になる。

したがって成果物側には要約と参照のみを置き、詳細は外部ファイルへ残す。

```yaml
grade:
  verdict: pass
  score: 98
  content_hash: d61b01...
  done_criteria:
    satisfied: 5
    total: 6
    detail_ref: <詳細ファイルへの参照>
```

要点は `content_hash` を成果物側が持つことである。詳細ファイルが古くなっても、成果物を見れば
評価が現在の内容に対するものかを判定できる。

## 5. 判定の分離

score と `done_criteria` の充足を合成しない。

| score | done_criteria | 扱い                         |
| ----- | ------------- | ---------------------------- |
| 98    | 6/6           | 受け入れ可                   |
| 98    | **5/6**       | **不可**。条件未充足         |
| 79    | 6/6           | 条件は満たすが品質に指摘あり |

score の閾値で `done_criteria` を上書きできない形にする。文書としての水準と、個別の完了条件の
充足は別の軸である。

`unsatisfied` に `roles` を含めれば、誰の確認が残っているかが分かる。`G-*-review-pass` ゲートが
束ねていた役割別の責任を保てる。

## 6. 判断結果

- 詳細ファイルは成果物ごとに 1 ファイルとし、再評価のたびに上書きする。過去時点は Git 履歴で
  追跡し、実行ごとのファイルは増やさない。
- grade と review は併存させるが、同じ責務を持たせない。grade は現在品質と `done_criteria` の
  継続評価、review result は完成時の合意形成履歴とする。
- 090 タスクと `G-*-review-pass` は人の最終確認・合意ゲートとして維持する。現在品質の判定には
  review result の日時を使わず、grade の `content_hash` と `done_criteria` を使う。
- 未充足条件は成果物 Frontmatter に条件 ID と担当 Role code を要約し、不足理由は詳細ファイルへ
  記録する。定期 Job の analysis も未充足条件と担当ロールを報告する。
- 既存 26 件の review result は不変の履歴として保持し、移行・削除しない。最新評価としては
  扱わないため、成果物との同期対象から外す。

## 7. 完了条件

- `grade --target deliverable` が `done_criteria` を評価に取り込む。
- 成果物の frontmatter に `done_criteria` の充足状況が要約として記録される。全量は書き込まない。
- 成果物側の `content_hash` により、評価が現在の内容に対するものかを判定できる。
- score と `done_criteria` の充足が別の軸として保たれている。score の閾値が充足判定を上書き
  しない。
- 未充足の条件について、担当ロールが分かる。
- 同じ成果物を再評価したとき、最新の評価が一意に判別できる。
- routine から定期実行でき、変更のあった成果物だけを再評価できる。
- review との関係が決まっている。置き換える場合は 090 タスクとゲートの扱いが示されている。

## 8. 作業内容

| No  | 作業                                      | 対応結果                                                   |
| --- | ----------------------------------------- | ---------------------------------------------------------- |
| 1   | 詳細ファイルの方式を決める                | 成果物ごとに 1 ファイルを上書きする方式に決定              |
| 2   | review との関係を決める                   | 最新評価と合意履歴に責務分離して併存                       |
| 3   | `done_criteria` を grade の評価へ取り込む | 条件 ID、Role code、viewpoint を plan と判定契約へ追加     |
| 4   | frontmatter へ要約と参照を記録する        | 充足数・総数・未充足担当・詳細参照だけを記録               |
| 5   | score と充足を分離して判定する            | verdict 計算と条件充足を独立したまま保存                   |
| 6   | 既存 26 件の review result の扱いを決める | 移行・削除せず合意形成履歴として保持                       |
| 7   | テストを追加する                          | plan、忠実性、要約、詳細上書き、定期実行経路を回帰テスト化 |

## 9. 対応結果

- `grade --target deliverable` が成果物カタログの `done_criteria` を plan へ列挙し、executor の条件別
  判定と reporter の転記を機械照合してから適用するようにした。
- 成果物 Frontmatter の `specdojo.grade.done_criteria` に要約を保存し、条件ごとの判定・不足理由・
  Role code・viewpoint は `<execution_path>/grade/criteria/` の成果物別 YAML に保存するようにした。
  詳細ファイルは再評価時に同じパスへ上書きされる。
- 共通 Frontmatter schema と詳細 YAML schema を追加し、要約と詳細の構造を検証可能にした。
- score / verdict の算出と条件充足を独立させ、未充足条件があっても score を書き換えず、逆に高い
  score でも条件を自動充足させない契約にした。
- `tools/grade/run-per-document.sh` を `--target deliverable` に対応させ、
  `job-grade-deliverable` と `rtn-grade-deliverable-recheck` から毎日、変更済み・未評価の成果物を
  最大 5 件ずつ再評価できるようにした。
- [[specdojo:review-guide|レビューガイド]]、[[specdojo:document-metadata-standard|ドキュメントメタ情報標準]]、
  [[specdojo:command-reference|コマンドリファレンス]]、[[specdojo:routine-operation-guide|routine運用ガイド]]
  に責務境界、保存形式、実行方法を反映した。
- 既存 review result の移行・削除、090 タスク、`G-*-review-pass` の変更は行っていない。これらは
  合意形成履歴・人の最終ゲートとして維持し、最新状態は grade から判定する。

## 10. 関連ドキュメント

- [[specdojo:review-guide]]: review の位置づけと PJR への転記条件。
- [[prj-0001:pjr-20dv-grade-content-hash-normalization]]: `content_hash` による変更検知。
- [[prj-0001:pjr-t2kk-grade-recheck-routine]]: 変更のあった文書の定期再評価。
