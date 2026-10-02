# Node + TypeScript 用の devcontainer ベースイメージ
# (multi-arch 対応 & Debian/Ubuntu ベースなので glibc あり)
FROM mcr.microsoft.com/devcontainers/javascript-node:24-trixie

USER root

ENV TZ=Asia/Tokyo

ARG NVIM_VERSION=0.12.5
ARG NVIM_SHA256_X86_64=bce0f56eda1f1b1db6eee8f4133d7a38813ea07933837dd1777411ca384c6875
ARG NVIM_SHA256_ARM64=1aa5ca085249580ae0f91eb14f27ec0919773ff2d99a163d03f3d6c21ac29725
ARG MARKSMAN_VERSION=2026-02-08
ARG MARKSMAN_SHA256_X86_64=be5098e8213219269c47fc0d916a66fa31ce0602ec967475c722260aabf26087
ARG MARKSMAN_SHA256_ARM64=db8e124527f7f8048e3e6c91821b9c52ef173d92c01e47d221bf1337afd962fb
ARG LAZYGIT_VERSION=0.65.1
ARG LAZYGIT_SHA256_X86_64=02beacbcda0fa342e50ae3480ba8147307353af3fb28e1d5f790e02329c201a6
ARG LAZYGIT_SHA256_ARM64=49abecdf6adf4f2dfdb11bf7b9bfada267ea523612ed809d1c6d87f6c04000a7

# mermaid-cli(mmdc) が使う Chromium と、その周辺ライブラリをインストール
# chromium-headless-shell を使うのは、Debian の chromium 150.0.7871.46-1~deb13u1
# (arm64 full 版) にヘッドレス描画時クラッシュ (brk #0 / SIGTRAP) の退行があるため。
# headless-shell は同一バージョンでも影響を受けず、mmdc の用途には軽量で十分。
# locales は tmux 等のターミナルで日本語(UTF-8)を正しく表示するために必要
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y \
      chromium \
      chromium-headless-shell \
      fonts-noto-cjk \
      locales \
      tzdata \
      libnss3 \
      libatk1.0-0 \
      libatk-bridge2.0-0 \
      libx11-xcb1 \
      libxcomposite1 \
      libxdamage1 \
      libxfixes3 \
      libxrandr2 \
      libgbm1 \
      libasound2 \
      bubblewrap \
    && rm -rf /var/lib/apt/lists/*

# コンテナ全体の既定タイムゾーンを日本時間にする。
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone

# 日本語 UTF-8 ロケールを生成する。LANG 未設定だと LC_CTYPE が POSIX になり、
# tmux が UTF-8 モードにならず日本語(全角)表示が崩れる。
RUN sed -i 's/^# *\(ja_JP.UTF-8 UTF-8\)/\1/' /etc/locale.gen && \
    sed -i 's/^# *\(en_US.UTF-8 UTF-8\)/\1/' /etc/locale.gen && \
    locale-gen

# Emacs とよく使われるツールをインストール
RUN apt-get update && apt-get install -y \
    build-essential \
    cron \
    emacs-nox \
    ripgrep \
    fd-find \
    git \
    git-delta \
    unzip \
    curl \
    sqlite3 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Neovim、Marksman、lazygit は公式 release を版と SHA-256 で固定する。
# Debian の amd64 は upstream の x86_64、arm64 は upstream の arm64 に対応する。
RUN set -eux; \
    architecture="$(dpkg --print-architecture)"; \
    case "$architecture" in \
      amd64) \
        nvim_arch="x86_64"; \
        nvim_sha256="$NVIM_SHA256_X86_64"; \
        marksman_arch="x64"; \
        marksman_sha256="$MARKSMAN_SHA256_X86_64"; \
        lazygit_arch="x86_64"; \
        lazygit_sha256="$LAZYGIT_SHA256_X86_64" \
        ;; \
      arm64) \
        nvim_arch="arm64"; \
        nvim_sha256="$NVIM_SHA256_ARM64"; \
        marksman_arch="arm64"; \
        marksman_sha256="$MARKSMAN_SHA256_ARM64"; \
        lazygit_arch="arm64"; \
        lazygit_sha256="$LAZYGIT_SHA256_ARM64" \
        ;; \
      *) \
        echo "Unsupported architecture: $architecture" >&2; \
        exit 1 \
        ;; \
    esac; \
    curl -fsSL --retry 3 \
      "https://github.com/neovim/neovim/releases/download/v${NVIM_VERSION}/nvim-linux-${nvim_arch}.tar.gz" \
      -o /tmp/nvim.tar.gz; \
    echo "${nvim_sha256}  /tmp/nvim.tar.gz" | sha256sum -c -; \
    install -d /opt/nvim; \
    tar -xzf /tmp/nvim.tar.gz -C /opt/nvim --strip-components=1; \
    ln -s /opt/nvim/bin/nvim /usr/local/bin/nvim; \
    curl -fsSL --retry 3 \
      "https://github.com/artempyanykh/marksman/releases/download/${MARKSMAN_VERSION}/marksman-linux-${marksman_arch}" \
      -o /tmp/marksman; \
    echo "${marksman_sha256}  /tmp/marksman" | sha256sum -c -; \
    install -m 0755 /tmp/marksman /usr/local/bin/marksman; \
    curl -fsSL --retry 3 \
      "https://github.com/jesseduffield/lazygit/releases/download/v${LAZYGIT_VERSION}/lazygit_${LAZYGIT_VERSION}_linux_${lazygit_arch}.tar.gz" \
      -o /tmp/lazygit.tar.gz; \
    echo "${lazygit_sha256}  /tmp/lazygit.tar.gz" | sha256sum -c -; \
    tar -xzf /tmp/lazygit.tar.gz -C /tmp lazygit; \
    install -m 0755 /tmp/lazygit /usr/local/bin/lazygit; \
    rm -f /tmp/nvim.tar.gz /tmp/marksman /tmp/lazygit.tar.gz /tmp/lazygit

# 両エディタで共用する LSP と tree-sitter CLI を再現可能な版で導入する。
RUN npm install --global \
      typescript@6.0.3 \
      typescript-language-server@6.0.1 \
      vscode-langservers-extracted@4.10.0 \
      yaml-language-server@1.24.0 \
      bash-language-server@5.8.1 \
      tree-sitter-cli@0.27.0

# named volume の初回作成時に node ユーザーの所有権を引き継がせる。
RUN install -d -o node -g node \
      /home/node/.local/share/emacs \
      /home/node/.local/share/nvim

# ビルド中に CLI の版と、各 LSP が stdio 待受まで進むことを確認する。
RUN set -eux; \
    nvim --version | grep '^NVIM v0\.12\.'; \
    emacs --batch --eval '(princ emacs-version)' | grep '^30\.1'; \
    tree-sitter --version; \
    lazygit --version; \
    delta --version; \
    check_lsp() { \
      status=0; \
      timeout 1s sh -c "tail -f /dev/null | $*" >/dev/null 2>&1 || status=$?; \
      [ "$status" -eq 124 ]; \
    }; \
    check_lsp typescript-language-server --stdio; \
    check_lsp vscode-json-language-server --stdio; \
    check_lsp vscode-eslint-language-server --stdio; \
    check_lsp yaml-language-server --stdio; \
    check_lsp bash-language-server start; \
    check_lsp marksman server

# ターミナル・各種 CLI が UTF-8 / 日本語を前提に動作するようロケールを設定。
# LC_ALL はあえて設定せず、必要に応じてツールごとに上書きできるようにする。
ENV LANG=ja_JP.UTF-8 \
    LANGUAGE=ja_JP:ja

# puppeteer/mermaid-cli に「自前の Chromium (headless-shell) を使え」と伝える。
# full 版 /usr/bin/chromium は上記の退行が直るまで参照しない。
ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/lib/chromium/chromium-headless-shell

USER node
