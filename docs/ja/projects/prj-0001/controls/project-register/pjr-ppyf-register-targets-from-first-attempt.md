---
specdojo:
  id: prj-0001:pjr-ppyf-register-targets-from-first-attempt
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-09-26T13:04:17Z"
---

# PJR-PPYF targets を宣言しない register 項目でも 1 回目の変更集合を下限として網羅を検証する

## 1. 概要

[[prj-0001:pjr-6wfa-register-plan-targets]] で、個票が `targets` を宣言すれば register 由来の plan でも網羅の検証が働くようにした。**宣言しない個票は、引き続き検証されない。** 1 回目の実行で変更されたファイルを下限として記録し、resume のときに「少なくともこれらは確認せよ」と使えるようにする。

## 2. 事実

### 2.1. 宣言しない個票が多い

`targets` は任意であり、`pjr-rulebook` は「確実に変更する対象が分かっている場合」に宣言するとしている。起票の時点で対象が決まらない項目（調査を伴う todo、実装の範囲が実行中に決まる項目）は宣言されない。

### 2.2. 発端の事象は宣言なしでも起きうる

[[prj-0001:pjr-xzeq-cdfd-overview-cdfd-check-cdfd-action-grade-review]] は、3 文書のうち 1 文書だけを変更した状態で rate limit により中断し、resume 後に残りへ着手しないまま成功扱いになった。個票に `targets` がなければ、同じ事象は今も検出できない。

### 2.3. 手がかりはすでにある

[[prj-0001:pjr-1y9p-resume-executor-plan]] は、resume したときに「開始時点ですでに存在した変更」の一覧を executor への指示に含めている。これは情報として渡すだけで、検証には使っていない。

[[prj-0001:pjr-6wfa-register-plan-targets]] の executor は、案 3 を「evidence 構造の変更と再設計を要する」として見送った。

## 3. 完了条件

- `targets` を宣言しない register 項目で、1 回目の実行の変更集合が evidence または pipeline 状態に記録される。
- resume のとき、記録した変更集合を下限として扱う。下限に含まれる対象について、再開後の executor が `changed` または `unchanged`（理由付き）を申告する。
- 下限は不完全でありうることが、executor への指示とガイドに記載されている。上限としては扱わない。
- `targets` を宣言した項目では、宣言を優先する。
- 中断しなかった実行では何も変わらない。
- PJR-XZEQ と同じ状況（1 文書だけ変更して中断し、resume）を再現するテストで、残りの未着手が検出される。
- `npm run test:unit` と `npm run test:integration` が通過している。

## 4. 作業内容

| No  | 作業                            | 担当 | 状態 | メモ                                                     |
| --- | ------------------------------- | ---- | ---- | -------------------------------------------------------- |
| 1   | 変更集合の記録先を決める        | ARC  | done | executor evidence の `attempt_changes` に記録する        |
| 2   | 記録を実装する                  | DEV  | done | executor 開始前後の fingerprint を比較する               |
| 3   | resume 時の下限の扱いを実装する | DEV  | done | 1Y9P の `target_coverage` 検証へ統合した                 |
| 4   | 再現テストを追加する            | DEV  | done | 宣言なし・rate limit・申告欠落を register E2E で再現した |

## 5. 対応結果

- executor の開始前後にある worktree 差分の fingerprint を比較し、その試行で実質的に変更されたファイルだけを evidence の `attempt_changes` へ記録するようにした。register の状態遷移など、executor 開始前から存在する差分は含めない。
- `targets` を宣言しない register 項目の executor を再開するとき、最初に記録された `attempt_changes` を target coverage の下限として prompt と runner 検証へ渡すようにした。複数回中断しても最初の集合を維持する。
- 下限は不完全であり作業範囲の上限ではないこと、plan 全体と下限外の必要成果物も確認することを executor 指示と [[specdojo:exec-operation-guide]] に明記した。
- plan に `targets` がある場合は宣言を優先し、初回変更集合へ切り替えない。
- 宣言なしの register executor が 1 ファイルを変更して rate limit で中断し、再開後に `target_coverage` を申告せず成功を返すケースを E2E テストへ追加した。runner が executor を `failed` にして reporter へ進めないことを検証する。
- evidence 読み込み、初回集合の保持、宣言済み `targets` の優先、schema-valid な `attempt_changes` を単体テストへ追加した。

## 6. 関連ドキュメント

- [[prj-0001:pjr-6wfa-register-plan-targets]]
- [[prj-0001:pjr-1y9p-resume-executor-plan]]
- [[prj-0001:pjr-xzeq-cdfd-overview-cdfd-check-cdfd-action-grade-review]]
- [[prj-0001:pjr-tdb0-task-resume-rate-limit-executor]]
