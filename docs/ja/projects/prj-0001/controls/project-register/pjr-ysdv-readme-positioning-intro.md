---
specdojo:
  id: prj-0001:pjr-ysdv-readme-positioning-intro
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-09-24T11:09:46Z"
  due_on: "2026-10-03"
  completed_at: "2026-09-24T12:00:43Z"
  conclusion: README 冒頭を PJR-E8TT の 3 つの主張へ揃え、register から始めて必要な分だけ広げる順序へ組み替えた。
---

# PJR-YSDV README 冒頭を PJR-E8TT の差別化軸へ揃える

## 1. 概要

[[prj-0001:pjr-e8tt-initial-release-positioning]] で初期リリースの差別化軸を決めたが、README 冒頭は旧来の説明のままである。

```text
SpecDojo は、仕様駆動開発のためのドキュメントフレームワークです。
プロダクトの構築・改修に必要な情報を体系化し、人と生成 AI が同じ成果物を作成・検証・更新できるようにします。

- 成果物の記述規則、作成手順、テンプレート、サンプル
- プロジェクトとプロダクトの文書体系
- register、Schedule、実行、レビューを支援する CLI
```

成果物の体系から説明を始めており、**段階的に使える構造が伝わらない**。決定では「全体を採用しなくても価値が出ることを入口で示す」としたが、冒頭が逆の印象を与える。106 種の型を先に見せると重さで脱落する、というのが決定の前提だった。

## 2. 完了条件

- README 冒頭が [[prj-0001:pjr-e8tt-initial-release-positioning]] の 3 つの主張と接続している。
  - 気づいたことを型に沿って残せる
  - 会話で進められる
  - 成果物の型が揃っている
- register から始められること、必要になったら成果物体系へ広げられることが読み取れる。
- 「使い始める」の手順（npm 導入 → orchestrator → 会話）と矛盾しない。
- 成果物 kata の網羅範囲は価値として残すが、入口としては提示しない。
- 誇張や未実装の機能を書かない。`exec` の並列実行や grade は冒頭で主張しない。
- `npm run lint:md` が通過している。

## 3. 作業内容

| No  | 作業                                | 担当 | 状態 | メモ                           |
| --- | ----------------------------------- | ---- | ---- | ------------------------------ |
| 1   | 冒頭の説明を 3 つの主張へ組み替える | DEV  | done | 段階的に使えることを示す       |
| 2   | 提供物の箇条書きを見直す            | DEV  | done | 体系の列挙から、使い方の順序へ |
| 3   | 「使い始める」との接続を確認する    | DEV  | done | 重複と矛盾を避ける             |

## 4. 対応結果

- README 冒頭へ `**登録簿ひとつから始められます。** 設定 2 行で使い始め、必要になった分だけ広げられます。` を置き、`できること` として 3 つの見出しを立てた。[[prj-0001:pjr-e8tt-initial-release-positioning]] の 3 つの主張がそのまま見出しになっている。
  - 気づいたことを、型に沿って残せる
  - 会話で進められる
  - 必要になったら、成果物の型へ広げられる
- 順序は register → orchestrator → 成果物体系とした。決定の前提「106 種の型を先に見せると重さで脱落する」に沿い、成果物体系を最後に置いて「最初から全部を用意する必要はありません」で締めている。
- 記述は検証済みの事実に絞った。設定 2 行（[[prj-0001:pjr-36qg-competitive-landscape-and-release]] の最小構成実測）、7 type のテンプレート、`controls/generated/` の 4 文書、kata 106 種。
- 冒頭で主張しなかったものがある。並列実行、grade による品質評価、schedule の CPM。決定で「機能比較に持ち込まない」としたものと、裏づけが弱いものを外した。
- ローカル feature ブランチ `feature/prj-0001/readme-intro` で実施し、`--no-ff` merge で develop へ統合した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-e8tt-initial-release-positioning]]
- [[prj-0001:pjr-49jk-readme-orchestrator-onboarding]]
- `README.md`
