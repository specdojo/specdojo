---
specdojo:
  id: prj-0001:pjr-bkq0-generated-blank-after-finding-removal
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-09-10T12:50:48Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-10T13:18:34Z"
---

# PJR-BKQ0 finding 除去後の空行が畳まれず生成物が lint に失敗する

## 1. 概要

[[prj-0001:pjr-say1-template-finding-comments]] で生成時に `specdojo:finding` コメントを除去した
が、除去後の空行が畳まれない。生成物に連続空行が残り `lint:md` が MD012 で失敗する。

```text
docs/ja/projects/prj-0001/controls/generated/pm-decision-log.md:13 error MD012/no-multiple-blanks
docs/ja/projects/prj-0001/controls/generated/pm-change-request-log.md
docs/ja/projects/prj-0001/controls/project-register/generated/pjr-views-by-status.md
```

## 2. 発生の経路

テンプレートには grade が挿入した finding コメントが本文の先頭付近にある。

```text
（空行）
# 決定記録
（空行）
<!-- specdojo:finding id=F001 severity=major rule=vp-arc-cross-document-consistency ... -->
<!-- specdojo:finding id=F002 ... -->
```

生成時にコメント行を除去すると、直前の空行と直後の空行が隣接して連続空行になる。

```text
（空行）
# 決定記録
（空行）
（空行）   ← コメントがあった位置
> この…
```

## 3. 影響

3 件の生成物が `lint:md` を通らない。いずれも `.gitignore` 対象のため commit は妨げないが、
`lint:md` が常に失敗する状態が続く。pre-commit hook で `lint:md` が走るため、関係のない変更でも
この失敗に出会う。

検証の信頼性が下がる。常に失敗する項目があると、本当の違反を見落とす。

## 4. 対処

コメントの除去と同時に空行を正規化する。[[prj-0001:pjr-20dv-grade-content-hash-normalization]] で
`stableContentHash` へ導入した処理と同じ形が使える。

```typescript
.replace(/\n{3,}/g, "\n\n")
```

PJR-20DV はハッシュ計算時の正規化で、生成物そのものは変えていない。本件は生成物の内容を正規化
する必要がある。

## 5. 完了条件

- finding コメントを含むテンプレートから生成した文書に連続空行が残らない。
- `lint:md` が MD012 で失敗しない。
- コメントがない位置の空行は変化しない。意図的な空行を畳まない。
- テンプレートへ finding が挿入された状態で生成し、lint が通ることを検証するテストがある。

## 6. 作業内容

| No  | 作業                             | メモ                                         |
| --- | -------------------------------- | -------------------------------------------- |
| 1   | 除去処理へ空行の正規化を加える   | 完了: finding を含む空白ブロックだけを正規化 |
| 2   | 生成を再実行して lint を確認する | 完了: 3 件を含む生成物の lint 成功           |
| 3   | テストを追加する                 | 完了: finding 挿入済みテンプレートで検証     |

## 7. 対応結果

- `stripSpecdojoFindingComments` で finding コメントと隣接空行からなるブロックを検出し、コメント除去後の空行を1行へ畳むようにした。finding を含まない空白ブロックは変更しない。
- finding が空行を挟んで複数並ぶ場合の平坦化結果を単体テストへ追加した。
- 登録項目の生成テストへ finding 前後の空行を含むテンプレートを与え、生成物に finding が複製されず、プロジェクトの markdownlint 設定で違反がないことを確認する回帰テストを追加した。
- 登録簿と派生ビューを再生成し、報告されていた3生成物を含む Markdown の lint が成功することを確認した。残課題はない。

## 8. 関連ドキュメント

- [[prj-0001:pjr-say1-template-finding-comments]]: 生成時の finding 除去。本件の発生元。
- [[prj-0001:pjr-20dv-grade-content-hash-normalization]]: 同種の空行正規化。
- [[prj-0001:pjr-88k2-grade-apply-trailing-blank]]: grade apply の末尾空行。類似の事象。
