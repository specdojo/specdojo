---
specdojo:
  id: prj-0001:pjr-gqfx-todo-marker-false-positive-in-inline-code
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-09T02:12:43Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-09T12:16:54Z"
  register_events:
    - v: 1
      id: reg_fdfb032416381060c878f3fb55d14425
      ts: "2026-08-09T02:12:43Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs(prj-0001): add PJR-ES57, PJR-GQFX, PJR-BJ97"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: register close の未記入 _TODO_ 検出がインラインコード内の文字列を誤検出する
        - field: description
          from: ""
          to: register の状態遷移時に個票を `ready` へ昇格させる判定が、本文にプレースホルダが残っているかを文字列の単純包含で判断しているため、インラインコードやコードブロック内に記述した記法の説明までプレースホルダとみなす。
        - field: type
          from: ""
          to: issue
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
      legacy_commit: 3f1be811234eaf5d52ea68370d0ed906d7f01245
    - v: 1
      id: reg_dc39508b07b66b9e0c11ec9e166114f7
      ts: "2026-08-09T10:55:22Z"
      action: update
      actor: SpecDojo Test
      from_status: open
      to_status: open
      reason: "exec(register PJR-9P5Q): 既存登録項目を個票 frontmatter へ一括移行する"
      changes:
        - field: description
          from: register の状態遷移時に個票を `ready` へ昇格させる判定が、本文にプレースホルダが残っているかを文字列の単純包含で判断しているため、インラインコードやコードブロック内に記述した記法の説明までプレースホルダとみなす。
          to: 個票本文でインラインコードとして記述した _TODO_ を未記入欄と誤判定し、close 時に個票が ready へ昇格しない。
        - field: owner
          from: _TODO_
          to: ARC
        - field: due
          from: _TODO_
          to: "2026-08-31"
      legacy_commit: dbac152079df02ec9bbad154a3253c043e10655a
      previous_event_id: reg_fdfb032416381060c878f3fb55d14425
    - v: 1
      id: reg_4cdbebf2eb25a70561ec516c0cd83dad
      ts: "2026-08-09T12:06:50Z"
      action: start
      actor: SpecDojo Test
      from_status: open
      to_status: in-progress
      reason: "exec(register PJR-GQFX): start"
      changes:
        - field: status
          from: open
          to: in-progress
      legacy_commit: 11088da0cd22c3cb57d08522a7906779d53806a7
      previous_event_id: reg_dc39508b07b66b9e0c11ec9e166114f7
    - v: 1
      id: reg_850063eef9210d0442889222d79b4b14
      ts: "2026-08-09T12:15:45Z"
      action: update
      actor: SpecDojo Test
      from_status: in-progress
      to_status: in-progress
      reason: "exec(register PJR-GQFX): register close の未記入 _TODO_ 検出がインラインコード内の文字列を誤検出する"
      changes:
        - field: title
          from: register close の未記入 _TODO_ 検出がインラインコード内の文字列を誤検出する
          to: register close の未記入 `_TODO_` 検出がインラインコード内の文字列を誤検出する
        - field: description
          from: 個票本文でインラインコードとして記述した _TODO_ を未記入欄と誤判定し、close 時に個票が ready へ昇格しない。
          to: 個票本文でインラインコードとして記述した `_TODO_` を未記入欄と誤判定し、close 時に個票が ready へ昇格しない。
      legacy_commit: 8ebe0391cb2e6fa520496b70ef60dc37a81bbb15
      previous_event_id: reg_4cdbebf2eb25a70561ec516c0cd83dad
    - v: 1
      id: reg_34be0a514b654b5abd7207e5c2dd208e
      ts: "2026-08-09T12:16:13Z"
      action: review
      actor: SpecDojo Test
      from_status: in-progress
      to_status: review
      reason: "exec(register PJR-GQFX): review"
      changes:
        - field: status
          from: in-progress
          to: review
      legacy_commit: 06448d1450960a8c569b27a3583a6011e7e33c8c
      previous_event_id: reg_850063eef9210d0442889222d79b4b14
    - v: 1
      id: reg_7c2440aca1dc404b2ad0477aea7dcd7f
      ts: "2026-08-09T12:16:54Z"
      action: close
      actor: SpecDojo Test
      from_status: review
      to_status: done
      reason: "docs(prj-0001): close PJR-GQFX"
      changes:
        - field: status
          from: review
          to: done
      legacy_commit: c209fa779e09794e2a6288d485f29adcc92381df
      previous_event_id: reg_34be0a514b654b5abd7207e5c2dd208e
    - v: 1
      id: reg_3d54b8c6c65c1d98cc69f7dfefba5853
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
      previous_event_id: reg_7c2440aca1dc404b2ad0477aea7dcd7f
---

# PJR-GQFX register close の未記入 `_TODO_` 検出がインラインコード内の文字列を誤検出する

## 1. 課題内容

個票本文でインラインコードとして記述した `_TODO_` を未記入欄と誤判定し、close 時に個票が ready へ昇格しない。

register の状態遷移時に個票を `ready` へ昇格させる判定が、本文にプレースホルダが残っているかを文字列の単純包含で判断しているため、インラインコードやコードブロック内に記述した記法の説明までプレースホルダとみなす。

- 発生日: 2026-08-09
- 発生状況: `specdojo register close --project prj-0001 --id PJR-9Y7G` の実行時に `Warning: PJR-9Y7G ticket has unresolved _TODO_; kept as draft (not promoted to ready)` が出力された。
- 実際の内容: 当該個票に未記入欄は残っていなかった。検出されたのは本文中でプレースホルダ記法そのものを説明するために書いたインラインコードの文字列だった。
- 暫定回避: 当該箇所の文言を言い換えて検出を回避した。記述内容としては、記法の説明を書けない制約が残っている。

## 2. 影響範囲

| 観点         | 影響                                                                                      |
| ------------ | ----------------------------------------------------------------------------------------- |
| スコープ     | 記法やテンプレートを説明する内容を含む個票が `ready` へ昇格しない                         |
| スケジュール | 影響は小さい。回避のための文言修正が都度発生する                                          |
| コスト       | 影響は小さい                                                                              |
| 品質         | 個票の文書成熟度（frontmatter の `status`）が実態と乖離する。記述内容に不要な制約がかかる |
| 関係者       | 登録簿を運用する全ロール                                                                  |

## 3. 対応方針

| 項目     | 内容                                                                                                                              |
| -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `src/register.ts` の `ticketBodyHasTodo` が本文全体に対する文字列包含判定のみで、インラインコードとコードブロックを除外していない |
| 対応策   | 判定をコード範囲を除外した走査へ変更する。Markdown の構文解析、またはコード範囲を除去してから判定する方式を検討する               |
| 依存事項 | [[prj-0001:pjr-es57-register-file-ssot-migration]] で個票 frontmatter を正本化する場合、昇格判定の位置づけが変わる可能性がある    |
| 完了条件 | インラインコードおよびコードブロック内のプレースホルダ文字列を未記入とみなさず、本文の未記入欄のみを検出する。回帰テストがある    |

## 4. 対応結果

- `src/register.ts` の未記入判定を、個票本文から Markdown のインラインコードとフェンスコードを除外してから `_TODO_` を検索する方式へ変更した。
- バッククォートの長さが対応するインラインコードと、バッククォート・チルダのフェンスコードを判定対象外にした。コード範囲外の `_TODO_` は従来どおり未記入として検出する。
- `tests/src/register.test.ts` に、インラインコード、2 種類のフェンスコード、およびコード範囲外にも未記入が残る場合の回帰テストを追加した。

## 5. 関連ドキュメント

- [[specdojo:register-operation-guide]]: 個票 status の遷移に関する運用手順
- [[specdojo:pjr-rulebook]]: 個票 status の遷移基準
- [[prj-0001:pjr-9y7g-register-item-file-as-ssot]]: 事象が発生した個票
- [[prj-0001:pjr-es57-register-file-ssot-migration]]: 判定の位置づけに影響しうる移行作業
