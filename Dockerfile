FROM node:20.10-bullseye-slim AS base

# Enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Install dependencies only when needed
FROM base AS deps
WORKDIR /workspace

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# This is necessary to run sharp
RUN npm add -g --arch=x64 --platform=linux --libc=glibc sharp@0.33.0-rc.2

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /workspace
COPY --from=deps /workspace/node_modules ./node_modules
COPY . .

# Build the application
RUN pnpm build

# Production image, copy all the files and run Next.js
FROM base AS runner
WORKDIR /workspace

ENV NODE_ENV production
# ENV NEXT_TELEMETRY_DISABLED 1
# Path to global installation of sharp
ENV NEXT_SHARP_PATH=/usr/local/lib/node_modules/sharp

# Copy dependencies
COPY --from=deps --chown=nextjs:nodejs /usr/local/lib/node_modules/sharp /usr/local/lib/node_modules/sharp

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next && \
    chown nextjs:nodejs .next

# Copy Next.js built artifacts
COPY --from=builder --chown=nextjs:nodejs /workspace/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /workspace/.next/static ./.next/static
# Include public directory
COPY --from=builder --chown=nextjs:nodejs /workspace/public ./public

USER nextjs
EXPOSE 3000
ENV PORT 3000
# Set hostname to localhost
ENV HOSTNAME "0.0.0.0"
# Run the app
CMD ["node", "server.js"]