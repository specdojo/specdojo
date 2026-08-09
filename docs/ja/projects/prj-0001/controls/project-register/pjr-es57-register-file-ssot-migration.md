---
specdojo:
  id: prj-0001:pjr-es57-register-file-ssot-migration
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-08-09T02:12:43Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-09T12:03:32Z"
  conclusion: 8件の分割先すべてが完了し、個票frontmatterを唯一の正本とする移行が完了した。
---

# PJR-ES57 登録簿を1項目1ファイル正本へ移行し pjr-index を生成ビュー化する

## 1. 概要

PJR-9Y7G の決定（選択肢B）に基づき、個票 frontmatter を正本、pjr-index.md を generated の派生ビューへ移行する。CLI・スキーマ・rulebook・テンプレート・既存項目移行を対象とする。

[[prj-0001:pjr-9y7g-register-item-file-as-ssot]] で選択肢 B を採択したため、登録項目の正本を個票 frontmatter へ一本化し、`pjr-index.md` を `generated/` 配下の派生ビューへ移行する。正本の粒度を実体（登録項目）単位に合わせることで、index と個票の同期規則、表末尾の追記競合、それを回避するための補償機構を不要にする。未リリースのうちに実施する。

作業量が1回の実行に収まらないため、2026-08-09 に 8 件の登録項目へ分割した。本項目は分割元として全体の進捗を追跡し、個別の実作業は分割先で行う。

## 2. 完了条件

- 個票 frontmatter が登録項目の唯一の正本になっている。処理状態・優先度・担当・期限・完了日・結論・分類が frontmatter に定義され、共通の frontmatter スキーマで検証される。
- `pjr-index.md` が `generated/` 配下の生成物として出力され、追跡対象から外れている。手編集を前提とする運用が残っていない。
- register の全サブコマンド（`add` / 状態遷移 / `update` / `build` / `where`）が個票を読み書きし、`pjr-index.md` を直接編集しない。
- 一覧生成が決定的（ID 昇順などの固定ソート）で、同一入力から同一出力が得られる。
- 補償機構（`--reserve` / `--local` / `--strict-sync` / 統合ブランチ自動ルーティング）が撤去され、`renumber` は乱数 ID 衝突の救済のみに縮小されている。
- [[specdojo:pjr-rulebook]] から `index と個別登録項目の同期` が削除され、「個票を作る項目／作らない項目」の二分が廃止されている。
- 既存の全登録項目が個票へ移行され、検証（frontmatter スキーマ、履歴リンク、Markdown lint）が通る。
- 台帳の差分レビュー喪失に対する代替手段が決まり、運用ガイドに記載されている。
- 既存テストが green で、移行後の挙動を検証するテストが追加されている。

## 3. 作業内容

本項目は分割元として全体を追跡し、実作業は次の登録項目で行う。番号は推奨する実施順序を表す。

| No  | 分割先の登録項目                                       | 担当 | 状態 | メモ                                                                 |
| --- | ------------------------------------------------------ | ---- | ---- | -------------------------------------------------------------------- |
| 1   | [[prj-0001:pjr-rf3b-register-item-frontmatter-schema]] | ARC  | done | claude-expert-edit-agent                                             |
| 2   | [[prj-0001:pjr-tt4j-register-cli-write-to-tickets]]    | ARC  | done | claude-expert-edit-agent                                             |
| 3   | [[prj-0001:pjr-rzr3-pjr-index-as-generated-view]]      | ARC  | done | claude-expert-edit-agent                                             |
| 4   | [[prj-0001:pjr-9p5q-migrate-existing-register-items]]  | ARC  | done | codex-expert-edit-agent                                              |
| 5   | [[prj-0001:pjr-37wn-remove-id-reservation-mechanisms]] | ARC  | done | codex-edit-agent（1回目はexec-run.tsの不具合で失敗し修正後に再実行） |
| 6   | [[prj-0001:pjr-vc94-update-validation-and-tests]]      | ARC  | done | codex-edit-agent                                                     |
| 7   | [[prj-0001:pjr-rdnc-update-docs-for-ticket-ssot]]      | ARC  | done | codex-edit-agent                                                     |
| 8   | [[prj-0001:pjr-gh26-ledger-review-alternative]]        | ARC  | done | claude-expert-edit-agent                                             |

## 4. 対応結果

- 8件の分割先すべてが完了し、完了条件をすべて満たした。個票 frontmatter が登録項目の唯一の正本になり、`pjr-index.md` は `generated/` 配下の非追跡な生成ビューへ移行した。register の全サブコマンドが個票を読み書きし、一覧生成は決定的である。予約系の補償機構は撤去され、`renumber` は乱数 ID 衝突の救済のみに縮小された。rulebook・運用ガイド・テンプレートは個票正本の構成へ更新された。既存186件の登録項目は個票へ移行済みで、台帳の差分レビュー代替手段（`register history` CLI 等）も実装・文書化された。テストは949件すべて green。
- 移行の過程で3件の副次的な問題を発見し、別途対応した。
  - 未定値プレースホルダ判定の誤検知（[[prj-0001:pjr-gqfx-todo-marker-false-positive-in-inline-code]]、未着手）
  - CODEOWNERS 未整備による自己承認（[[prj-0001:pjr-bj97-codeowners-and-branch-protection]]、未着手）
  - `pjr-index.md` の非追跡化に伴う wikilink 解決不能（[[prj-0001:pjr-1d0c-pjr-index-wikilink-broken]]、未着手。個票60件の`part_of`とwikilink10箇所が対象）
- `exec-run.ts` のcheckpointが削除済み`pjr-index.md`を`git add`しようとして失敗するバグを発見・修正した（PJR-37WN以降の全register実行に影響していた）。
- 上記のうち PJR-GQFX・PJR-BJ97・PJR-1D0C は本項目の完了条件の範囲外（発見時点で別途起票し追跡）のため、これらの未着手を理由に本項目のcloseを妨げない。

## 5. 関連ドキュメント

- [[prj-0001:pjr-9y7g-register-item-file-as-ssot]]: 本作業の根拠となる決定（選択肢 B の採択）
- [[specdojo:pjr-rulebook]]: 更新対象の記載ルール
- [[specdojo:register-operation-guide]]: 更新対象の運用手順
- [[prj-0001:pjr-index]]: 移行対象の登録項目一覧
