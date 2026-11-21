---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-cop-index-040-20261118t062935z-546a8167
  type: exec-result
  task_id: T-KATA-SLIM-2-cop-index-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-cop-index-040/T-KATA-SLIM-2-cop-index-040-20261118T062935Z-546a8167/plan.md
  started_at: "2026-11-18T06:29:45.621Z"
  completed_at: "2026-11-18T06:59:42.666Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - prj-0001:cop-index
    - specdojo:cop-index-rulebook
---

# Edit Result

## 1. 実施内容

- `cop-index-rulebook` から、どの成果物にも共通する文書の運用の記述を外し、全体方針の「共通の運用」1 項目から共通の正本を参照する形にした。
- 本文構成と記述ガイドを、章ごとの内容と受入条件の表にまとめた。
- Frontmatter の誤り（`title` の記載、`rulebook` の欠落）を直した。
- F001〜F009・F011・F012 は rulebook 側で解消した。F010 は sample 側の問題のため未解消である。
- 章名は「位置づけと用語定義」から「位置づけ」に変えた。10 章構成と全章必須は維持した。
- 空白と表の区切り行を除いた文字数は 2,747 字から 2,350 字（85.5%）になった。目安の 8 割には届いていない。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/cop-index-rulebook.md`: 共通の運用の記述（役割、status、承認、改訂と廃止、未決事項の管理）を外し、「共通の運用」への参照にした。本文構成と記述ガイドは、章ごとの内容と受入条件の表にまとめた。Frontmatter の `title` と `rulebook` 欠落を修正した。「位置づけと用語定義」章は「位置づけ」に改めた。finding への対応として、対象外の明示、公開範囲の分け方、計画変更時の再周知、関係先変更時の見直し、型固有の良い例・悪い例を足した。差分は 45 行追加、131 行削除である。

## 3. 申し送り

- F010 の sample 改訂は、この段では行っていない。sample は commit 対象外のため変更案として残る。10 章構成と駄菓子屋の文脈で sample を書き直す todo が必要である。
- 文字数が目安の 8 割を超えたのは、finding が求める記述を足したためである。さらに削るかは人が判断する。
- 計画の成果物 `docs/ja/projects/prj-0001/060-migration-planning/cop-index.md` が存在しないため、成果物と照らした見直しはできていない。成果物ができたら、受入条件が実態に合うか確かめる。
- 大きさ: 空白と表の区切り行を除いた文字数は前 2,747 字、後 2,350 字（85.5%）で、目安の 8 割を超えた。finding が求める記述（対象外の明示、公開範囲の分け方、計画変更時の再周知、関係先変更時の見直し、型固有の良い例・悪い例）を足したため。削るかは人が判断する。
- F010（major）未解消: `specdojo:cop-index-sample` は今の 10 章構成になっておらず、完成例として使えない。sample はこの段の commit 対象外のため変更案として残す。10 章構成と駄菓子屋の文脈で sample を書き直す todo が必要。
- 章名の変更: 「位置づけと用語定義」を「位置づけ」にした。用語定義を外したためで、rulebook 作成標準の「用語定義が不要な場合は章を位置づけとする」に従った。10 章の章名と全章必須は変えていない。
- 根拠: 計画の成果物 `docs/ja/projects/prj-0001/060-migration-planning/cop-index.md` は存在せず、成果物と照らした見直しはできていない。成果物が作られたら、rulebook の受入条件が実態に合うか確かめる。
- 共通の正本への追記: 不要と判断した。ドキュメントメタ情報標準の「文書の改訂・廃止とライフサイクル変更管理」と「成果物の値制約」で、外した記述をまかなえる。recipe・template は `undecided` で、取り込む記法の rulebook もない。
- rate limit後に sol-executor から opus-executor へ切り替え、2026-11-18T06:32:51.016Z に再開

## 4. 進め方と実践の型の適用

rulebook-maintenance の進め方に沿い、finding の判定根拠と `docs/ja/specdojo/standards/document-metadata-standard.md` を根拠にした。共通の運用の記述は共通の正本への参照に置き換え、型固有の判断基準、受入条件、禁止事項は残した。共通の正本への追記は不要と判断した。recipe・template は `undecided` で、取り込む記法の rulebook もない。F010 は sample 側の問題のため、rulebook は変更せず上記の申し送りとした。prettier と markdownlint、runner の `lint:fm`・`lint:md`・`validate:schema`・テストはいずれも通過した。
