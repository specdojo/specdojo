---
specdojo:
  id: prj-0001:pjr-qm88-rulebook-schema-enum-lint
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-09-02T12:16:43Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-02T13:25:58Z"
  block_reason: "agent exited with non-zero code: agent exited with non-zero code: agent-config-write: protected configuration changes detected; paths=package.json; agent must record the required change in the result …"
  conclusion: schema の enum 網羅を rulebook に対して検査する lint を追加し、validate:schema へ統合した。検出された既存の乖離2件も修正した。
---

# PJR-QM88 schema の enum 網羅を rulebook に対して検査する

## 1. 概要

rulebook は成果物の規範を定める正本だが、schema や実装が変わったときに追従が保証されて
いない。`status: ready` であっても実装との乖離が残る。

grade の較正検証で、`ready` の rulebook 2 件からいずれも実装との矛盾が見つかった。

| 文書                     | 乖離の内容                                                              |
| ------------------------ | ----------------------------------------------------------------------- |
| `pm-members-rulebook.md` | `mode` を `edit` / `review` のみと定義。schema と実装は `report` を含む |
| `pjr-rulebook.md`        | ID 規約が schema の除外文字とハイフン制約を反映していない               |

`report` は executor / reporter の2段構成で後から追加された値であり、schema
（`pm-members.schema.yaml`）と実装（`src/specdojo-config.ts` の `AgentMode`）は一致して
いるが、rulebook だけが取り残されている。

ローカルモデルによる grade はこの種の乖離を検出できない。schema と実装を読み合わせる必要が
あるためで、実際に該当文書を98〜100点・finding 0〜1件と評価した。codex は検出できるが、
1文書あたり数分を要し、全文書へ日常的に適用するには重い。

機械的に判定できる矛盾は lint で先に潰し、agent の評価は判断を要する事項へ集中させる。

## 2. 手法の検証結果

判明している2件に対し、3つの手法を試した。

| 手法                    | 結果                     | 評価                   |
| ----------------------- | ------------------------ | ---------------------- |
| git 履歴の更新時刻比較  | 2件中1件のみ検出         | 見逃す。採用しない     |
| schema の enum 網羅検査 | 該当指摘を的中、誤検出 0 | 有効。本項目で実装する |
| schema の required 照合 | 真3件に対し誤検出13件    | 表構造に依存し実用困難 |

git 履歴が使えないのは、文書が部分的に更新されるためである。`pjr-rulebook.md` は別件の
追記により更新時刻が新しくなっていたが、ID 規約の欠落は残っていた。ファイル単位の更新時刻は
該当箇所の追従を表さない。

`required` 照合が使えないのは、必須・任意を示す列の書式が rulebook ごとに異なるためである。
`○`、`agent 推奨`、説明文などが混在し、単純な照合では誤検出が支配的になる。表構造を標準化
しない限り実用にならないため、本項目では対象外とする。

enum が有効なのは、機械可読で意味が一意であり、rulebook が許容値を列挙する義務を負うため、
欠落がそのまま矛盾になるからである。

## 3. 完了条件

- schema が定義する enum 値が、対応 rulebook の本文に現れないことを検出できる。
- rulebook と schema の対応付けが、命名規則または frontmatter の宣言から解決できる。
- 検出時は、対象 rulebook、schema のパス、欠落した値を示して失敗する。
- `specdojo:finding` コメント内の記述を本文の記載と誤認しない。
- lint / hook / CI のいずれかから自動実行される。
- 既知の2件を検出し、他の rulebook で誤検出を出さない。

## 4. 作業内容

| No  | 作業                                  | 担当 | 状態 | メモ                          |
| --- | ------------------------------------- | ---- | ---- | ----------------------------- |
| 1   | rulebook と schema の対応付けを決める | ARC  | done | 同一 prefix の命名規則を採用  |
| 2   | enum 抽出と本文照合を実装する         | ARC  | done | finding と Frontmatter を除外 |
| 3   | 全 rulebook で誤検出の有無を確認する  | ARC  | done | ready の YAML/JSON を検査     |
| 4   | lint / hook から実行する              | ARC  | done | validate:schema へ統合        |
| 5   | 単体テストを追加する                  | ARC  | done | 欠落・正常・境界条件を追加    |
| 6   | 検出された既存の乖離を整理する        | ARC  | done | 既知2文書の規則を修正         |

## 5. 対応結果

- `validate-rulebook-schema-enums.ts` を追加し、ready の YAML/JSON rulebook と同一 prefix の schema を
  対応付けて、schema 内の文字列 enum が規範本文に網羅されることを検査するようにした。
- Frontmatter と `specdojo:finding` コメントを網羅判定から除外し、`reporter` のような長い語に
  含まれる部分文字列も enum 値の記載とはみなさない。
- `validate:schema:rulebook-enums` を `validate:schema` に統合し、hook / CI の既存検証経路から
  自動実行されるようにした。
- 既知の乖離について、`pm-members-rulebook.md` に `report` 起動プロファイルを追記し、
  `pjr-rulebook.md` に PJR-ID の除外文字と topic のハイフン制約を追記した。
- 単体テストでは enum 抽出、欠落値と対象パスの報告、finding コメントの除外、独立トークンの
  判定を固定した。現時点の対象 rulebook で未解消の enum 欠落はない。
- `package.json` への script 登録は `agent-config-write` が保護して block した。orchestrator が
  差分を確認して適用した。既存の `validate:schema` へ連結するだけの変更であり、agent が
  検証設定を自ら書き換えていないことを確認している。
- orchestrator が worktree の成果物を統合して受け入れた。統合後に `validate:schema` が enum
  検査を含めて成功すること、`pm-members-rulebook.md` から `report` の記載をすべて除くと
  欠落した値と schema のパスを示して失敗することを確認した。単体テスト1327件も通過している。
- agent は保護機構が要求する申し送りを result へ記入せずに block した。この規約違反は
  [[prj-0001:pjr-vh6r-agent-config-write-handoff]] として分離した。

## 6. 関連ドキュメント

- [[prj-0001:pjr-49d2-quality-assessment]]: grade コマンドの起点。
- [[prj-0001:pjr-excv-grade-per-document-pipeline]]: 乖離が判明した較正検証の実行経路。
