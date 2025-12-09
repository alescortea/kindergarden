FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# pentru Nuxt production build
RUN npm run build

ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

EXPOSE 3000

CMD ["npm", "run", "start"]
