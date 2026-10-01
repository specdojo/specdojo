---
specdojo:
  id: prj-0001:pjr-fzc4-multi-repo-design-investigation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  owner: ARC
  registered_at: "2026-10-01T03:58:50Z"
---

# PJR-FZC4 複数リポジトリ対応の調査と選択肢の比較

## 1. 概要

PJR-5822 の決定に必要な調査として、現行実装の変更箇所を一覧にし、論点ごとの選択肢と推奨案を PJR-5822 の個票に書く。決定はしない（v0.3.0）

## 2. 完了条件

- 現行の実装を調べ、結果を [[prj-0001:pjr-5822-multi-repo-item-design]] の個票に書く。複数リポジトリ対応で変更が要る箇所を、ファイルと関数の単位で一覧にする。少なくとも次を含める。
  - worktree の作成・撤去・命名（`src/exec-worktree.ts`）
  - agent の作業ディレクトリと、各 provider の sandbox・書き込み許可（claude の settings、codex、antigravity、opencode）
  - commit 対象の算出と保護設定の検査（`src/exec-agent-protected-config.ts` など）
  - 親検証の実行場所（`src/exec-parent-validation.ts`）
  - 統合・再開・pipeline state（`src/exec-run.ts`、`src/exec-pipeline-state.ts` など）
  - `targets`・`paths` の解決と doc index
- 次の論点ごとに、選択肢を 2 つ以上、利点と懸念を添えてPJR-5822 の「検討した選択肢」の表に書く。
  - 1 つの項目で複数リポジトリの変更を許すか（禁止して項目の分割を求める案を含める）
  - リポジトリの宣言の場所と形式（`specdojo.config.json` の project に持たせる案など。名前・パス・統合先ブランチ・検証の割り当て）
  - `targets`・`paths` でリポジトリを指定する書式（例: `app1:src/...`）
  - worktree の配置（`<task-id>/` の下にリポジトリごと、など）と agent の作業ディレクトリ
  - 統合の順序（宣言順でプロダクト先行、など）と、統合済みの範囲の記録・再開の位置
  - 部分状態での `item_status`
  - 親検証のリポジトリへの割り当て
  - プロダクト側の commit への `Refs: <project-id>:<item-id>` の付与（[[prj-0001:pjr-1sxk-refs-trailer-project-qualified-id]]）
- 論点ごとに推奨案とその理由を書く。推奨案は「決定内容」ではなく、「検討した選択肢」の下の推奨として書く。PJR-5822 の「決定内容」「採択理由」「承認」は `_TODO_` のまま残す。
- 推奨案に沿って、todo（PJR-HQBK・PJR-98G4・PJR-V96B・PJR-0WAA・PJR-30SW・PJR-69VP）の分担と実施順が妥当かを確かめ、変更が要れば提案する。
- 既存の単一リポジトリ構成（同一リポジトリ構成）の動作と互換性を保つ方法を書く。
- コード・設定・ガイドを変更しない。更新するのは PJR-5822 と本項目の個票だけとする。

## 3. 作業内容

| No  | 作業                      | 担当 | 状態 | メモ                  |
| --- | ------------------------- | ---- | ---- | --------------------- |
| 1   | 現行実装の変更箇所の一覧  | ARC  | open | -                     |
| 2   | 論点ごとの選択肢と推奨案  | ARC  | open | PJR-5822 の個票に書く |
| 3   | todo の分担と実施順の確認 | ARC  | open | -                     |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-5822-multi-repo-item-design]]
- [[prj-0001:pjr-p7hy-multi-repo-single-item]]
- [[specdojo:docs-structure-guide]]
