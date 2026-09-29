# CLAUDE.md

Read README.md first.

## Cloud sessions

For Claude Code on the web (claude.ai/code). `scripts/cloud-setup.sh` runs automatically at session start (`npm ci`).

- Check: `npm run check` (`tsc --noEmit && next build`; the static export lands in `./out`, which is gitignored).
- Work on the session's branch and open a PR. Merging to `main` deploys catty3d.com to GitHub Pages (`.github/workflows/deploy.yml`), so never push `main`. There are no deploy scripts.
- No secrets are available or needed. Keep changes small and copy in the site's voice.
