#!/bin/bash
# scripts/install-hooks.sh
# Sets up local git hooks for the repository.

HOOK_PATH=".git/hooks/pre-commit"

echo "Installing git hooks..."

cat <<EOF > "$HOOK_PATH"
#!/bin/bash
# .git/hooks/pre-commit
# Automatically sync dist before every commit using the shared script

./scripts/sync-dist.sh
git add dist/
EOF

chmod +x "$HOOK_PATH"

echo "✅ Git hooks installed successfully."
