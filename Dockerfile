FROM node:10.12.0-alpine
RUN mkdir -p /home/nodejs/app
WORKDIR /home/nodejs/app
COPY package*.json ./
RUN npm install
COPY . /home/nodejs/app
ARG port=80
EXPOSE port
CMD ["node", "index.js"]