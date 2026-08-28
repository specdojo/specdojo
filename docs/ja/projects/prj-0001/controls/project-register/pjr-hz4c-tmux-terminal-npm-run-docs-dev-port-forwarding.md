---
specdojo:
  id: prj-0001:pjr-hz4c-tmux-terminal-npm-run-docs-dev-port-forwarding
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-12T22:17:50Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-13T04:49:02Z"
  conclusion: devcontainer.jsonのforwardPortsをappPort（Dockerレベルの固定ポート公開）へ変更し、リモート端末からのアクセスはVS CodeのPorts機能ではなくtmux接続用Hostエントリへのssh local forwardingで対応。Mac自身・リモート端末（ThinkPad）双方のブラウザで実機確認済み。
  register_events:
    - v: 1
      id: reg_7f5a759aa6ff7cb71d2bb0d4f3c9ac0e
      ts: "2026-08-12T22:37:01Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "exec(register PJR-HZ4C): file todo to enable port forwarding for tmux-launched docs:dev"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: tmuxのterminalからnpm run docs:devを起動してもport forwardingを機能させる
        - field: description
          from: ""
          to: 現状、npm run docs:devはvscodeのterminalで実行し、vscodeのport forwarding機能でホスト/リモート端末からWebページを表示している。tmuxのterminalから起動した場合も同様にport forwardingできるようにする。
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: "2026-08-13"
        - field: due
          from: ""
          to: "2026-08-31"
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: 738759050b53e847a1469e10e80f944b4908514d
    - v: 1
      id: reg_a61f168345c59d579477dfeb7560f734
      ts: "2026-08-13T01:48:07Z"
      action: start
      actor: SpecDojo Test
      from_status: open
      to_status: in-progress
      reason: "exec(register PJR-HZ4C): start"
      changes:
        - field: status
          from: open
          to: in-progress
      legacy_commit: a5d192fa476d3899d448e86d8dc12e74e9403391
      previous_event_id: reg_7f5a759aa6ff7cb71d2bb0d4f3c9ac0e
    - v: 1
      id: reg_d11d1191657c88ecbae52d8881f89c87
      ts: "2026-08-13T01:55:17Z"
      action: review
      actor: SpecDojo Test
      from_status: in-progress
      to_status: review
      reason: "exec(register PJR-HZ4C): review"
      changes:
        - field: status
          from: in-progress
          to: review
      legacy_commit: 53a04bb10d06ff31963d5e044e865bdfd1b1c576
      previous_event_id: reg_a61f168345c59d579477dfeb7560f734
    - v: 1
      id: reg_fdd5746ab9218fc49bddd09f013eccb8
      ts: "2026-08-13T04:59:13Z"
      action: close
      actor: SpecDojo Test
      from_status: review
      to_status: done
      reason: "exec(register PJR-HZ4C): switch devcontainer port to appPort with SSH local forwarding"
      changes:
        - field: status
          from: review
          to: done
        - field: completed
          from: "-"
          to: "2026-08-13"
        - field: conclusion
          from: "-"
          to: devcontainer.jsonのforwardPortsをappPort（Dockerレベルの固定ポート公開）へ変更し、リモート端末からのアクセスはVS CodeのPorts機能ではなくtmux接続用Hostエントリへのssh local forwardingで対応。Mac自身・リモート端末（ThinkPad）双方のブラウザで実機確認済み。
      legacy_commit: e4217de1a2af0fd1502ad69e417d669c433cc587
      previous_event_id: reg_d11d1191657c88ecbae52d8881f89c87
---

# PJR-HZ4C tmuxのterminalからnpm run docs:devを起動してもport forwardingを機能させる

## 1. 概要

現状、npm run docs:devはvscodeのterminalで実行し、vscodeのport forwarding機能でホスト/リモート端末からWebページを表示している。tmuxのterminalから起動した場合も同様にport forwardingできるようにする。

## 2. 完了条件

- `docs:dev`（`vitepress dev . --host 0.0.0.0 --port 5173`）を tmux のターミナルから起動した場合でも、VS Code の Ports パネルにポート 5173 が自動登録され、ホスト/リモート端末からブラウザでアクセスできる。
- vscode の統合ターミナルから起動した場合と同様の挙動になることを確認する。

## 3. 作業内容

| No  | 作業                                                                                                        | 担当  | 状態 | メモ                                                                                                                                       |
| --- | ----------------------------------------------------------------------------------------------------------- | ----- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `.devcontainer/devcontainer.json` に `forwardPorts: [5173]` と `portsAttributes` を追加                     | ARC   | done | 初回対応。`VitePress docs` として固定ポート 5173 を明示登録                                                                                |
| 2   | 実機確認: Rebuild 後、Mac 自身のブラウザからアクセス                                                        | owner | done | 到達を確認                                                                                                                                 |
| 3   | 実機確認: リモート端末（ThinkPad）のブラウザからアクセス                                                    | owner | done | `forwardPorts` では到達不可。VS Code の `Forward a Port` で手動転送すると到達したが、VS Code起動必須・母艦側セッション再接続の副作用を確認 |
| 4   | 副作用の原因調査と対応方針の決定                                                                            | ARC   | done | ネスト構成（Remote SSH + Dev Containers）での `forwardPorts` の既知の制限と判断。`appPort` + SSH local forwarding へ変更                   |
| 5   | `.devcontainer/devcontainer.json` を `forwardPorts` から `appPort: [5173]` へ変更                           | ARC   | done | Docker レベルの固定ポート公開に切り替え、VS Code の起動有無に依存しない構成にした                                                          |
| 6   | [[tsd-home-mac-dev-server-usage\|自宅 MacBook Pro 開発サーバ運用ガイド]] へ SSH local forwarding 手順を追記 | ARC   | done | 4.8.6 の Ollama API と同様のパターンで、接続元端末の `~/.ssh/config` に `LocalForward 5173 127.0.0.1:5173` を追加する手順を記載            |
| 7   | Dev Container を Rebuild し、`appPort` 設定が反映されることを確認                                           | owner | done | No.9 のリモートアクセス成功により、rebuild と `appPort` 反映を確認                                                                         |
| 8   | Mac 自身のブラウザから `http://localhost:5173` でアクセスできることを再確認                                 | owner | done | `appPort` 変更後も到達を確認                                                                                                               |
| 9   | リモート端末の SSH config に `LocalForward` を追加し、VS Code 未起動でもアクセスできることを確認            | owner | done | Windows(ThinkPad) の `~/.ssh/config` の tmux 接続用 Host エントリ（環境名: `specdojo-tmux`）に追加してアクセス成功                         |

## 4. 対応結果

- 初回対応として `.devcontainer/devcontainer.json` に `forwardPorts: [5173]` を追加したが、実機確認の結果、Mac 自身のブラウザからは到達したものの、リモート端末（ThinkPad）からは到達しなかった。
- 接続経路は「リモート端末 → SSH（Tailscale）→ Host Mac → Dev Containers → devcontainer」という二重のリモート接続（ネスト構成）であり、`forwardPorts` は VS Code（Dev Containers拡張）が動的に張るトンネルのため、この経路の SSH レイヤーでの自動転送検出が機能していなかったと判断した。VS Code の `Forward a Port` で手動転送すると到達したが、「リモート端末で VS Code を起動していないと繋がらない」「母艦（Mac）側で開いている VS Code が再接続になる」という副作用が確認された。これは VS Code Remote SSH + Dev Containers のネスト構成における既知の制限（<https://github.com/microsoft/vscode/issues/191945>、<https://github.com/microsoft/vscode-remote-release/issues/10926>）と一致する。
- 対応として、`forwardPorts`（VS Code 主導の動的トンネル）を `appPort: [5173]`（Docker レベルの固定ポート公開）へ変更した。`docs:dev` は既に `--host 0.0.0.0` で待ち受けており、`appPort` の要件（全インターフェースで待ち受け）を満たす。
- リモート端末からのアクセスは、VS Code の Ports パネルではなく SSH local forwarding（`LocalForward 5173 127.0.0.1:5173`）を使う方式へ変更した。`LocalForward` はその設定を持つ SSH 接続自体にだけ有効なため、通常のログイン接続（`Host home-mbp`）ではなく、tmux セッションへ直接入る接続用 Host エントリ（4.11.2 の `home-mbp-tmux` 相当）へ追加する必要がある。当初「`Host home-mbp` へ追加する」と案内したのは誤りで、[[tsd-home-mac-dev-server-usage|自宅 MacBook Pro 開発サーバ運用ガイド]] を tmux 接続用 Host エントリへの追加に訂正した。実機では Windows(ThinkPad) 側の tmux 接続用 Host エントリ（環境名: `specdojo-tmux`）へ追加してアクセスに成功した。
- 既存の Ollama API（11434番、4.8.6節）と同じ SSH local forwarding のパターンを踏襲しており、SSH 接続が張られている間は VS Code の起動有無に関わらずアクセスでき、複数クライアント間のトンネル競合も発生しない。
- JSONC/Markdown の整形・静的検査と register/catalog/index の検証は完了した。Mac 自身のブラウザ、リモート端末（ThinkPad）のブラウザの双方で `appPort` + SSH local forwarding 構成での到達を実機確認し、完了条件を満たした。

## 5. 関連ドキュメント

- [[tsd-home-mac-dev-server|自宅 MacBook Pro 開発サーバ技術スタック定義]]
- [[tsd-home-mac-dev-server-usage|自宅 MacBook Pro 開発サーバ運用ガイド]]
