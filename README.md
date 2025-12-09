# RSS Reader + AI

A simple RSS reader with AI suggestions and summaries.

## Setup

```bash
npm install
```

## Development

Start the dev server

```bash
npm run dev
```

The page will open at `http://localhost:3000`.

## Build

Create a production build

```bash
npm run build
```

Output will be in the `dist/` folder.

## Preview

Preview the production build locally

```bash
npm run preview
```

## Roadmap

- [ ] fix RSS feed fetching
  - [ ] [DemocracyNow!](https://www.democracynow.org/democracynow.rss)
  - [ ] [IACR Protocols](http://eprint.iacr.org/rss/rss.xml?order=recent&category=PROTOCOLS)
- [ ] add feed fetch retries
- [ ] add left vertical component for recent feeds
- [ ] add IndexedDB for persisted feed collections
- [ ] convert landing page into SSO
- [ ] add scripts for easier deploy
- [ ] add AI suggestions for new RSS feeds
- [ ] add AI summaries for subscribed RSS feeds
- [ ] Obsidian integration?
- [ ] user can post and follow each other?
