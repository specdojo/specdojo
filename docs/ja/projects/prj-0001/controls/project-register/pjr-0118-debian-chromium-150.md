---
specdojo:
  id: prj-0001:pjr-0118-debian-chromium-150
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  owner: ARC
  due_on: "2026-07-08"
  completed_at: "2026-07-08T12:00:00Z"
  conclusion: Dockerfileを修正
  register_events:
    - v: 1
      id: reg_0873158927ad344442aa7eb55087b96c
      ts: "2026-08-09T10:55:22Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: done
      reason: "exec(register PJR-9P5Q): 既存登録項目を個票 frontmatter へ一括移行する"
      changes:
        - field: status
          from: ""
          to: done
        - field: title
          from: ""
          to: Debian chromium 150のヘッドレス描画クラッシュ対応
        - field: description
          from: ""
          to: "arm64 full版chromium 150.0.7871.46がヘッドレス描画時にbrk #0でクラッシュしmermaid SVG生成が失敗。chromium-headless-shellへ切替(Dockerfile変更済み)。"
        - field: type
          from: ""
          to: issue
        - field: priority
          from: ""
          to: high
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: _TODO_
        - field: due
          from: ""
          to: "2026-07-08"
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: Dockerfileを修正
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: dbac152079df02ec9bbad154a3253c043e10655a
    - v: 1
      id: reg_bad87ef142dcdc3723a16f34457d0635
      ts: "2026-08-09T14:39:40Z"
      action: update
      actor: SpecDojo Test
      from_status: done
      to_status: done
      reason: "exec(register PJR-EQAQ): 登録簿日時をregistered_at・completed_atへ移行する"
      changes:
        - field: completed
          from: "-"
          to: "2026-07-08"
      legacy_commit: 38201bef867f3cc1454db6b748fc979ed3f2fa8f
      previous_event_id: reg_0873158927ad344442aa7eb55087b96c
---

# PJR-0118 Debian chromium 150のヘッドレス描画クラッシュ対応

## 1. 課題内容

arm64 full版chromium 150.0.7871.46がヘッドレス描画時にbrk #0でクラッシュしmermaid SVG生成が失敗。chromium-headless-shellへ切替(Dockerfile変更済み)。

## 2. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 3. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
