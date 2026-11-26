---
specdojo:
  id: prj-0001:xep-t-kata-review-all-ifx-file-sample-120-20261125t205952z-ec54a6c7
  type: exec-plan
  rulebook: none
  task_id: T-KATA-REVIEW-ALL-ifx-file-sample-120
  name: "R2 構成"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: sample-maintenance
  targets:
    - specdojo:ifx-file-sample
    - specdojo:ifx-file-sample
---

# Edit Plan: T-KATA-REVIEW-ALL-ifx-file-sample-120

## 1. このフェーズで行うこと

kata のレビューの段 R2（構成）を行う。段の内容・読む範囲・観点・報告の形は [[specdojo:kata-guide|実践の型活用ガイド]]（docs/ja/specdojo/guides/kata-guide.md）の「kata を agent でレビューする」に従う。plan に展開された grade の finding は、この段の観点に当たるものだけを扱い、ほかは扱う段に任せる。R1 が直した版を読み、R1 の指摘を繰り返さない。
章の順・粒度・表と本文の配置が rulebook の本文構成と template に沿い、前提から結論の順に読めるかを確かめ、章の移動・分割・統合の差分を sample に入れる。rulebook など sample 以外は変更せず、直す案を result に書く。報告は同ガイドの「人への報告の形」に従い、executor は報告の handoff に指摘を 1 件ずつ 1 項目（No・段・箇所・指摘・直した案・根拠・印）で書き、表の文字列にまとめない。reporter は handoff の指摘を出力の findings に 1 件ずつ渡し、表を書かず、summary と handoff に指摘を重ねない。runner が findings を result の実施内容の後に表として 1 回だけ描く。迷った指摘に「要判断」の印を付ける。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 駄菓子屋きぬや 外部ファイル連携仕様の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、駄菓子屋きぬや 外部ファイル連携仕様の完成例を示す
- `path`: `docs/ja/specdojo/samples/ifx-file-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-REVIEW-ALL-ifx-file-sample-120/T-KATA-REVIEW-ALL-ifx-file-sample-120-20261125T205952Z-ec54a6c7/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/ifx-file-sample.md`
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

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-arc-conciseness; line=306; anchor=````"```json"````\]: `正本スキーマ 2 件の全文掲載により required 配列が YAML の required_fields と重複しているため、状態値の制約（enum・if/then）など required_fields で表せない部分だけの抜粋に絞り、正本の全文は schemas/ 配下を参照させる形に縮める。`
- F002 \[minor/vp-qe-verifiability; line=458; anchor=``"| 取引状態の欠落（`current_tx_json` の `missing`、「取引未開始」） | `sales start` が未解決の控えを検査し、1 件でもあれば新規取引を始めずに exit code 3 で停止する                          | 店番担当は `sales total` を使わずに停止し、店主代表と開発担当（`DEV`）が `data/sales/` の当日控えを確認する。未解決の控え（`api_sync_status` が `pending` / `unknown` / `rejected`）を本部受付と照合してから新規取引へ進む |"``\]: `「取引状態の欠落」の行が、取引未開始（sales add/total/complete/cancel で exit code 2）と sales start が未解決の控えを検出して止まる場合（exit code 3）を 1 行に混ぜており期待結果が一意に決まらないため、事象ごとに行を分けて終了コードと次の手を対応させる。`
- F003 \[major/vp-qe-omissions-consistency; line=9; anchor=``"_UNDECIDED_: 本サンプルの仕様は学習用の完成例（`status: draft`）であり、実運用の採否、問屋側 SFTP 接続条件の確定、および `status: ready` への昇格は人間の店主代表（`PO`）が最終判断する。"``\]: `sample-authoring-standard は本文に文書の承認・昇格の担当や進み具合を書くことを禁じているが、本文 9・42・179・469 行で ready 昇格や承認判断の担当を述べているため削除し、承認と留保は登録簿の個票で追う形にする（採否の論点など業務上の未決事項だけを残す）。`
- F004 \[major/vp-qe-kata-conformance; line=1; anchor=`"# 駄菓子屋きぬや 外部ファイル連携仕様 サンプル"`\]: `rulebook の target_format は yaml で、sample-authoring-standard はファイル名を target_format に合わせ sample 独自の章立てを作らないことを求めるが、本 sample は .md 形式で rulebook にない章（利用目的、正本スキーマ例、再開判定、異常時の次の手、将来課題）を持ち他の ifx sample（.yaml）とも不一致なため、YAML sample に再構成し補足は YAML コメントか rulebook 側の扱いへ移すか、md とする例外を rulebook に宣言する。`
- F005 \[minor/vp-qe-kata-conformance; line=300; anchor=`"### 3.3. 参照する正本スキーマの例と検証"`\]: `rulebook は正本スキーマの全文再掲を禁止事項としているが「参照する正本スキーマの例と検証」で 2 スキーマを全文掲載しており正本参照方式の手本として誤用を招くため、required_fields で表せない制約の抜粋に絞るか正本ファイルへの参照に置き換える。`
- F006 \[minor/vp-ux-language-consistency; line=5; anchor=``"店主代表（`PO`）と家族利用者代表（`PO` 業務助言）が日々の店頭販売と在庫把握を行う「駄菓子屋きぬや」において、[[specdojo:ifx-file-rulebook|外部ファイル連携仕様作成ルール]] に従う 2 つの代表的なファイル受け渡し契約（**単一ファイル・インライン定義**および**複数ファイル・正本スキーマ参照**）を示す完成例である。外部取引先へ送付するバッチファイルと、店頭 CLI の実行段階間で授受・照合する状態・証跡ファイルの双方について、配置・命名・必須項目・書き手と読み手・失敗時の回復手順を検証可能な形で定義する。"``\]: `家族利用者代表を「PO 業務助言」と記しているが pm-members-sample では roles が [UX] であり Role code が食い違うため、UX（または役割名のみ）に揃える。`
- F007 \[minor/vp-ux-language-consistency; line=9; anchor=``"_UNDECIDED_: 本サンプルの仕様は学習用の完成例（`status: draft`）であり、実運用の採否、問屋側 SFTP 接続条件の確定、および `status: ready` への昇格は人間の店主代表（`PO`）が最終判断する。"``\]: `本文で本サンプルを「status: draft」としているが Frontmatter の status は ready で状態表記が矛盾するため、「埋め込み YAML の x-spec-meta.status は draft」のように対象を明示するか記述を揃える。`
- F008 \[minor/vp-ops-release-readiness; line=9; anchor=``"_UNDECIDED_: 本サンプルの仕様は学習用の完成例（`status: draft`）であり、実運用の採否、問屋側 SFTP 接続条件の確定、および `status: ready` への昇格は人間の店主代表（`PO`）が最終判断する。"``\]: `sample 自体は Frontmatter で status: ready だが本文で「学習用の完成例（status: draft）」「ready への昇格は未判断」と読める記述があり公開状態の判断を誤らせるため、埋め込み契約例の status と sample 文書の status を区別して記述する。`

### 成果物から届いた Kata が原因の finding

- なし

各記録の `source=grade` / `source=condense` を確認する。grade は成果物・行・viewpoint・内容、condense は result・修正前の場所・種類・直し方・理由を読み、`cause.location` と照合して、見直し対象の Kata の該当箇所を確認する。この節の condense の記録も Kata の見直しの根拠とし、判定は `vp-arc-conciseness` を参照する。以下の手順は、この節と Kata そのものの grade の finding に適用する。

1. 見直し対象の sample を読み込み、現状の粒度・文体・表の書き方を把握する。
2. plan に展開された finding は severity にかかわらず、message と同じ viewpoint ID の判定根拠を修正要件として読み取る。message と判定根拠から指摘の根拠となる規範を特定し、対象 sample の frontmatter から辿れる rulebook と recipe、該当する執筆標準のうち必要な文書を読み、指摘された問題を解消するよう該当箇所を修正する。rulebook との構成不整合を指摘する finding では、成果物の有無にかかわらず rulebook を正として照合する。
3. 修正後、各 finding の問題が判定根拠に照らして解消したことを確認する。未解消、根拠不足、または判断不能の finding は、理由と次のアクションを result の `進め方と実践の型の適用` セクションに記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。
4. 複数の成果物・review result・対象領域の慣行を根拠に、それらが完成例として適切かを見直す。
5. rulebook の必須項目・禁止事項を満たす最小の記述例になるよう再構成し、実成果物の丸写しを避ける。
6. 既存記述のうち、根拠と整合しない・陳腐化したものは見直し、整合するものは維持する。

finding の修正後は、再評価で構造・整合性が劣化していないことを確認する。

見直した sample は [[specdojo:sample-authoring-standard]]（構成・記述ルール・禁止事項の正本）に従う。rulebook / recipe と記述が矛盾しないように更新する（構造・必須項目・禁止事項は rulebook を正とする）。

approach 全体の定義は [[specdojo:ryu-guide]] の「実践の型メンテナンスの進め方」を参照する。本タスクの実行に必要な sample メンテナンスの進め方は、このセクションで完結する。

### 4.1. 見直しの根拠が不足する場合

- finding の message と判定根拠、対象 sample から辿れる rulebook / recipe、該当する執筆標準、利用可能な成果物・review result・対象領域の慣行を確認しても改訂を判断できない場合に限り、根拠不足として見送る。成果物または review result がないことだけを理由に見送らない。
- 見送る場合は、確認した資料、判断できなかった理由、不足している根拠、次のアクションを result の `進め方と実践の型の適用` セクションに記録する。
- 根拠不足のまま推測で sample を改訂しない。確証が得られた範囲に改訂を限定し、残りは申し送りに残す。
- 見直し対象の sample が存在しない場合は、根拠とした成果物群から新規に作成する。

### 4.2. 判断根拠の記録

見直しの根拠とした規範・成果物・review result と判断根拠を result に残す。記録先は次のとおり。

- 根拠とした規範・成果物・review result、改訂・維持した記述とその根拠、矛盾時に rulebook を正とした箇所: result の `進め方と実践の型の適用` セクション。

## 5. 完了手順

1. 「このフェーズで行うこと」に従って sample を更新する。
2. 共通規約に従って、必要な整形・静的検査を実行する。
3. result の `実施内容`・`変更ファイル`・`進め方と実践の型の適用` セクションを記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。

## 6. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
