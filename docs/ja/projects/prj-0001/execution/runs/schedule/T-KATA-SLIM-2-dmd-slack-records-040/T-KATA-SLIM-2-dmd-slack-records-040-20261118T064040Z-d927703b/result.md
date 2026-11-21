---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-dmd-slack-records-040-20261118t064040z-d927703b
  type: exec-result
  task_id: T-KATA-SLIM-2-dmd-slack-records-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-dmd-slack-records-040/T-KATA-SLIM-2-dmd-slack-records-040-20261118T064040Z-d927703b/plan.md
  started_at: "2026-11-18T06:40:47.403Z"
  completed_at: "2026-11-18T07:10:08.636Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - prj-0001:dmd-slack-records
    - specdojo:dmd-rulebook
---

# Edit Result

## 1. 実施内容

- `dmd-rulebook` から、どの成果物にも共通する運用の記述を外し、全体方針の「共通の運用」1 項目から [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] を参照する形にした。
- 型固有の判断基準、章構成と必須・条件付きの区分、推奨表、型固有の禁止事項は残した。
- 空白と表の区切り行を除いた文字数は 4,305 字から 3,457 字（80.3%）になった。目安の 8 割をわずかに上回るが、残りは本文 10 章の判断基準と推奨表であり、削ると判断に要る記述を失うため止めた。
- `prettier`、`markdownlint-cli2`、`lint:fm`、`lint:md`、`lint:mermaid`、`lint:d2`、`validate:schema`、`test:unit`、`test:integration` は passed。`lint:ts` と `typecheck` は変更種別により `not_applicable`。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/dmd-rulebook.md`: 運用の記述を外して共通の正本への参照にした（36 行追加・94 行削除）。外したのは、全体方針の運用方針の段落、再現性・実行と検証の段、Frontmatter 項目の表と相対パスの Markdown リンク、記述ガイド各節の見出しを述べる行、禁止事項の『関連ドキュメントの省略』である。変換ルールと除外ルールの未記載の 2 行は 1 行に統合した。足したのは、全体方針の「共通の運用」1 項目と、型固有の禁止事項『文書の整形・lint を移行の検証方法に含める』である。成果物の 10 章の見出しと必須の区分は変えていない。rulebook 自身の章 5 は『本文構成（標準テンプレ）』から『本文要件』に改名した。命名規則はカタログの実際の宣言に合わせ、ファイル名を `dmd-&lt;term&gt;.md` に、文書 ID を `&lt;project-id&gt;:dmd-&lt;term&gt;` に改めた。H1 は `# データ移行設計: &lt;対象名&gt;` とした。

## 3. 申し送り

- grade の finding と成果物からの finding はなかった。成果物 `dmd-slack-records.md` がまだないため、成果物との照合は行っていない。共通の正本への追記は不要と判断した。sample は運用の記述を含まず、見出しが rulebook の表と一致するため変更不要。recipe と template は宣言がない。includes で取り込む記法の rulebook もない。
- 計測用の `tmp/count.py`、`tmp/before.md`、`tmp/dmd-rulebook.before.md` が残っている。`tmp/` は commit の対象外だが、後で削除が必要である。
- 大きさ: 空白（改行を含む）と表の区切り行を除いた文字数で、前 4,305 字（区切り行込み 4,841 字・11,974 B）、後 3,457 字（3,933 字・9,730 B）、比 80.3%。目安の 8 割をわずかに上回るが、残りは本文 10 章の判断基準と推奨表で、削ると判断に要る記述を失うため止めた。
- 外した記述: 全体方針の運用方針の段落（「関連ドキュメント」必須の言い直し）、全体方針の再現性・実行と検証の段（記述ガイドと重なるため 1 項目にまとめた）、Frontmatter 項目の表（`title` を含み今の標準に反し、`type`・`status` は正本の再掲）と相対パスの Markdown リンク、記述ガイド各節の『生成する本文の見出しは…』の行（章 5 の表と重なるため 1 文にまとめた）、禁止事項の『関連ドキュメントの省略』（表の必須と重なる）。変換ルールと除外ルールの未記載の 2 行は 1 行に統合した。
- 足した記述: 全体方針の「共通の運用」1 項目（役割は適用先のメンバー定義、`status`・承認・改訂と廃止・未決事項の引き継ぎは [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]]、整形・lint は移行の検証に含めない）と、型固有の禁止事項『文書の整形・lint を移行の検証方法に含める』。
- 章名の変更: 成果物の 10 章の見出しと必須の区分は変えていない。rulebook 自身の章 5 の名前は『本文構成（標準テンプレ）』から『本文要件』に変えた（rulebook-authoring-standard の標準章構成に合わせるため。成果物の見出しへの影響はない）。
- 命名規則の見直し: ファイル名を `dmd-020-データ移行設計-&lt;term&gt;.md` から `dmd-&lt;term&gt;.md` に、文書 ID にプロジェクト固有の `&lt;project-id&gt;:dmd-&lt;term&gt;` を足した（カタログの実際の宣言 `dmd-slack-records.md` に合わせるため）。H1 は外した Frontmatter 表の `title` の形をそのまま使い `# データ移行設計: &lt;対象名&gt;` とした（それ以外の根拠はない）。
- 根拠とした規範: pjr-8s4t の『他の型へ広げるときの一覧』、改訂済みの sld-rulebook、rulebook-authoring-standard、document-metadata-standard。grade の finding も成果物からの finding もなし（既存の grade result は pass・100 点）。成果物 `dmd-slack-records.md` はまだないため、成果物との照合はしていない。
- 共通の正本への追記: 不要（ドキュメントメタ情報標準で賄える）。sample・recipe・template: 変更なし。dmd-sample は運用の記述を含まず、見出しは rulebook の表と一致する。recipe・template は宣言されていない。includes で取り込む記法の rulebook はない。
- 後片付け: 計測用の `tmp/count.py` と、比較用の改訂前の写し `tmp/before.md`・`tmp/dmd-rulebook.before.md` が残っている（削除コマンドが承認待ちで実行できなかった。`tmp/` は commit の対象外）。
- 適用外の検証: `npm run validate:history-links`（変更は rulebook のみで、pjr 個票・plan・result を変更していないため）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がないため）
- rate limit後に sol-executor から opus-executor へ切り替え、2026-11-18T06:43:49.959Z に再開

## 4. 進め方と実践の型の適用

rulebook-maintenance として、pjr-8s4t の「他の型へ広げるときの一覧」、改訂済みの sld-rulebook、rulebook-authoring-standard、document-metadata-standard を根拠にした。役割、`status`・承認・改訂と廃止、未決事項の管理、文書品質の検査といった共通の運用の記述を外して参照に置き換え、型固有の判断基準と禁止事項は維持した。章名と必須の区分は成果物との対応を保つため変えていない。
