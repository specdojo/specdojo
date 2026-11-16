// VitePress サイドバーの固定データ（手動メニュー構成・表示名・表示順）を集約する。
// 変換ロジック（transformSidebar 等）は config.mts 側に置く。
// 型のメニュー（ルール・レシピ・サンプル・テンプレート）は sidebar-kata.ts が型の文書から組み立てる。
// 型の分類・並び・表示名の上書きは sidebar-kata-config.ts に書く（PJR-C8J8）。
import { buildKataMenus } from "./sidebar-kata.js";
import { kataMenuConfig } from "./sidebar-kata-config.js";

export type SidebarItem = {
  text?: string;
  link?: string;
  collapsed?: boolean;
  items?: SidebarItem[];
};

const specdojoLink = (dir: string, id: string) => `/ja/specdojo/${dir}/${id}`;
const guide = (text: string, id: string): SidebarItem => ({
  text,
  link: specdojoLink("guides", id),
});
const reference = (text: string, id: string): SidebarItem => ({
  text,
  link: specdojoLink("references", id),
});
const standard = (text: string, id: string): SidebarItem => ({
  text,
  link: specdojoLink("standards", id),
});
const philosophy = (text: string, id: string): SidebarItem => ({
  text,
  link: specdojoLink("philosophy", id),
});
const group = (text: string, items: SidebarItem[], collapsed = true): SidebarItem => ({
  text,
  collapsed,
  items,
});

// サイドバーの表示名は対象ページの H1 に揃える。guide と philosophy はグループ配下で
// 種別が自明なため接尾辞（「ガイド」「の考え方」）を落とし、reference は H1 をそのまま使う。
// クリック前後でタイトルが変わらないようにするため、H1 を変更したらここも合わせて更新する。
// rulebook / recipe / sample / template の表示名は sidebar-kata.ts が H1 から作り、
// 接尾辞（「作成ルール」など）を落として対象成果物の名称に揃える。
// specdojoDir は docs/ja/specdojo に当たるディレクトリ（文書サイトではステージング側）。
export function buildSpecdojoSidebarItems(specdojoDir: string): SidebarItem[] {
  const kata = buildKataMenus(specdojoDir, kataMenuConfig);
  return [
    {
      text: "ガイド",
      collapsed: false,
      items: [
        group(
          "はじめに",
          [
            guide("全体概要", "specdojo-overview-guide"),
            guide("Quick Start", "quick-start-guide"),
            guide("ユースケース別", "use-case-guide"),
            guide("ドキュメント構成", "docs-structure-guide"),
          ],
          false,
        ),
        group(
          "型で作る",
          [
            guide("型の構成", "practice-system-composition-guide"),
            guide("実践の進め方", "ryu-guide"),
            guide("実践の型活用", "kata-guide"),
            guide("レビュー", "review-guide"),
          ],
          false,
        ),
        group(
          "技で回す",
          [
            guide("遂行の技活用", "waza-guide"),
            guide("オーケストレーター運用", "orchestrator-operation-guide"),
            guide("exec運用", "exec-operation-guide"),
            guide("登録簿運用", "register-operation-guide"),
            group("Schedule設計・実行", [
              guide("トラック設計", "track-design-guide"),
              guide("Schedule設計", "schedule-design-guide"),
              guide("Schedule実行運用", "schedule-operation-guide"),
            ]),
            guide("routine運用", "routine-operation-guide"),
            guide("常時稼働ホスト運用", "remote-host-development-guide"),
            group("exec共通", [
              guide("exec設定", "exec-config-guide"),
              guide("plan/resultライフサイクル", "plan-result-lifecycle-guide"),
              guide("exec worktree運用", "exec-worktree-guide"),
              guide("ブランチワークフロー", "branch-workflow-guide"),
            ]),
            guide("プロジェクト移行", "project-move-guide"),
          ],
          false,
        ),
        group("付録", [guide("ドキュメント編集", "docs-editing-guide")]),
      ],
    },
    {
      text: "リファレンス",
      collapsed: false,
      items: [
        reference("成果物リファレンス", "deliverables-reference"),
        reference("ディレクトリレイアウトリファレンス", "directory-layout-reference"),
        reference("SpecDojo設定リファレンス", "specdojo-config-reference"),
        reference("CLIコマンドリファレンス", "command-reference"),
      ],
    },
    {
      // 規約の前提となる考え方。一度読めば足りるため、実務で引く guide / reference の後ろへ置く。
      text: "考え方",
      collapsed: true,
      items: [
        philosophy("SpecDojo", "specdojo-philosophy"),
        philosophy("要求から実装まで", "needs-to-implementation-philosophy"),
      ],
    },
    { text: "レシピ", collapsed: true, items: kata.recipes },
    { text: "サンプル", collapsed: true, items: kata.samples },
    { text: "テンプレート", collapsed: true, items: kata.templates },
    {
      text: "標準",
      collapsed: true,
      items: [
        standard("ドキュメントID・ファイル命名", "id-and-file-naming-standard"),
        standard("ドキュメントメタ情報", "document-metadata-standard"),
        standard("Gitブランチ運用", "git-branching-standard"),
        standard("ルールブック記述", "rulebook-authoring-standard"),
        standard("レシピ記述", "recipe-authoring-standard"),
        standard("サンプル記述", "sample-authoring-standard"),
        standard("テンプレート記述", "template-authoring-standard"),
        standard("ガイド記述", "guide-authoring-standard"),
        standard("リファレンス記述", "reference-authoring-standard"),
        standard("標準記述", "standard-authoring-standard"),
        standard("人・組織定義", "people-and-organization-definition-standard"),
        standard("テスト文書スコープ", "test-document-scope-standard"),
      ],
    },
    { text: "ルール", collapsed: true, items: kata.rulebooks },
  ];
}

export const PROJECTS_SEGMENT_TEXT: Record<string, string> = {
  projects: "プロジェクト",
  "010-deliverables-catalog": "成果物カタログ",
  "020-project-definition": "プロジェクト定義",
  "030-project-management": "プロジェクトマネジメント",
  "040-product-change": "プロダクト変更",
  controls: "管理台帳・管理ビュー",
  "project-register": "プロジェクト登録簿",
  reporting: "レポート",
  "progress-reports": "進捗報告",
  "meeting-minutes": "議事録",
  execution: "実行管理",
  exec: "実行ワークスペース",
  events: "イベントログ",
  plans: "実行プラン",
  results: "実行結果",
  generated: "生成物",
  reviews: "レビュー",
  schedule: "スケジュール",
  routines: "ルーチン",
  "010-as-is": "現状定義",
  "010-business-specifications": "業務仕様",
  "020-impact-analysis": "影響調査",
  "030-traceability": "トレーサビリティ",
  "040-migration": "移行",
  // 非推奨化した成果物ファイルの置き場所（id-and-file-naming-standard.md 9.1）。
  trash: "廃止済み",
};

export const PROJECTS_FILE_TEXT: Record<string, string> = {
  index: "一覧",
  "task-catalog": "タスクカタログ",
};

// docs/ja/product 配下のディレクトリ名 → サイドバー表示名（日本語化）。
export const PRODUCT_SEGMENT_TEXT: Record<string, string> = {
  product: "プロダクト",
  "010-business-specs": "業務仕様",
  "010-data-flow": "概念データフロー",
  "030-architecture": "アーキテクチャ",
  "020-infrastructure": "インフラ・技術選定",
  "040-system-design": "システム設計",
  // 非推奨化した成果物ファイルの置き場所（id-and-file-naming-standard.md 9.1）。
  trash: "廃止済み",
};

// docs/ja/product 配下の既知ファイルのメニュー表示（PROJECTS_FILE_MENU と同じ仕組み）。
// text: 全ファイル共通の「概念データフロー図（...）: SpecDojo」という H1 は冗長なため、
// 固定の短い表示名（H1 より優先）にする。
// order: cdfd-overview を先頭、続けて系統別の詳細（register 系・schedule 系・routine 系）を並べる（PJR-SJQC）。
// 廃止済み（trash）の旧文書は、旧体系ごとにまとめて後ろへ並べる。
export const PRODUCT_FILE_MENU: Record<string, { text: string; order?: number }> = {
  "cdfd-overview": { text: "全体概要", order: 0 },
  "cdfd-uc-register": { text: "register 系", order: 1 },
  "cdfd-uc-schedule": { text: "schedule 系", order: 2 },
  "cdfd-uc-routine": { text: "routine 系", order: 3 },
  // 廃止済み（PJR-SJQC）。プロセスグループ別 CDFD と、cdfd-uc-schedule に引き継いだ旧ユースケース別 CDFD。
  "cdfd-onboarding": { text: "（旧）Onboarding（P-01）", order: 200 },
  "cdfd-plan": { text: "（旧）Plan（P-02〜P-06）", order: 210 },
  "cdfd-do": { text: "（旧）Do（P-07）", order: 220 },
  "cdfd-check": { text: "（旧）Check（P-08〜P-10）", order: 230 },
  "cdfd-action": { text: "（旧）Action（P-11〜P-13）", order: 240 },
  "cdfd-orchestrator": { text: "（旧）Orchestrator（P-14）", order: 250 },
  "cdfd-uc-deliverable": { text: "（旧）成果物の作成から完了まで", order: 260 },
  "cdfd-init": { text: "初期セットアップ（P-01）", order: 10 },
  "cdfd-register-lifecycle": { text: "登録簿ライフサイクル（P-02）", order: 20 },
  "cdfd-catalog-planning": { text: "計画展開（P-03）", order: 30 },
  "cdfd-task-execution": { text: "タスク実行（P-04）", order: 40 },
  "cdfd-routine": { text: "定期処理（P-05）", order: 50 },
  "cdfd-multi-project": { text: "並行処理（P-06）", order: 60 },
  "cdfd-agent-config-operation": { text: "構成変更（P-07）", order: 70 },
  "cdfd-derived-content": { text: "派生生成（P-08）", order: 80 },
  "cdfd-reporting": { text: "報告（P-09）", order: 90 },
  "cdfd-deprecation": { text: "非推奨化・保管（P-10）", order: 100 },
  // 廃止済み（id-and-file-naming-standard.md 9.2 経路B）。cdfd-register-lifecycle の後継に
  // 移行済みだが、Schedule の過去タスクID参照整合性のためファイルは維持する。
  "cdfd-register-operation": { text: "登録簿運用（廃止・旧版）", order: 999 },
};

// プロジェクト配下の既知ファイルのメニュー表示（標準成果物と生成ビュー）。
// text: H1 の「タイトル: <プロジェクト名>」形式や英語 H1 より短い固定表示名（H1 より優先）。
// order: 同一ディレクトリ内での表示順。ファイル名順ではなく作成順・検討順
// （track-design-guide）や参照頻度に合わせる。未登録ファイルはファイル名順で後続に並ぶ。
// order を省略したファイルは既定の並び（README は先頭）に従う。
export const PROJECTS_FILE_MENU: Record<string, { text: string; order?: number }> = {
  README: { text: "概要" },
  // 010-deliverables-catalog
  "dct-index": { text: "成果物カタログの索引", order: 10 },
  "dct-project-definition": { text: "成果物カタログ（プロジェクト定義）", order: 20 },
  "dct-project-management": { text: "成果物カタログ（プロジェクトマネジメント）", order: 30 },
  "dct-planning": { text: "成果物カタログ（計画）", order: 40 },
  // 020-project-definition
  "prj-overview": { text: "プロジェクト概要", order: 10 },
  "prj-stakeholder-register": { text: "ステークホルダー登録簿", order: 20 },
  "prj-charter": { text: "プロジェクト憲章", order: 30 },
  "prj-scope": { text: "プロジェクトスコープ", order: 40 },
  "prj-success-criteria-and-acceptance-criteria": { text: "成功基準と受入条件", order: 50 },
  "prj-issues-and-approach": { text: "課題と解決アプローチ", order: 60 },
  "prj-assumptions-constraints-dependencies": { text: "前提・制約・依存関係", order: 70 },
  "prj-comparison-of-alternatives": { text: "代替案の比較", order: 80 },
  // 030-project-management（管理計画 → 組織体制の順。同一ディレクトリなので通し番号）
  "pm-plan": { text: "プロジェクト管理計画", order: 10 },
  "pm-communication-plan": { text: "コミュニケーション計画", order: 20 },
  "pm-quality-management-plan": { text: "品質管理計画", order: 30 },
  "pm-review-viewpoints": { text: "レビュー観点", order: 40 },
  "pm-organization": { text: "組織とロールの定義", order: 50 },
  "pm-roles": { text: "ロール定義", order: 60 },
  "pm-members": { text: "メンバー定義", order: 70 },
  "pm-raci": { text: "組織体制とRACI", order: 80 },
  // controls
  "pjr-index": { text: "プロジェクト登録台帳", order: 10 },
  "pjr-views-by-status": { text: "台帳ビュー（状態別）", order: 11 },
  "pjr-views-by-priority": { text: "台帳ビュー（優先度別）", order: 12 },
  "pjr-views-by-owner": { text: "台帳ビュー（担当者別）", order: 13 },
  "pm-risk-register": { text: "リスク登録簿", order: 10 },
  "pm-issue-log": { text: "課題ログ", order: 20 },
  "pm-change-request-log": { text: "変更要求ログ", order: 30 },
  "pm-decision-log": { text: "意思決定ログ", order: 40 },
  // execution / generated（進捗ビュー）
  ready: { text: "着手可能タスク", order: 10 },
  timeline: { text: "タイムライン", order: 20 },
  "critical-path": { text: "クリティカルパス", order: 30 },
  cpm: { text: "クリティカルパス分析", order: 40 },
  "schedule-diff": { text: "スケジュール差分", order: 50 },
  dashboard: { text: "ダッシュボード", order: 60 },
  // 実行プラン・実行結果はサイドバーに載せず、この一覧から辿る。
  "exec-records": { text: "実行記録一覧", order: 70 },
};

// グループ（リンクなし）の表示順。メニュー表示名（変換後）をキーにする。
// 既定では同一階層の先頭に並ぶため、後ろへ動かしたいグループのみ登録する。
// プロジェクト直下の横断ディレクトリ（台帳・スケジュール・実行状態）は、
// 番号付きの成果物ツリー（成果物カタログ〜プロダクト変更）の後ろに運用順で並べる。
// 実行プラン・実行結果は大量の項目を含むため、進捗ビューの後ろに置く。
export const PROJECTS_GROUP_ORDER: Record<string, number> = {
  // 非推奨化した文書（trash）は現行の文書の後ろに置く。
  廃止済み: 900,
  "管理台帳・管理ビュー": 10,
  スケジュール: 20,
  ルーチン: 30,
  実行管理: 40,
  レポート: 50,
  実行プラン: 90,
  実行結果: 95,
};

// グループ化せず、子を親と同一階層へ展開するグループ（メニュー表示名）。
// 「生成物」（generated フォルダ）は一覧性のため、「実行ワークスペース」（exec フォルダ）は
// VitePress サイドバーの描画深さ上限を超えて実行プラン・実行結果が表示されなくなるのを防ぐため。
export const FLATTENED_GROUP_TEXTS = new Set(["生成物", "実行ワークスペース"]);
