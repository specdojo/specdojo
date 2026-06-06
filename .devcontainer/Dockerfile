# Node + TypeScript 用の devcontainer ベースイメージ
# (multi-arch 対応 & Debian/Ubuntu ベースなので glibc あり)
FROM mcr.microsoft.com/devcontainers/javascript-node:24-trixie

USER root

# mermaid-cli(mmdc) が使う Chromium と、その周辺ライブラリをインストール
RUN apt-get update && \
    apt-get install -y \
      chromium \
      fonts-noto-cjk \
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

# Codex / OpenCode
RUN npm install -g \
    @openai/codex \
    opencode-ai

# puppeteer/mermaid-cli に「自前の Chromium を使え」と伝える
ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

USER node
