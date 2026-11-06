---
specdojo:
  id: prj-0001:pjr-fma4-evidence-secret-redaction
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  registered_at: "2026-11-05T22:17:51Z"
  derived_from:
    - PJR-2WC2
---

# PJR-FMA4 実行記録へ書く前の伏せ字を広げ、秘密の混入を検査する

## 1. 概要

生のログを全文残すため、redactSensitiveText の対象を広げ、commit の hook か CI で実行記録への秘密の混入を検査する

## 2. 入力

- 由来: PJR-2WC2 で生のログを全文 Git に残すと決めた。push 先は github.com/specdojo/specdojo で、記録は push される（2026-11-06）
- orchestrator の調査: 追跡中の実行記録（evidence 3,099 件と plans・results・trials・events）に API キー・トークン・秘密鍵・個人のメールアドレスは見つからなかった。`[REDACTED]` は 1 件（2026-11-06）
- orchestrator の調査: `src/shared/text.ts` の `redactSensitiveText` が伏せるのは `Bearer …`、`sk-…`・`gh?_…`、`password=…` などの「名前=値」だけ。AWS・Google・Slack のキー、JWT、秘密鍵、URL に埋め込まれた認証情報は対象外（2026-11-06）
- 委任: 検査に gitleaks などの道具を使うか自前の検査を足すかは executor が選び、理由を個票の対応結果に記録する。`package.json` や hook の設定など保護された設定の変更は、案を個票の対応結果に書き、反映は利用者の承認のもとで行う（2026-11-06）

## 3. 完了条件

- `src/shared/text.ts` の `redactSensitiveText` が、既存の形式に加えて次を伏せ字にする: AWS のアクセスキー（`AKIA`・`ASIA` で始まる 20 文字）、Google の API キー（`AIza` で始まる 39 文字）、Slack のトークン（`xox` で始まる形式）、GitHub の fine-grained token（`github_pat_`）、JWT（`eyJ` で始まる 3 区画）、秘密鍵の PEM ブロック（`BEGIN … PRIVATE KEY` から `END … PRIVATE KEY` まで全体）、URL に埋め込まれた認証情報（`https://user:pass@host` の `user:pass`）、Anthropic の `sk-ant-` 形式。
- 単体テストを足す。形式ごとに伏せ字になること、伏せ字の後に元の値が残らないこと、語の一部（例: `task-judgement`、`risk-assessment`）や通常の URL を伏せ字にしないことを確かめる。
- 実行記録に秘密が入っていないかを調べる検査のスクリプトを足す。入口は依存のない環境（`node_modules` のない linked worktree）でも動く plain JS（`.mjs`）とし、指定したファイル（hook では staged のファイル）を調べ、見つけたら終了コード 1 でファイル・行・種類を出す。値そのものは出力しない。
- 検査の形式の定義は `redactSensitiveText` と同じ正本から取るか、二重に持つ場合は両者の一致をテストで確かめる。どちらにするかは executor が決め、理由を個票の対応結果に書く。gitleaks などの外部の道具を使うかも executor が決め、理由を書く。
- 追跡中の実行記録（`docs/ja/projects/prj-0001/execution/` 配下）に検査を実行し、検出が 0 件であること（または検出があれば、ファイルと種類だけ）を個票の対応結果に書く。値は書かない。
- `lefthook.yml`・`package.json`・`.github/workflows/` は保護された設定として変えない。hook や CI への登録の案（追加する設定の全文）を個票の対応結果に書き、pipeline では報告の `handoff` にも書く。反映は利用者の承認のもとで行う。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` が通り、親の検証が通る。
- CHANGELOG は未公開の版の節に書き、公開済みの版の節を変えない。

## 4. 作業内容

| No  | 作業                                   | 担当     | 状態 | メモ |
| --- | -------------------------------------- | -------- | ---- | ---- |
| 1   | 伏せ字の形式を足し、テストを足す       | executor | done | -    |
| 2   | 検査のスクリプトを足し、テストを足す   | executor | done | -    |
| 3   | 既存の実行記録に検査を流し、結果を書く | executor | done | -    |
| 4   | hook と CI への登録の案を書く          | executor | done | -    |

## 5. 対応結果

### 5.1. 実装と選定理由

- `src/shared/text.ts` の `redactSensitiveText` に完了条件の 8 形式を追加した。秘密鍵はブロック全体、URL は認証情報全体を置換する。既存の Bearer・キー・名前付きの値も維持し、JSON や空白を含む引用符付きの値を処理する。
- `tools/check-evidence-secrets.mjs` は Node 標準モジュールだけで動く。ファイル指定は作業ファイル、`--staged` は Git の index にある追加・変更・改名・コピー対象、`--tracked` は追跡中の作業ファイルを検査する。Git の 2 モードの対象は `docs/ja/projects/*/execution/` 配下で、削除済みの staged ファイルは対象外。NUL 区切りで列挙し、空白や改行を含むパスを扱う。
- 診断はファイル・行・種類と件数だけとし、値やソース行、Git の stderr を出さない。検出・読み取り失敗・引数不正は終了コード 1、検出なしは 0 とする。`.env` と `secrets/`、通常ファイル以外の読み取りは拒否する。
- gitleaks 等は導入せず、自前の検査を選んだ。対象の形式が明確であり、依存や外部バイナリのない linked worktree でも同じ検査を動かせるためである。未知の形式やエントロピーによる検出は行わない。
- 形式定義は TS と `.mjs` に二重に持つ。現行のビルドは TS のみを配布用 `dist` へ出力するため、実行時の TS から開発用 `tools/` への依存やビルド設定の変更を避けた。`tests/tools/check-evidence-secrets.test.ts` が種類・正規表現の source / flags・置換文字列・順序の一致を検証する。
- 形式別の完全な除去・複数出現・語や URL の保持・再適用、伏せ字後の検査 0 件を単体テストへ追加した。CLI の依存なしの起動、秘密を表示しない診断、index と作業ファイルの相違、エラー時の終了を統合テストへ追加した。[[specdojo:exec-config-guide|exec 設定ガイド]]の対象説明と CHANGELOG の未公開節も更新した。

### 5.2. 既存記録の検査

`node tools/check-evidence-secrets.mjs --tracked` を実行した。追跡中の実行記録 6,782 ファイル、候補 4 件、読み取り失敗なし、終了コード 1。検出メタデータは次のとおり（値は記載しない）。

```text
docs/ja/projects/prj-0001/execution/exec/plans/pjr-fma4-20261105T235847Z-f10bb399-plan.md:38: credential-assignment
docs/ja/projects/prj-0001/execution/exec/results/pjr-tc43-20260810T204732Z-4f04-result.md:25: credential-assignment
docs/ja/projects/prj-0001/execution/grade/results/tsd-omlx-opencode.yaml:215: credential-assignment
docs/ja/projects/prj-0001/execution/grade/results/tsd-omlx-opencode.yaml:216: credential-assignment
```

検出は形式への一致であり、実在する秘密かどうかの判定ではない。既存の履歴は編集していない。CI 案の有効化前に、利用者がこの 4 件を確認し、伏せ字や例示の書き直しが必要か判断する。広い除外設定で見逃す処理は加えていない。

### 5.3. 承認後に反映する設定案

`lefthook.yml`・`package.json`・`.github/workflows/` は変更していない。スクリプトは直接 Node で起動するため、npm script の追加は不要である。次の hook 案、CI 案の両方を提示し、採用と反映は利用者の承認後に行う。

既存 `lefthook.yml` の `pre-commit.commands` に追加する設定の全文:

```yaml
evidence-secrets:
  run: node tools/check-evidence-secrets.mjs --staged
```

`glob` や `{staged_files}` は使わず、スクリプトが対象を列挙して index の内容を検査する。staged の実行記録がなければ正常終了する。

新規 `.github/workflows/check-evidence-secrets.yml` の全文案（Actions の版と Node 24 は既存 workflow に合わせる）:

```yaml
name: Check evidence secrets

on:
  pull_request:
  push:

permissions:
  contents: read

jobs:
  evidence-secrets:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with:
          node-version: 24
      - name: Check tracked execution records
        run: node tools/check-evidence-secrets.mjs --tracked
```

依存インストールは不要。CI は追跡中の記録を全件検査するため、5.2 の候補が残っていれば失敗する。

### 5.4. 検証と申し送り

- sandbox でスクリプトの構文検査と、コピーした `.mjs` の単独起動を確認した。隔離した一時 Git repository では、検出時の終了コード 1 と値を含まない診断、staged と作業ファイルの読み分け、禁止パス・存在しないファイルの拒否を確認した。
- Prettier と対象 Markdown の検査、catalog 検査、履歴リンク検査、hook に合わせた `register build` は終了コード 0。catalog 検査には既存の re-export 参照・文書未作成などの警告がある。型検査・TS lint・単体／統合テスト・その他の親検証は runner が実行し、result へ追記する。
- reporter / runner は本節の実装理由、5.2 の検出ファイルと種類、5.3 の設定全文案と承認後の適用を result の申し送りへ反映する。登録簿の行・個票のステータス・result は executor では変更しない。

## 6. 関連ドキュメント

- PJR-2WC2: 由来の issue（生のログを全文残す決定）
