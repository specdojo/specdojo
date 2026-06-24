# Node + TypeScript 用の devcontainer ベースイメージ
# (multi-arch 対応 & Debian/Ubuntu ベースなので glibc あり)
FROM mcr.microsoft.com/devcontainers/javascript-node:24-trixie

USER root

# mermaid-cli(mmdc) が使う Chromium と、その周辺ライブラリをインストール
# locales は tmux 等のターミナルで日本語(UTF-8)を正しく表示するために必要
RUN apt-get update && \
    apt-get install -y \
      chromium \
      fonts-noto-cjk \
      locales \
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

# 日本語 UTF-8 ロケールを生成する。LANG 未設定だと LC_CTYPE が POSIX になり、
# tmux が UTF-8 モードにならず日本語(全角)表示が崩れる。
RUN sed -i 's/^# *\(ja_JP.UTF-8 UTF-8\)/\1/' /etc/locale.gen && \
    sed -i 's/^# *\(en_US.UTF-8 UTF-8\)/\1/' /etc/locale.gen && \
    locale-gen

# ターミナル・各種 CLI が UTF-8 / 日本語を前提に動作するようロケールを設定。
# LC_ALL はあえて設定せず、必要に応じてツールごとに上書きできるようにする。
ENV LANG=ja_JP.UTF-8 \
    LANGUAGE=ja_JP:ja

# Codex / OpenCode
RUN npm install -g \
    @openai/codex \
    opencode-ai

# puppeteer/mermaid-cli に「自前の Chromium を使え」と伝える
ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

USER node
