---
specdojo:
  id: prj-0001:pjr-zjzd-dct-index-nested-groups
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-22T06:49:44Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-22T10:34:04Z"
  conclusion: dct-index に1段のサブグループ階層を追加し、ルートグループを H3、サブグループを親番号継承の H4 として出力できるようにした。schema でグループの domains と groups を排他にし、2段目のサブグループを構造的に許可しないことで H4 上限を保証している。dct-index.yaml を成果物リファレンスの章構成へ再編し、既存の1段構成の後方互換とサイドバー表示名の解決も維持した。
---

# PJR-ZJZD dct-index にサブグループ階層を追加し、成果物リファレンスの節構成へ揃える

## 1. 概要

dct-index.yaml の groups は 1 段固定で、生成物も ### の見出しと表しか出せない。成果物リファレンスは 2 章の下に 2.1 業務仕様などの節を持つ二階層構造のため、リファレンスへ正確に揃えられない。groups[].groups[] によるサブグループを許可し、生成物で #### 2.2.1. 業務仕様 のような見出しと表を出せるようにする。Markdown 記述ルールで H5 以下は禁止のため、追加できる階層は 1 段までとする。

補足として、Markdown 記述ルールは H5 以下の見出しを禁止しているため、`## 2. 成果物カタログ一覧` を起点とすると `###`（グループ）と `####`（サブグループ）で階層は上限に達する。3 段目のグループは宣言できない仕様とする。

## 2. 完了条件

- `dct-index.schema.yaml` が `groups[].groups[]`（サブグループ）を許可し、グループが `domains` と `groups` のどちらか一方だけを持つことを検証する。
- `catalog build` がサブグループを `#### <章番号>. <名称>` として出力し、章番号が親グループの番号を継承する（例: `### 2.2.` の配下は `#### 2.2.1.`）。
- 見出しは H4 までとし、サブグループの下にさらにグループを宣言した場合は検証エラーにする。
- 既存の 1 段だけの宣言（サブグループなし）が従来どおり動作する。
- 宣言と実体の突き合わせ、および同一ドメインの重複宣言の検出が、入れ子でも機能する。
- `dct-index.yaml` の分類が [[specdojo:deliverables-reference|成果物リファレンス]] の章構成へ揃っている。プロジェクト成果物とプロダクト成果物を第1階層、業務仕様や外部I/F仕様などの節を第2階層とする。
- サイドバーの表示名解決（`.vitepress/config.mts`）が入れ子宣言でも `name` を引ける。
- `dct-index-rulebook` と `dct-index-sample.yaml` が新しい宣言構造と生成物仕様に一致する。
- `npm run typecheck`、`npm run test:unit`、`npm run lint:md`、`npm run validate:schema`、`npm run validate:catalog` が成功する。

## 3. 作業内容

| No  | 作業                                                            | 担当 | 状態 | メモ                                                                               |
| --- | --------------------------------------------------------------- | ---- | ---- | ---------------------------------------------------------------------------------- |
| 1   | schema にサブグループを追加し、`domains` との排他を定義する     | ARC  | open | 深さは1段まで。2段目のサブグループは検証エラー                                     |
| 2   | `buildDctIndexMarkdown` を2階層の採番と見出しレベルへ対応させる | ARC  | open | ドメイン別カタログの `renderSections` が持つ採番方式を参考にする                   |
| 3   | 構造検証を入れ子へ追随させる                                    | ARC  | open | 重複ドメイン、宣言と実体の突き合わせ、深さ超過の検出                               |
| 4   | `dct-index.yaml` をリファレンスの節構成へ再編する               | ARC  | open | 第1階層はプロジェクト成果物とプロダクト成果物、第2階層はリファレンス 2.1〜2.9 の節 |
| 5   | サイドバーの表示名解決が入れ子でも動くことを確認する            | ARC  | open | `.vitepress/config.mts` は `- domain:` と直後の `name:` を読む実装                 |
| 6   | rulebook と sample を更新する                                   | ARC  | open | 宣言構造と生成物仕様の両方                                                         |
| 7   | unit test を追加する                                            | ARC  | open | 入れ子の採番、表分割、後方互換、深さ超過エラー、決定論性                           |

## 4. 対応結果

- `dct-index.schema.yaml` と TypeScript 型へ 1 段のサブグループを追加し、各グループが `domains` と `groups` のどちらか一方だけを持つ構造にした。サブグループは `domains` だけを持てるため、3 段目の宣言は schema と `catalog validate` の両方でエラーになる。
- `buildDctIndexMarkdown` を階層採番へ対応させ、ルートグループを H3、サブグループを親番号を継承した H4 として生成するようにした。従来の `groups[].domains[]` も同じ H3 と表の構成で維持した。
- 宣言ドメインの収集と重複検出を入れ子全体へ対応させ、実在する `dct-*.yaml` との突き合わせがサブグループ内でも機能するようにした。
- プロジェクトの `dct-index.yaml` を「プロジェクト成果物」「プロダクト成果物」の 2 グループと、成果物リファレンスの分類に対応するサブグループへ再編した。
- サイドバーの表示名解決はインデント階層に依存せず `domain` と直後の `name` を読む既存方式で入れ子にも対応できることを確認し、意図を実装コメントへ明記した。
- `dct-index-rulebook` と `dct-index-sample.yaml` を、排他構造、深さ上限、H3/H4 の生成規則、入れ子の記述例に合わせて更新した。
- 単体テストへ入れ子の採番と表分割、従来形式の互換性、入れ子全体の重複検出、深さ超過と排他違反の検証を追加した。
- 残課題はない。

## 5. 関連ドキュメント

- 揃える対象の分類: [[specdojo:deliverables-reference|成果物リファレンス]]
- 生成の規範: [[specdojo:dct-index-rulebook|成果物カタログ（インデックス）作成ルール]]
- 生成の仕組みを導入した項目: [[prj-0001:pjr-269z-dct-index-generation|PJR-269Z dct-index.md を dct-index.yaml から自動生成し、順序とグループ分割を宣言で制御する]]
- 表示名解決の実装: `.vitepress/config.mts`
- 変更対象の実装: `src/catalog-build.ts` の `buildDctIndexMarkdown` と `validateDctIndexStructure`
