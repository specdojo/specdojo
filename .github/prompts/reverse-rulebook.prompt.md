# 成果物から対応する rules を逆生成

参照 Skill: `.github/skills/reverse-rulebook/SKILL.md`

`/reverse-rulebook` は、上記 Skill に定義された手順と実行ルールに従って実行してください。

## 入力の扱い

- 現在開いているファイルを単一対象として処理する。
- 開いているファイルがサンプル、またはプロジェクト成果物の場合のみ逆生成を実行する。
- 開いているファイルが `*-rulebook.md` / `*-instruction.md` の場合は対象外として中止し、対応プロンプトへ誘導する。
