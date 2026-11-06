---
specdojo:
  id: specdojo:timeline-design-guide
  type: guide
  status: deprecated
---

# Timeline から epic への移行ガイド

Timeline to Epic Migration Guide

Timeline（`tml-index.yaml`）は非推奨です。全体計画は epic を正本とし、`dashboard build` で生成します。

**対象読者**

- 旧 Timeline を運用しているプロジェクト管理者、担当者

**この文書で分かること**

- 全体計画を epic へ移す手順と旧形式の互換運用

**次に読む文書**

- [[specdojo:register-operation-guide|登録簿運用ガイド]]
- [[specdojo:pjr-rulebook|プロジェクト登録簿ルール]]

## 1. 移行手順

1. 全体計画に載せる track ごとに epic を 1 件起票します。未着手の計画も `open` の epic にします。epic のない古い track は全体計画に出しません。
2. 旧 `tracks[].domains` を各 epic の `domains` へ移します。範囲の一部だけを扱う場合は個票の範囲の章で境界を記し、strategy の `scope.catalogs[].local_ids` で限定します。
3. 旧 track 間の `depends_on` を見直し、必要な順序を epic 間の `depends_on` に記録します。`order` と `parallel_group` は移しません。`derived_from` は由来なので依存へ自動転記しません。
4. 予定開始日を `start_on`、期限を `due_on` に記録します。`register add` / `update` の `--start-on <YYYY-MM-DD>` で設定できます。着手・完了は register の操作で記録します。旧 `planned_start_date` やカタログの見積りから実績を作らないでください。日付が分からない期間は未定のまま表示されます。
5. `register build` で epic の track 重複・依存循環を検査し、`dashboard build` で `execution/generated/` の全体計画と未作成カタログを確認します。
6. カタログから旧 `tml-index` のエントリと不要な依存を外します。外せない依存は理由と次の対応を記録して保留します。既存ファイルは互換用に保持でき、削除は利用者が判断します。

```bash
specdojo register add --type epic --title "データモデルの整備" --topic data-model \
  --track data-model --domain data-model --due 2026-11-30
# PJR-AB12 を作成した epic の ID に置き換える
specdojo register update --id PJR-AB12 --domain data-model
specdojo register build
specdojo dashboard build
```

## 2. 互換運用

`tml-index.yaml`・`timeline build`・`timeline_path` は警告付きで互換を維持します。epic がある project の全体計画は epic だけから作り、epic のない project は旧 timeline 表示を維持します。strategy の範囲解決は既存 strategy の scope、epic の `domains`、旧 timeline の順です。移行後も既存 scope が優先されるため、範囲が変わる場合は scope も確認してください。旧コマンドの仕様は [[specdojo:command-reference|コマンドリファレンス]] を参照してください。
