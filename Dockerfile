FROM node:12-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV TZ Africa/Nairobi
CMD [ "npm", "start" ]