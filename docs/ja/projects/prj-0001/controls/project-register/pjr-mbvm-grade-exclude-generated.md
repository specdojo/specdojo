---
specdojo:
  id: prj-0001:pjr-mbvm-grade-exclude-generated
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-09-07T13:45:36Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-07T22:47:12Z"
---

# PJR-MBVM grade の対象選択から generated 配下を除外する

## 1. 概要

`grade validate` / `grade plan` の文書選択が `docs/ja/specdojo/*/generated/` 配下を対象に含めて
いる。`--changed-only` の走査で 47 件が `specdojo.grade is missing` として報告される。

`generated` は生成物であり評価対象ではない。`tools/grade/run-per-document.sh` は find で
`-not -path '*/generated/*'` を指定して除外済みだが、`grade` 側の選択には反映されていない。

## 2. 完了条件

- `grade validate` / `grade plan` の文書選択が `generated` 配下を対象に含めない。
- `--path` で `generated` 配下を明示指定した場合の扱いを決め、その動作を実装する。
- `grade validate --target kata --changed-only` の出力に `generated` 配下が現れない。
- 除外を検証する単体テストを追加する。

## 3. 作業内容

| No  | 作業                                        | メモ                                                   |
| --- | ------------------------------------------- | ------------------------------------------------------ |
| 1   | CLI の選択ロジックへ `generated` 除外を追加 | パス要素単位で判定し、自動探索の候補から除外する       |
| 2   | `--path` 明示指定時の扱いを決める           | 生成物の直接評価・更新を防ぐため、入力エラーとして拒否 |
| 3   | 単体テストを追加                            | 自動探索の除外と明示指定時の拒否を検証                 |

## 4. 対応結果

- `discoverGradeTargets` に `generated` パス要素の判定を追加し、自動探索では生成文書を除外した。
- `--path` で生成文書を明示した場合は、`generated documents cannot be graded` エラーで拒否するようにした。この選択関数を共有する `grade plan` / `grade apply` / `grade validate` のすべてに適用される。
- 自動探索と明示指定の双方を検証する単体テストを追加し、コマンドリファレンスへ選択規則を追記した。
- 型検査を通過し、`grade validate --target kata --changed-only` の実出力に `generated` 配下が現れないこと、および明示指定が拒否されることを確認した。未解決の残課題はない。

## 5. 関連ドキュメント

- [[prj-0001:pjr-20dv-grade-content-hash-normalization]]: 同じ走査で判明したハッシュの問題。
