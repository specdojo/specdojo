import {
  code,
  properties,
  records,
  recordTable,
  TableBody,
  valueText,
  type YamlRecord,
} from "./yaml-table-shared.js";

export function renderBdd(doc: YamlRecord): string {
  const body = new TableBody();
  for (const entity of records(doc.entities)) {
    body.section(
      valueText(entity.logical_name),
      [
        properties(entity, [
          ["physical_name", "物理名"],
          ["description", "説明"],
          ["key_fields", "キー項目"],
          ["schema_ref", "正本スキーマ"],
          ["type_ref", "正本型定義"],
          ["glossary_term_id", "用語 ID"],
          ["related_terms", "関連用語"],
        ]),
        recordTable(records(entity.fields), [
          ["logical_name", "論理名"],
          ["physical_name", "物理名"],
          ["description", "業務上の意味"],
          ["type", "型"],
          ["unit", "単位"],
          ["constraints", "制約"],
          ["allowed_values", "許容値"],
          ["allowed_values_detailed", "許容値と業務ラベル"],
          ["example", "例"],
          ["glossary_term_id", "用語 ID"],
        ]),
      ].join("\n\n"),
    );
  }
  return body.render();
}

export function renderRoles(doc: YamlRecord): string {
  const body = new TableBody();
  body.section(
    "採用ロール",
    recordTable(records(doc.roles), [
      ["code", "ロールコード"],
      ["name", "名称"],
      ["project_note", "プロジェクトでの責務・補足"],
    ]),
  );
  return body.render();
}

export function renderMembers(doc: YamlRecord): string {
  const body = new TableBody();
  body.section(
    "メンバー",
    recordTable(records(doc.members), [
      ["nickname", "実行主体 ID"],
      ["display_name", "表示名"],
      ["roles", "ロール"],
      ["type", "種別"],
      ["focus", "担当領域"],
      ["note", "補足"],
    ]),
  );
  if (Array.isArray(doc.rules))
    body.section(
      "運用ルール",
      recordTable(
        doc.rules.map((rule) => ({ rule })),
        [["rule", "ルール"]],
      ),
    );
  return body.render();
}

export function renderTimeline(doc: YamlRecord): string {
  const body = new TableBody();
  body.section(
    "計画の前提",
    properties(doc, [
      ["planned_start_date", "予定開始日"],
      ["notes", "注記"],
    ]),
  );
  body.section(
    "トラック順序",
    recordTable(records(doc.tracks), [
      ["track", "トラック"],
      ["domains", "ドメイン"],
      ["catalog_status", "カタログ状態"],
      ["catalog_duration_estimate_days", "カタログ整備の見積日数"],
      ["order", "順序"],
      ["parallel_group", "並行グループ"],
      ["depends_on", "先行トラック"],
      ["note", "補足"],
    ]),
  );
  return body.render();
}

export function renderMilestones(doc: YamlRecord): string {
  const body = new TableBody();
  body.section(
    "マイルストーン",
    recordTable(records(doc.milestones), [
      ["id", "ID"],
      ["name", "名称"],
      ["artifact_name", "対象成果物"],
      ["depends_on", "先行タスク"],
      ["owner", "担当ロール"],
      ["date_hint", "目安日"],
      ["tags", "タグ"],
      ["notes", "注記"],
    ]),
  );
  if (Array.isArray(doc.tasks))
    body.section(
      "概要タスク",
      recordTable(records(doc.tasks), [
        ["id", "ID"],
        ["name", "名称"],
        ["owner", "担当ロール"],
        ["depends_on", "先行タスク"],
      ]),
    );
  return body.render();
}

export function renderViewpoints(doc: YamlRecord): string {
  const body = new TableBody();
  if (typeof doc.extends === "string") {
    body.section(
      "共通定義の継承",
      `共通定義: [[${doc.extends}]]。以下の表はこの YAML が宣言する差分です。同じ ID・ロールは上書きし、新しい値は追加します。空の表は差分なしを表します。`,
    );
  }
  for (const [key, title, columns] of [
    [
      "categories",
      "分類",
      [
        ["id", "ID"],
        ["name", "名称"],
      ],
    ],
    [
      "coverage_types",
      "確認対象の分類",
      [
        ["id", "ID"],
        ["name", "名称"],
        ["description", "説明"],
        ["applies_to", "適用先"],
      ],
    ],
    [
      "severity_levels",
      "重大度",
      [
        ["id", "ID"],
        ["description", "意味・扱い"],
      ],
    ],
    [
      "verdict_definitions",
      "判定",
      [
        ["id", "ID"],
        ["description", "意味・次の対応"],
      ],
    ],
    [
      "viewpoints",
      "レビュー観点",
      [
        ["id", "ID"],
        ["role", "ロール"],
        ["category", "分類"],
        ["title", "観点"],
        ["check", "確認内容"],
        ["evidence", "根拠"],
        ["default_severity", "重大度"],
        ["evaluation", "評価方法"],
      ],
    ],
    [
      "role_viewpoint_sets",
      "ロール別観点",
      [
        ["role", "ロール"],
        ["viewpoints", "観点 ID"],
      ],
    ],
  ] as const) {
    if (Array.isArray(doc[key]))
      body.section(
        title,
        recordTable(
          records(doc[key]),
          columns.map(([field, label]) => [field, label]),
        ),
      );
  }
  // 適用条件を省くと観点を誤用するため、指定された観点だけ補表で示す。
  const scoped = records(doc.viewpoints).filter(
    (item) =>
      item.document_kinds || item.grade_targets || item.comparison_sources || item.coverage_types,
  );
  if (scoped.length)
    body.section(
      "観点の適用条件",
      recordTable(scoped, [
        ["id", "観点 ID"],
        ["coverage_types", "確認対象"],
        ["grade_targets", "評価対象"],
        ["comparison_sources", "比較元"],
        ["document_kinds", "文書種別の条件"],
      ]),
    );
  if (doc.disabled !== undefined) body.section("無効化する共通定義", properties(doc.disabled));
  if (doc.grade_rubric !== undefined) body.section("採点基準", properties(doc.grade_rubric));
  return body.render();
}

export function renderDctIndex(doc: YamlRecord): string {
  const body = new TableBody();
  body.section(
    "カタログの設定",
    properties(doc, [
      ["project_id", "プロジェクト"],
      ["size", "規模"],
    ]),
  );
  const visit = (groups: YamlRecord[], parent: string): void => {
    for (const group of groups) {
      const name = [parent, valueText(group.name)].filter(Boolean).join(" / ");
      if (Array.isArray(group.domains))
        body.section(
          name,
          recordTable(records(group.domains), [
            ["domain", "ドメイン"],
            ["name", "名称"],
            ["overview", "概要"],
          ]),
        );
      visit(records(group.groups), name);
    }
  };
  visit(records(doc.groups), "");
  return body.render();
}

export function renderDct(doc: YamlRecord): string {
  const body = new TableBody();
  body.section(
    "カタログの設定",
    properties(doc, [
      ["project_id", "プロジェクト"],
      ["domain", "ドメイン"],
      ["base_path", "基準パス"],
    ]),
  );
  const visit = (groups: YamlRecord[], parent: string): void => {
    for (const group of groups) {
      const name = [parent, group.name ? valueText(group.name) : ""].filter(Boolean).join(" / ");
      const items = records(group.deliverables);
      if (items.length) {
        body.section(
          name || "成果物",
          [
            properties(group, [
              ["base_path", "配置先（親からの相対パス）"],
              ["note", "注記"],
            ]),
            recordTable(items, [
              ["local_id", "成果物 ID"],
              ["name", "名称"],
              ["kind", "種別"],
              ["depends_on", "根拠"],
              ["overview", "概要"],
            ]),
            ...items
              .filter((item) => item.done_criteria || item.path || item.brief)
              .map((item) =>
                [
                  `**${code(String(item.local_id))}**`,
                  properties(item, [
                    ["path", "パス"],
                    ["rulebook", "準拠ルール"],
                    ["brief", "作成指示"],
                    ["note", "注記"],
                  ]),
                  recordTable(records(item.done_criteria), [
                    ["text", "完了条件"],
                    ["roles", "確認ロール"],
                    ["viewpoint", "観点 ID"],
                  ]),
                ].join("\n\n"),
              ),
          ].join("\n\n"),
        );
      }
      visit(records(group.groups), name);
    }
  };
  visit(records(doc.groups), "");
  return body.render();
}
