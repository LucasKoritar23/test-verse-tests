FROM mcr.microsoft.com/playwright:v1.35.0-jammy

WORKDIR /test-verse-tests

ENV PATH /test-verse-tests/node_modules/.bin:$PATH

COPY . /test-verse-tests

RUN apt-get update && apt-get -y install zip libnss3 libatk-bridge2.0-0 libdrm-dev libxkbcommon-dev libgbm-dev libasound-dev libatspi2.0-0 libxshmfence-dev

# Install JAVA
RUN apt install -y default-jre
RUN wget -q https://github.com/allure-framework/allure2/releases/download/2.22.4/allure-2.22.4.tgz 
RUN tar -zxvf allure-2.22.4.tgz -C /opt/
RUN ln -s /opt/allure-2.22.4/bin/allure /usr/bin/allure

# Removing folder allure .tgz after installed
RUN rm -R allure-2.22.4.tgz

RUN npm install -g npm@latest 
RUN npm install 

# RUN npm ci