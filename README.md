# Speed Typing

Live: https://speed-typing-niccolomach.pages.dev/

A responsive static typing practice app, with no database, accounts, analytics, paid services, or runtime dependencies.

## Features

- 15 / 30 / 60 second tests; timer starts on the first character.
- Live WPM, accuracy, character highlighting, results, and restart.
- Mobile text input, keyboard focus styles, labeled controls, and paste prevention.
- WPM uses correct characters / 5 / elapsed minutes. Accuracy measures the current corrected text, not historical keystrokes.

## Development

Serve `public/` with any static HTTP server. Run `npm test` and `npm run check` with Node 22 or newer. There is no build step; publish `public/` unchanged.

## Hosting

Cloudflare Pages project: `speed-typing-niccolomach`, production branch: `main`.

Initial release uses Pages Direct Upload, with source backed up on GitHub. Git pushes do not automatically deploy. Deploy after validation with:

```
npx wrangler pages deploy public --project-name speed-typing-niccolomach --branch main
```

No secrets belong in this repository. Cloudflare authentication is stored outside it by Wrangler. No custom domain was purchased or attached.

Cloudflare does not allow switching a Direct Upload project to Git integration. Future automatic deployments can use GitHub Actions and a narrowly scoped Cloudflare token, or a separate Git-integrated Pages project.
