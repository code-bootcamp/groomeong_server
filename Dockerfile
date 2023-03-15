FROM node:14

COPY ./package.json /teamproject/
COPY ./yarn.lock /teamproject/
WORKDIR /teamproject/
RUN yarn install

COPY . /teamproject/

CMD yarn start:dev