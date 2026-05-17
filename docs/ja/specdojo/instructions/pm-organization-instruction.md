---
id: pm-organization-instruction
type: instruction
status: draft
rulebook: pm-organization-rulebook
---

# 組織定義 作成指示

## 1. 目的と前提

- 生成対象は `pm-organization.md` とする。
- 目的は、プロジェクトのロール・メンバー構成について、設計根拠、方針、見直し条件を記述することとする。
- 参照ルールは [pm-organization-rulebook.md](../rulebooks/pm-organization-rulebook.md) とし、Role、Member、Task owner、Executor、RACI の共通定義は `people-and-organization-definition-standard` を正として扱う。
- `pm-organization.md` にはプロジェクト固有の判断だけを書く。Role code の全一覧は `pm-roles.yaml`、実行主体と兼務の割り当ては `pm-members.yaml`、成果物・プロセス別の責任分担は `pm-raci.md` に委ねる。
- 対象外は、全 Role code の列挙、member 一覧の複製、`owner` / `roles` / `--by` の共通定義表、プロジェクト固有でない Agent 委任方針、RACI 定義の再掲とする。
- 公開文書として扱い、個人名、私用メールアドレス、非公開組織情報は記載しない。

## 2. 入力情報

- プロジェクト ID。
- プロジェクト規模。個人・小規模運用、複数人運用、外部関係者ありなど、`people-and-organization-definition-standard` の規模別採用パターンと照合できる粒度で指定する。
- ロール構成とメンバー構成をその形にした理由。
- 兼務構成の概要。具体的な member 一覧は `pm-members.yaml` に委ね、本文では方針として記述する。
- 最終判断の集約先。小規模運用では `po`（human）に集約してよい。
- 関連ドキュメントの有無と役割。最低でも `pm-roles.yaml`、`pm-members.yaml`、`pm-raci.md`、`people-and-organization-definition-standard.md` を確認する。
- ロール・メンバー構成を見直す更新トリガーと、見直し時に更新する内容。
- 未確定事項は `_TODO_:`, `_UNDECIDED_:`, `_ASSUMPTION_:` のいずれかで明示する。

## 3. 出力フォーマット

- 出力形式は Markdown とし、ファイル名は `pm-organization.md` を基本とする。
- Frontmatter には、少なくとも `id`, `type`, `status`, `rulebook` を含める。

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
2. 関連ドキュメント
3. 見直し条件
4. 禁止事項

- `関連ドキュメント` には次の列を持つ表を置く。

| ドキュメント | 役割 |
| ------------ | ---- |

- `見直し条件` には次の列を持つ表を置く。

| 更新トリガー | 見直し内容 |
| ------------ | ---------- |

## 4. 記述ルール

- `基本方針` では、プロジェクト規模、ロール・メンバー構成の設計根拠、最終判断の集約先を記載する。
- 規模の判断は `people-and-organization-definition-standard` の規模別採用パターンと整合させる。
- `pm-roles.yaml` がプロジェクトで使用する Role code の語彙一覧であること、`pm-members.yaml` が実行主体と対応 Role code を管理すること、`pm-organization.md` がその設計根拠であることをそれぞれ 1 行で示す。
- 兼務構成は概要だけを書く。誰がどの Role code に対応するかの具体的な割り当ては `pm-members.yaml` に委ねる。
- 標準ロールの一般的な責務、`owner` / `roles` / `--by` の共通定義、共通の Agent 委任方針は本文に再掲しない。
- `関連ドキュメント` では、`pm-roles.yaml`、`pm-members.yaml`、`pm-raci.md`、`people-and-organization-definition-standard.md` への導線を置き、それぞれの役割を 1 行で示す。
- 関連ドキュメントが未作成の場合でも節自体は省略せず、`_TODO_:` を用いて不足と作成予定を明示する。
- `見直し条件` には、共通的な一般論ではなく、このプロジェクトで起きそうな更新トリガーだけを書く。
- `禁止事項` では、プロジェクト固有の禁止事項を箇条書きで示す。最低でも、agent に最終判断を委ねない、個人名を `owner` に使わない、`pm-roles.yaml` 未掲載の Role code を `owner` に使わない、の 3 点を含める。
- 章への参照は章番号ではなく章タイトルで記載する。

## 5. 禁止事項

- 全ロール一覧を `pm-organization.md` に記載しない。
- 兼務の具体的な割り当てや member 一覧を `pm-organization.md` に記載しない。
- `owner` / `roles` / `--by` の共通定義表を再掲しない。
- プロジェクト固有でない Agent 委任方針や RACI 定義を再掲しない。
- 個人名、member nickname、agent 名を Schedule の `owner` として使えるような記述をしない。
- `pm-roles.yaml` 未掲載の Role code を `owner` に使えるような記述をしない。
- agent に最終判断、公開可否判断、説明責任を委ねない。

## 6. 最終チェック

- Frontmatter に `id`, `type`, `status`, `rulebook` がある。
- 本文の見出し順が `基本方針`、`関連ドキュメント`、`見直し条件`、`禁止事項` で揃っている。
- `関連ドキュメント` に `pm-roles.yaml`、`pm-members.yaml`、`pm-raci.md`、`people-and-organization-definition-standard.md` への導線がある。
- `見直し条件` の表に `更新トリガー` と `見直し内容` がある。
- 全ロール一覧、member 一覧、共通定義表、共通 Agent 委任方針、RACI 定義が重複記載されていない。
- `owner` に個人名、member nickname、agent 名、`pm-roles.yaml` 未掲載の Role code を使えるような記述がない。
- 個人情報、非公開組織情報が含まれていない。
