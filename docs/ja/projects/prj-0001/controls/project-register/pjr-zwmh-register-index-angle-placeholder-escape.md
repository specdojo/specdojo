---
specdojo:
  id: prj-0001:pjr-zwmh-register-index-angle-placeholder-escape
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  owner: ARC
  registered_at: "2026-08-22T14:05:29Z"
  due_on: "2026-08-31"
---

# PJR-ZWMH 登録簿の索引生成で山括弧プレースホルダをインラインコード化し、frontmatter でも検知する

## 1. 概要

個票 frontmatter の conclusion などに dct-<domain>.yaml のような素の山括弧プレースホルダを書くと、register build がそのまま表セルへ展開し、generated/pjr-index.md で HTML タグとして解釈されて VitePress ビルドが失敗する。remark の山括弧検査は本文の html ノードだけを対象とし、markdownlint も frontmatter を見ず、生成物は gitignore で lint:md の対象外のため、ビルドまで誰も検知できない。生成側でインラインコード化して塞ぎ、あわせて frontmatter 側でも検知できるようにする。

## 2. 完了条件

- `register build` が索引の表セルへ展開する全項目（`title`、`description`、`conclusion` など）で、素の山括弧プレースホルダがインラインコードへ変換される。
- 変換範囲は Markdown 記述ルールに合わせ、山括弧の前後で英字・数字・ハイフン・アンダースコアが連結している場合はその範囲全体を 1 つのインラインコードで囲む。
- 既にインラインコードで囲まれている箇所は二重に囲まない。コードスパン内の山括弧は変換しない。
- `<br>` のような実在する HTML タグ名も、索引の表セルでは同様に無害化される（セル内改行は記述ルールで禁止のため、HTML として通す必要がない）。
- 生成された `generated/pjr-index.md` と派生ビューに、コードスパン外の素の山括弧が現れない。
- 個票 frontmatter に素の山括弧プレースホルダを書いた場合、`register-item-frontmatter.schema.yaml` の検証または同等の検査で検知され、ビルドを待たずに気付ける。
- `parsePjrIndex` による表の読み戻しが、インラインコード化した値に対しても破綻しない。読み戻し値の扱い（コードスパンを剥がすか、そのまま扱うか）が実装として定まっている。
- 上記を検証する unit test が追加され、`npm run test:unit`、`npm run lint:md`、`npm run validate:schema` が成功する。

## 3. 作業内容

| No  | 作業                                                     | 担当 | 状態 | メモ                                                                              |
| --- | -------------------------------------------------------- | ---- | ---- | --------------------------------------------------------------------------------- |
| 1   | 表セルへ展開する値の一覧と、変換対象の判定規則を決める   | ARC  | open | コードスパン内は対象外。連結範囲全体を囲む                                        |
| 2   | `register build` の行生成へインラインコード化を実装する  | ARC  | open | `src/register.ts` の行組み立て箇所。パイプのエスケープと同じ層で行う              |
| 3   | `parsePjrIndex` の読み戻しへの影響を確認し、扱いを決める | ARC  | open | 移行処理と重複検査から呼ばれる。コードスパンを剥がすかを判断する                  |
| 4   | frontmatter 側の検知を追加する                           | ARC  | open | `register-item-frontmatter.schema.yaml` の pattern など、既存の検証経路を優先する |
| 5   | unit test を追加する                                     | ARC  | open | 変換、二重化しないこと、コードスパン内不変、読み戻しの往復                        |
| 6   | 記述ルールとの整合を確認し、必要ならガイドへ追記する     | ARC  | open | Markdown 記述ルールの山括弧規約と同じ扱いにする                                   |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- 事象が確認された個票: [[prj-0001:pjr-wvns-planning-artifacts-catalog-scope|PJR-WVNS 計画成果物をカタログへ載せ、専用の planning ドメインとトラックで所有する]]
- 表記規約: `.github/instructions/markdown.instructions.md` の山括弧プレースホルダの節
- 本文側の既存検査: `tools/docs/src/remark-no-unescaped-angle-placeholder.ts`
- 変更対象の実装: `src/register.ts` の索引行生成と `parsePjrIndex`
- 検証スキーマ: `docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml`
