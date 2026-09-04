# syntax=docker/dockerfile:1

# --- deps ---------------------------------------------------------------
# Isolated so `pnpm install` is only re-run when the lockfile changes, not
# on every source edit.
FROM node:24-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# --- build ----------------------------------------------------------------
FROM node:24-alpine AS build
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Vite bakes VITE_* vars into the client bundle at build time, so they must
# be supplied as build args (not runtime env) — see docker-compose.yml.
ARG VITE_NEWS_API_KEY
ARG VITE_GUARDIAN_API_KEY
ARG VITE_NYT_API_KEY
ARG VITE_NYT_API_SECRET
ARG VITE_NEWSDATA_API_KEY
ENV VITE_NEWS_API_KEY=$VITE_NEWS_API_KEY \
    VITE_GUARDIAN_API_KEY=$VITE_GUARDIAN_API_KEY \
    VITE_NYT_API_KEY=$VITE_NYT_API_KEY \
    VITE_NYT_API_SECRET=$VITE_NYT_API_SECRET \
    VITE_NEWSDATA_API_KEY=$VITE_NEWSDATA_API_KEY

RUN pnpm build

# --- run ------------------------------------------------------------------
# Static output only — final image ships no Node, no source, no
# node_modules, just nginx + the built assets.
FROM nginx:1.27-alpine AS run

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ || exit 1
