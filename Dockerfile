FROM node:6.7.0

RUN npm i --quiet -g save-exchange-data

RUN mkdir /opt/exchange_data
WORKDIR /opt/exchange_data

# Share local directory on the docker container
ADD . /opt/exchange_data

# Machine cleanup
RUN npm cache clean
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Set development environment as default
ENV NODE_ENV development
ENV PYTHON /user/bin/python2.7

#CMD ["save-exchange-data"]
