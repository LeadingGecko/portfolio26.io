#!/usr/bin/env bash
# setup.sh — Initialize git repo and optionally push to GitHub
# Usage: bash setup.sh [your-github-username]

set -e

USERNAME=${1:-"yourusername"}
REPO="portfolio"

echo ""
echo "⚡  Portfolio Git Setup"
echo "────────────────────────────────────"

# Init
git init
git add .
git commit -m "feat: initial portfolio launch ⚡"

echo ""
echo "✓  Local repo initialized."
echo ""

# Check for GitHub CLI
if command -v gh &>/dev/null; then
  echo "→ GitHub CLI found. Creating public repo..."
  gh repo create "$REPO" --public --push --source .
  echo ""
  echo "✓  Repo live at: https://github.com/$USERNAME/$REPO"
  echo ""
  echo "→ To enable GitHub Pages:"
  echo "   https://github.com/$USERNAME/$REPO/settings/pages"
  echo "   Source: main branch · / (root) · Save"
  echo ""
  echo "   Your site will be at:"
  echo "   https://$USERNAME.github.io/$REPO"
else
  echo "→ GitHub CLI not found. Add remote manually:"
  echo ""
  echo "   git remote add origin https://github.com/$USERNAME/$REPO.git"
  echo "   git branch -M main"
  echo "   git push -u origin main"
  echo ""
  echo "   Then enable Pages at:"
  echo "   https://github.com/$USERNAME/$REPO/settings/pages"
fi

echo ""
echo "────────────────────────────────────"
echo "Done. Happy shipping. 🚀"
echo ""
