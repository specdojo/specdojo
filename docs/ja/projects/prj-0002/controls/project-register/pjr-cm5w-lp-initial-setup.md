---
specdojo:
  id: prj-0002:pjr-cm5w-lp-initial-setup
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  owner: DEV
  registered_at: "2026-10-11T10:25:32Z"
  block_reason: "agent exited with non-zero code: agent exited with non-zero code: agent-config-write: protected configuration changes detected; paths=specdojo-lp:package.json; agent must record the required change in…"
---

# PJR-CM5W specdojo-lp に Astro と Tailwind CSS の初期構成を作る

## 1. 概要

PJR-FV3W の決定に従い、specdojo-lp に静的出力の Astro と Tailwind CSS、Material 3 の指針を表すテーマ、仮のトップページを用意する

## 2. 完了条件

- プロダクトリポジトリ `specdojo-lp` に、静的出力の Astro プロジェクトと Tailwind CSS が導入されている。パッケージ管理は npm とする。
- Material 3 の色の役割（primary・surface など）、文字の大きさの段階、角丸、影の段階が Tailwind CSS のテーマとして定義されている。
- 仮のトップページが 1 枚あり、テーマの色と文字の段階を使っている。
- `specdojo-lp` で `npm run build` を実行すると、静的な HTML が出力される。
- `specdojo-lp` の README に、開発とビルドの手順が書かれている。
- Cloudflare への配置、本番の原稿（PJR-HEPK）、マスコット（PJR-FSMC）は本項目に含めない。

## 3. 作業内容

| No  | 作業                                                    | 担当 | 状態 | メモ |
| --- | ------------------------------------------------------- | ---- | ---- | ---- |
| 1   | Astro（静的出力）と Tailwind CSS を導入する             | DEV  | open | -    |
| 2   | Material 3 の指針を Tailwind CSS のテーマとして定義する | DEV  | open | -    |
| 3   | 仮のトップページと README を用意し、ビルドを確認する    | DEV  | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0002:pjr-fv3w-lp-tech-stack]]: 技術スタックの決定。
- [[prj-0002:pjr-g4qn-lp-tech-stack-evaluation]]: 比較評価と根拠。
