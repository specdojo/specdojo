---
specdojo:
  id: prj-0001:pjr-say1-template-finding-comments
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-09-07T13:14:06Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-08T12:37:11Z"
---

# PJR-SAY1 同梱テンプレートから finding コメントを除去する

## 1. 概要

`grade apply` がテンプレートへ挿入した `specdojo:finding` コメントが、そのテンプレートから
生成されるすべての文書へ複製される。

```text
grade apply    → pjr-todo-template.md へ finding コメントを挿入
register add   → テンプレート本文をそのまま複製
                 → pjr-kk07-template-resolution-fallback.md へ混入
```

## 2. 調査結果

### 2.1. 時系列

| 出来事                      | 日時             |
| --------------------------- | ---------------- |
| テンプレートへ finding 挿入 | 2026-09-06 20:30 |
| PJR-KK07 / PJR-SAY1 の起票  | 2026-09-07 13:14 |

挿入より後に起票した項目が混入している。

### 2.2. 混入範囲

生成物への影響が大きい。登録簿本体とその全ビューが該当する。

| 文書                       | 混入数 |
| -------------------------- | -----: |
| `pjr-views-by-priority.md` |     10 |
| `pjr-views-by-status.md`   |     10 |
| `pjr-index.md`             |      5 |
| `pjr-views-by-owner.md`    |      5 |
| `pm-issue-log.md`          |      4 |
| `pm-risk-register.md`      |      4 |
| `pm-change-request-log.md` |      3 |
| `pm-decision-log.md`       |      1 |

個票は 311 件中 2 件（PJR-KK07 と PJR-SAY1）である。この 2 件だけ本文をテンプレートのまま
残したためで、他の項目は起票時に本文を書き直していた。

finding コメントを含む個票は他に 9 件あるが、いずれも finding を主題として扱う項目であり、
正当な引用である。

供給元となるテンプレートは 26 件ある。

### 2.3. 誤解を招く点

混入したコメントは、その文書に対する指摘ではない。テンプレート自身への指摘である。

```text
テンプレートが Frontmatter の owner / item_status と区別できない「担当」「状態」を
本文の固定列として生成するため…
```

個票を読む利用者は、自分の文書への指摘だと誤読する。

### 2.4. テンプレートの掃除だけでは再発する

テンプレート本体から除去しても、次の grade 走査でテンプレートへ finding が再挿入される。
テンプレートは評価対象であるため、この循環は続く。したがって生成時に除去する経路が要る。

## 3. 完了条件

- テンプレートから文書を生成する経路が、`specdojo:finding` コメントを生成物へ複製しない。
  `register add`、`register build`、`catalog build` など、テンプレートを材料とする経路すべてに
  適用する。
- テンプレートへ finding が挿入された状態で `register add` を実行しても、生成された個票に
  `specdojo:finding` が含まれない。
- 既存の混入分（生成物 8 件と個票 2 件）が解消されている。
- npm へ同梱するテンプレートに finding コメントが含まれない。
- 生成時に除去することを検証する単体テストを追加する。

## 4. 作業内容

| No  | 作業                                              | メモ                                  |
| --- | ------------------------------------------------- | ------------------------------------- |
| 1   | テンプレート材料化の共通処理へ finding 除去を追加 | 除去は 1 箇所へ寄せる                 |
| 2   | 適用漏れがないか生成経路を洗い出す                | register / catalog / deliverable      |
| 3   | 既存の混入分を再生成または手当て                  | 生成物は再生成で解消する見込み        |
| 4   | 同梱範囲の確認                                    | `npm pack --dry-run` で内容を確認する |
| 5   | 単体テストを追加                                  |                                       |

## 5. 対応結果

- Markdown テンプレートの生成物化を担う共通処理で `specdojo:finding` コメントを除去するようにした。`register add`、`register build`、`catalog build`、`catalog generate` はこの共通処理を経由する。
- `docs/ja/specdojo/templates` 配下で finding コメントが残っていた Markdown テンプレート 26 件を清掃した。
- `register build` で登録簿・派生ビュー 8 件を再生成し、finding コメントが含まれないことを確認した。PJR-KK07 と PJR-SAY1 の個票にも finding コメントがないことを確認した。
- finding コメントと通常の HTML コメントを区別する共通処理、`register add`、`catalog generate` の回帰テストを追加した。
- Template 記述標準へ、finding コメントを生成物へ複製しない規則と npm 公開前の確認事項を追加した。
- 残課題はない。

## 6. 関連ドキュメント

- [[prj-0001:pjr-kk07-template-resolution-fallback]]: 同じ調査で判明したテンプレート解決の問題。
- [[prj-0001:pjr-36qg-competitive-landscape-and-release]]: npm 公開の段取り。
