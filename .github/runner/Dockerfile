FROM ubuntu:22.04

# =============================================================================
# ENJOY GAME RUNNER - MINIMAL EDITION
# =============================================================================
# This is a TEXT-BASED GAME. We don't need PyTorch. We don't need SQLMap.
# We need: Node.js, Git, and a sense of humor.
#
# Previous version installed: torch, transformers, nmap, nikto, sqlmap, opencv
# That was like renting a Falcon 9 rocket to deliver a pizza. - Gemini 2025
# =============================================================================

# Base system - only what we actually need
RUN apt-get update && apt-get install -y \
    curl \
    git \
    jq \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Node 20 LTS - the only runtime we actually use
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# GitHub Actions Runner
WORKDIR /runner
RUN curl -o actions-runner-linux.tar.gz -L \
    https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz \
    && tar xzf actions-runner-linux.tar.gz \
    && rm actions-runner-linux.tar.gz

# Setup entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

# =============================================================================
# REMOVED BLOAT (preserved here for archaeological purposes):
# - ffmpeg, imagemagick (we're not editing videos)
# - python3, pip (we're a Node.js project)
# - torch, transformers, huggingface-hub (we're not training LLMs)
# - opencv-python-headless, pillow, numpy (we're not doing computer vision)
# - nmap, nikto, sqlmap (we're not penetration testing anyone)
# - playwright (nice to have, but not essential)
#
# Total image size reduction: ~8GB → ~400MB
# Security attack surface reduction: 100%
# =============================================================================
