---
specdojo:
  id: prj-0001:pjr-0142-vs-code-specdojo
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: low
  owner: ARC
  due_on: "2026-10-31"
---

# PJR-0142 ドキュメント編集ガイドにVS Code拡張とSpecDojo拡張の説明を追加

## 1. 概要

[[specdojo:docs-editing-guide]] に、文書編集で用いる VS Code 拡張と SpecDojo 拡張の説明を追加する。

[[prj-0001:pjr-gx9d-vscode-extension-consolidation]] で定めた集約方針の 4 番目にあたる。
当初は [[prj-0001:pjr-0143-vs-code-marketplace]] の公開後に記述する順序だったが、公開に依存するのは
導入手順の 1 箇所だけであり、他は現時点で記述できる（2026-09-15 の判断）。導入手順は Marketplace
公開前の現行経路（vsix）で記述し、公開後の差し替えは PJR-0143 の作業とする。

## 2. 現状

`.vscode/extensions.json` は次を推奨するが、ガイドに説明がない。

```json
{ "recommendations": ["unifiedjs.vscode-remark", "davidanson.vscode-markdownlint"] }
```

SpecDojo 拡張そのものも推奨に含まれておらず、利用者は存在を知る手段がない。ガイドは
`Format Markdown Table` タスクを名指しで参照しており、拡張へ集約した後は記述の追従が要る。

## 3. 完了条件

- ガイドに、文書編集へ必要な VS Code 拡張とその役割が記載されている。
- SpecDojo 拡張の導入手順が記載されている。Marketplace 公開前は `packages/vscode-specdojo` で
  `npm run package` して `code --install-extension` する vsix の手順とし、公開後に Marketplace からの
  導入へ差し替える旨を明記する。
- 拡張が提供する機能（`[[id]]` のリンク表示、ID による文書を開く、表整形）が説明されている。
- `Format Markdown Table` タスクを参照する既存の記述が、拡張のコマンドへ追従している。
  対象は [[specdojo:docs-editing-guide]] と [[specdojo:guide-authoring-standard]]。
- `.vscode/extensions.json` の推奨へ SpecDojo 拡張を追加する時期を判断し、結果が反映されている。
  Marketplace 未公開の拡張 ID を推奨に入れると VS Code が見つからないと表示するため、公開後に
  追加する判断であれば、その旨を PJR-0143 の作業として記録する。
- `npm run -s lint:md` と `npm run docs:build` が通る。

## 4. 検討事項

- 拡張を必須とするか推奨に留めるかを決める。必須にすると VS Code 以外の利用者を排除する。
  表整形は CLI からも実行できるため、拡張なしでも作業は成立する。
- タスクの撤去時期を判断する。集約方針では移行期間として当面残すとしている。ガイドの記述を
  拡張へ寄せた時点で、タスクを非推奨として明示するかを決める。

## 5. 作業内容

| No  | 作業                                | 担当 | 状態 | メモ                            |
| --- | ----------------------------------- | ---- | ---- | ------------------------------- |
| 1   | 必要な VS Code 拡張と役割を記載する | ARC  | open | remark、markdownlint ほか       |
| 2   | SpecDojo 拡張の導入手順を記載する   | ARC  | open | 公開前は vsix、公開後に差し替え |
| 3   | 提供機能を説明する                  | ARC  | open | リンク表示、文書を開く、表整形  |
| 4   | タスク参照の記述を追従させる        | ARC  | open | ガイドと standard の2箇所       |
| 5   | `extensions.json` の推奨を判断する  | ARC  | open | 公開後に追加する判断を記録      |

## 6. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 7. 関連ドキュメント

- [[prj-0001:pjr-gx9d-vscode-extension-consolidation]]: 集約方針。本項目はその3番目。
- [[prj-0001:pjr-0143-vs-code-marketplace]]: 公開後に導入手順の差し替えと `extensions.json` への追加を行う。
- [[specdojo:docs-editing-guide]]: 記載先。
- [[specdojo:guide-authoring-standard]]: タスク参照の追従先。
