---
specdojo:
  id: prj-0001:xep-t-kata-wave-4-nfr-reliability-sample-040-20261123t053111z-e9167705
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-4-nfr-reliability-sample-040
  name: "rulebook を簡潔にする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: rulebook-maintenance
  targets:
    - specdojo:nfr-reliability-sample
    - specdojo:nfr-reliability-rulebook
---

# Edit Plan: T-KATA-WAVE-4-nfr-reliability-sample-040

## 1. このフェーズで行うこと

対象の sample が従う rulebook を、grade のし直しの指摘（run id regrade-kata-2026-11-21 と、その後の最新の grade）と成果物の done_criteria に沿って簡潔に整える。rulebook に完成例の章を置かず、完成例は sample に任せる。見出しは H4 までにする。sample・recipe・template はこの段で変更しない。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。rulebook が frontmatter の includes で記法の rulebook（`<name>-mermaid-rulebook` など）を取り込む場合は、記法の rulebook もこの段で簡潔にする。
grade が pass の型は、grade の指摘、冗長な記述、ほかの型との重なりのように理由のある箇所だけを直し、理由のない書き換えはしない。直さなかった箇所と理由を result に書く。
PJR-76N9 の決まりに従い、rulebook の「誰がどの利用場面で何を判断するか」は「どの利用場面で何を判断するための文書か」に直し、成果物の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を求めない。承認と留保は登録簿の個票で追う。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 信頼性要件の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、信頼性要件の完成例を示す
- `path`: `docs/ja/specdojo/samples/nfr-reliability-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-4-nfr-reliability-sample-040/T-KATA-WAVE-4-nfr-reliability-sample-040-20261123T053111Z-e9167705/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/nfr-reliability-rulebook.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **ARC（Architect）**
- 責務: rulebook、recipe、sample、template、成果物カタログの構造整合と技術制約を整理する。

このロールが重視するレビュー観点:

- 文書構造・配置・命名: frontmatter、ID、ファイル名、配置、見出し、リンクがプロジェクトの文書体系と整合しているか。
- 成果物間整合: 成果物について、成果物カタログ、Schedule、RACI、組織定義、メンバー定義、生成物と矛盾していないか。不整合の finding は突き合わせ先の文書 ID またはパスと、双方の相反する記述を特定する。rulebook、recipe、sample、template の内部・相互・適用先との整合は vp-qe-kata-conformance で判定し、この観点では扱わない。
- 技術前提・制約の明確性: 技術的な前提、制約、外部依存、構成判断が必要な範囲で明示されているか。
- 冗長性・簡潔性: 各節が固有の判断または手順に寄与し、同じ主張の繰り返し、表と本文の二重の説明、図をなぞる文、目的に要らない背景、正本の再掲がないか。判断に要る背景・制約・例外・完了条件が残されていれば下限を満たしているとする。長さだけでは fail にせず、削る・まとめる・参照に置き換えることで判断情報を失わない箇所を具体的に特定できる場合のみ minor とする。
- 文書責務の単一性: 文書の中心主題と責務境界が一つに定まり、各章がその責務に直接寄与しているか。独立して参照・更新できる主題が複数あり、対象読者・利用時点が異なる、または別々の sample・recipe・template に対応する場合は分割を検討する。分量や対応する実践の型の数だけでは不備としない。同一主張の反復や正本の過剰な再掲は vp-arc-conciseness で判定し、この観点では扱わない。

## 4. 進め方

参照の向きを「成果物 → rulebook」に切り替え、対象成果物に紐づく rulebook を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-po-purpose-alignment; line=5; anchor=``"本ドキュメントは、非機能要件のうち信頼性（障害抑止・誤動作防止・継続稼働）を定義する `nfr-reliability` の作成ルールを定義する。"``\]: ``冒頭の「継続稼働」とサンプルの「復旧性」が `nfr-availability`（停止許容・RTO/RPO）と重なるため、「位置づけ」に可用性との責務の境界（信頼性は障害の発生抑止・誤動作防止・自動回復、停止許容・復旧目標は可用性）を明記すること。``
- F002 \[minor/vp-po-decision-readiness; line=13; anchor=``"- **共通の運用**: 役割の割り当ては適用先のメンバー定義に、`status` の昇格と承認、改訂と廃止、未決事項の登録簿への引き継ぎは [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] に従い、本書と成果物で言い直さない。文書の整形・lint はリポジトリの検証で扱い、「測定・検証方法」に含めない。"``\]: ``Frontmatter の `recipe`・`template` が `undecided` のままで判断の論点や時期が示されていないため、要否判断の論点を明記するか、判断して宣言を確定すること。``
- F003 \[minor/vp-po-publication-accountability; line=117; anchor=`"| nfr-rel-001 | 障害ログから月次障害率を集計 | 月次レビュー   | SRE    |"`\]: `サンプルの判定者「SRE」は共通サンプル文脈とメンバー定義の Role code に対応しないため、適用先の Role code で記述し、判定責任の主体を明確にすること。`
- F004 \[minor/vp-pm-plan-feasibility; line=24; anchor=``"- 生成対象ドキュメントIDは `nfr-reliability` を推奨する。"``\]: ``「ファイル命名・ID規則」に配置先ディレクトリとファイル名が書かれていないため、`docs-structure-guide` に沿った配置先とファイル名を明記すること。``
- F005 \[minor/vp-pm-dependency-risk; line=68; anchor=``"- `nfr-index`、`sac-*`、`opd-*`、`opr-*`、`dec-*` への導線を置く。"``\]: ``「位置づけ」で検証先に挙げた `stc-*` が関連ドキュメント導線のガイドから抜けているため、両者の参照先一覧を揃えること。``
- F006 \[minor/vp-pm-control-reporting; line=64; anchor=`"- 要件IDごとに、監視・テスト・レビューのどこで、いつ、誰が判定するかを明記する。"`\]: `測定・検証方法のガイドに、判定で基準未達だった場合の転記先（課題・PJR など）と対応方針の記載要否を加えること。`
- F007 \[minor/vp-ba-business-value; line=51; anchor=`"- 業務継続に対する信頼性要求の目的を 1〜3文で示す。"`\]: `概要のガイドが「目的を1〜3文」に留まるため、対象業務と障害時の業務影響（放置時の影響）を書くよう指示を加え、基準値の根拠をたどれるようにすること。`
- F008 \[minor/vp-ba-requirements-completeness; line=60; anchor=`"- 指標例：障害率（処理失敗・異常終了の発生割合）、MTBF（平均故障間隔）、再試行成功率。"`\]: ``障害率などの割合指標について、分子と分母（対象処理・期間）を定義するよう記述ガイドに明記し、サンプルの `nfr-rel-001` も分母を示すこと。``
- F009 \[minor/vp-ba-stakeholder-clarity; line=117; anchor=`"| nfr-rel-001 | 障害ログから月次障害率を集計 | 月次レビュー   | SRE    |"`\]: `サンプルの判定者を共通サンプル文脈の関係者または Role code に置き換え、確認者を特定できるようにすること。`
- F010 \[minor/vp-arc-technical-constraints; line=111; anchor=`"| nfr-rel-002 | 障害発生時に自動再試行で復旧できること | 再試行成功率 | 95% 以上       | 3回まで再試行    |"`\]: ``サンプル `nfr-rel-002` の備考「3回まで再試行」が実装設定値の列挙に当たり得るため、品質基準（再試行を含めた成功率など）として表現するか、要件として許される条件の境界を禁止事項に明記すること。``
- F011 \[minor/vp-arc-conciseness; line=6; anchor=`"信頼性要件は、障害の予防・検知・回復を測定可能な基準で記述する。"`\]: `冒頭の「測定可能な基準で記述する」と「全体方針」の「合否判定可能にする」が同じ主張のため、どちらかに統合すること。`
- F012 \[minor/vp-arc-single-responsibility; line=17; anchor=``"- `nfr-reliability`：信頼性要求の正本"``\]: ``「位置づけ」に `nfr-availability` との境界（復旧目標・停止許容は可用性側）を記載し、信頼性の責務範囲を一つに定めること。``
- F013 \[minor/vp-dev-implementation-readiness; line=24; anchor=``"- 生成対象ドキュメントIDは `nfr-reliability` を推奨する。"``\]: ``推奨する文書 ID を `＜project-id＞:nfr-reliability` のようにプロジェクトで修飾した形で示し、サンプルの `id` と `part_of` も合わせること。``
- F014 \[minor/vp-dev-change-impact; line=17; anchor=``"- `nfr-reliability`：信頼性要求の正本"``\]: ``復旧に関する定義を変更するときに `nfr-availability` へ波及することが読み取れないため、関連文書として可用性 rulebook との関係を「位置づけ」に挙げること。``
- F015 \[minor/vp-dev-testability; line=117; anchor=`"| nfr-rel-001 | 障害ログから月次障害率を集計 | 月次レビュー   | SRE    |"`\]: ``サンプルの測定・検証方法が月次レビューだけのため、少なくとも1件はテストでの判定（`sac-*`／`stc-*` との対応）を例示すること。``
- F016 \[minor/vp-qe-verifiability; line=110; anchor=`"| nfr-rel-001 | 会計処理は障害率を基準内に保つ         | 障害率       | 月次 0.1% 以下 | 対象外: 計画停止 |"`\]: ``サンプル `nfr-rel-001` の障害率は分母（会計処理件数など）が不明で pass/fail を一意に判定できないため、算出式を備考または内容に明記すること。``
- F017 \[minor/vp-qe-omissions-consistency; line=122; anchor=``"- `nfr-index`（必須）、`sac-*`（必須）、`opr-*`（必須）、`dec-*`（任意）"``\]: ``関連ドキュメント導線の対象と必須・任意が「位置づけ」・記述ガイド・サンプルで一致しないため（`stc-*`・`opd-*` の有無、必須指定の有無）、記述ガイドに必須・任意を定義し、3か所を揃えること。``
- F018 \[major/vp-qe-kata-conformance; line=1; anchor=`"# 非機能要件 / 信頼性 作成ルール"`\]: `指定サンプル(nfr-reliability-sample.md)の構成を、第5章で定義した必須構成(順序固定)に準拠させること。`
- F019 \[minor/vp-ux-readability; line=5; anchor=``"本ドキュメントは、非機能要件のうち信頼性（障害抑止・誤動作防止・継続稼働）を定義する `nfr-reliability` の作成ルールを定義する。"``\]: `冒頭で信頼性と可用性の違いを一文で示し、読み手が記載先を判断できるようにすること。`
- F020 \[minor/vp-ux-language-consistency; line=117; anchor=`"| nfr-rel-001 | 障害ログから月次障害率を集計 | 月次レビュー   | SRE    |"`\]: `判定者を Role code に統一し、「継続稼働」「復旧性」など信頼性の観点を表す用語をどちらか一方に揃えること。`
- F021 \[minor/vp-ops-release-readiness; line=13; anchor=``"- **共通の運用**: 役割の割り当ては適用先のメンバー定義に、`status` の昇格と承認、改訂と廃止、未決事項の登録簿への引き継ぎは [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] に従い、本書と成果物で言い直さない。文書の整形・lint はリポジトリの検証で扱い、「測定・検証方法」に含めない。"``\]: ``ready 化の前に解消すべき事項（sample の構成準拠、`recipe`・`template` の要否判断）が識別できないため、PJR などで追跡できるよう明示すること。``
- F022 \[minor/vp-ops-operability; line=64; anchor=`"- 要件IDごとに、監視・テスト・レビューのどこで、いつ、誰が判定するかを明記する。"`\]: `測定・検証方法のガイドに、基準未達や重大障害の発生時に要件や基準を見直す契機と、その記録先を記述するよう加えること。`
- F023 \[minor/vp-ops-agent-boundary; line=117; anchor=`"| nfr-rel-001 | 障害ログから月次障害率を集計 | 月次レビュー   | SRE    |"`\]: `判定者の例を人間の Role code で示し、agent が判定・承認を担わないことが読み取れるようにすること。`

### 成果物から届いた Kata が原因の finding

- なし

各記録の `source=grade` / `source=condense` を確認する。grade は成果物・行・viewpoint・内容、condense は result・修正前の場所・種類・直し方・理由を読み、`cause.location` と照合して、見直し対象の Kata の該当箇所を確認する。この節の condense の記録も Kata の見直しの根拠とし、判定は `vp-arc-conciseness` を参照する。以下の手順は、この節と Kata そのものの grade の finding に適用する。

1. 見直し対象の rulebook を読み込み、現状の章構成・必須項目・禁止事項・判定基準を把握する。
2. plan に展開された finding は severity にかかわらず、message と同じ viewpoint ID の判定根拠を修正要件として読み取る。message と判定根拠から指摘の根拠となる規範を特定し、対象 rulebook の frontmatter から辿れる recipe / sample / template、`併せて適用する rulebook`、該当する執筆標準のうち必要な文書を読み、指摘された問題を解消するよう該当箇所を修正する。
3. 修正後、各 finding の問題が判定根拠に照らして解消したことを確認する。未解消、根拠不足、または判断不能の finding は、理由と次のアクションを result の `進め方と実践の型の適用` セクションに記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。
4. 複数の成果物・review result・対象領域の慣行を根拠に、それらが成果物の実態と合っているかを見直す。
5. 成果物側で繰り返し守られていない規定は、規定が過剰なのか成果物側の不備なのかを判断し、根拠とともに rulebook へ反映するか result に記録する。
6. 既存記述のうち、根拠と整合しない・陳腐化したものは見直し、整合するものは維持する。

finding の修正後は、再評価で構造・整合性が劣化していないことを確認する。

見直した rulebook は [[specdojo:rulebook-authoring-standard]]（章立て・記述ルール・禁止事項の正本）に従う。recipe / sample / template と記述が矛盾しないように更新する（構造・必須項目・禁止事項は rulebook を正とする）。

approach 全体の定義は [[specdojo:ryu-guide]] の「実践の型メンテナンスの進め方」を参照する。本タスクの実行に必要な rulebook メンテナンスの進め方は、このセクションで完結する。

### 4.1. 見直しの根拠が不足する場合

- finding の message と判定根拠、対象 rulebook から辿れる関連文書、該当する執筆標準、利用可能な成果物・review result・対象領域の慣行を確認しても改訂を判断できない場合に限り、根拠不足として見送る。成果物または review result がないことだけを理由に見送らない。
- 見送る場合は、確認した資料、判断できなかった理由、不足している根拠、次のアクションを result の `進め方と実践の型の適用` セクションに記録する。
- 根拠不足のまま推測で rulebook を改訂しない。確証が得られた範囲に改訂を限定し、残りは申し送りに残す。
- 見直し対象の rulebook が存在しない場合は、根拠とした成果物群から新規に作成する。

### 4.2. 判断根拠の記録

見直しの根拠とした規範・成果物・review result と判断根拠を result に残す。記録先は次のとおり。

- 根拠とした規範・成果物・review result、改訂・維持した記述とその根拠、矛盾時に rulebook を正とした箇所: result の `進め方と実践の型の適用` セクション。

## 5. 完了手順

1. 「このフェーズで行うこと」に従って rulebook を更新する。
2. 共通規約に従って、必要な整形・静的検査を実行する。
3. result の `実施内容`・`変更ファイル`・`進め方と実践の型の適用` セクションを記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。

## 6. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
