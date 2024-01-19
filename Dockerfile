FROM node:20

WORKDIR /app

COPY . /app

EXPOSE 1402

CMD ["npm", "run", "start:prod"]