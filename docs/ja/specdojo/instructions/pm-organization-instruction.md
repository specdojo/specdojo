---
id: pm-organization-instruction
type: instruction
status: draft
rulebook: pm-organization-rulebook
---

# 組織定義 作成指示

## 1. 目的と前提

- 生成対象は `pm-organization.md` とする。
- 目的は、プロジェクトで採用する Role code、採用しない Role code、使用可能な `owner`、見直し条件を定義することとする。
- 参照ルールは [pm-organization-rulebook.md](../rulebooks/pm-organization-rulebook.md) とし、Role、Member、Task owner、Executor、RACI の共通定義は `people-and-organization-definition-standard` を正として扱う。
- `pm-organization.md` にはプロジェクト固有の判断だけを書く。標準ロールの一般責務、`owner` / `role` / `--by` の共通定義、共通の Agent 委任方針は再掲しない。
- 対象外は、`pm-members.yaml` の具体的な member 割当、`pm-raci.md` の詳細な責任分担、標準ロール定義の再説明とする。
- 公開文書として扱い、個人名、私用メールアドレス、非公開組織情報は記載しない。

## 2. 入力情報

- プロジェクト規模。`小規模`、`中規模`、`大規模` のいずれかを選択し、必要に応じて個人運用、複数人運用、外部関係者ありなどの補足を添える。
- 採用する Role code 一覧、正式名称、プロジェクトでの扱い、採用理由。
- 採用しない Role code 一覧、未採用理由、代替方針、追加条件。
- Schedule の `owner` に使用する Role code 一覧。
- 最終判断の集約先、必要なエスカレーション先。
- 関連ドキュメントの有無と役割。最低でも `pm-roles.yaml`、`pm-members.yaml`、`pm-raci.md`、`people-and-organization-definition-standard.md` を確認する。
- ロール採用を見直す更新トリガーと、見直し時に更新する内容。
- 関連ドキュメントが未作成の場合は `_TODO_:` で不足を明示し、想定する役割だけ先に記載する。
- 未確定事項は `_TODO_:`, `_UNDECIDED_:`, `_ASSUMPTION_:` のいずれかで明示する。

## 3. 出力フォーマット

- 出力形式は Markdown とする。
- 生成する `pm-organization.md` の Frontmatter には、少なくとも `id`, `type`, `status`, `rulebook` を含める。
- Frontmatter は次を基本形とする。

```yaml
---
id: <project-id>:pm-organization
type: project
status: draft
rulebook: pm-organization-rulebook
based_on:
  - people-and-organization-definition-standard
---
```

- H1 は 1 つだけとし、タイトルは `# 組織定義` を基本とする。
- 本文は次の順序で作成する。

1. 基本方針
2. 採用ロール
3. 未採用ロール
4. 本プロジェクトで使用できる `owner`
5. 関連ドキュメント
6. 見直し条件
7. 禁止事項

- `採用ロール` には次の列を持つ表を置く。

| Role code | 正式名称 | 本プロジェクトでの扱い |
| --------- | -------- | ---------------------- |

- `未採用ロール` には次の列を持つ表を置く。

| Role code | 正式名称 | 未採用理由・代替方針 |
| --------- | -------- | -------------------- |

- `本プロジェクトで使用できる owner` は箇条書きで記載し、使用可能な Role code だけを列挙する。
- `関連ドキュメント` には、各ドキュメントのパスまたは名称と役割を 1 行ずつ記載する。未作成のものは `_TODO_:` を付けて不足状態を明示する。
- `見直し条件` には次の列を持つ表を置く。

| 更新トリガー | 見直し内容 |
| ------------ | ---------- |

## 4. 記述ルール

- `基本方針` では、プロジェクト規模を `小規模`、`中規模`、`大規模` の三択で明記し、`owner` の使用範囲、最終判断の集約先も記載する。小規模運用では最終判断を `PO` に集約してよい。
- 採用方針は `people-and-organization-definition-standard` の規模別採用パターンと整合させる。
- `採用ロール` には採用する Role code だけを載せ、標準的な責務を長く再掲せず、プロジェクト固有に強調したい扱いだけを書く。
- `採用ロール` と `未採用ロール` の判断理由は、採用可否や追加条件を第三者が判定できる粒度で書く。
- `未採用ロール` には、未採用理由に加えて、誰が兼務するか、またはどの条件で追加するかを必ず書く。
- `本プロジェクトで使用できる owner` には採用済み Role code だけを記載し、未採用ロールを使わないことを明記する。
- `関連ドキュメント` では `pm-roles.yaml`、`pm-members.yaml`、`pm-raci.md`、`people-and-organization-definition-standard.md` への導線を置き、それぞれの役割を 1 行で示す。
- `関連ドキュメント` に未作成ファイルがある場合でも節自体は省略せず、`_TODO_:` を用いて不足と作成予定を明示する。
- `見直し条件` には、共通的な一般論ではなく、このプロジェクトで起きそうな更新トリガーだけを書く。
- `禁止事項` では、プロジェクト固有の禁止事項を箇条書きで示し、最低でも未採用ロールを `owner` に使わない、agent に最終判断を委ねない、個人名を `owner` に使わない、の 3 点を含める。
- 章への参照は章番号ではなく章タイトルで記載する。

## 5. 禁止事項

- 標準ロールの一般的な責務を長文で再掲しない。
- `owner` / `role` / `--by` の共通定義表を再掲しない。
- `pm-members.yaml` の具体的な member 一覧を複製しない。
- プロジェクト固有でない Agent 委任方針や RACI 定義を再掲しない。
- 未採用ロールを Schedule の `owner` に使えるような記述をしない。
- 個人名を `owner` に使わない。
- agent に最終判断を委ねない。

## 6. 最終チェック

- Frontmatter に `id`, `type`, `status`, `rulebook` がある。
- 本文の見出し順が `基本方針` から `禁止事項` まで揃っている。
- `採用ロール` と `未採用ロール` の表に必須列が揃っている。
- `owner` に未採用ロールや個人名が含まれていない。
- `関連ドキュメント` に `pm-roles.yaml`、`pm-members.yaml`、`pm-raci.md`、`people-and-organization-definition-standard.md` への導線がある。
- 未作成の関連ドキュメントがある場合は、`_TODO_:` で不足状態が明示されている。
- 個人情報、非公開組織情報、標準の重複記述がない。
