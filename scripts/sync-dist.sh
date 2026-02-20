#!/bin/bash
# scripts/sync-dist.sh
# This script syncs the source files to the dist folder.

echo "Syncing src files to dist folder..."

# Ensure we are in the project root
cd "$(dirname "$0")/.."

mkdir -p dist/images
cp src/7segment.css dist/
cp src/7segment.woff dist/
cp src/lg-washer-dryer-card.js dist/

# Safely copy images directory contents
if [ -d "src/images" ]; then
  cp -a src/images/. dist/images/
fi

echo "✅ Dist folder updated."
