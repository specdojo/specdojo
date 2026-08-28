---
specdojo:
  id: prj-0001:pjr-gh26-ledger-review-alternative
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-08-09T08:48:42Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-09T11:58:09Z"
  register_events:
    - v: 1
      id: reg_e87284967b23cb726e171ebf2dfd0af8
      ts: "2026-08-09T08:48:42Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs(prj-0001): split PJR-ES57 into 8 register items"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: 台帳の差分レビュー代替手段を決めて実装する
        - field: description
          from: ""
          to: "[[prj-0001:pjr-es57-register-file-ssot-migration]] の分割8。一覧が生成物となり追跡対象から外れることで、台帳全体の変更を1ファイルの差分で追えなくなる。これは [[prj-0001:pjr-9y7g-register-item-file-as-ssot]] で選択肢 B の懸念として挙げた点であり、成立条件として代替手段を決めることが求められている。"
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: _TODO_
        - field: registered
          from: ""
          to: _TODO_
        - field: due
          from: ""
          to: _TODO_
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: ed4a5ebd78cf5d5c024951e1eb834e5a78317135
    - v: 1
      id: reg_032bf4bf345a6600eacaba2774116464
      ts: "2026-08-09T10:55:22Z"
      action: update
      actor: SpecDojo Test
      from_status: open
      to_status: open
      reason: "exec(register PJR-9P5Q): 既存登録項目を個票 frontmatter へ一括移行する"
      changes:
        - field: description
          from: "[[prj-0001:pjr-es57-register-file-ssot-migration]] の分割8。一覧が生成物となり追跡対象から外れることで、台帳全体の変更を1ファイルの差分で追えなくなる。これは [[prj-0001:pjr-9y7g-register-item-file-as-ssot]] で選択肢 B の懸念として挙げた点であり、成立条件として代替手段を決めることが求められている。"
          to: PJR-ES57 の分割8。一覧が非追跡になることで失われる台帳全体の差分レビューについて、代替手段を決めて運用ガイドへ反映する。
        - field: priority
          from: medium
          to: high
        - field: owner
          from: _TODO_
          to: ARC
        - field: due
          from: _TODO_
          to: "2026-08-31"
      legacy_commit: dbac152079df02ec9bbad154a3253c043e10655a
      previous_event_id: reg_e87284967b23cb726e171ebf2dfd0af8
    - v: 1
      id: reg_69f665f86c4dbab67f8da58810f9af1d
      ts: "2026-08-09T11:42:45Z"
      action: start
      actor: SpecDojo Test
      from_status: open
      to_status: in-progress
      reason: "exec(register PJR-GH26): start"
      changes:
        - field: status
          from: open
          to: in-progress
      legacy_commit: 53cc1d3a2f766d36ef108e4752c77de17aead0fb
      previous_event_id: reg_032bf4bf345a6600eacaba2774116464
    - v: 1
      id: reg_75c1feddc9a44f64ad2a78573cf7091c
      ts: "2026-08-09T11:55:55Z"
      action: review
      actor: SpecDojo Test
      from_status: in-progress
      to_status: review
      reason: "exec(register PJR-GH26): review"
      changes:
        - field: status
          from: in-progress
          to: review
      legacy_commit: 5801cc1f258dbd6c43742c217e68fa363f1dae00
      previous_event_id: reg_69f665f86c4dbab67f8da58810f9af1d
    - v: 1
      id: reg_1a38c773576116c079dd02d9fa8af2a9
      ts: "2026-08-09T11:58:09Z"
      action: close
      actor: SpecDojo Test
      from_status: review
      to_status: done
      reason: "docs(prj-0001): close PJR-GH26"
      changes:
        - field: status
          from: review
          to: done
      legacy_commit: 41366b07cc873bec9fafc54092e3ffd4fab23e64
      previous_event_id: reg_75c1feddc9a44f64ad2a78573cf7091c
    - v: 1
      id: reg_a6d94610c53adc719c1c5a9803532956
      ts: "2026-08-09T14:39:40Z"
      action: update
      actor: SpecDojo Test
      from_status: done
      to_status: done
      reason: "exec(register PJR-EQAQ): 登録簿日時をregistered_at・completed_atへ移行する"
      changes:
        - field: registered
          from: _TODO_
          to: "2026-08-09"
        - field: completed
          from: "-"
          to: "2026-08-09"
      legacy_commit: 38201bef867f3cc1454db6b748fc979ed3f2fa8f
      previous_event_id: reg_1a38c773576116c079dd02d9fa8af2a9
---

# PJR-GH26 台帳の差分レビュー代替手段を決めて実装する

## 1. 概要

PJR-ES57 の分割8。一覧が非追跡になることで失われる台帳全体の差分レビューについて、代替手段を決めて運用ガイドへ反映する。

[[prj-0001:pjr-es57-register-file-ssot-migration]] の分割8。一覧が生成物となり追跡対象から外れることで、台帳全体の変更を1ファイルの差分で追えなくなる。これは [[prj-0001:pjr-9y7g-register-item-file-as-ssot]] で選択肢 B の懸念として挙げた点であり、成立条件として代替手段を決めることが求められている。

## 2. 完了条件

- 台帳の変更を確認する手段が決まっている。個票の履歴で追う、pull request で frontmatter 差分を確認する、一覧表示コマンドを用意する等の選択肢が比較されている。
- 選定した手段が実装または運用手順として整備されている。
- 手段が [[specdojo:register-operation-guide]] へ記載され、いつ何を見れば台帳の変化を追えるかが分かる。
- 監査時に、ある期間の登録項目の追加・状態遷移を再構成できる。

## 3. 作業内容

| No  | 作業                                 | 担当 | 状態 | メモ                                                                              |
| --- | ------------------------------------ | ---- | ---- | --------------------------------------------------------------------------------- |
| 1   | 代替手段の選択肢を洗い出して比較する | ARC  | done | 個票履歴 / PR 差分 / 一覧表示コマンドを、確認の容易さ・実装コスト・監査耐性で比較 |
| 2   | 採用する手段を決める                 | ARC  | done | 3 手段の役割分担（用途別の併用）を採用。単独案は監査要件を満たさない              |
| 3   | 実装または運用手順を整備する         | ARC  | done | `register history` を CLI へ追加（`src/register-history.ts`）                     |
| 4   | 運用ガイドへ反映する                 | ARC  | done | [[specdojo:register-operation-guide]] に「台帳の変更を追う」を追加                |

## 4. 対応結果

- 代替手段の選択肢を次の観点で比較した。

| 選択肢                                        | 確認の容易さ                                                  | 実装コスト                         | 監査への耐性                                                        |
| --------------------------------------------- | ------------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------- |
| A. 個票の Git 履歴を直接読む（`git log -p`）  | 1項目の経緯は追いやすいが、台帳全体は項目数だけコマンドが要る | 不要                               | 生データとしては完全だが、期間内の全項目の再構成は手作業になる      |
| B. pull request で個票 Frontmatter 差分を見る | 変更単位でまとまり、レビューには最適                          | 不要（既存の PR 運用）             | PR を経ない直接 commit を取りこぼす。過去期間の遡及集計に向かない   |
| C. 一覧表示コマンド（`register history`）     | 期間・項目・種別で絞って1行1イベントで読める                  | 中（新規モジュールとテストが必要） | 期間指定で追加・状態遷移を機械的に再構成でき、JSON で証跡化もできる |

- 単独では完了条件（監査時に、ある期間の登録項目の追加・状態遷移を再構成できる）を満たす選択肢が無いため、用途別に3手段を併用する形を採用した。台帳全体の把握と監査は C、変更の妥当性レビューは B、1項目の深掘りは A とし、役割分担を運用ガイドへ明記した。
- C を実装した。`specdojo register history` は登録簿ディレクトリの Git 履歴（`git log --reverse --name-status`）を走査し、各コミット時点と親コミット時点の個票 Frontmatter を比較して、項目単位の `added` / `updated` / `removed` を古い順に出力する。比較対象は生成一覧の列（ステータス・タイトル・説明・分類・優先度・担当・登録日・期限・完了日・結論）に揃えたため、表を正本にしていた時期の一覧差分と同じ粒度になる。
- 監査用途に `--since` / `--until`（期間、当日を含む）、`--id`（項目の限定）、`--status-only`（追加・削除・状態遷移のみ）、`--limit`（走査コミット数の上限）、`--json`（機械可読出力）を用意した。`--status-only` は変更内容も遷移に関わる項目（`status` / `type` / `completed` / `conclusion`）へ絞り、本文推敲の差分を落とす。
- `renumber` による ID 付け替えは、フィールド値が変わらず rename としてのみ現れるため、`id` の変更として明示的にイベント化した。生成物（`generated/` 配下）と個票以外のファイルは対象外とした。
- 実装は純粋関数（ログ解析・差分生成・整形）と Git 呼び出しを分離し、`tests/src/register-history.test.ts` で追加・状態遷移・本文のみの変更・renumber・削除・絞り込み・整形を検証した。
- 運用ガイドに「台帳の変更を追う」を追加し、目的別の手段、コマンド例、出力の読み方、個票化前（`pjr-index.md` が正本だった期間）の履歴の参照方法を記載した。CLI リファレンスにも `register history` とオプションを追加した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-es57-register-file-ssot-migration]]: 分割元の移行タスク
- [[prj-0001:pjr-9y7g-register-item-file-as-ssot]]: 代替手段の決定を成立条件とした決定
- [[prj-0001:pjr-rzr3-pjr-index-as-generated-view]]: 一覧が非追跡になる変更
- [[prj-0001:pjr-1d0c-pjr-index-wikilink-broken]]: 同じくRZR3/9P5Qで一覧が非追跡になったことに起因する別問題（wikilink解決）。本項目の対応方針検討時に候補として参照したが、`register history` はwikilink解決を代替しないため対象外とした
- [[specdojo:register-operation-guide]]: 反映先の運用手順
