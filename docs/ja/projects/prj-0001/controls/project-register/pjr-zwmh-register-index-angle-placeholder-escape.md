---
specdojo:
  id: prj-0001:pjr-zwmh-register-index-angle-placeholder-escape
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-08-22T14:05:29Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-22T22:00:26Z"
  conclusion: register build が索引の表セルへ展開する全項目で、コードスパン外の山括弧プレースホルダをインラインコード化するようにした。連結範囲は拡張子のドットまで含め、文末の句点はコードの外へ戻す。あわせて remark プラグインを拡張し、frontmatter の文字列値に素の山括弧があればビルド前に検知できるようにした。読み戻しはコードスパンを保持したまま扱う。
  register_events:
    - v: 1
      id: reg_44c2f358955370a92147e366d6a28424
      ts: "2026-08-22T14:08:07Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs(register): 索引生成の山括弧エスケープを PJR-ZWMH として起票"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: 登録簿の索引生成で山括弧プレースホルダをインラインコード化し、frontmatter でも検知する
        - field: description
          from: ""
          to: 個票 frontmatter の conclusion などに `dct-<domain>.yaml` のような素の山括弧プレースホルダを書くと、register build がそのまま表セルへ展開し、generated/pjr-index.md で HTML タグとして解釈されて VitePress ビルドが失敗する。remark の山括弧検査は本文の html ノードだけを対象とし、markdownlint も frontmatter を見ず、生成物は gitignore で lint:md の対象外のため、ビルドまで誰も検知できない。生成側でインラインコード化して塞ぎ、あわせて frontmatter 側でも検知できるようにする。
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: high
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: "2026-08-22"
        - field: due
          from: ""
          to: "2026-08-31"
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: b9258a0ec52eab6ec8d2f6c64cb15be76cc14e09
    - v: 1
      id: reg_9c356fbb136008b9f35c3ae32f0c199c
      ts: "2026-08-22T14:09:40Z"
      action: start
      actor: SpecDojo Test
      from_status: open
      to_status: in-progress
      reason: "exec(register PJR-ZWMH): start"
      changes:
        - field: status
          from: open
          to: in-progress
      legacy_commit: cb85bbc1a6a0cd2bfdada03ea9f912205c3aa7aa
      previous_event_id: reg_44c2f358955370a92147e366d6a28424
    - v: 1
      id: reg_ccab11bb4cce0b2179d58df5a55b556d
      ts: "2026-08-22T14:40:10Z"
      action: update
      actor: SpecDojo Test
      from_status: in-progress
      to_status: in-progress
      reason: "exec(register PJR-ZWMH): 登録簿の索引生成で山括弧プレースホルダをインラインコード化し、frontmatter でも検知する"
      changes:
        - field: description
          from: 個票 frontmatter の conclusion などに `dct-<domain>.yaml` のような素の山括弧プレースホルダを書くと、register build がそのまま表セルへ展開し、generated/pjr-index.md で HTML タグとして解釈されて VitePress ビルドが失敗する。remark の山括弧検査は本文の html ノードだけを対象とし、markdownlint も frontmatter を見ず、生成物は gitignore で lint:md の対象外のため、ビルドまで誰も検知できない。生成側でインラインコード化して塞ぎ、あわせて frontmatter 側でも検知できるようにする。
          to: 個票 frontmatter の conclusion などに `dct-<domain>.yaml` のような山括弧プレースホルダをインラインコードにせず書くと、register build がそのまま表セルへ展開し、generated/pjr-index.md で HTML タグとして解釈されて VitePress ビルドが失敗する。remark の山括弧検査は本文の html ノードだけを対象とし、markdownlint も frontmatter を見ず、生成物は gitignore で lint:md の対象外のため、ビルドまで誰も検知できない。生成側でインラインコード化して塞ぎ、あわせて frontmatter 側でも検知できるようにする。
      legacy_commit: bbbd8bb0b5d590eb848aa4aa0b9368be01ee2f0f
      previous_event_id: reg_9c356fbb136008b9f35c3ae32f0c199c
    - v: 1
      id: reg_a7ef44e6377f4514deff89dcbf918549
      ts: "2026-08-22T14:40:46Z"
      action: review
      actor: SpecDojo Test
      from_status: in-progress
      to_status: review
      reason: "exec(register PJR-ZWMH): review"
      changes:
        - field: status
          from: in-progress
          to: review
      legacy_commit: 1dc1d697a04c08859f5d8e822ffa260208a05b20
      previous_event_id: reg_ccab11bb4cce0b2179d58df5a55b556d
    - v: 1
      id: reg_41ee701bcb49580b573ac93199d053e0
      ts: "2026-08-22T22:00:26Z"
      action: close
      actor: SpecDojo Test
      from_status: review
      to_status: done
      reason: "exec(register PJR-ZWMH): close"
      changes:
        - field: status
          from: review
          to: done
        - field: completed
          from: "-"
          to: "2026-08-23"
        - field: conclusion
          from: "-"
          to: register build が索引の表セルへ展開する全項目で、コードスパン外の山括弧プレースホルダをインラインコード化するようにした。連結範囲は拡張子のドットまで含め、文末の句点はコードの外へ戻す。あわせて remark プラグインを拡張し、frontmatter の文字列値に素の山括弧があればビルド前に検知できるようにした。読み戻しはコードスパンを保持したまま扱う。
      legacy_commit: fcb0267ae8fcccf71035c8972b5f2e617679d31a
      previous_event_id: reg_a7ef44e6377f4514deff89dcbf918549
---

# PJR-ZWMH 登録簿の索引生成で山括弧プレースホルダをインラインコード化し、frontmatter でも検知する

## 1. 概要

個票 frontmatter の conclusion などに `dct-<domain>.yaml` のような山括弧プレースホルダをインラインコードにせず書くと、register build がそのまま表セルへ展開し、generated/pjr-index.md で HTML タグとして解釈されて VitePress ビルドが失敗する。remark の山括弧検査は本文の html ノードだけを対象とし、markdownlint も frontmatter を見ず、生成物は gitignore で lint:md の対象外のため、ビルドまで誰も検知できない。生成側でインラインコード化して塞ぎ、あわせて frontmatter 側でも検知できるようにする。

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

| No  | 作業                                                     | 担当 | 状態 | メモ                                                                   |
| --- | -------------------------------------------------------- | ---- | ---- | ---------------------------------------------------------------------- |
| 1   | 表セルへ展開する値の一覧と、変換対象の判定規則を決める   | ARC  | done | 全 12 セルを対象とし、コードスパン外の連結範囲全体を囲む               |
| 2   | `register build` の行生成へインラインコード化を実装する  | ARC  | done | `formatTableRow` で全セルへ共通変換を適用                              |
| 3   | `parsePjrIndex` の読み戻しへの影響を確認し、扱いを決める | ARC  | done | コードスパンを表示値の一部として保持し、再生成時の二重化を防ぐ         |
| 4   | frontmatter 側の検知を追加する                           | ARC  | done | 既存 remark 検査を YAML frontmatter の文字列値へ拡張                   |
| 5   | unit test を追加する                                     | ARC  | done | 変換、二重化防止、コードスパン内不変、読み戻し、frontmatter 検知を追加 |
| 6   | 記述ルールとの整合を確認し、必要ならガイドへ追記する     | ARC  | done | 既存の山括弧規約と一致するためガイド変更は不要                         |

## 4. 対応結果

- 登録簿の行生成で、`title`、`description`、`conclusion` を含む全セルのコードスパン外にある山括弧をインラインコード化した。
- 生成処理と lint に同一の変換規則を適用し、frontmatter の文字列値に素の山括弧がある場合は既存 remark 検査で報告するようにした。表セルでは HTML を許容しないため、`<br>` などの実在タグも frontmatter では検知する。
- `parsePjrIndex` はコードスパンを剥がさず表示値として保持する。このため、旧一覧の読み取り後に再生成してもコードスパンは二重化されない。
- unit test で全表セルへの適用、連結範囲、既存コードスパン、実在 HTML タグ、frontmatter 検知、読み戻しを確認した。残課題はない。

## 5. 関連ドキュメント

- 事象が確認された個票: [[prj-0001:pjr-wvns-planning-artifacts-catalog-scope|PJR-WVNS 計画成果物をカタログへ載せ、専用の planning ドメインとトラックで所有する]]
- 表記規約: `.github/instructions/markdown.instructions.md` の山括弧プレースホルダの節
- 本文側の既存検査: `tools/docs/src/remark-no-unescaped-angle-placeholder.ts`
- 変更対象の実装: `src/register.ts` の索引行生成と `parsePjrIndex`
- 検証スキーマ: `docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml`
