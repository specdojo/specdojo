# Antigravity 向け配布原本

`npx specdojo config scaffold --provider antigravity` が配置するファイルの原本です。この README 自体はコピーされません。

## 配置されるもの

| 原本                         | 配置先                                             |
| ---------------------------- | -------------------------------------------------- |
| `orchestrator.md`            | `.specdojo/antigravity/orchestrator.md`            |
| `exec-defaults-snippet.yaml` | `.specdojo/antigravity/exec-defaults-snippet.yaml` |
| `pm-members-snippet.yaml`    | `.specdojo/antigravity/pm-members-snippet.yaml`    |

`settings.global.json` はリポジトリへコピーされません。`--global` を明示した場合だけ、
権限ルールをユーザー設定へマージするための原本として使われます。

## ユーザー権限設定

まず dry-run で、`~/.gemini/antigravity-cli/settings.json` へ追加されるルールだけを差分表示します。

```sh
npx specdojo config scaffold --provider antigravity --global --dry-run
```

内容を確認してから適用します。

```sh
npx specdojo config scaffold --provider antigravity --global
```

- `--global` を付けない通常の scaffold はユーザーディレクトリへ触れません。
- `permissions.allow` / `deny` / `ask` の既存要素と、それ以外のユーザー設定を保持し、不足するルールだけを末尾へ追加します。
- 書き換え前のファイルは `settings.json.backup-<timestamp>` へ退避します。設定ファイルがまだ無い場合は新規作成し、バックアップは作りません。
- 既存 JSON や permission 配列の形式が不正な場合は、バックアップも書き込みも行わずエラーにします。
- `--force` はリポジトリ内の配布物だけに作用し、グローバル設定の既存項目を上書きしません。

権限原本は、必要な検証コマンドを allow し、`git push`、破壊的コマンド、秘密情報、親 runner・hook・CI・agent 設定を変更できるパスを deny します。`.specdojo/doc-index.json` のような既知の生成物は検証で更新できるよう、`.specdojo/` 全体ではなく設定ファイルと provider ディレクトリを個別に deny します。provider 非依存の実行後ガードも併用されます。

## オーケストレーターの起動

Antigravity CLI（`agy`）はファイル定義の agent を持たないため、`--agent <name>` では起動できません。規範の本文を `-i` で渡します。

```sh
agy --add-dir "$(pwd)" --model gemini-3.1-pro-high -i "$(cat .specdojo/antigravity/orchestrator.md)"
```

`--add-dir "$(pwd)"` を付けないと、作業ディレクトリのファイルを読み書きできず、`AGENTS.md` と `.agents/rules/*.md` も読み込まれません。

`package.json` へ登録しておくと短く起動できます。

```json
{
  "scripts": {
    "orch:agy": "agy --add-dir \"$(pwd)\" --model gemini-3.1-pro-high -i \"$(cat .specdojo/antigravity/orchestrator.md)\""
  }
}
```

## executor / reporter として使う

`exec-defaults-snippet.yaml` を `.specdojo/exec-defaults.yaml` の `providers` へ、`pm-members-snippet.yaml` を `pm-members.yaml` の `members` へ写します。モデル ID は推論強度を含むため、`--effort` を併用すると起動に失敗します。headless 実行に必要な command は上記のグローバル permission で許可し、`--dangerously-skip-permissions` は使いません。
