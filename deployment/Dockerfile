FROM node:8.4-wheezy

RUN mkdir -p /usr/local/owh
WORKDIR /usr/local/owh
COPY . /usr/local/owh
RUN npm install -g bower
RUN npm install -g nodemon
RUN chmod 777 /usr/local/owh/scripts/*.sh
WORKDIR /usr/local/owh/server
RUN cd /usr/local/owh/server
RUN npm install
WORKDIR /usr/local/owh/client
RUN cd /usr/local/owh/client
RUN npm install
RUN bower install --allow-root
RUN npm install -g bunyan
WORKDIR /usr/local/owh
RUN cd /usr/local/owh/server
EXPOSE 80:3000
CMD ["/bin/bash", "scripts/start-app.sh"]
