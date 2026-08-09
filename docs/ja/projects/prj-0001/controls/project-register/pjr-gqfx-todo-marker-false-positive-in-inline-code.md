---
specdojo:
  id: prj-0001:pjr-gqfx-todo-marker-false-positive-in-inline-code
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
---

# PJR-GQFX register close の未記入 _TODO_ 検出がインラインコード内の文字列を誤検出する

## 1. 課題内容

register の状態遷移時に個票を `ready` へ昇格させる判定が、本文にプレースホルダが残っているかを文字列の単純包含で判断しているため、インラインコードやコードブロック内に記述した記法の説明までプレースホルダとみなす。

- 発生日: 2026-08-09
- 発生状況: `specdojo register close --project prj-0001 --id PJR-9Y7G` の実行時に `Warning: PJR-9Y7G ticket has unresolved _TODO_; kept as draft (not promoted to ready)` が出力された。
- 実際の内容: 当該個票に未記入欄は残っていなかった。検出されたのは本文中でプレースホルダ記法そのものを説明するために書いたインラインコードの文字列だった。
- 暫定回避: 当該箇所の文言を言い換えて検出を回避した。記述内容としては、記法の説明を書けない制約が残っている。

## 2. 影響範囲

| 観点         | 影響                                                                                      |
| ------------ | ----------------------------------------------------------------------------------------- |
| スコープ     | 記法やテンプレートを説明する内容を含む個票が `ready` へ昇格しない                         |
| スケジュール | 影響は小さい。回避のための文言修正が都度発生する                                          |
| コスト       | 影響は小さい                                                                              |
| 品質         | 個票の文書成熟度（frontmatter の `status`）が実態と乖離する。記述内容に不要な制約がかかる |
| 関係者       | 登録簿を運用する全ロール                                                                  |

## 3. 対応方針

| 項目     | 内容                                                                                                                              |
| -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `src/register.ts` の `ticketBodyHasTodo` が本文全体に対する文字列包含判定のみで、インラインコードとコードブロックを除外していない |
| 対応策   | 判定をコード範囲を除外した走査へ変更する。Markdown の構文解析、またはコード範囲を除去してから判定する方式を検討する               |
| 依存事項 | [[prj-0001:pjr-es57-register-file-ssot-migration]] で個票 frontmatter を正本化する場合、昇格判定の位置づけが変わる可能性がある    |
| 完了条件 | インラインコードおよびコードブロック内のプレースホルダ文字列を未記入とみなさず、本文の未記入欄のみを検出する。回帰テストがある    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[specdojo:register-operation-guide]]: 個票 status の遷移に関する運用手順
- [[specdojo:pjr-rulebook]]: 個票 status の遷移基準
- [[prj-0001:pjr-9y7g-register-item-file-as-ssot]]: 事象が発生した個票
- [[prj-0001:pjr-es57-register-file-ssot-migration]]: 判定の位置づけに影響しうる移行作業
