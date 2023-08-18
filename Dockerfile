FROM node:18

ENV APP_PORT=${APP_PORT}

WORKDIR /myapp

COPY .env .

COPY package*.json .

COPY tsconfig.json /myapp/tsconfig.json

RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "start"]