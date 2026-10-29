_FRONTMATTER_

# Edit Result

この human タスクは雛形作成と文脈の記入を担当する。plan は生成せず、claim / complete で状態を記録する。対象は frontmatter の `targets` を成果物カタログで確認する。

1. `specdojo deliverable scaffold --project <project-id> --dct <catalog>` で対象カタログの未作成成果物を雛形から生成する。既存ファイルは上書きしない。`--force` は指定しない。
2. 対象本文の必要な箇所に `_CONTEXT_:` を付け、固定前提・制約・調査や選定を任せる範囲を記入する。例: `_CONTEXT_: 既存 API を維持し、認証方式の候補を調べて提案してほしい。`
3. 以下へ対象ファイルと記入した文脈を記録し、`specdojo exec complete --project <project-id> --task <task-id> --by <human>` で完了する。後続の agent が draft で文脈を下書きへ反映する。

## 1. 実施内容

_TODO_: 雛形の作成有無と記入した文脈を記録する。

## 2. 変更ファイル

_TODO_: 雛形を作成した、または文脈を記入した成果物のパスを記録する。

## 3. 申し送り

_TODO_: 後続の draft へ渡す前提・委任範囲・確認事項を記録する（なければ削除）。

_APPROACH_SECTION_
