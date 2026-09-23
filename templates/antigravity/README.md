# Antigravity 向け配布原本

`npx specdojo config scaffold --provider antigravity` が配置するファイルの原本です。この README 自体はコピーされません。

## 配置されるもの

| 原本                         | 配置先                                             |
| ---------------------------- | -------------------------------------------------- |
| `orchestrator.md`            | `.specdojo/antigravity/orchestrator.md`            |
| `exec-defaults-snippet.yaml` | `.specdojo/antigravity/exec-defaults-snippet.yaml` |
| `pm-members-snippet.yaml`    | `.specdojo/antigravity/pm-members-snippet.yaml`    |

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

`exec-defaults-snippet.yaml` を `.specdojo/exec-defaults.yaml` の `providers` へ、`pm-members-snippet.yaml` を `pm-members.yaml` の `members` へ写します。モデル ID は推論強度を含むため、`--effort` を併用すると起動に失敗します。
