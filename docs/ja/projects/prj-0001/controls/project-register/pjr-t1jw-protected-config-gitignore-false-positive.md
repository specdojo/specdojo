---
specdojo:
  id: prj-0001:pjr-t1jw-protected-config-gitignore-false-positive
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-08-22T02:04:42Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-22T02:05:41Z"
  conclusion: 保護判定から gitignore 済みのパスを除外し、agent が共通規約どおり index build を実行しても違反にならないようにした。除外条件は未追跡ではなく ignore 済みとし、未追跡の新規設定ファイルによるすり抜けを防いでいる。git が使えない場合は除外せず全候補を保護する fail closed とした。
  register_events:
    - v: 1
      id: reg_54b417b42d0171af6659495e979110df
      ts: "2026-08-22T02:05:43Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: done
      reason: "docs(register): add and close PJR-T1JW protected config false positive"
      changes:
        - field: status
          from: ""
          to: done
        - field: title
          from: ""
          to: 設定変更ガードが gitignore 済み生成物を誤検知する問題を解消する
        - field: description
          from: ""
          to: PJR-Y3KP で追加した設定変更ガードは .specdojo/ ディレクトリ全体を保護対象にしていたため、gitignore 済みの生成物である .specdojo/doc-index.json まで検知していた。agent は共通規約に従って docs/ 配下の変更後に index build を実行するため、規約どおりに作業しただけで必ず block され、docs を変更するすべての exec タスクが完了できない状態になっていた。PJR-269Z の実行で顕在化した。保護判定から gitignore 済みのパスを除外する。
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: high
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: "2026-08-22"
        - field: due
          from: ""
          to: "2026-08-31"
        - field: completed
          from: ""
          to: "2026-08-22"
        - field: conclusion
          from: ""
          to: 保護判定から gitignore 済みのパスを除外し、agent が共通規約どおり index build を実行しても違反にならないようにした。除外条件は未追跡ではなく ignore 済みとし、未追跡の新規設定ファイルによるすり抜けを防いでいる。git が使えない場合は除外せず全候補を保護する fail closed とした。
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: abbc94794adf937eb7453729717bb5ab90228bb9
---

# PJR-T1JW 設定変更ガードが gitignore 済み生成物を誤検知する問題を解消する

## 1. 概要

PJR-Y3KP で追加した設定変更ガードは .specdojo/ ディレクトリ全体を保護対象にしていたため、gitignore 済みの生成物である .specdojo/doc-index.json まで検知していた。agent は共通規約に従って docs/ 配下の変更後に index build を実行するため、規約どおりに作業しただけで必ず block され、docs を変更するすべての exec タスクが完了できない状態になっていた。PJR-269Z の実行で顕在化した。保護判定から gitignore 済みのパスを除外する。

## 2. 完了条件

- 保護判定が gitignore 済みのパスを除外し、`.specdojo/doc-index.json` の再生成が違反として扱われない。
- 未追跡でも gitignore されていない設定ファイルは保護対象に残り、新しい権限プロファイルを自作して起動するすり抜けができない。
- Git リポジトリでない場所や git が使えない場合は除外せず、全候補を保護対象として扱う。
- 上記3点を検証する unit test が追加され、`npm run test:unit` と `npm run test:integration` が成功する。
- 実リポジトリで `index build` を実行しても違反が検知されないことを確認している。

## 3. 作業内容

| No  | 作業                                 | 担当 | 状態 | メモ                                                                          |
| --- | ------------------------------------ | ---- | ---- | ----------------------------------------------------------------------------- |
| 1   | 誤検知の原因を特定する               | ARC  | done | 保護対象が `.specdojo/` 全体で、gitignore 済みの生成物を含んでいた            |
| 2   | 除外条件を決める                     | ARC  | done | 「未追跡」ではなく「ignore 済み」を条件にし、新規設定ファイルのすり抜けを防ぐ |
| 3   | 保護判定に除外処理を実装する         | ARC  | done | `git check-ignore -z --stdin` で判定し、失敗時は除外しない fail closed とした |
| 4   | unit test を追加する                 | ARC  | done | 生成物の除外、未追跡設定の保護、非 Git ディレクトリでの動作を検証             |
| 5   | 実リポジトリで誤検知の解消を確認する | ARC  | done | `index build` 実行後の検知が空になることを確認                                |

## 4. 対応結果

`src/exec-agent-protected-config.ts` の snapshot 収集後に、`git check-ignore -z --stdin` で判定した gitignore 済みパスを保護対象から除外する処理を追加した。orchestrator が exec を介さず直接実装した。

- 除外条件は「Git 追跡対象でない」ではなく「gitignore 済み」とした。未追跡をすべて除外すると、agent が `pm-members.yaml` へ新しい mode の member を追加したうえで対応する `.specdojo/claude/settings.<mode>.json` を新規作成し、自作の権限プロファイルで起動できてしまうため。
- git が使えない場合や想定外の終了コードで失敗した場合は除外せず、全候補を保護対象のまま残す fail closed とした。非 Git ディレクトリでも従来どおり保護が働く。
- unit test を3件追加した。gitignore 済み生成物の書き換えを違反としないこと、未追跡かつ ignore されていない設定ファイルは保護すること、非 Git ディレクトリでは全候補を保護することを検証している。
- 実リポジトリで snapshot が `.specdojo/doc-index.json` を含まず `.specdojo/exec-defaults.yaml` を含むこと、`index build` 実行後の検知が空になることを確認した。
- `npm run test:unit`（85 ファイル・1225 件）、`npm run test:integration`（10 ファイル・75 件）、`npm run typecheck`、eslint がいずれも成功している。

残課題はない。

## 5. 関連ドキュメント

- 誤検知を生んだ実装: [[prj-0001:pjr-y3kp-agent-config-write-enforcement|PJR-Y3KP agent による設定ファイル変更を provider 非依存で実効的に止める]]
- 根拠となる決定: [[prj-0001:pjr-3s8q-agent-writable-config-scope|PJR-3S8Q 実行コマンドを定義する設定ファイルは agent の書き込み範囲に含めない]]
- 顕在化した実行: [[prj-0001:pjr-269z-dct-index-generation|PJR-269Z dct-index.md を dct-index.yaml から自動生成し、順序とグループ分割を宣言で制御する]]
- 変更した実装: `src/exec-agent-protected-config.ts`、`tests/src/exec-agent-protected-config.test.ts`
