---
specdojo:
  id: prj-0001:pjr-p318-security-automation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: ARC
  registered_at: "2026-11-18T12:18:15Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-5CTM
  depends_on:
    - PJR-5CTM
---

# PJR-P318 依存の更新と脆弱性・コードの検査を定期的に回す仕組みを入れる

## 1. 概要

Dependabot（週 1 回の依存の更新と脆弱性の修正の PR）、CI の npm audit の関門（配る依存の high で止める）、CodeQL（PR ごとと週 1 回）を入れる

## 2. 入力

- 利用者の依頼（2026-11-18）: package の更新やコードの検査などのセキュリティ対策を定期的に実行したい
- 利用者の決定（2026-11-18）: orchestrator の推奨の 1〜3 を採る。1. Dependabot（週 1 回、開発用の依存はまとめて 1 本の PR、脆弱性の修正は随時）、2. CI の audit の関門（PR と publish の前に npm audit --omit=dev --audit-level=high、開発用は報告だけ）、3. CodeQL（TypeScript、PR ごとと週 1 回）
- orchestrator の推奨（2026-11-18）: specdojo の routine で週 1 回 audit を見て登録簿へ起票する案（4）は、routine から任意のコマンドを流せるかを確かめてから決める。GitHub の secret scanning・push protection と npm publish の provenance も合わせて勧めた
- orchestrator の調べ（2026-11-18）: 今ある検査は .github/workflows/check-evidence-secrets.yml（実行の記録の秘密の検査）だけ。Dependabot・CodeQL・audit の CI は無い

## 3. 完了条件

- `.github/dependabot.yml` を作る。npm の依存は週 1 回更新し、開発用の依存はまとめて 1 本の PR にする。脆弱性の修正（security updates）は随時 PR になるようにする。GitHub Actions の版も週 1 回更新する。
- 配る依存の audit を CI に入れる。PR と publish（`publish-specdojo.yml`）の前に `npm audit --omit=dev --audit-level=high` を流し、該当があれば止める。開発用の audit は結果を報告するだけで止めない。上流が直すまで止まる場合の、期限付きの例外の手順を書く。
- CodeQL（`javascript-typescript`）を PR ごとと週 1 回で流す workflow を入れる。
- secret scanning・push protection と、npm publish の provenance の設定の手順を書く。GitHub の設定は利用者が行う。
- workflow と Dependabot の設定が保護された設定に当たる場合は、executor は変えず、案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- specdojo の routine で週 1 回 audit を見て登録簿へ起票する案が、今の routine で実現できるかを調べ、結論を個票の対応結果に書く。できない場合に要る機能は、起票の案として書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- 設定の書き方を関係する文書（運用・リリースの手順など）へ反映する。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。
- `npm run lint:md` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                           | 担当 | 状態 | メモ                                                                                                    |
| --- | ---------------------------------------------- | ---- | ---- | ------------------------------------------------------------------------------------------------------- |
| 1   | Dependabot の設定を書く                        | ARC  | done | `.github/dependabot.yml` を作った（npm 4 か所と GitHub Actions）                                        |
| 2   | CI に配る依存の audit の関門を入れる           | ARC  | open | `.github/workflows/` は保護された設定のため executor は変えない。案を対応結果に書いた。反映は利用者承認 |
| 3   | CodeQL の workflow を入れる                    | ARC  | open | 同上。案を対応結果に書いた。反映は利用者の承認のもと feature ブランチで行う                             |
| 4   | GitHub の設定の手順と routine の案の調べを書く | ARC  | done | 手順を運用メモの「依存とコードのセキュリティ検査」に書き、routine の結論を対応結果に書いた              |

## 5. 対応結果

### 5.1. 実施内容

- `.github/dependabot.yml` を新しく作った。npm（ルート・`packages/docs-lint`・`packages/docs-site`・`packages/vscode-specdojo`）と GitHub Actions を毎週月曜 9:00（Asia/Tokyo）に更新する。開発用の依存は `dependency-type: development` の group でディレクトリごとに 1 本の PR にまとめる。GitHub Actions は 1 本の PR にまとめる。group は `applies-to: version-updates` に限るため、脆弱性の修正（security updates）はまとめられず随時届く。commit の接頭辞は `build(deps)`・`build(deps-dev)`・`ci(deps)` で、commitlint の `type-enum` に収まる。
- [[prj-0001:pm-orchestrator-playbook|オーケストレーター運用メモ]] に「依存とコードのセキュリティ検査」の節を足し、Dependabot の PR の扱い、audit の関門と期限付きの例外の手順、CodeQL、GitHub の設定（secret scanning・push protection・Dependabot security updates）、npm publish の provenance の確かめ方を書いた。リリースの手順にも配る依存の audit の確認を足した。
- audit の関門と CodeQL の workflow は、`.github/workflows/` が保護された設定（`src/exec/agent-protected-config.ts` の `PROTECTED_DIRECTORY_PREFIXES`）のため executor は作らず、次の「保護された設定の変更案」に書いた。`.github/dependabot.yml` は保護の対象に含まれないため executor が作った。

### 5.2. 決めた事項

- 配る依存の audit の関門はルートの `specdojo` だけに掛ける。完了条件が `publish-specdojo.yml` を対象とするためである。`packages/docs-lint`・`packages/docs-site` は報告だけにする。docs-lint 単体の audit には PJR-5CTM で範囲の外とした markdown-it の high が残り、関門にすると PR がすべて止まるためである。その high を扱う項目が閉じたら関門へ移す。
- 例外は `npm audit` に無視の仕組みが無いため、workflow の環境変数 `AUDIT_EXCEPTIONS` に「advisory の ID・期限・追跡する登録簿項目」の 3 つを 1 行ずつ書き、JSON の結果を Node 標準だけの短いスクリプトで判定する。例外の置き場を workflow にしたのは、保護された設定として agent が足せず、利用者の承認を経るからである。期限を過ぎると再び止まり、書式の誤りも止める。
- 関門は `npm ci` を流さない。`npm audit` は `package-lock.json` だけで判定できるためである。
- 関門は再利用できる workflow（`workflow_call`）にまとめ、PR と `publish-specdojo.yml` から同じ定義を呼ぶ。判定が二つの場所でずれないようにするためである。
- CodeQL は `push` の `main` も対象に足す。PR の結果を比べる基準の解析が既定のブランチに要るためである。解析は `build-mode: none` とする（JavaScript・TypeScript はビルドが要らない）。
- Dependabot の PR は既定のブランチ（`main`）へ向く。`target-branch` で develop 系へ向ける案は、security updates が既定のブランチにしか向かず二つの経路に分かれるため採らなかった。PR の取り込みは運用メモの手順に従う。

### 5.3. 保護された設定の変更案

利用者の承認のもと、orchestrator が feature ブランチで反映する。反映の後に、PR を 1 本作って関門と CodeQL が動くことを確かめる。

案 1. `.github/workflows/security-audit.yml` を新しく作る。

```yaml
name: Security audit

# 配る依存の npm audit を PR と publish の前に流し、high 以上で止める（PJR-P318）。
# 開発用を含む全体の audit と packages/* の audit は報告だけで止めない。
# 上流が直すまで止まる advisory は AUDIT_EXCEPTIONS に期限付きで足す（手順は運用メモ）。
on:
  pull_request:
  workflow_dispatch:
  workflow_call:

permissions:
  contents: read

jobs:
  audit:
    runs-on: ubuntu-latest
    env:
      # 1 行に 1 件、"<GHSA-id> <YYYY-MM-DD> <PJR-ID>"。期限の翌日から再び止まる。
      AUDIT_EXCEPTIONS: ""
    steps:
      - uses: actions/checkout@v5

      - uses: actions/setup-node@v5
        with:
          node-version: 24

      - name: Audit shipped dependencies (gate)
        shell: bash
        run: |
          set -euo pipefail
          npm audit --omit=dev --audit-level=high --json > "$RUNNER_TEMP/audit.json" || true
          node - "$RUNNER_TEMP/audit.json" <<'EOF'
          const fs = require("node:fs");
          const report = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
          if (report.error) {
            console.error(`npm audit failed: ${JSON.stringify(report.error)}`);
            process.exit(1);
          }
          const today = new Date().toISOString().slice(0, 10);
          const exceptions = new Map();
          for (const line of (process.env.AUDIT_EXCEPTIONS ?? "").split("\n")) {
            const [id, until, item] = line.trim().split(/\s+/);
            if (!id) continue;
            if (!/^\d{4}-\d{2}-\d{2}$/.test(until ?? "") || !/^PJR-[0-9A-Z]{4}$/.test(item ?? "")) {
              console.error(`invalid AUDIT_EXCEPTIONS line (expected "<GHSA-id> <YYYY-MM-DD> <PJR-ID>"): ${line}`);
              process.exit(1);
            }
            exceptions.set(id, { until, item });
          }
          const failures = [];
          for (const [name, vulnerability] of Object.entries(report.vulnerabilities ?? {})) {
            for (const via of vulnerability.via ?? []) {
              if (typeof via !== "object" || !["high", "critical"].includes(via.severity)) continue;
              const id = String(via.url ?? "").split("/").pop();
              const exception = exceptions.get(id);
              if (exception && exception.until >= today) {
                console.log(`excepted: ${name} ${id} until ${exception.until} (${exception.item})`);
                continue;
              }
              const expired = exception ? ` (exception expired on ${exception.until}, ${exception.item})` : "";
              failures.push(`${name}: ${via.severity} ${id} ${via.title}${expired}`);
            }
          }
          if (failures.length > 0) {
            console.error(`high or critical advisories in shipped dependencies:\n${failures.join("\n")}`);
            process.exit(1);
          }
          console.log("no unexcepted high or critical advisories in shipped dependencies");
          EOF

      - name: Audit all dependencies (report only)
        if: always()
        continue-on-error: true
        shell: bash
        run: npm audit --audit-level=high | tee -a "$GITHUB_STEP_SUMMARY"

      - name: Audit packages (report only)
        if: always()
        continue-on-error: true
        shell: bash
        run: |
          for dir in packages/docs-lint packages/docs-site; do
            echo "## $dir" | tee -a "$GITHUB_STEP_SUMMARY"
            npm --prefix "$dir" audit --omit=dev --audit-level=high | tee -a "$GITHUB_STEP_SUMMARY" || true
          done
```

案 2. `.github/workflows/publish-specdojo.yml` の `jobs` で、公開の前に関門を呼ぶ。

```yaml
jobs:
  audit:
    uses: ./.github/workflows/security-audit.yml

  publish:
    needs: audit
    runs-on: ubuntu-latest
    # 以下の steps は変えない
```

案 3. `.github/workflows/codeql.yml` を新しく作る。

```yaml
name: CodeQL

# TypeScript・JavaScript のコードを PR ごとと週 1 回解析する（PJR-P318）。
# main への push は、PR の結果を比べる基準の解析として流す。
on:
  pull_request:
  push:
    branches:
      - main
  schedule:
    - cron: "0 0 * * 1"
  workflow_dispatch:

permissions:
  contents: read

jobs:
  analyze:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write
      actions: read
    steps:
      - uses: actions/checkout@v5

      - uses: github/codeql-action/init@v4
        with:
          languages: javascript-typescript
          build-mode: none

      - uses: github/codeql-action/analyze@v4
        with:
          category: "/language:javascript-typescript"
```

- 案 1 の判定のスクリプトは、executor の sandbox で `node` を起動できず、試しの入力（high・例外の期限内・期限切れ・書式の誤り・該当なし）で確かめられていない。反映の前に orchestrator が `npm audit --omit=dev --json` の出力と試しの入力で確かめる。
- `github/codeql-action` の版（`v4`）は反映のときに最新の主版を確かめる。リポジトリの設定で CodeQL の default setup を有効にしていると、この workflow（advanced setup）と並べて使えないため、default setup は無効のままにする。

### 5.4. routine で週 1 回 audit を見て起票する案の調べ

- 結論: 今の routine で実現できる。routine の `action.kind` は `job` と `specdojo` だけで、routine から直接は任意のコマンドを流せない（`src/routine/definition.ts`）。ただし `kind: job` から呼ぶ job が `task.mode: command` なら、`task.command`（または `task.steps[].command`）にシェルの手順を書ける（`src/job/definition.ts`、例: `job-register-sweep.yaml`）。そこで `npm audit --omit=dev --json` を流し、該当があれば `{{specdojo}} register add --project "{{project_id}}" --type todo --priority high --title ... --input ... --commit` で起票する。`task.precondition`（`skip_when: empty-output`）で該当が無い週は飛ばせる。
- 課題: 同じ advisory を毎週起票しない仕組みが無い。シェルで既存の個票を advisory の ID で探して飛ばすことはできるが、手順が job の中に埋もれる。また Dependabot の security updates と CI の関門で同じ advisory が既に見えるため、起票は重なりやすい。
- 起票の案（必要になったら起票する）: `register add` に重複を避ける鍵（例: `--dedupe-key <key>` で、同じ鍵の open な項目があれば起票しない）を足す。job の中の重複判定をシェルに頼らず、ほかの定期の起票にも使える。今回は Dependabot と CI の関門で足りるため、routine は作らない。

### 5.5. 残課題

- 作業内容の 2・3（保護された設定の反映）は、利用者の承認のもと orchestrator が feature ブランチで行う。
- GitHub の設定（secret scanning・push protection・Dependabot alerts と security updates・private vulnerability reporting）は利用者が行う。手順は運用メモの「依存とコードのセキュリティ検査」にある。
- npm publish の provenance は、Trusted Publishing で公開リポジトリから公開すると自動で付く。staged publishing（`npm stage publish`）で付くかは確かめていないため、次の公開で npm の版のページに provenance の表示があるかを確かめる。無ければ `npm stage publish` に `--provenance` を足す案を別に起票する。
- `packages/docs-lint` の markdown-it の high を扱う項目が閉じたら、案 1 の packages の audit を関門へ移す。

### 5.6. CHANGELOG に書く事項

- 区分: 変更（開発の基盤。配る成果物には影響しない）。
- 行の文案: 「依存の更新を Dependabot で週 1 回 PR にし、配る依存の `npm audit`（high 以上）を PR と npm 公開の前の関門にし、CodeQL の解析を PR ごとと週 1 回流すようにした（PJR-P318）。」
- 案 2・3 の反映が同じリリースに入らない場合は、Dependabot の部分だけを書く。

## 6. 関連ドキュメント

- [[prj-0001:pjr-5ctm-npm-audit-high|PJR-5CTM]]
