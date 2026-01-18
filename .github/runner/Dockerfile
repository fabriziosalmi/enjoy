FROM ubuntu:22.04

# Base system
RUN apt-get update && apt-get install -y \
    curl \
    git \
    jq \
    build-essential \
    python3 \
    python3-pip \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Node 20 LTS
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# FFmpeg for media manipulation (Level 60+)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    imagemagick \
    && rm -rf /var/lib/apt/lists/*

# Python tools for AI/ML (Level 70+)
RUN pip3 install --no-cache-dir \
    torch \
    transformers \
    huggingface-hub \
    pillow \
    numpy \
    opencv-python-headless

# Cybersecurity tools (Level 80+)
RUN apt-get update && apt-get install -y \
    nmap \
    nikto \
    sqlmap \
    && rm -rf /var/lib/apt/lists/*

# Playwright for screenshots (all levels)
RUN npm install -g playwright && playwright install --with-deps chromium

# GitHub Actions Runner (will be configured at runtime)
WORKDIR /runner
RUN curl -o actions-runner-linux.tar.gz -L \
    https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz \
    && tar xzf actions-runner-linux.tar.gz \
    && rm actions-runner-linux.tar.gz

# Setup entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
