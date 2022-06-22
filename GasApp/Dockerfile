FROM node:18.4.0

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]
COPY ["baseGasProvider.js", "ethGasStationProvider.js", "etherscanGasProvider.js", "gasProviders.js", "./"] 
COPY ["main.js", "redis_client.js", "server.js", "serverUtils.js", "timeUtils.js", "./"]
COPY ["baseLogProvider.js", "consoleLogProvider.js", "logProviders.js", "./"]
COPY ["conf/.env", "./"]

RUN npm install --no-audit
RUN npm install -g npm@8.12.2 --quiet   

CMD ["node", "main.js"]
