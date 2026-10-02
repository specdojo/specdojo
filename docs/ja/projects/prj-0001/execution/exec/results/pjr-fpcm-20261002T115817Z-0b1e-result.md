---
specdojo:
  id: prj-0001:xer-pjr-fpcm-20261002t115817z-0b1e
  type: exec-result
  task_id: PJR-FPCM
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-fpcm-20261002T115817Z-0b1e-plan.md
  started_at: "2026-10-02T11:58:17.908Z"
  completed_at: "2026-10-02T12:17:18.820Z"
  agent: codex-expert-executor
---

# Edit Result

## 1. 実施内容

- devcontainer に Neovim 0.12（release の tarball）と、両エディタ共通で使う LSP（TypeScript・JSON/ESLint・YAML・Bash・Markdown）、tree-sitter CLI、C コンパイラ、lazygit、git-delta を導入するよう `.devcontainer/Dockerfile` を更新した。
- エディタの設定とプラグインはイメージに含めず、dotfiles と named volume で扱う構成にした。`.devcontainer/devcontainer.json` に named volume 関連の変更を加えた。
- 設計書 `tsd-home-mac-dev-server.md` と個票 `pjr-fpcm-devcontainer-editor-toolchain.md` に、実装内容と dotfiles 手順を反映した。
- executor 実行の整形・登録簿生成・`catalog validate`・`index build`・`git diff --check` はいずれも成功した。runner 検証の `lint-ts`、`lint-fm`、`lint-md`、`test-integration`、`validate-schema`、`typecheck`、`test-unit` もすべて passed だった。
- `devcontainer build --workspace-folder .` は executor 環境に devcontainer と docker がなく not_run である。個票の指定どおり、実機再ビルドは人が実施する残作業であり、本タスクの編集内容の完了を妨げるものではない。

## 2. 変更ファイル

- `.devcontainer/Dockerfile`: Neovim 0.12 の tarball、LSP 群、tree-sitter CLI、C コンパイラ、lazygit、git-delta の導入処理を追加した（95 行規模の変更）。
- `.devcontainer/devcontainer.json`: エディタ設定・プラグイン用の named volume に関する設定を変更した（3 行規模の変更）。
- `docs/ja/product/030-architecture/020-infrastructure/tsd-home-mac-dev-server.md`: devcontainer のエディタツールチェーン構成と dotfiles・named volume の扱いを設計書へ追記した。
- `docs/ja/projects/prj-0001/controls/project-register/pjr-fpcm-devcontainer-editor-toolchain.md`: 個票の作業内容・対応結果セクションを実施内容で更新した。

## 3. 申し送り

- 人が `devcontainer build --workspace-folder .` による実機再ビルドを実施し、イメージが正常にビルドできることを確認する。
- 再ビルド後、Neovim と Emacs で LSP・tree-sitter・lazygit・git-delta の動作と、dotfiles・named volume の運用を確認する。
- `catalog validate` に既存の欠落文書に関する警告が出ているが、本タスクの変更に起因するものではない。
- 登録簿（`pjr-index.md`）の行と個票のステータス項目は変更していない。状態遷移は runner と人間が行う。

## 4. 進め方と実践の型の適用

個票と設計書を基準に、Dockerfile と devcontainer.json の変更でツールチェーンを導入した。エディタ設定とプラグインはイメージに含めず dotfiles と named volume に分離し、設計書と個票へ反映した。検証は executor 実行分と runner の固定許可リスト検証で確認した。実機ビルドのみ環境制約で未実施のため、人への申し送りとした。
