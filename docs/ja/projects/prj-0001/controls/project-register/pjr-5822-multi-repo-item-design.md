---
specdojo:
  id: prj-0001:pjr-5822-multi-repo-item-design
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-10-01T03:53:24Z"
---

# PJR-5822 1 つの項目で複数リポジトリを変更する exec の方針を決める

## 1. 背景

既定の別リポジトリ構成では、プロジェクトリポジトリ（`app1-specdojo/`）とプロダクトリポジトリ（`app1/`）を分ける。現行の exec は、プロジェクトリポジトリ 1 つと worktree 1 組だけを扱う。このため、プロダクトの実装やプロダクト文書を変更する項目は exec run で扱えない（`docs-structure-guide` の「現行実装の境界」）。v0.3.0 で、1 つの項目が複数のリポジトリを変更する exec を実現する。N 個のリポジトリを扱える設計とし、まずプロジェクトリポジトリ 1 つとプロダクトリポジトリ 1 つで動かす。複数プロダクトの論点は [[prj-0001:pjr-p7hy-multi-repo-single-item]] にある。

### 1.1. 調査と案の作成の範囲

本項目の exec run では、決定はせず、決定に必要な調査と案を個票に書く。決定内容と承認は利用者が記入する。次を満たす。

- 現行の実装を調べ、複数リポジトリ対応で変更が要る箇所を、ファイルと関数の単位で一覧にする。少なくとも次を含める。
  - worktree の作成・撤去・命名（`src/exec-worktree.ts`）
  - agent の作業ディレクトリと、各 provider の sandbox・書き込み許可（claude の settings、codex、antigravity、opencode）
  - commit 対象の算出と保護設定の検査（`src/exec-agent-protected-config.ts` など）
  - 親検証の実行場所（`src/exec-parent-validation.ts`）
  - 統合・再開・pipeline state（`src/exec-run.ts`、`src/exec-pipeline-state.ts` など）
  - `targets`・`paths` の解決と doc index
- 次の論点ごとに、選択肢を 2 つ以上、利点と懸念を添えて「検討した選択肢」の表に書く。
  - 1 つの項目で複数リポジトリの変更を許すか（禁止して項目の分割を求める案を含める）
  - リポジトリの宣言の場所と形式（`specdojo.config.json` の project に持たせる案など。名前・パス・統合先ブランチ・検証の割り当て）
  - `targets`・`paths` でリポジトリを指定する書式（例: `app1:src/...`）
  - worktree の配置（`<task-id>/` の下にリポジトリごと、など）と agent の作業ディレクトリ
  - 統合の順序（宣言順でプロダクト先行、など）と、統合済みの範囲の記録・再開の位置
  - 部分状態での `item_status`
  - 親検証のリポジトリへの割り当て
  - プロダクト側の commit への `Refs: <project-id>:<item-id>` の付与（[[prj-0001:pjr-1sxk-refs-trailer-project-qualified-id]]）
- 論点ごとに推奨案とその理由を書く。推奨案は「決定内容」ではなく、「検討した選択肢」の下の推奨として書く。
- 推奨案に沿って、todo（PJR-HQBK・PJR-98G4・PJR-V96B・PJR-0WAA・PJR-30SW・PJR-69VP）の分担と実施順が妥当かを確かめ、変更が要れば提案する。
- 既存の単一リポジトリ構成（同一リポジトリ構成）の動作と互換性を保つ方法を書く。
- 本項目では、コード・設定・ガイドを変更しない。個票だけを更新する。

## 2. 検討した選択肢

| 選択肢 | 内容   | 利点   | 懸念   |
| ------ | ------ | ------ | ------ |
| A      | _TODO_ | _TODO_ | _TODO_ |

## 3. 決定内容

_TODO_: 採択した内容を明確に記載する。

## 4. 採択理由

- _TODO_: 判断根拠を記載する。

## 5. 承認

| 項目     | 内容   |
| -------- | ------ |
| 決定者   | _TODO_ |
| 決定日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容   |
| ---------- | ------ |
| 影響範囲   | _TODO_ |
| 必要な対応 | _TODO_ |
| 追跡先     | _TODO_ |

## 7. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
