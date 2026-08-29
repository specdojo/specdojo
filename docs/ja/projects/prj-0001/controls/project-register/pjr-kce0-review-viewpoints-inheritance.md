---
specdojo:
  id: prj-0001:pjr-kce0-review-viewpoints-inheritance
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-29T08:08:04Z"
  due_on: "2026-09-30"
  completed_at: "2026-08-29T09:04:05Z"
  conclusion: 共通レビュー観点を specdojo:pm-review-viewpoints として docs/ja/specdojo/defaults/ に正本化し、プロジェクトは extends による1段継承と差分宣言のみを保持する構成へ移行した。kata 用観点 vp-qe-kata-conformance を共通側へ新設し、prj-0001 の固有差分はすべて共通へ昇格した。共通正本の更新は再生成なしで次回の plan 生成へ反映される。
  register_events:
    - v: 1
      id: reg_343dd24b21b544e7b3ba1135865d6584
      ts: "2026-08-29T08:08:05Z"
      action: add
      actor: manual
      from_status: null
      to_status: open
      reason: item added
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: レビュー観点を共通集合として定義しプロジェクトが継承する仕組みへ移行する
        - field: description
          from: ""
          to: レビュー観点は本来プロジェクト横断で共通だが、exec scaffold が pm-review-viewpoints-template.yaml をプロジェクトへコピーする方式のため、コピー後に両者が独立して分岐する。実際に prj-0001 は 25 観点、template は 24 観点で本文差分は 97 行あり、prj-0001 が独自追加した vp-qe-config-validity は汎用的な観点でありながら共通へ還元される経路がない。共通の観点集合を正本とし、プロジェクトは差分（追加・上書き・無効化）だけを宣言して継承する仕組みへ移行する。kata 用の観点は特定プロジェクトに属さないため共通側へ置く。既存の差分は共通へ昇格するものとプロジェクト固有として残すものへ仕分ける。
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: "2026-08-29"
        - field: due
          from: ""
          to: "2026-09-30"
    - v: 1
      id: reg_7ad1d485a6534651add67964649d74dc
      ts: "2026-08-29T08:17:36Z"
      action: start
      actor: codex-expert-executor
      from_status: open
      to_status: in-progress
      reason: work started
      changes:
        - field: status
          from: open
          to: in-progress
      previous_event_id: reg_343dd24b21b544e7b3ba1135865d6584
    - v: 1
      id: reg_4c9d3d27176f46fe8be63318597dcc86
      ts: "2026-08-29T08:31:43Z"
      action: review
      actor: codex-expert-executor
      from_status: in-progress
      to_status: review
      reason: ready for review
      changes:
        - field: status
          from: in-progress
          to: review
      previous_event_id: reg_7ad1d485a6534651add67964649d74dc
    - v: 1
      id: reg_102d513953b24950a3ce5f4173f90b3e
      ts: "2026-08-29T09:04:05Z"
      action: close
      actor: manual
      from_status: review
      to_status: done
      reason: 実装とレビューが完了し、配置の見直しと決定事項の記録を反映したため
      changes:
        - field: status
          from: review
          to: done
        - field: completed
          from: "-"
          to: "2026-08-29"
        - field: conclusion
          from: "-"
          to: 共通レビュー観点を specdojo:pm-review-viewpoints として docs/ja/specdojo/defaults/ に正本化し、プロジェクトは extends による1段継承と差分宣言のみを保持する構成へ移行した。kata 用観点 vp-qe-kata-conformance を共通側へ新設し、prj-0001 の固有差分はすべて共通へ昇格した。共通正本の更新は再生成なしで次回の plan 生成へ反映される。
      previous_event_id: reg_4c9d3d27176f46fe8be63318597dcc86
---

# PJR-KCE0 レビュー観点を共通集合として定義しプロジェクトが継承する仕組みへ移行する

## 1. 概要

レビュー観点は本来プロジェクト横断で共通であり、プロジェクト固有なのは例外的な追加分だけである。しかし現在の `exec scaffold` は `pm-review-viewpoints-template.yaml` をプロジェクトへコピーする方式であり、コピー後は共通ひな形とプロジェクト側が独立して変化する。

その結果、共通側を改善してもプロジェクトへ届かず、プロジェクトでの改善も共通へ還元されない。実際に分岐が発生している。

共通の観点集合を正本とし、プロジェクトは差分だけを宣言して継承する仕組みへ移行する。あわせて kata 用の観点を共通側へ置く場所を確保する。

## 2. 完了条件

- 共通の観点集合が正本として定義され、その置き場所が決まっている。
- プロジェクトが追加・上書き・無効化を差分として宣言でき、解決順序が定義されている。
- kata 用の観点が共通側に置かれている。
- 既存の prj-0001 の差分が、共通へ昇格するものとプロジェクト固有として残すものへ仕分けられている。
- 共通側の観点を更新すると、継承しているプロジェクトへ反映される。
- 独自ロールを持つプロジェクトでの扱いが定義されている。
- review plan の生成が新しい解決経路で動作する。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                           | 担当 | 状態 | メモ                                           |
| --- | ------------------------------ | ---- | ---- | ---------------------------------------------- |
| 1   | 共通観点集合の置き場所の決定   | ARC  | done | `standards/pm-review-viewpoints.yaml` を正本化 |
| 2   | 継承の宣言方法と解決順序の設計 | ARC  | done | 1段継承、upsert 後に無効化                     |
| 3   | role 依存の扱いの決定          | ARC  | done | 標準ロールを継承し、独自ロールは差分へ追加     |
| 4   | 既存差分の仕分け               | ARC  | done | prj-0001 の差分はすべて共通へ昇格              |
| 5   | 解決処理の実装                 | DEV  | done | review plan の読み込み経路へ接続               |
| 6   | scaffold の見直し              | DEV  | done | 全量コピーから空の差分ファイル生成へ変更       |
| 7   | 規範文書の更新                 | ARC  | done | review-guide、command-reference、初期化 DFD    |

### 3.1. 分岐の実態

現状を計測した結果は次のとおりである。

| 対象                                                            | viewpoint 数 |
| --------------------------------------------------------------- | ------------ |
| `docs/ja/specdojo/templates/pm-review-viewpoints-template.yaml` | 24           |
| prj-0001 の `pm-review-viewpoints.yaml`                         | 25           |

本文の差分は 97 行ある。prj-0001 が独自に追加した `vp-qe-config-validity`（設定の妥当性）は、内容としてはプロジェクト固有ではなく汎用的な観点であるが、共通へ還元する経路がないためプロジェクト側に留まっている。継承の仕組みがあれば、共通へ昇格させる判断を明示的に行える。

### 3.2. 継承の設計要素

| 要素             | 内容                                                                   |
| ---------------- | ---------------------------------------------------------------------- |
| 正本の位置       | SpecDojo 側の共通観点集合。現ひな形をコピー元から継承元へ役割変更する  |
| プロジェクト宣言 | 差分のみを記述する。追加・上書き・無効化                               |
| 解決順序         | 共通を先に読み、プロジェクトの宣言で上書きする                         |
| kata 用観点      | 共通側にのみ置く。kata は特定プロジェクトに属さないため                |
| role 依存        | 共通観点は標準ロールを前提とする。独自ロールを持つ場合の対応を定義する |

rulebook の `includes`（併せて適用する rulebook の ID 配列、単一段のみ）が前例となる。多段継承を避ける方針もあわせて踏襲する。

### 3.3. 移行時の注意

既存の prj-0001 の観点定義に手を入れることになるため、review の実運用に影響する。仕分けの結果として観点 ID が変わると、過去の review result に記録された観点 ID との対応が取れなくなる。ID は原則として変えず、所属（共通かプロジェクトか）だけを移す。

`execution` 配下の plan / result は過去の記録であり書き換えない。

### 3.4. 決定事項

起票時に未決としていた論点は、実施を通じて次のとおり決着した。

- 共通観点集合は成果物として扱う。文書 ID `specdojo:pm-review-viewpoints` を持ち、表示ページの生成と参照の対象とする。設定として `.specdojo/` 配下へ置く案は採らない。
- プロジェクトによる共通観点の無効化は `disabled` で明示的に宣言した場合のみ許す。同じキーの上書きと無効化の同時指定、および存在しないキーの無効化はエラーとする。無効化を暗黙に行えないため、品質基準の乖離は宣言として可視化される。
- 共通観点を更新しても、既にレビュー済みの成果物へ遡及適用しない。次回のレビュー時から新しい観点が適用される。共通正本の更新はプロジェクトファイルの再生成なしに次回の plan 生成へ反映されるため、routine による定期実行の中で自然に反映される。

### 3.5. 配置の見直し

実装時は共通正本を `docs/ja/specdojo/standards/` へ置いたが、`standard-authoring-standard` は standards の適用範囲を「配下のすべての `*-standard.md`」と定義しており、YAML は適用範囲外の異物となる。

そのため `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml` へ移した。SpecDojo には `.specdojo/exec-defaults.yaml` があり、既定値をプロジェクトが上書きするという概念が既に確立している。`extends` と差分上書きの関係はこれと一致する。規範文書からの参照は wikilink であり文書 ID に依存するため、移動による参照の修正は生じていない。

## 4. 対応結果

- 共通正本を `docs/ja/specdojo/standards/pm-review-viewpoints.yaml` に定め、従来の template をコピー元ではなく実行時の継承元へ移行した。共通正本の ID は `specdojo:pm-review-viewpoints` とし、多段継承は許可しない。
- プロジェクト差分は `extends` を必須とし、各配列の同名 `id`（`role_viewpoint_sets` は `role`）を全体上書き、新しいキーを追加として扱う。`disabled` は upsert 後に適用し、同じキーの upsert と無効化、存在しないキーの無効化をエラーにした。
- prj-0001 で変更されていた目的整合、業務価値、抜け漏れ観点と `vp-qe-config-validity` はプロジェクト固有ではないため、すべて共通正本へ昇格した。prj-0001 の差分ファイルには固有項目を残していない。
- kata は特定プロジェクトに属さないため、共通正本へ `vp-qe-kata-conformance` を追加した。rulebook、recipe、sample、template の責務、相互参照、対象成果物への適用整合を確認する。
- 標準ロールは従来の8種を維持し、独自ロールは `pm-roles.yaml` に定義した大文字 Role code と、対応する viewpoint / role viewpoint set をプロジェクト差分へ追加できるよう schema と解決検査を拡張した。
- `review plan` はプロジェクトファイルを直接読むのではなく、共通正本と差分の解決結果から viewpoint と coverage type を展開する。`extends` のない既存の全量ファイルは互換入力として維持した。
- `exec scaffold` は共通内容をコピーせず、空の差分宣言を生成する。したがって共通正本の更新は、プロジェクトファイルの再生成なしで次回の plan 生成へ反映される。
- 共通正本の配置は実装後のレビューで `docs/ja/specdojo/defaults/` へ移した。standards は `*-standard.md` を適用範囲とする規範文書のディレクトリであり、YAML の正本を置く場所ではない。
- 共通観点の更新は既レビュー成果物へ遡及適用せず、次回レビュー時から適用する。routine による定期実行の中で反映される。

## 5. 関連ドキュメント

- [[prj-0001:pjr-49d2-quality-assessment]]: 観点の正本が定まっていることを前提とする品質評価の TODO。
- [[specdojo:review-guide]]: レビュー観点の運用と review plan の生成経路。
- [[specdojo:command-reference]]: scaffold の挙動変更の記載先。
- [[specdojo:pm-review-viewpoints]]: プロジェクト横断のレビュー観点の共通正本。
