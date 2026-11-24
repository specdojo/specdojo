---
specdojo:
  id: prj-0001:pjr-f636-onboarding-ci-matrix
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-23T13:17:07Z"
  due_on: "2026-11-30"
  depends_on:
    - PJR-B6M3
  commit_type: ci
  commit_scope: onboarding
---

# PJR-F636 導入のパターンを CI で確かめる（Linux の Dev Container と macOS）

## 1. 概要

Linux の Dev Container と macOS の手元の導入を GitHub Actions で確かめ、WSL はリリースの前のチェックリストにする

## 2. 入力

- 利用者の依頼（2026-11-23）: 多くの人に使ってもらうため、Dev Container・Dev Container ＋ tmux・mac・mac ＋ tmux・WSL・WSL ＋ tmux のパターンですぐに使えるようにする
- v0.10.0 に入れる（利用者の指定、2026-11-24）

## 3. 完了条件

- Linux の Dev Container の導入と、macOS の手元の導入（`init`・`doctor`・`register add`）を、GitHub Actions で確かめる。WSL は CI で確かめにくいので、リリースの前に人が流すチェックリストを運用メモに書く。
- ワークフロー（`.github/`）は保護された設定のため、案を個票の対応結果に書き、反映は利用者の承認のもとでオーケストレーターが行う。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。

## 4. 作業内容

| No  | 作業                                         | 担当 | 状態 | メモ                                                           |
| --- | -------------------------------------------- | ---- | ---- | -------------------------------------------------------------- |
| 1   | CI のワークフローを提案する                  | DEV  | done | 4 パターンの実行案を下記に記録。保護設定への反映は承認後に行う |
| 2   | WSL のリリース前チェックを運用メモに追加する | DEV  | done | 手元と tmux の両方の手順と合格条件を記載                       |

## 5. 対応結果

### 5.1. ワークフロー案

`.github/workflows/onboarding.yml` を新設する案。pull request と develop への push、および手動実行で、現在のソースから作った npm package を空の Git リポジトリに導入する。macOS と Linux の Dev Container について tmux の有無をそれぞれ別ジョブにする。認証を必要とする agent の実行は対象外で、CLI の存在を `doctor` で検査する。Git の名前とメールは一時リポジトリだけに設定する。

```yaml
name: Onboarding
on:
  pull_request:
  push:
    branches: [develop]
  workflow_dispatch:
permissions:
  contents: read
jobs:
  onboarding:
    strategy:
      fail-fast: false
      matrix:
        include:
          - os: macos-latest
            container: false
            tmux: false
          - os: macos-latest
            container: false
            tmux: true
          - os: ubuntu-latest
            container: true
            tmux: false
          - os: ubuntu-latest
            container: true
            tmux: true
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
      - run: npm ci
      - name: Pack current source
        run: npm pack --pack-destination "$RUNNER_TEMP"
      - name: Install prerequisites
        env:
          CONTAINER: ${{ matrix.container }}
          TMUX: ${{ matrix.tmux }}
        run: |
          npm install -g @anthropic-ai/claude-code
          if [ "$CONTAINER" = true ]; then
            npm install -g @devcontainers/cli
          elif [ "$TMUX" = true ]; then
            brew install tmux
          fi
      - name: Initialize a clean project
        env:
          CONTAINER: ${{ matrix.container }}
          TMUX: ${{ matrix.tmux }}
        run: |
          mkdir -p "$RUNNER_TEMP/onboarding/project"
          cd "$RUNNER_TEMP/onboarding/project"
          git init
          git config --local user.name 'CI'
          git config --local user.email 'ci@example.invalid'
          npm init -y
          npm install --save-dev "$RUNNER_TEMP"/specdojo-*.tgz
          args=(--yes --provider claude)
          if [ "$CONTAINER" = true ]; then
            args+=(--devcontainer --devcontainer-preset minimal)
          fi
          if [ "$TMUX" = true ]; then args+=(--tmux); else args+=(--no-tmux); fi
          npx specdojo init "${args[@]}"
      - name: Check macOS
        if: ${{ !matrix.container }}
        env:
          TMUX: ${{ matrix.tmux }}
        run: |
          cd "$RUNNER_TEMP/onboarding/project"
          if [ "$TMUX" = true ]; then
            npx specdojo doctor --tmux
            tmux new-session -d -s onboarding
            tmux has-session -t onboarding
            tmux kill-session -t onboarding
          else
            npx specdojo doctor
          fi
          npx specdojo register add --project prj-0001 --type todo --title 'CI onboarding'
          find docs -name 'pjr-*.md' -exec grep -l 'CI onboarding' {} + | grep -q .
      - name: Check Linux Dev Container
        if: ${{ matrix.container }}
        env:
          TMUX: ${{ matrix.tmux }}
        run: |
          project="$RUNNER_TEMP/onboarding/project"
          devcontainer up --workspace-folder "$project"
          devcontainer exec --workspace-folder "$project" bash -lc             'npx specdojo doctor --devcontainer && npx specdojo register add --project prj-0001 --type todo --title "CI onboarding" && find docs -name "pjr-*.md" -exec grep -l "CI onboarding" {} + | grep -q .'
          if [ "$TMUX" = true ]; then
            devcontainer exec --workspace-folder "$project" bash -lc               'npx specdojo doctor --devcontainer --tmux && tmux new-session -d -s onboarding && tmux has-session -t onboarding && tmux kill-session -t onboarding'
          fi
```

この案は保護された `.github/` へ未反映であり、GitHub Actions 上の実行結果はまだない。承認後、オーケストレーターが反映し、4 ジョブの成功と実際に起票された個票を確認する。外部 CLI や Dev Container image の取得を伴うため、失敗時はログを確認して修正する。

### 5.2. CHANGELOG に書く事項

変更: Linux の Dev Container と macOS の導入を CI で確認し、WSL のリリース前チェックを追加する（ワークフロー反映後に掲載）。

## 6. 関連ドキュメント

- [[specdojo:quick-start-guide|クイックスタート]]: 6 パターンの導入手順。
- [[prj-0001:pm-orchestrator-playbook|オーケストレーター運用メモ]]: WSL のリリース前チェック。
- [[prj-0001:pjr-b6m3-quick-start-environment-patterns|PJR-B6M3]]: 導入手順の整備。
