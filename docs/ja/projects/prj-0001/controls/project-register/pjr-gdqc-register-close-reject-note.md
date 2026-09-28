---
specdojo:
  id: prj-0001:pjr-gdqc-register-close-reject-note
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: question
  item_status: decided
  priority: low
  owner: DEV
  registered_at: "2026-09-27T12:46:35Z"
  completed_at: "2026-09-28T15:27:36Z"
  conclusion: 候補 A。register close / reject / defer は note を拒否し、別の type での起票を案内する。実装は PJR-T2M6
---

# PJR-GDQC register close で note の終端を拒否するかを決める

## 1. 確認事項

`register close` などの終端操作で、type が `note` の項目を拒否するか。

## 2. 背景

`pjr-rulebook.md` は、`note` を終端させず `open` のまま追記し、`done` / `decided` / `rejected` / `deferred` へ遷移させないと定めている。一方、`register close` は type を区別しておらず（`src/register-item.ts` に `note` 固有の扱いがない）、`note` も `done` にできる。規則と CLI の間に強制の抜けがある。

PJR-ZFFZ で作成した `stsd-register-entry` は、この点を _UNDECIDED_（「`note` の終了を CLI で拒否するか」）として残している。2026-09-27 には、orchestrator が誤った定義（PJR-XW9M）を根拠に `note` 6 件を close 候補として示した。CLI が拒否していれば、誤って閉じる前に止まる。

## 3. 回答候補

| 候補 | 内容                                                                             | 利点                  | 懸念                                                         |
| ---- | -------------------------------------------------------------------------------- | --------------------- | ------------------------------------------------------------ |
| A    | `register close` / `reject` / `defer` が `note` を拒否し、別項目の起票を案内する | 規則が CLI で守られる | 過去に `note` を閉じた記録の扱いを決める必要がある           |
| B    | 拒否はせず、警告を出して続行する                                                 | 既存の運用を壊さない  | 規則違反が残り得る                                           |
| C    | CLI では扱わず、rulebook と運用ガイドに委ねる                                    | 変更が不要            | 規則と違う操作が、今回の orchestrator の誤りのように起き得る |

## 4. 回答・結論

候補 A を採る。`register close` / `reject` / `defer` は、type が `note` の項目を拒否し、対応や判断が必要なら目的に合う別の type で起票するよう案内する。

- 規則（`pjr-rulebook` の type 別の扱い）を CLI で強制する。2026-09-27 には、orchestrator が誤った定義を根拠に `note` 6 件を close 候補として示した。CLI が拒否していれば、閉じる前に止まる。
- 過去に `note` を終端させた記録があれば、その扱い（そのまま残すか、`open` へ戻すか）を実装の項目で確認して決める。
- 実装は別の todo で行う。

## 5. 承認

| 項目     | 内容                                                       |
| -------- | ---------------------------------------------------------- |
| 回答者   | PO                                                         |
| 回答日   | 2026-09-29                                                 |
| 承認方式 | commit                                                     |
| 証跡     | 本個票の回答を記録した commit（`docs(register PJR-GDQC)`） |

- 承認方式は既定で `commit`（`register close` により `decided` へ遷移）を用いる。
- 回答が不可逆・高リスク・framework schema 破壊的変更を伴う場合は `PR` 方式で承認し、証跡に PR URL と merge SHA を記載する。

## 6. 関連ドキュメント

- [[specdojo:pjr-rulebook]]
- [[prj-0001:stsd-register-entry]]
- PJR-ZFFZ、PJR-XW9M
