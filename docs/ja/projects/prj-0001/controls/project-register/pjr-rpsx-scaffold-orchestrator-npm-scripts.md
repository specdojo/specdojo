---
specdojo:
  id: prj-0001:pjr-rpsx-scaffold-orchestrator-npm-scripts
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-09-26T13:33:13Z"
---

# PJR-RPSX config scaffold で provider に応じたオーケストレーター起動スクリプトを package.json へ加える

## 1. 概要

オーケストレーターの起動は provider ごとにコマンドが長い（`codex "$(cat .specdojo/codex/orchestrator.md)"` など）。このリポジトリの `package.json` には `orch:opus` などの起動スクリプトがあるが、SpecDojo を導入した人の `package.json` には何も加わらない。`config scaffold --provider` のときに、provider に応じた起動スクリプトを加える。

## 2. 事実

### 2.1. 現在の scaffold は package.json を変えない

`src/exec-provider-scaffold.ts` は provider ごとの設定ファイルを配置するが、`package.json` には触れない。

### 2.2. このリポジトリには起動スクリプトがある

```json
"orch:opus": "claude --agent specdojo-orchestrator --model opus",
"orch:sonnet": "claude --agent specdojo-orchestrator --model sonnet",
"orch:agy": "agy --add-dir \"$(pwd)\" --model gemini-3.1-pro-high -i \"$(cat .agents/specdojo-orchestrator.agent.md)\"",
```

ただしこれは開発用で、規範の本文を `.agents/specdojo-orchestrator.agent.md` から読む。導入した人の環境では `.specdojo/<provider>/orchestrator.md` に配置されるため、**同じコマンドはそのまま使えない。**

## 3. 追加するスクリプト

| provider      | スクリプト                 | 起動                                                                       |
| ------------- | -------------------------- | -------------------------------------------------------------------------- |
| `claude`      | `orch:opus`、`orch:sonnet` | `claude --agent specdojo-orchestrator --model <model>`                     |
| `codex`       | `orch:codex`               | `codex "$(cat .specdojo/codex/orchestrator.md)"`                           |
| `antigravity` | `orch:agy`                 | `agy --add-dir "$(pwd)" -i "$(cat .specdojo/antigravity/orchestrator.md)"` |
| `opencode`    | `orch:opencode`            | `opencode --agent specdojo-orchestrator`                                   |
| `copilot`     | `orch:copilot`             | **要確認**。`templates/copilot/` にオーケストレーターの定義がない          |

`config init` ではなく `config scaffold --provider` で加える。init の時点ではどの provider を使うかが分からないためである。

## 4. 決まりごと

| 決まりごと                 | 内容                                                                 |
| -------------------------- | -------------------------------------------------------------------- |
| 既存のキーは上書きしない   | 同じ名前のスクリプトがあれば飛ばし、その旨を表示する                 |
| 起動パスは配置先に合わせる | codex / antigravity は `.specdojo/<provider>/orchestrator.md` を読む |
| `--dry-run` で確認できる   | 追加予定のスクリプトを表示するだけにできる                           |
| 整形を保つ                 | `package.json` のインデントと既存の並びを崩さない                    |

## 5. 完了条件

- `config scaffold --provider <p>` のあと、`npm run orch:<name>` でオーケストレーターを起動できる。
- 既存の同名スクリプトを上書きしない。飛ばしたことが表示される。
- `package.json` がない場合の扱いが決まっている（作らずに案内するか、エラーにするか）。
- `--dry-run` で追加予定が確認でき、ファイルは変わらない。
- copilot の扱いが決まっている。オーケストレーターの定義を配置しないなら、スクリプトも加えない。
- README の「オーケストレーターを配置する」に、`npm run orch:<name>` で起動できることが書かれている。
- 単体テストがある。
- `npm run check` が通過している。

## 6. 作業内容

| No  | 作業                                             | 担当 | 状態 | メモ                              |
| --- | ------------------------------------------------ | ---- | ---- | --------------------------------- |
| 1   | copilot のオーケストレーター配置の有無を確かめる | DEV  | open |                                   |
| 2   | scaffold へスクリプトの追加を実装する            | DEV  | open | 上書きしない                      |
| 3   | テストを追加する                                 | DEV  | open |                                   |
| 4   | README へ起動方法を記載する                      | DEV  | open | PJR-34MQ の README 改訂と調整する |

## 7. 対応結果

-

## 8. 関連ドキュメント

- [[prj-0001:pjr-34mq-plain-repository-naming-readme]]
- `src/exec-provider-scaffold.ts`
- `README.md`
