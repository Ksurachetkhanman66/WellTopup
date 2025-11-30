# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

# รับค่า API_HOST จาก Docker Compose มาใช้ตอน Build
ARG API_HOST=http://localhost:3001

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# ตั้งค่า Environment ตอน Build
ENV NEXT_TELEMETRY_DISABLED=1 \
    API_HOST=${API_HOST} \
    NEXT_PUBLIC_API_HOST=${API_HOST}

RUN npm run build

# ---------- Stage 2: Run ----------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy ไฟล์ที่ Build เสร็จแล้ว (Mode Standalone)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]