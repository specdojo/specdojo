---
specdojo:
  id: prj-0001:xep-t-kata-wave-6-design-tsd-sample-050-20261123t110326z-3a30bfe6
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-DESIGN-tsd-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: sample-maintenance
  targets:
    - specdojo:tsd-sample
    - specdojo:tsd-sample
---

# Edit Plan: T-KATA-WAVE-6-DESIGN-tsd-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 技術スタック詳細定義の完成例
- `depends_on`:
  - [[specdojo:tsd-index-sample]]
- `overview`: 駄菓子屋の販売管理システムを題材に、技術スタック詳細定義の完成例を示す
- `path`: `docs/ja/specdojo/samples/tsd-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-DESIGN-tsd-sample-050/T-KATA-WAVE-6-DESIGN-tsd-sample-050-20261123T110326Z-3a30bfe6/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/tsd-sample.md`
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

- F001 \[minor/vp-po-purpose-alignment; line=10; anchor=`"- **ビジネス価値・運用上の利点**: 店主代表の記憶や紙の帳簿に依存していた販売・つけ管理をシステム化することで、つけ残高の確認時間を1分以内に短縮し、記録漏れによる金銭トラブルや人気商品の欠品・過剰在庫を防止する。"`\]: ``1.1 は上位の目的を本文で言い直したうえで、プロジェクト概要にない「つけ残高確認1分以内」という目標値を追加している。上位文書（プロジェクト概要・非機能要件）を参照する形に改め、Frontmatter に `based_on` を加えて、目的の根拠を上位文書からたどれるようにする必要がある。``
- F002 \[minor/vp-pm-dependency-risk; line=25; anchor=``"- `tsd-hosting.md`: Fly.io 上のアプリケーション実行環境およびネットワーク基盤の構成定義（未作成のため仮置き）。"``\]: ``1.3 の `tsd-hosting.md`・`tsd-ci.md` は「未作成のため仮置き」とだけ書かれ、`_TODO_` の目印、作成担当、本書が依存する内容（6PN 経路・`migrate deploy` の実行）が示されていない。後続文書への依存とリスクを追跡できる形にする必要がある。``
- F003 \[minor/vp-pm-control-reporting; line=107; anchor=`"- **未決事項（検討中）**: _UNDECIDED_: 年末年始や繁忙期における一時的なメモリ拡張ポリシー（日次売上件数の実測推移をもとに運用フェーズで判断）。"`\]: ``4.2 の `_UNDECIDED_`（繁忙期のメモリ拡張ポリシー）は ISSUE-03 と同じ論点なのに課題 ID で紐付けられておらず、二重管理になっている。ISSUE-03 への参照に置き換えて、転記元を一つにする必要がある。``
- F004 \[minor/vp-arc-technical-constraints; line=94; anchor=``"| DB エンジン        | バージョン                            | PostgreSQL 16.x  | 全環境           | 長期サポート版であり、JSON 処理性能と耐障害性に優れるため             | `SELECT version();` で確認              |"``\]: `PostgreSQL 16.x の採用理由「長期サポート版」は事実と異なる（PostgreSQL のメジャー版は一律約5年のサポートで LTS 区分はない）。また「JSON 処理性能」は利用目的に対応していない。決定記録や公式情報に基づく理由へ改める必要がある。`
- F005 \[minor/vp-arc-technical-constraints; line=53; anchor=`"- **ストレージ**: 10GB 永続ボリューム（年間データ増加量予測約 100MB に対して10年分以上の容量を確保）。"`\]: ``容量 10GB の根拠「年間データ増加量予測約 100MB」に見積もりの出典（取引件数×レコードサイズや実測）が示されていない。recipe の「根拠が出ない容量は採用値に入れない」に照らすと、根拠を示すか `_ASSUMPTION_` を付ける必要がある。``
- F006 \[minor/vp-arc-conciseness; line=28; anchor=`"### 1.4. 役割と責任"`\]: `1.4 の役割と責任は、rulebook が「適用先のメンバー定義に従う」とする内容を再掲し、1.1 も上位文書の目的を言い直している。メンバー定義・プロジェクト概要への参照に置き換え、本書固有の担当範囲だけを残せる。`
- F007 \[minor/vp-arc-single-responsibility; line=203; anchor=`"生成されたダンプファイルは暗号化のうえ、外部クラウドストレージへ自動転送する。日次データは過去30日分、月末データは過去1年分を保持する。"`\]: ``7.2 の保管ポリシー（日次30日・月末1年・外部転送）と実行時刻は、rulebook で運用設計の責務とされるバックアップ方針に当たる。TSD には `pg_dump`/`pg_restore` の技術操作だけを残し、方針は運用設計文書への参照に分離する必要がある。``
- F008 \[minor/vp-dev-implementation-readiness; line=100; anchor=``"| 共有バッファ       | `shared_buffers`                      | `256MB`          | 本番環境         | 割り当てメモリ 1GB のうち 25% をデータキャッシュに充当するため        | `SHOW shared_buffers;`                  |"``\]: ``4.1 の `shared_buffers`・`max_connections` などのサーバー設定に、Fly Postgres 上の保存先・反映方法と再起動の要否が示されていない。rulebook の採用設定表のガイドに従い、反映先と再起動の要否を記す必要がある。``
- F009 \[minor/vp-dev-implementation-readiness; line=194; anchor=``"深夜の店舗休業時間帯（午前 3:00）に自動スクリプトで `pg_dump` を実行する。"``\]: ``7.2 の日次 `pg_dump` を実行するホスト、実行ユーザー、スケジューラ、`/backups` の所在が示されておらず、実行場所を特定して再現できない。``
- F010 \[minor/vp-dev-testability; line=228; anchor=``"| マイグレーションロックエラー<br/>（`Migration is locked`）         | 前回のマイグレーション失敗によるロックの残留        | `_prisma_migrations` テーブルの `applied_steps_count` と `finished_at` を確認         | `npx prisma migrate resolve` を実行してロックを解除し、不整合のあるステップを手動で調整する                              |"``\]: ``8.2 のマイグレーションロックの行は、症状のエラー文が Prisma の実際の表記として確認できない。`npx prisma migrate resolve` に必要な `—applied`/`—rolled-back` とマイグレーション名も省かれ、「手動で調整」は再現できる手順になっていない。``
- F011 \[minor/vp-qe-verifiability; line=242; anchor=``"| `ISSUE-03` | 繁忙期（駄菓子屋祭りイベント等）における一時的スケールアップ基準 | 集中アクセス時の店頭画面レスポンス遅延の防止                   | 店頭端末の会計完了待機時間が 3 秒を超える確率を 0% に抑制（期日: 総合リハーサル前）          | 疑似負荷テストを実施し、CPU 使用率 80% 超過時のメモリ増設手順（1GB → 2GB）を OPS が手順化             | OPS / DEV |"``\]: `ISSUE-03 の基準「3秒を超える確率を0%」は、負荷条件・試行回数・測定方法・判定時点が定義されておらず、有限の試験で pass/fail を判定できない。p95 などの閾値と測定条件に改める必要がある。`
- F012 \[minor/vp-qe-verifiability; line=172; anchor=`"| 確認対象                    | 実行場所・方法                                                                          | 期待結果                                                                         | 失敗時の確認先                                                                         |"`\]: `6.1 の動作確認表に確認環境・確認日・未確認の条件が記されていない。rulebook の動作確認ガイド（確認環境・未確認条件を示し、未実施を成功と扱わない）に沿って記録欄を設ける必要がある。`
- F013 \[major/vp-qe-omissions-consistency; line=211; anchor=`"pg_restore -h <HOST> -U <USER> -d <DB> -v --clean --if-exists \"/backups/kinuyo-db-<TARGET_DATE>.dump\""`\]: ``7.2 の `pg_restore —clean —if-exists` は既存オブジェクトを削除する破壊的操作だが、事前バックアップ・アプリ停止・失われるデータ範囲・切り戻しが示されておらず、rulebook の禁止事項「停止、削除、再構築を、状態やデータへの影響を示さず指示する」に抵触している。``
- F014 \[minor/vp-qe-omissions-consistency; line=218; anchor=`"- **オフライン時の制限**: 店頭タブレットがネットワーク不通となった場合、PostgreSQL への直接書き込みは行えない。端末側ブラウザの一時退避領域（IndexedDB）に販売記録を保持し、再接続時に順次同期する構成を前提とする。"`\]: ``8.1 は IndexedDB への退避と再接続時の同期を「前提とする」と確定済みのように書いているが、ISSUE-01 は未解決で、プロジェクト概要もオフライン方針を `_UNDECIDED_` としている。`_ASSUMPTION_` を付けるか ISSUE-01 を参照し、未採択の設計を採用済みとして書かない必要がある。``
- F015 \[minor/vp-qe-omissions-consistency; line=203; anchor=`"生成されたダンプファイルは暗号化のうえ、外部クラウドストレージへ自動転送する。日次データは過去30日分、月末データは過去1年分を保持する。"`\]: `7.2 は外部クラウドストレージへの自動転送を決定済みとして書いているが、保管先は ISSUE-02 で選定中であり、ISSUE-02 との関係が示されていない。`
- F016 \[minor/vp-qe-kata-conformance; line=28; anchor=`"### 1.4. 役割と責任"`\]: `sample が 1.4 で独自の役割定義を持ち、7.2 でバックアップ保管方針まで定めている。これは rulebook の「役割は適用先のメンバー定義に従う」「バックアップ方針は運用設計」や、recipe の「バックアップ方針は運用設計の担当へ渡す」と食い違い、Kata 内の手本として整合していない。`
- F017 \[minor/vp-ux-language-consistency; line=174; anchor=``"| コンテナ起動状態            | 開発端末: `docker compose ps postgres`<br/>本番環境: `fly status --app kinuyo-db`       | 状態が `Up` または `running` であり、予期せぬ再起動が発生していないこと          | Docker デーモンの稼働状態、Fly.io プラットフォームステータス、コンテナ割り当てメモリ量 |"``\]: ``Fly アプリ名・ダンプファイル名に `kinuyo-db` を使っており（6.1・7.2・8.2）、店名「きぬや」と表記がずれている。`kinuya-db` などに統一し、読み手が別の対象と誤認しないようにする必要がある。``
- F018 \[minor/vp-ops-operability; line=205; anchor=`"3. **リカバリ手順**:"`\]: `7.2 のリカバリ手順に、リストア後の正常性確認（6.1 のどの確認へ戻るか）とバックアップ失敗の検知方法がなく、障害時の対応を完了まで追跡できない。`

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
