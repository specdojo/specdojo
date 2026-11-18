---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-opd-monitoring-040-20261118t123531z-ad7a8778
  type: exec-result
  task_id: T-KATA-SLIM-2-opd-monitoring-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-opd-monitoring-040/T-KATA-SLIM-2-opd-monitoring-040-20261118T123531Z-ad7a8778/plan.md
  started_at: "2026-11-18T12:35:55.173Z"
  completed_at: "2026-11-18T13:01:38.228Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - opd-monitoring
    - specdojo:opd-rulebook
---

# Edit Result

## 1. 実施内容

- opd-rulebook から共通の運用に当たる記述を外し、全体方針に「共通の運用」を 1 項目置いて共通の正本への参照にした。
- Frontmatter の表（規約に反する title を含む）や重複記述も外した。
- F001 は本文構成の必須区分を `opd-index` と `opd-term` の 2 列に分けて解消した。
- F002 は `specdojo:opd-index-sample` を sample の宣言に足して解消した。
- F003 は規約に沿わない `specdojo:opd-sample` を sample の宣言から外して解消した。
- 空白を除いた文字数は、区切り行を除く数え方で 4,540 字から 3,625 字（79.8%）、区切り行を含めて 4,967 字から 4,010 字（80.7%）になり、目安の 8 割以下に収まった。
- F004 は executor evidence に、term 系サンプル群を直した記録がない。sample は commit の対象外のため変更案として申し送る。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/opd-rulebook.md`: 共通の運用に当たる記述を外し、全体方針に「共通の運用」を 1 項目置いて参照にした。本文構成の表は `opd-index` 列と `opd-term` 列に分けた。`opd-term` では 2〜11 章を条件付きにし、概要と関連ドキュメント導線は必須とした。章名は変えていない。sample の宣言に `specdojo:opd-index-sample` を足し、`specdojo:opd-sample` を外した。差分は 42 行追加、109 行削除。

## 3. 申し送り

- F004 は rulebook 側で `opd-term` の必須区分を条件付きにしたため、規定とのずれは減った。ただし各 term サンプルが改訂後の構成を満たすかは evidence で確認できていない。サンプルの再評価が要る。
- 章名と必須・条件付きの区分のうち、変えたのは `opd-term` の 2〜11 章を条件付きにした点だけである。変更理由は evidence.handoff に記載のとおり。
- 章の区分の変更理由（result 用）: opd-rulebook の本文構成の表を opd-index 列と opd-term 列に分けた。opd-term では 2〜11 章を条件付きにした。F001 で指摘された 1.1 の差分方針との矛盾を解き、既存の term サンプル 3 件（monitoring・incident-management・access-control。どれも概要＋該当ドメインの章＋関連導線の構成）と規定を合わせるため。章名は変えていない。
- 大きさ（result 用、空白を除いた文字数）: 表の区切り行を除く数え方で 4,540 字から 3,625 字（79.8%）、区切り行を含めて 4,967 字から 4,010 字（80.7%）。
- sample の宣言: F003 への対応として specdojo:opd-sample を sample の宣言から外した。opd-sample は rulebook の構成に沿わず中身の説明だけのサンプルで、ファイル自体は commit の対象外のため変えていない。変更案: opd-sample.md を廃止（deprecated）にするか、opd-index-sample と統合する。
- sample の変更案: opd-index-sample.md は改訂後の rulebook でも opd-index の全 12 章必須を満たしていない（概要・SLO・RACI・導線の 4 章だけ）。運用の範囲・前提、監視、障害対応、変更管理、バックアップ、権限、定期運用、問い合わせの各章を足すか、最小の記述でよいので全章を置く必要がある。
- sample の変更案: opd-index-sample.md など各 sample の本文にある「参照: ../rulebooks/opd-rulebook.md」の行は、共通の運用の参照と同じく sample 側では不要なため削る。
- recipe と template は undecided のままで、変更点はない。共通の正本（ドキュメントメタ情報標準）に足すべき記述はない。
- 成果物本体 docs/ja/product/090-operations/opd-monitoring.md はまだ存在しないため、成果物との照合は行っていない。
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイル（plan・result・個票）を変更していないため）
- rate limit後に sol-executor から opus-executor へ切り替え、2026-11-18T12:37:50.379Z に再開

## 4. 進め方と実践の型の適用

rulebook-maintenance の進め方に沿い、finding F001〜F003 を rulebook の本文構成と Frontmatter の sample 宣言の修正で解消した。F004 の対象である term 系サンプル群は commit の対象外のため変更案として申し送った。共通の運用は `docs/ja/specdojo/standards/document-metadata-standard.md` への参照に置き換え、型固有の判断基準と区分は残した。runner の検証は `lint:fm`、`lint:md`、`lint:mermaid`、`lint:d2`、`validate:schema`、`test:unit`、`test:integration` が passed である。`lint:ts` と `typecheck` は変更種別により対象外である。
