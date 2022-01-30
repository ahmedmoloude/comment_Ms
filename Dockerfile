
FROM node:14.15.4-alpine as production
WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY . .
EXPOSE 3000
CMD [ "npm", "run", "start" ]