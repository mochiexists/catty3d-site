# catty3d.com

The marketing + download site for [Catty 3D](https://github.com/mochiexists/catty-3d),
deployed as a static export to GitHub Pages.

## Stack

- Next.js 16 with `output: "export"` (static HTML/CSS/JS, no server)
- Cormorant Garamond + Manrope via `next/font/google`
- Deployed via `.github/workflows/deploy.yml` on push to `main`

## Local dev

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # produces ./out
```

## DNS (one-time setup)

In your registrar for `catty3d.com`:

| Type  | Host | Value                   |
|-------|------|-------------------------|
| A     | @    | `185.199.108.153`       |
| A     | @    | `185.199.109.153`       |
| A     | @    | `185.199.110.153`       |
| A     | @    | `185.199.111.153`       |
| CNAME | www  | `mochiexists.github.io` |

Then in the GitHub repo: **Settings → Pages → Custom domain → `catty3d.com`** →
check **Enforce HTTPS** once the cert provisions (~10 minutes).

The `public/CNAME` file mirrors the custom domain so GH Pages doesn't drop it
on each deploy.

## Adding a release link

The `/download` page links to `https://github.com/mochiexists/catty-3d/releases/latest`,
which always resolves to whatever GitHub considers latest. No code changes
needed when a new DMG ships — just create a release with the DMG attached.

## Brew cask

The brew tap lives at [`mochiexists/homebrew-catty3d`](https://github.com/mochiexists/homebrew-catty3d).
After a release, update `Casks/catty.rb` there with the new version and
SHA256 of the DMG.
