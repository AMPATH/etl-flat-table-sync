FROM node:12-alpine

# Create app directory
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# Set timezone
ENV TZ Africa/Nairobi
ENV NODE_ENV production

CMD [ "npm", "start" ]
