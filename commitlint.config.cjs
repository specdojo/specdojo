module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // 新機能
        "fix", // バグ修正
        "docs", // ドキュメント変更
        "style", // コードスタイル変更（機能に影響なし）
        "refactor", // リファクタリング
        "perf", // パフォーマンス改善
        "test", // テスト追加/修正
        "build", // ビルドシステム変更
        "ci", // CI設定変更
        "chore", // その他の変更
        "revert", // 変更の取り消し
        "exec", // taskの実行
      ],
    ],
    // Disabled: subjects may contain uppercase template placeholders (e.g., pjr-NNNN-TERM, YYYY-MM-DD)
    "subject-case": [0],
    // runner の commit の見出しは長い task ID を scope に含むため、既定の 100 では足りない（PJR-7TVA）。
    "header-max-length": [2, "always", 120],
    "subject-max-length": [2, "always", 100],
    "body-max-line-length": [2, "always", 100],
  },
};
