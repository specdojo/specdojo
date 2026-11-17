---
specdojo:
  id: prj-0001:xer-t-kata-slim-prj-charter-040-20261117t154110z-78ecba8b
  type: exec-result
  task_id: T-KATA-SLIM-prj-charter-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-prj-charter-040/T-KATA-SLIM-prj-charter-040-20261117T154110Z-78ecba8b/plan.md
  started_at: "2026-11-17T15:41:17.127Z"
  completed_at: "2026-11-17T16:17:12.835Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - prj-0001:prj-charter
    - specdojo:prj-charter-rulebook
---

# Edit Result

## 1. 実施内容

- `prj-charter-rulebook.md` から、文書に共通する運用の記述を外し、共通の正本への参照に置き換えた。全体方針に「共通の運用」を1項目だけ置いた。役割は適用先のメンバー定義、状態管理・承認・改訂と廃止・未決事項の引き継ぎは `document-metadata-standard` を参照する。
- 共通の禁止事項、改訂時の再承認手順、管理用の担当・期限要件、共通記法の再掲、空の表の骨組みを削った。
- 認可範囲、権限委譲、予算枠、承認履歴の標準列、GO / Not GO の観点と合格条件、未決事項の論点・影響・当面の扱いは、維持または具体化した。
- 空白と改行を除いた全文の文字数は 5,926 字から 4,430 字になり、74.76% になった。目安の8割以下を満たす。sld 試行と同じく表の区切り行も除く場合は 5,412 字から 4,217 字で、77.92% だった。
- grade の finding は F001〜F007 のうち、F001・F002・F003・F005・F006・F007 を rulebook の範囲で反映した。F004 は編集範囲外の sample に関わるため未解消で、申し送りに残した。
- executor の Prettier 検査と `git diff --check` は合格した。runner の `lint:fm`・`lint:md`・`lint:mermaid`・`lint:d2`・`validate:schema`・`test:unit`・`test:integration` も合格した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/prj-charter-rulebook.md`: 全体方針に「共通の運用」を1項目だけ置き、役割・状態管理・承認・改訂と廃止・未決事項の引き継ぎを共通の正本参照にした。共通禁止事項、再承認手順、担当・期限による管理要件、共通記法の再掲、本文要件を言い直すだけの用語表を削った。第2章は「位置づけと用語定義」から「位置づけ」に改め、予算枠の費用・外部支出・運用負担と GO / Not GO の区分は記述ガイドへ移した。スポンサーと PO の表記は「承認責任者」に統一した。`status`（文書の成熟度）と承認履歴（認可状態）は独立した軸と明記した。AI Agent の支援範囲は、AI Agent を利用するプロジェクトに限る条件付き要件にした。成果物の9章の名称・順序・必須8章／任意1章は変えていない。

## 3. 申し送り

- F004 は未解消。sample の実在する概要・ステークホルダー登録簿への相対 Markdown リンクを、`specdojo:prj-overview-sample` と `specdojo:prj-stakeholder-register-sample` の wikilink に変える案を申し送る。sample は今回の編集範囲外のため変えていない。次のアクションは sample 側の改訂。
- recipe・template・sample は commit の対象外のため変えていない。次段で合わせる案は4点。(1) sample の本文「ドラフト」を「立ち上げ認可は未承認」に改め、`status: ready` と矛盾しないようにする。(2) template に AI Agent の支援活動・委譲範囲の記入指示を足し、sample も同じ前提なら対応する活動を追記する。(3) recipe の PO 固定表現を「承認責任者」にそろえ、成果物カタログの PO との対応を確認する。(4) recipe・sample・template の共通役割説明と担当・期限による未決事項管理を整理する。template の生成物 Frontmatter の `status: ready` は `draft` にする。
- 共通の正本への補足案。`document-metadata-standard` のライフサイクル規定には、承認を要する文書の重要な内容変更後の再承認条件が明示されていない。承認対象を変える内容変更では、変更後の文書状態と承認意思を特定できる証跡を記録する、という規定の追加を検討する。今回削除した憲章固有の再承認手順は rulebook に戻さない。
- 変更ファイルは docs/ja/specdojo/rulebooks/prj-charter-rulebook.md のみ。成果物本体、recipe、template、sample、grade サイドカー、result は編集していない。result の記入は reporter に委ねる。
- 判断根拠: 共通 exec 規約、[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]、[[specdojo:document-metadata-standard|ドキュメントメタ情報標準]]、[[specdojo:pm-review-viewpoints|共通レビュー観点一覧]] の該当5観点、[[prj-0001:pjr-8s4t-sld-kata-slim-pilot|sld 試行]]、[[specdojo:sld-rulebook|sld 作成ルール]]、憲章の recipe・sample・template、prj-0001 の憲章・概要・ステークホルダー登録簿・メンバー定義・ロール一覧・成果物カタログ、憲章と対象 rulebook の grade result を確認した。plan の source=grade 相当は F001〜F007、source=condense の記録はない。
- 実施内容: 全体方針に「共通の運用」を1項目設けた。役割は適用先のメンバー定義、状態管理・承認・改訂廃止・未決事項の引き継ぎはメタ情報標準へ委譲した。共通禁止事項、改訂時の再承認手順、管理用の担当・期限要件、共通記法の再掲、空の表の骨組みを削った。認可範囲、権限委譲、予算枠、承認履歴の標準列、GO / Not GO の観点・合格条件、未決事項の論点・影響・当面の扱いは維持・具体化した。
- F001・F006: 冒頭文の記載要件を「共通」に集約し、本文構成直後と同節内の重複指示を削除した。F002・F007: rulebook 内を「承認責任者」に統一し、スポンサーと PO の対応は適用先のメンバー定義を正本とした。recipe の PO 固定表現も次段で共通語へそろえ、カタログの PO が適用先の承認責任者と対応することを確認する。
- F003: 文書の成熟度を示す `status` と、プロジェクトの認可状態を示す承認履歴を独立した軸として明記した。sample の `status: ready` と本文の「ドラフト」の不整合は編集範囲外のため残る。変更案: sample の本文を「立ち上げ認可は未承認」とし、文書の成熟度と混同しない表現へ更新する。
- F004 は未解消。sample の実在する概要・ステークホルダー登録簿への相対 Markdown リンクを、それぞれ `specdojo:prj-overview-sample`・`specdojo:prj-stakeholder-register-sample` の wikilink へ変更する案を申し送る。その他のバッククォート参照は実在する適用先を確定してから更新し、未作成のものは仮置きを維持する。根拠は確認済みだが、sample が今回の編集範囲外のため変更していない。
- F005: AI Agent の支援範囲の記載を、AI Agent を利用するプロジェクトに限る条件付き要件とした。template には利用時の支援活動・委譲範囲を記入する指示を追加する案を申し送る。sample も AI Agent を利用する設定なら対応する活動を追記する。共通の agent 禁止事項は再掲しない。
- 章名の変更理由: rulebook の第2章を「位置づけと用語定義」から「位置づけ」に変更し、本文要件を言い直す用語表と下位見出しを削除した。固有の意味を持つ予算枠の費用・外部支出・運用負担と、GO / Not GO の継続・再計画・中止の区分は記述ガイドへ移した。成果物の9章の名称・順序・必須8章／任意1章は変更していない。
- 文字数は全文の空白・改行を除いて 5,926→4,430 字、74.76%（25.24%削減）。sld 試行と同じく表の区切り行も除く場合は 5,412→4,217 字、77.92%。Frontmatter 不変、成果物の9章の名称・順序・必須区分不変、共通運用1項目、変更対象が rulebook のみであることも確認した。
- 共通正本の補足案: メタ情報標準のライフサイクル規定には、承認を要する文書の重要な内容変更後の再承認条件が明示されていない。『承認対象を変える内容変更では、変更後の文書状態と承認意思を特定できる証跡を記録する』という共通規定の追加を検討する。今回削除した憲章固有の再承認手順を rulebook へ戻さず、正本側で整理する。
- 次段の整合案: recipe・sample・template の共通役割説明と担当・期限による未決事項管理を整理し、論点・影響・当面の扱いへ寄せる。template の生成物 Frontmatter の `status: ready` は共通標準に従って `draft` とする案を申し送る。今回の改訂では、これらの文書と不一致になる箇所は rulebook を正としている。
- 適用外の検証: `npm run validate:schema:file`（変更ファイルは Markdown rulebook のみで、YAML の変更がない。）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下に達しない。）
- 適用外の検証: `npm run validate:history-links`（executor が変更した履歴ファイル、既存 plan、result はない。）

## 4. 進め方と実践の型の適用

根拠は、共通 exec 規約、`rulebook-authoring-standard`、`document-metadata-standard`、`pm-review-viewpoints`、sld 試行の個票 `pjr-8s4t-sld-kata-slim-pilot`、改訂済みの `sld-rulebook` である。あわせて、憲章の recipe・sample・template、prj-0001 の憲章・概要・ステークホルダー登録簿・メンバー定義・ロール一覧・成果物カタログ、憲章と対象 rulebook の grade result も確認した。plan に展開された finding は F001〜F007 で、`source=condense` の記録はない。 共通運用に当たる記述（役割、状態管理・承認・改訂と廃止、文書品質の検査、未決事項の管理台帳の区分）は外し、共通の正本への参照にした。型固有の判断基準、標準の列と章の受入条件、良い例・悪い例、型固有の禁止事項、GO / Not GO の観点、未決事項の論点と影響は残した。章名と必須・条件付きの区分は、成果物の9章については変えていない。rulebook 自身の第2章だけ、用語表を削ったため「位置づけ」に改めた。recipe・sample・template と記述が食い違う箇所は rulebook を正とした。 各 finding の扱いは次のとおり。 - F001・F006: 冒頭文の記載要件を「共通」に集約し、重複していた指示を削除して解消した。 - F002・F007: rulebook 内を「承認責任者」に統一し、スポンサーと PO の対応は適用先のメンバー定義を正本とした。 - F003: `status` は文書の成熟度、承認履歴は認可状態という独立した軸だと明記した。sample の本文は編集範囲外のため、変更案として申し送った。 - F004: sample の改訂が必要で、今回は未解消。根拠は確認済みで、次のアクションは handoff に記載した。 - F005: AI Agent の支援範囲を、AI Agent を利用するプロジェクトに限る条件付き要件とした。template と sample の追記案は handoff に記載した。
