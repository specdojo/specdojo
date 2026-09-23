---
specdojo:
  id: prj-0001:pjr-9rwg-register-events-separation
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-31T22:34:14Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-01T00:10:52Z"
  conclusion: register のイベントを個票の Frontmatter から controls/project-register/events/ へ項目ごとのファイルとして分離した。285 件すべてを移行し、個票からは register_events が消えている。PJR-AKJ4 では個票が 251 行から 95 行、Frontmatter が 174 行から 18 行になった。ファイル名は topic を含めず pjr-xxxx.yaml とし、register update --topic での追随を不要にしている。
---

# PJR-9RWG register のイベントを個票の Frontmatter から分離する

## 1. 概要

`register_events` が個票の Frontmatter を肥大化させている。イベントは状態遷移のたびに増えるため、比率は悪化し続ける。

| 個票     | 全体   | Frontmatter | うちイベント | 本文   |
| -------- | ------ | ----------- | ------------ | ------ |
| PJR-AKJ4 | 251 行 | 174 行      | 156 行       | 77 行  |
| PJR-49D2 | 360 行 | 113 行      | 95 行        | 247 行 |
| PJR-VQB5 | 340 行 | 65 行       | 50 行        | 275 行 |

PJR-AKJ4 では Frontmatter の 9 割がイベントで、本文の 2 倍にあたる。

状態遷移のたびに個票が変更されるため、本文の修正とイベントの追記が同じ差分に現れる。レビューで両者を区別しにくい。

`controls/project-register/events/` へ項目ごとに 1 ファイルとして分離する。

## 2. 完了条件

- イベントが個票の Frontmatter から分離され、項目ごとのファイルに保存される。
- 個票の Frontmatter には現在値だけが残る。
- `register build` が個票とイベントファイルの整合を検証する。
- 状態遷移で個票の本文と Frontmatter が変わらない。
- 既存の全項目のイベントが移行されている。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業               | 担当 | 状態 | メモ                                              |
| --- | ------------------ | ---- | ---- | ------------------------------------------------- |
| 1   | 配置と形式の決定   | ARC  | done | `events/pjr-XXXX.yaml` の YAML 配列               |
| 2   | 整合検証の設計     | ARC  | done | 1 対 1 対応、連鎖、最新状態と個票の一致を検証     |
| 3   | 実装               | ARC  | done | 読み書き、履歴表示、runner 対象、`register build` |
| 4   | 既存イベントの移行 | ARC  | done | 285 項目、864 イベントを抽出して分離              |
| 5   | 規範文書の更新     | ARC  | done | rulebook、運用ガイド、参照文書、schema を更新     |

### 3.1. 既存の設計判断との関係

`pjr-rulebook` は次のとおり定めている。

> イベントは個票ごとの配列へ古い順に追記する。項目ごとの配置により、イベントごとの追加ファイルを作らず、異なる項目を並行更新したときの共有ログ競合を避ける。

避けたいのは共有ログの競合であり、これは全項目のイベントを 1 ファイルへ集約する形を否定したものである。項目ごとにファイルを分ければ競合は生じない。設計意図は維持される。

### 3.2. exec と粒度を変える理由

`exec` はイベント単位でファイルを分けており、606 ファイルに達している。register で同じ粒度にすると 300 ファイルを超える。

register の状態遷移は項目あたり数個から十数個であり、同一項目を並行して更新することもほぼない。項目ごとに 1 ファイルとすれば、その項目の履歴を 1 ファイルで通読できる。

将来イベントが増えて 1 ファイルが肥大化した場合は、その時点でイベント単位へ分ければよい。最初から細かく分ける必要はない。

### 3.3. ファイル名に topic を含めない

`register update --topic` で topic を変更したときに、イベントファイルまで追随させる必要がなくなる。個票のファイル名は `pjr-<NNNN>-<topic>.md` だが、イベントファイルは `pjr-<NNNN>` だけで識別する。

### 3.4. 設計判断

- 形式は、既存の `register_events` を無変換で移せる YAML 配列とした。各ファイルは `register-events.schema.yaml` の modeline を持つ。
- `register build` は個票とイベントファイルの 1 対 1 対応を要求し、孤立・欠落ファイル、イベント連鎖、最新イベントの状態と個票の `item_status` の不一致を検出する。
- 個票を削除する場合はイベントファイルだけを残さず、同じ変更で扱う。孤立したイベントファイルは `register build` が拒否する。
- register event は増え続ける監査履歴なので分離する。grade は評価の現在値であり、現在値を保持する Frontmatter に置く。

## 4. 対応結果

- 個票 Frontmatter から `register_events` を除去し、`controls/project-register/events/pjr-XXXX.yaml` へ項目単位で分離した。ファイル名に topic を含めないため、`register update --topic` ではイベントファイルを改名しない。
- `register add`、状態遷移、更新、topic 変更、再採番、Git 履歴移行が項目別イベントファイルを読み書きするよう変更した。exec runner の register 状態コミットもイベントファイルを対象に含める。
- `register build` は個票とイベントファイルの対応、schema、イベント ID、時刻・直前参照・状態連鎖、最新イベントの状態と個票の `item_status` を検証する。
- 既存 285 項目の 864 イベントを移行した。個票には現在値だけが残り、本文変更とイベント追記の差分が分離された。

## 5. 関連ドキュメント

- [[specdojo:pjr-rulebook]]: イベントの配置と検証に関する規約。
- [[prj-0001:pjr-21e8-grade-frontmatter-flow-style]]: Frontmatter の肥大化という同種の問題。方針の違いを説明する。
- [[prj-0001:pjr-2kpn-register-update-topic]]: topic の変更。ファイル名に topic を含めない理由。
