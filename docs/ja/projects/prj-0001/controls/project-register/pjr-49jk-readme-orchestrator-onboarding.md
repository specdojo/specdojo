---
specdojo:
  id: prj-0001:pjr-49jk-readme-orchestrator-onboarding
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-09-23T12:58:16Z"
  due_on: "2026-10-17"
---

# PJR-49JK README の onboarding を orchestrator 経由の導線へ書き換える

## 1. 概要

README は `npx specdojo` を直接叩く手順を案内している。SpecDojo の想定する使い方は対話型オーケストレーターへ会話で指示することなので、導線を組み替える。

現在の README は次の流れである。

```text
npm install --save-dev specdojo @specdojo/docs-lint
npx specdojo config init
npx specdojo config scaffold --provider codex   （任意）
npx specdojo register scaffold / add / build
npx specdojo exec plan --register PJR-XXXX
npx specdojo kata list / show / eject
```

CLI を直接使う手順としては完結しているが、オーケストレーターへの言及が無い。[[specdojo:quick-start-guide]] は各コマンドへチャット指示を併記しているものの、agent の入手方法は書かれていない。

本項目は [[prj-0001:pjr-8xqz-orchestrator-distribution-and-ssot]] で配布経路が整ってから着手する。

## 2. 完了条件

- README の導入手順が、オーケストレーターの配置と起動を含む。
- 配置は `config scaffold --provider <name>` で行えることが示されている。
- 起動方法が provider ごとに示されている（`claude --agent specdojo-orchestrator` など）。
- 最初の操作として、オーケストレーターへ会話で指示する例（register の起票など）が示されている。
- CLI を直接使う手順が選択肢として残り、agent を使わない利用者も導入できる。
- 記載した手順を kata を持たない一時ディレクトリでなぞり、記載どおり動作することを確認している。
- README が npm のページとして成立している。GitHub 前提の記述が残っていない。
- `npm run lint:md` が通過している。

## 3. 作業内容

| No  | 作業                                               | 担当 | 状態 | メモ                        |
| --- | -------------------------------------------------- | ---- | ---- | --------------------------- |
| 1   | オーケストレーターの配置と起動を README へ追加する | DEV  | open | provider ごとの起動コマンド |
| 2   | 会話で操作する最初の例を示す                       | DEV  | open | register の起票を例にする   |
| 3   | CLI 直接利用を選択肢として整理する                 | DEV  | open | 既存手順を残す              |
| 4   | 一時ディレクトリで記載手順をなぞって確認する       | DEV  | open | 実際に動くことを確かめる    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-8xqz-orchestrator-distribution-and-ssot]]
- [[prj-0001:pjr-09kk-npm-onboarding-path]]
- [[specdojo:orchestrator-operation-guide]]
- [[specdojo:quick-start-guide]]
- `README.md`
