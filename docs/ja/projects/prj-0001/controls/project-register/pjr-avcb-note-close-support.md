---
specdojo:
  id: prj-0001:pjr-avcb-note-close-support
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  owner: DEV
  registered_at: "2026-11-28T07:20:46Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-CA6G
---

# PJR-AVCB note を done で close できるように rulebook と CLI を直す

## 1. 概要

PJR-CA6G の決定に沿って、register close で note を done にできるようにし、pjr-rulebook と登録簿運用ガイドとオーケストレーター本文の note の扱いを直す

## 2. 入力

- PJR-CA6G で note を done で close できるようにすると決めた（indie、2026-11-28）。rejected・deferred は note に使わない
- 今は src/register/update.ts が note の close を拒んでいる
- v0.10.0 に入れる。担当 DEV・期限 2026-11-30 は indie の指示（2026-11-28）

## 3. 完了条件

- PJR-CA6G の決定に沿って、`register close` で `item_type: note` を `done` にできるようにする。`--status` を省いたときの終端は `done` とし、`decided` など他の状態は拒む。
- `register reject` と `register defer` は、今と同じく note を終了コード 1 で拒む。案内の文言は「使い終わった note は `register close` で `done` にする」ことを示す形に直す。
- close した note は `register reopen` で `open` に戻せる。
- `register close` の note で `--conclusion` を必須にし、省くと終了コード 1 で拒む。conclusion には移した先または古くなった理由を書く旨を、エラーの文言に含める。
- `register build` の生成物で、done の note が `open` の一覧から外れ、ほかの type の done と同じ扱いになることを確かめる。
- 単体テストで、note の close（done）、`--status decided` の拒否、conclusion なしの拒否、reject・defer の拒否、reopen を確かめる。既存の「note は close できない」テストは新しい振る舞いに置き換える。
- 規範の文書を直す。対象は次の 3 つ（名前で書く）。
  - プロジェクト登録簿 作成ルール（pjr-rulebook）の item_type 別の終端基準の表と note の注記、例外的な追跡終了の前書き（note は close できるが rejected・deferred は使わない）。
  - 登録簿運用ガイドの、完了の表と、動いていない項目の整理の段落。
  - CLI コマンドリファレンスの register の note の段落。
- オーケストレーターの本文など保護された設定（`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`templates/` の配下のオーケストレーター本文を含む）は変えない。本文の type の表の note の終端状態と、note の扱いの段落の変更案を、個票の対応結果と報告の `handoff` に書く。
- 英語版の文書（`docs/en/`）に対応する文書があれば、同じ内容に直す。なければ何もしない。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run -s lint:md` を通し、親の検証を通す。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。

## 4. 作業内容

1. done: 終端の共通ガードで note の close を許可し、close では `done` と明示的な `--conclusion` を必須にした。
2. done: 単体テストを新しい close の振る舞いへ置き換え、不正入力・一覧生成・reopen の検証を追加した。再開時に比較用 todo のイベント履歴を補い、build 直後の成功と reopen 後の結論保持も検証するようにした。
3. done: 規範の文書 3 つと、対応する英語版 rulebook を更新した。ガイドとコマンドリファレンスには対応する英語版がない。
4. done: 保護されたオーケストレーター本文の変更案を 5.2 に記録した。
5. done: executor 担当の整形・検査を実施し、検証の分担と CHANGELOG の文案を対応結果に記録した。親検証は runner が後続で実行する。

## 5. 対応結果

### 5.1. 実施内容と判断

- `src/register/update.ts` で note の close を許可し、reject・defer のエラーを「使い終わった note は close で done にする」という案内に変更した。
- `src/register/transition-commands.ts` で note の close を `done` に制限し、`--conclusion` に移した先または古くなった理由を書くようエラーで案内する。既存の既定値によって `--status` 省略時も `done` になる。
- `tests/src/register/commands.test.ts` に、既定・明示の done、decided などの拒否、結論なしの拒否、reject・defer の拒否、reopen、build の状態別一覧で note と todo の done が同じ一覧に入り open から外れることの検証を用意した。生成処理と reopen は既存実装を使う。
- 再開時に前回の親検証ログを確認した。失敗 2 件は、比較用 todo 2 件のイベント履歴がなく `register build` が終了コード 1 を設定し、その値が reopen 後まで残ったことが原因だった。比較用 todo に初期イベントを追加し、build 直後にも終了コードを検証するよう修正した。reopen の実装変更は不要と判断し、一時登録簿で既定・明示の done から open へ戻せること、完了日時の削除と結論保持を確認した。
- 結論の空文字・空白だけ・未設定値を表す `-` も未記入として拒否する。既存の結論があっても、今回使い終わった根拠を残すため `--conclusion` の明示を必須にした。
- プロジェクト登録簿 作成ルール、登録簿運用ガイド、CLI コマンドリファレンスと、英語版 rulebook を更新した。

### 5.2. オーケストレーター本文の変更案

保護された設定は編集していない。利用者の承認後、feature ブランチで `.agents/specdojo-orchestrator.agent.md` の type の表の note の行を次へ置き換える。

```markdown
| `note` | 記録として残す観測・分析 | `done` |
```

note の扱いの段落は次へ置き換える。

> `note` の `open` は継続して更新できる記録を表す。使い終わった note（内容を別の項目・文書・運用メモへ移した、または古くなった）は `register close --conclusion <text>` で `done` にし、移した先または古くなった理由を必ず書く。`--status` を省いた場合も `done` とし、`decided`・`rejected`・`deferred` は使わない。必要になれば `register reopen` で `open` に戻す。対応や判断が必要になった場合は、目的に合う別の type で起票し、note を参照元とする（`pjr-rulebook` の type 別の扱い）。

反映時は `npm run orchestrator:sync` で各 agent のラッパーと配布テンプレートにも反映し、`npm run lint:orchestrator-sync` で同期を確かめる。

### 5.3. 検証と申し送り

- Prettier 整形、変更 Markdown の lint、`node --import tsx tools/catalog-validate-if-configured.mjs`、`npm run validate:history-links`、`node --import tsx src/specdojo.ts register build --project prj-0001`、`git diff --check` は成功した。catalog 検証は既存の参照・未作成文書に関する警告を出したが、終了コードは 0。正確なコマンドは executor evidence にも記録する。
- 再開時は整形、catalog 検証、履歴リンク検査、register build を再実行した。一時スクリプト `node --import tsx tmp/pjr-avcb-note-smoke.mjs` で note の close → build → reopen を既定・明示の done の両方で確認し、すべて成功した。スクリプトと一時登録簿は検証後に削除した。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・Markdown lint など指定済みの親検証は、pipeline の指示に従い runner に委ねる。
- 確認したステータス定義（登録項目個票）には、note を継続記録とする旧い業務遷移と、close が note を拒むという現行制約の説明が残る。本項目で指定された規範 3 文書の修正と分け、PJR-CA6G の決定に合わせた設計の更新を後続で扱う。

### 5.4. CHANGELOG に書く事項

- 区分: 不具合修正（v0.10.0）。
- 文案: `register close` で使い終わった note を `done` にできるようにした。移した先または古くなった理由を `--conclusion` に必須とし、必要になれば `register reopen` で再開できる。note の reject・defer は引き続き拒否する。

## 6. 関連ドキュメント

- [[prj-0001:pjr-ca6g-note-closable|PJR-CA6G note を done で close できるようにする]]
- [[specdojo:pjr-rulebook|プロジェクト登録簿 作成ルール]]
- [[specdojo:register-operation-guide|登録簿運用ガイド]]
- [[specdojo:command-reference|CLI コマンドリファレンス]]
