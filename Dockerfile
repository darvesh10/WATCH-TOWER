FROM node:20-alpine

WORKDIR /app

# 👇 correct path
COPY WatchTower-backend/package*.json ./

RUN npm install

# 👇 pura backend copy
COPY WatchTower-backend ./

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]