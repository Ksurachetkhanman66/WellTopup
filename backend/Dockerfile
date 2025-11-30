FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose Port (3001)
EXPOSE 3001

# ✅ จุดสำคัญ: เปลี่ยนจาก index.js เป็น server.js
CMD ["node", "server.js"]