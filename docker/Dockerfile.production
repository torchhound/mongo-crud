FROM node:10.12.0-alpine
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait
WORKDIR /home/nodejs/app
ENV NODE_ENV prod
COPY package*.json ./
RUN npm install --only=production
ARG port=80
EXPOSE $port
COPY . ./
CMD /wait && node index.js