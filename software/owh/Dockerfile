FROM node:4.5.0-wheezy

RUN mkdir -p /usr/local/owh
WORKDIR /usr/local/owh/software/owh
COPY . /usr/local/owh
RUN npm install -g bower
RUN npm install -g nodemon
RUN npm install -g pm2
RUN chmod 777 /usr/local/owh/scripts/*.sh
WORKDIR /usr/local/owh/server
RUN cd /usr/local/owh/server
RUN npm install
WORKDIR /usr/local/owh/client
RUN cd /usr/local/owh/client
RUN npm install
WORKDIR /usr/local/owh
RUN cd /usr/local/owh/server
EXPOSE 80:3000
CMD ["/bin/bash", "scripts/start-app.sh"]
