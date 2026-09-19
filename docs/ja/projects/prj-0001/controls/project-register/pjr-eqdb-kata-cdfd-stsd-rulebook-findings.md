---
specdojo:
  id: prj-0001:pjr-eqdb-kata-cdfd-stsd-rulebook-findings
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: ARC
  registered_at: "2026-09-17T13:17:10Z"
  due_on: "2026-09-30"
---

# PJR-EQDB cdfd-rulebook と stsd 系 rulebook の grade 指摘を解消する

## 1. 概要

PJR-ZA91（STSD/CSTD 統合）で変更した Kata を 16 時の定期評価 `rtn-grade-recheck`（`JBR-grade-kata-8a8333596f2e`、3 段目 codex-expert）で評価した結果、rulebook 3 件が needs-work となった。recipe 4 件（96〜100）と cdfd-uc-rulebook（84）、cdfd-overview-rulebook（84）は本 todo の対象外とする。

| Kata                    | score | findings      | 指摘の中心                                                                                                                                                                                                                                                    |
| ----------------------- | ----- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cdfd-rulebook`         | 75    | 11（major 3） | includes 先の `cdfd-mermaid-rulebook` が個別プロセス例に本書で禁止した `P-01` 形式を使う。主要例外・委譲が 0 件のときの章の扱いが未定義。完成判定の「停止範囲」の記載先が本文要件にない。sample の `cdfd-sales` 委譲行だけ「在庫数量」で用語が揺れる          |
| `stsd-rulebook`         | 73    | 8（major 3）  | includes 先の `stsd-mermaid-rulebook` が `＜＜choice＞＞` 疑似状態とイベントなしの出力遷移を許し、本書の「遷移元・遷移先は状態」と矛盾。rulebook 内サンプルが「販売終了まで」を宣言しながら販売可能までしか定義していない。外部参照に使う値の一意性要件がない |
| `stsd-mermaid-rulebook` | 71    | 7（major 4）  | `＜＜choice＞＞` の扱い（イベントの有無、遷移の説明との対応、状態一覧に載せない疑似状態である旨）が未定義。分岐例の出力遷移が `イベント / 条件` 形式に反する。図の分割条件と「主要な終了・継続状態」の判定基準がない                                          |

3 件に共通するのは、rulebook 本体と `includes` 先の mermaid rulebook の整合不足である。個別に直すのではなく、mermaid rulebook 側の例と許容記法を本体の要件に合わせて決め直す。

### 1.1. 決定事項

- `＜＜choice＞＞` 疑似状態は許さない（決定者 ARC、2026-09-17）。状態遷移図の遷移元・遷移先は状態一覧に載る状態に限り、分岐は同じ遷移元から出る複数の出力遷移にそれぞれ `イベント / 条件` を付けて表現する。`stsd-mermaid-rulebook` の分岐例と許容記法、`stsd-rulebook` の本文要件をこの決定に合わせる。

## 2. 完了条件

- `cdfd-mermaid-rulebook` の個別プロセス例が `cdfd-rulebook` の ID 形式に従い、凡例の再掲方針が本体と一致している。
- `cdfd-rulebook` に、主要例外・グループ外委譲が 0 件の場合の章の扱いと、完成判定の「停止範囲」の記載先が定義されている。`cdfd-sample` の委譲表の用語が本文と一致している。
- `stsd-mermaid-rulebook` が `＜＜choice＞＞` 疑似状態を禁止事項として明記し、分岐例が同一遷移元からの複数出力遷移で各矢印に `イベント / 条件` を持つ形に改まっている。図の分割条件と「主要な終了・継続状態」に判定基準がある。
- `stsd-rulebook` が mermaid rulebook と矛盾せず、外部参照値の一意性要件を持ち、rulebook 内サンプルの対象範囲と記載内容が一致している。
- 3 件の `specdojo:finding` が次回 grade で解消され、verdict が pass になっている。
- `npm run lint:md` と `npm run validate:schema` が通過している。

## 3. 作業内容

| No  | 作業                                                                                                                                                                 | 担当 | 状態 | メモ                                                                                                               |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------------------------------------------------------------------ |
| 1   | `＜＜choice＞＞` の可否と、許す場合の記法（イベントの扱い・状態一覧との関係）を決める                                                                                | ARC  | done | 2026-09-17 決定: 許さない。分岐は各出力遷移の `イベント / 条件` で表現し、状態一覧に載らない疑似状態を図に置かない |
| 2   | `stsd-mermaid-rulebook` と `stsd-rulebook` を決定に沿って改訂し、rulebook 内サンプルと `stsd-sample` を整合させる                                                    | ARC  | done | 疑似状態禁止、分岐・分割・到達性・値一意性を規定し、sample と template を追従                                      |
| 3   | `cdfd-mermaid-rulebook` の例を `cdfd-rulebook` の ID 形式・凡例方針に合わせ、`cdfd-rulebook` に 0 件時の扱いと停止範囲の記載先を追加し、`cdfd-sample` の用語を揃える | ARC  | done | `P-<nn>-<nn>`、共通凡例参照、0 件時の確認根拠、停止範囲列、売場商品の用語へ統一                                    |
| 4   | 再 grade で 3 件の解消を確認する                                                                                                                                     | ARC  | open | `rtn-grade-recheck` または手動 `--changed-only`                                                                    |

## 4. 対応結果

- [[specdojo:cdfd-mermaid-rulebook]] の個別プロセス例を `P-<nn>-<nn>` 形式へ統一し、図直後は共通凡例への参照、使用線種、省略事項、共有ノードだけを記録する方針へ揃えた。
- [[specdojo:cdfd-rulebook]] と template に、主要例外・グループ外委譲が 0 件の場合の確認範囲と該当なしの残し方を追加した。主要例外表には「停止範囲」を独立列として定義し、[[specdojo:cdfd-sample]] の例外表を追従させた。販売グループへの引き渡しは「売場商品」に統一した。
- [[specdojo:stsd-mermaid-rulebook]] と [[specdojo:stsd-rulebook]] で `<<choice>>` などの疑似状態を禁止し、同じ遷移元からの複数遷移へ各 `イベント / 条件` を記載する方式に統一した。図の分割閾値、終了・継続状態の判定、全経路の到達性、外部参照値の一意性も明文化した。
- [[specdojo:stsd-sample]] と rulebook 内サンプルは、売場補充後に販売可能となり、販売・返品の完了事実を各終了状態への進入条件に含めるライフサイクルへ揃えた。STSD template にも同じ一意性・分岐・分割規則を反映した。
- 残課題は次回 grade による verdict の pass 確認のみであり、作業 4 で追跡する。

## 5. 関連ドキュメント

- [[specdojo:cdfd-rulebook]]
- [[specdojo:cdfd-mermaid-rulebook]]
- [[specdojo:cdfd-sample]]
- [[specdojo:stsd-rulebook]]
- [[specdojo:stsd-mermaid-rulebook]]
- [[specdojo:stsd-sample]]
- [[prj-0001:pjr-za91-stsd-cstd-merge]]
