#!/bin/bash
set -e

# GitHub Runner configuration
GITHUB_TOKEN=${GITHUB_TOKEN:?"GITHUB_TOKEN is required"}
RUNNER_NAME=${RUNNER_NAME:-"enjoy-runner-$(hostname)"}
RUNNER_WORKDIR=${RUNNER_WORKDIR:-"/runner/_work"}
RUNNER_LABELS=${RUNNER_LABELS:-"self-hosted,enjoy"}

# Configure runner
cd /runner
./config.sh \
    --url https://github.com/${GITHUB_REPOSITORY} \
    --token ${GITHUB_TOKEN} \
    --name ${RUNNER_NAME} \
    --work ${RUNNER_WORKDIR} \
    --labels ${RUNNER_LABELS} \
    --unattended \
    --replace

# Cleanup on exit
cleanup() {
    echo "Removing runner..."
    ./config.sh remove --token ${GITHUB_TOKEN}
}
trap 'cleanup; exit 130' INT
trap 'cleanup; exit 143' TERM

# Run
./run.sh & wait $!
