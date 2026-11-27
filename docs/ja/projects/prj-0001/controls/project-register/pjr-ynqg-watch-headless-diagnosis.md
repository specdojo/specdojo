---
specdojo:
  id: prj-0001:pjr-ynqg-watch-headless-diagnosis
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-23T00:13:23Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-52EE
  depends_on:
    - PJR-3M4M
  commit_type: feat
  commit_scope: exec
---

# PJR-YNQG 判断が要る止まりの診断の案をヘッドレスの agent に書かせる

## 1. 概要

判断が要るものに分けた止まりについて agent を起こし、診断と次の手の案を朝の報告に書かせる。agent には手を打たせない（PJR-52EE の子の 3）

## 2. 入力

- PJR-52EE を 4 件に分ける。決まった手当ては規則で行い、判断が要るものは agent に診断の案だけを書かせ（案 C）、立ち上げたままのオーケストレーターのために待つコマンドを足す（案 A）。MCP を使う案は採らない（利用者の決定、2026-11-23）

## 3. 完了条件

- 見張り（子の 1）が「判断が要るもの」に分けた止まりについて、`specdojo orchestrator launch` などでヘッドレスの agent を起こし、playbook と止まった理由の記録を渡して、診断と次の手の案を朝の報告に書かせる。
- 起こす agent と起動のコマンドは exec-defaults（`command_template`・名簿）で決まり、agent の種類に頼らない。どの agent を使うかは設定で選べ、既定は起こさない。
- agent に許すのは、読み取りと朝の報告への書き込みだけとする。claim・再開・release・commit・設定の変更・登録簿の記帳はさせない。許す範囲を、provider ごとの権限の設定の案として個票の対応結果に書く（保護された設定は変えない）。
- 1 晩に起こす回数と 1 回の時間に上限を設ける。同じ止まりで二度起こさない。
- agent が失敗したり上限に達したりしても、見張りと朝の報告は止まらない。
- cron と routine だけで動く。
- 偽の agent（決まった診断を返すスクリプト）で、起こし方・渡す中身・書き込みの範囲を確かめる統合テストを足す。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。設定の例や変更が要る場合は、案を個票の対応結果と報告の `handoff` に書く。
- 関連する設計・ガイド・CLI リファレンスを直す。
- runner と routine の動きを変えるため、統合の後に orchestrator が `exec smoke` と実際の routine の 1 回の実行で確かめてから close する。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                                  | 担当         | 状態 | メモ                                                                       |
| --- | ----------------------------------------------------- | ------------ | ---- | -------------------------------------------------------------------------- |
| 1   | 診断の起動・重複防止・回数と時間の制限                | executor     | done | `watch.diagnosis` と専用の起動記録・ロックを追加。既定は無効               |
| 2   | 朝報告への転記と失敗時の継続                          | executor     | done | 先に見張りの報告を保存し、標準出力の案を引用して転記。失敗・時間切れも記録 |
| 3   | 偽 agent の統合テストと設計・ガイド・CLI リファレンス | executor     | done | 起動・入力・書き込み範囲・上限・重複・失敗・無効化を検査するテストを追加   |
| 4   | 親の型検査・lint・テスト                              | runner       | open | pipeline の親検証で実行するため executor では重複実行しない                |
| 5   | 統合後の `exec smoke` と実際の routine 1 回           | orchestrator | open | 統合後のホスト操作と実 agent の起動が必要。成功を確認してから close する   |

## 5. 対応結果

### 5.1. 実施内容と判断

- `src/exec/watch-diagnosis.ts` を追加し、CLI の見張り後に `needs_decision` の未診断の止まりを古い順で 1 件だけ診断する。名簿の有効な `mode: review` member を選び、既存の `resolveMemberCommand` で起動コマンドを決める。診断用 member を指す `watch.diagnosis.by` が無ければ起動しない。
- agent は読み取りと標準出力への案の返却を担当し、朝報告への書き込みは見張りが代行する方式を採った。provider ごとの書き込みパスの制御に頼らず、agent へファイルの書き込み権限を与えずに済むためである。playbook と止まりの記録を標準入力で渡し、claim・再開・release・commit・設定変更・登録簿の記帳・MCP を禁ずる。権限の強制は次節の専用設定が前提であり、`mode: review` だけで強制されるとは扱わない。
- 1 晩は登録簿の時間帯の正午から翌正午と決めた。夜中の日付変更で回数を戻さないためである。既定は 3 回・1 回 300 秒、設定上限は 100 回・3600 秒とし、時間切れは既存のプロセス群の終了処理を使う（SIGTERM 後の猶予最大 10 秒、出力の切断待ち最大 5 秒を別途伴う）。
- 起動前に止まりの鍵の SHA-256 をファイル名にした記録を排他的に作り、同じ止まりは失敗・時間切れ・翌晩も二度起こさない。別の診断用ロックで並行する回数判定を直列にする。記録は `execution/watch/diagnoses/` に保持し、親が中断して `running` のまま残った場合は人が確認する。
- 朝報告を先に保存し、診断結果を第 7 節に転記する。現在の止まりに対する過去の案と当晩の診断記録を再描画し、報告の更新で案を失わない。設定不備・playbook 不在・回数上限は警告として報告する。診断の失敗は見張りや routine の成功を妨げない。
- `--no-diagnosis` を追加し、`--no-remedy` と独立に止められるようにした。dry-run・全体停止・対象外の止まりには起動しない。cron と既存 routine の呼び出し方は変更不要で、MCP は追加しない。
- 偽 agent の統合テストと schema の設定検査を追加した。統合テストは CLI の名簿・template 解決、playbook と理由の入力、朝報告以外の設定・schedule・event が変わらないこと、失敗・時間切れ、日付をまたぐ上限、同時起動、同じ止まりの再依頼防止を対象にする。実行は親 runner の `test-integration`・`test-docs` に委ねる。

### 5.2. 保護された設定の変更案（未適用）

`.specdojo/exec-defaults.yaml` へ次を加え、`.specdojo/agent-members.yaml` に専用の `watch-diagnoser`（`type: agent`・`mode: review`・選んだ provider と model・`capabilities: []`・`proficiency: normal`・`priority: 1`）を定義する案とする。既存の executor・reporter・review 用の設定をそのまま流用しない。導入前に利用者の承認と実 CLI での権限確認が必要であり、本タスクでは設定を変えていない。

```yaml
watch:
  diagnosis:
    by: watch-diagnoser
    max_per_night: 3
    timeout_seconds: 300
```

起動は provider の `command_template` と、専用 nickname の `command_params.by_nickname` により既存の実行用設定から分ける。既存 template に分岐用の変数が無い場合は、専用 member の `command` を使う。読み取りと案の標準出力だけを許し、朝報告を含むファイルへの書き込み許可は与えない。

| provider | 権限設定の案                                                                                                                                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| codex    | 専用コマンドを `codex exec --ephemeral --sandbox read-only -c approval_policy="never" --model <model>` とし、`workspace-write`・追加の writable root・MCP server を継がせない。既存 review の template は `workspace-write` のため使わない |
| claude   | 専用 agent と専用 `--settings` を選び、Read・Glob・Grep のみ allow、Bash・Edit・Write・NotebookEdit・Task・MCP は deny。通常の review 設定の result 編集許可を外し、bypass を許さない                                                      |
| opencode | 専用 agent の `permission` で read・glob・grep・list だけ allow、bash・edit・task・webfetch・websearch・MCP を deny。既存 review の検証コマンド許可は継がせない                                                                            |
| copilot  | 専用コマンドで read のみを許し、`--deny-tool write`・`--deny-tool shell`・`--disable-builtin-mcps` を指定する。一般 template の write・shell の allow と追加 MCP 設定を継がせない                                                          |
| custom   | 読み取り専用の OS sandbox または CLI の許可リストを持つ専用 wrapper に限定し、任意 shell・ネットワーク・編集・MCP を許さない                                                                                                               |

全 provider で認証情報・秘密鍵・`.env`・`secrets/` は読む対象から除く。provider にパス単位の読み取り拒否が無い場合は、専用 sandbox へ必要な資料だけを公開する。これらの権限設定は案であり、実 provider の確認が済むまでは `watch.diagnosis.by` を設定しない。

### 5.3. 検証と申し送り

Prettier 整形、変更 Markdown の検査、schema の例示設定の検査、catalog 検査、履歴リンク検査、実行時 import の依存宣言検査、差分の空白検査は成功した。catalog には既存の参照先不在・re-export 参照などの警告があるが、終了コードは 0。型検査・TypeScript lint・Markdown/frontmatter lint・unit/integration/docs テスト・全体 schema 検査は親 runner が実行する。result の記入と登録簿の状態遷移は reporter・runner・人に引き継ぐ。

統合後に orchestrator が `npm run build` を行い、`exec smoke` の対象へ PJR-YNQG を含めて確認する。その後、承認済みの診断専用設定を用意し、実際の見張り routine を 1 回実行する。朝報告の診断案、時間・回数制限、禁止された操作の拒否、登録簿と設定に変更が無いことを確認してから close する。実 agent の起動は使用量を消費し、統合後のホスト操作が必要なため executor では実施しない。

### 5.4. CHANGELOG に書く事項

- 区分: 追加。
- 文案: 見張りで判断が要る止まりに、設定で選んだヘッドレス agent の診断案を朝報告へ載せられるようにした。既定は無効で、回数・時間の上限と同じ止まりの重複起動防止を備え、agent は再開や記帳を行わない。

## 6. 関連ドキュメント

- [[prj-0001:pm-orchestrator-playbook|prj-0001 のオーケストレーター運用メモ]]
- [[sysd-job-execution|Job実行設計]]
- [[specdojo:exec-config-guide|exec設定ガイド]]
- [[specdojo:register-operation-guide|登録簿運用ガイド]]
- [[specdojo:routine-operation-guide|routine運用ガイド]]
- [[specdojo:command-reference|コマンドリファレンス]]
