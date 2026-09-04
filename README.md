# 📰 InnoNews Aggregator

A news aggregator that pulls articles from multiple sources — NewsAPI, The
Guardian, The New York Times, and BBC News (via newsdata.io) — with search,
filtering (date/category/source/author), and a personalized feed that
persists across visits.

**🚀 Live demo:** https://inno-news-mauve.vercel.app/

## 🛠️ Stack

React + TypeScript, Vite, Tailwind CSS, TanStack Query, Jotai (persisted
preferences), nuqs (URL-synced filters).

## 💻 Local development

```bash
pnpm install
cp .env.example .env   # fill in your API keys — see below
pnpm dev
```

### 🔑 API keys

All variables must keep the `VITE_` prefix (Vite only exposes prefixed vars
to the client bundle, and it bakes them in at **build** time, not runtime).

| Variable                | Source                                                                        |
| ----------------------- | ----------------------------------------------------------------------------- |
| `VITE_NEWS_API_KEY`     | https://newsapi.org/register                                                  |
| `VITE_GUARDIAN_API_KEY` | https://open-platform.theguardian.com/access/                                 |
| `VITE_NYT_API_KEY`      | https://developer.nytimes.com/my-apps (enable "Article Search API")           |
| `VITE_NYT_API_SECRET`   | issued alongside the NYT key; unused by Article Search, kept for completeness |
| `VITE_NEWSDATA_API_KEY` | https://newsdata.io/register (powers the BBC News source)                     |

See `.env.example` for per-key notes and free-tier limitations.

## 🐳 Running with Docker

The app is a static SPA — the container just builds it and serves the
output with nginx.

```bash
cp .env.example .env   # fill in your API keys
docker compose up --build
```

Then open http://localhost:8080.

Without compose:

```bash
docker build \
  --build-arg VITE_NEWS_API_KEY=... \
  --build-arg VITE_GUARDIAN_API_KEY=... \
  --build-arg VITE_NYT_API_KEY=... \
  --build-arg VITE_NEWSDATA_API_KEY=... \
  -t inno-news .
docker run -p 8080:80 inno-news
```

Because Vite bakes `VITE_*` values into the built JS bundle, they must be
passed as **build args**, not container env vars — setting `-e` on `docker
run` has no effect after the image is built.

> ⚠️ NewsAPI's free tier blocks browser (CORS) requests from anywhere but
> `localhost`. Accessing the container via `http://localhost:8080` works;
> a non-localhost host/IP or a deployed domain will not, without a paid plan.

## 📜 Scripts

```bash
pnpm dev       # start the dev server
pnpm build     # type-check + production build (dist/)
pnpm lint      # eslint
pnpm test      # run unit & integration tests (Vitest)
pnpm preview   # preview the production build locally
```
