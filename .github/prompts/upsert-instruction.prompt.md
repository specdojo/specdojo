# 対象の instruction を作成/更新

参照 Skill: `.github/skills/upsert-instruction/SKILL.md`

`/upsert-instruction` は、上記 Skill に定義された手順と実行ルールに従って実行してください。

## 入力の扱い

- 引数がある場合は、その引数セットを対象として処理する。
- 引数がない場合は、現在開いているファイルを単一対象として処理する。
- 引数解釈および対象判定は Skill の規則に従う。
