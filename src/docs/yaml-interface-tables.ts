import {
  isRecord,
  properties,
  records,
  recordTable,
  TableBody,
  table,
  valueText,
  code,
  type YamlRecord,
} from "./yaml-table-shared.js";

export function renderCommand(doc: YamlRecord): string {
  const body = new TableBody();
  body.section(
    "コマンド",
    properties(doc.command, [
      ["executable", "実行ファイル"],
      ["subcommands", "サブコマンド"],
      ["purpose", "目的"],
      ["reference", "仕様の参照先"],
      ["version_constraint", "バージョン制約"],
      ["shell", "シェル経由"],
    ]),
  );
  if (Array.isArray(doc.arguments))
    body.section(
      "引数",
      recordTable(records(doc.arguments), [
        ["name", "名称"],
        ["kind", "種別"],
        ["position", "位置"],
        ["required", "必須"],
        ["value_type", "値の型"],
        ["value_source", "値の供給元"],
        ["description", "説明"],
        ["example", "例"],
      ]),
    );
  const streams = isRecord(doc.streams) ? doc.streams : {};
  body.section(
    "標準入出力",
    table(
      ["ストリーム", "モード", "形式", "文字コード", "契約"],
      Object.entries(streams).map(([name, stream]) => {
        const item = isRecord(stream) ? stream : {};
        return [name, ...[item.mode, item.format, item.encoding, item.description].map(valueText)];
      }),
    ),
  );
  const files = isRecord(doc.files) ? doc.files : {};
  for (const [key, title] of [
    ["inputs", "入力ファイル"],
    ["outputs", "出力ファイル"],
  ]) {
    if (Array.isArray(files[key]))
      body.section(
        title,
        recordTable(records(files[key]), [
          ["path", "パス"],
          ["format", "形式"],
          ["encoding", "文字コード"],
          ["description", "契約"],
        ]),
      );
  }
  body.section(
    "終了コード",
    recordTable(records(doc.exit_codes), [
      ["code", "コード"],
      ["meaning", "意味・判定条件"],
      ["category", "分類"],
      ["retryable", "再試行可否"],
    ]),
  );
  for (const [key, title] of [
    ["authentication", "認証"],
    ["execution", "実行制御"],
    ["error_handling", "異常時の扱い"],
  ])
    body.section(title, properties(doc[key]));
  body.section("副作用", table(["内容"], [[valueText(doc.side_effects)]]));
  return body.render();
}

// IFX-FILE には専用 schema がないため、ifx-file-rulebook と正本の契約単位に沿って示す。
export function renderFileInterface(doc: YamlRecord): string {
  const body = new TableBody();
  body.section(
    "連携の概要",
    properties(doc, [
      ["source", "連携元"],
      ["target", "連携先"],
      ["direction", "向き"],
      ["format", "形式"],
      ["timing", "タイミング"],
    ]),
  );
  body.section(
    "受け渡すファイル",
    recordTable(records(doc.files), [
      ["name", "名称"],
      ["location", "配置"],
      ["description", "説明"],
      ["writer", "書き手"],
      ["reader", "読み手"],
      ["format", "形式"],
    ]),
  );
  for (const file of records(doc.files)) {
    body.section(
      `ファイル契約: ${code(String(file.name))}`,
      properties(file, [
        ["naming_rule", "命名規則"],
        ["encoding", "文字コード"],
        ["schema_ref", "正本の型"],
        ["required_fields", "必須項目"],
      ]),
    );
  }
  for (const [key, title] of [
    ["transport", "配送・書き込み"],
    ["schema", "データ契約"],
    ["error_handling", "異常時の扱い"],
  ])
    body.section(title, properties(doc[key]));
  const verification = isRecord(doc.verification) ? doc.verification : {};
  body.section(
    "検証方法",
    properties(verification, [
      ["procedure", "手順"],
      ["file_checks", "ファイルごとの確認"],
    ]),
  );
  body.section(
    "検証ケース",
    recordTable(records(verification.cases), [
      ["id", "ケース ID"],
      ["viewpoint", "観点"],
      ["expected", "期待結果"],
    ]),
  );
  body.section(
    "未決事項",
    recordTable(records(doc.open_decisions), [
      ["id", "ID"],
      ["topic", "論点"],
      ["impact", "影響"],
      ["owner", "担当"],
      ["next_action", "次の対応"],
    ]),
  );
  return body.render();
}
