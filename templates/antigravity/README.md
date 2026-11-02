# Antigravity CLI provider 設定

`npx specdojo config scaffold --provider antigravity` の配布原本です。README と旧 `settings.global.json` はコピーされません。

| 原本                                                                                                  | 配置先                   |
| ----------------------------------------------------------------------------------------------------- | ------------------------ |
| `settings.edit.json` / `settings.review.json` / `settings.report.json` / `settings.orchestrator.json` | `.specdojo/antigravity/` |
| `orchestrator.md` / `exec-defaults-snippet.yaml` / `agent-members-snippet.yaml`                       | `.specdojo/antigravity/` |

通常の導入ではグローバル設定を書き換えません。agy 1.4.12 以上と、同じ版の `specdojo` が PATH に必要です。

```sh
npx specdojo config scaffold --provider antigravity --dry-run
npx specdojo config scaffold --provider antigravity
```

provider / member のスニペットを設定へマージし、生成ファイルを commit します。command template は次の入口を使います。

```yaml
command_template: 'specdojo agent launch --provider antigravity --role {mode} -- --sandbox --model {model} -p "$(cat)"'
```

`mode` は edit / review / report です。起動処理が役割プロファイルと runner の宣言済み task worktree の絶対パスを単一の `--settings` JSON にまとめて渡し、保存しません。edit は通常成果物を編集し、秘密情報・保護設定を拒否します。review / report は全ファイルの書き込みと command / MCP を拒否します。検証は親 runner に委ねます。

対話型は生成された `npm run orch:argon`（または `npm run orch:flash`）あるいは次の入口を使います。

```sh
specdojo orchestrator launch --provider antigravity -- --model gemini-4-argon-medium -i "$(cat .specdojo/antigravity/orchestrator.md)"
```

この入口は orchestrator プロファイルと選択 project の宣言済み repository を使い、cwd も `--add-dir` に加えます。保護設定の編集は利用者の承認に従い、秘密情報・Git metadata・push の制限は維持します。直接 `agy` を起動すると、この権限生成処理は適用されません。

既存利用者は command template と個別 command を上記へ移行し、`--dangerously-skip-permissions` を削除してください。既存 npm script は scaffold が上書きしないため、`orchestrator launch` 経由へ手動変更します。旧 `--global` は互換用途で残ります。既存ルールを自動で消さず、ユーザー設定をバックアップして自身の制限を役割プロファイルへ移してください。

`--settings` と既存グローバル・project 設定の配列マージは実機で未検証です。Claude と同等の隔離を確認したとは扱いません。仕様・移行・無害なファイルでの実機検証手順は [[sysd-antigravity-agent-settings|Antigravity CLI エージェント設定]] を参照してください。実機の許可／拒否と、統合後の PJR-JSEY の証跡を記録してから運用へ適用します。

モデル ID は `agy models` で確認し、推論強度を含むため `--effort` と併用しません。認証は利用者が別途行い、設定や成果物に資格情報を書きません。
