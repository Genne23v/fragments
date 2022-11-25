# stage 0: Install dependencies
FROM node:16.15.1-alpine3.15@sha256:1fafca8cf41faf035192f5df1a5387656898bec6ac2f92f011d051ac2344f5c9 AS dependencies

# To give node modules information that it's production env
ENV NODE_ENV=production

WORKDIR /app

COPY package*.json /app/

# Install only production dependencies
RUN npm ci --only=production

###################################################################################################

# stage 1: Build microservice 
FROM node:16.15.1-alpine3.15@sha256:1fafca8cf41faf035192f5df1a5387656898bec6ac2f92f011d051ac2344f5c9

LABEL maintainer="Wonkeun No <wno@myseneca.ca>"
LABEL description="Fragments node.js microservice"

ENV PORT=8080
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false
ENV NODE_ENV=production

WORKDIR /app

USER root
RUN apk add --no-cache \
    curl=7.86.0 \
    && rm -rf /var/cache/apk/*

# Change default root authority to node
COPY --from=dependencies /app /app
COPY --chown=node:node ./src ./src
COPY --chown=node:node ./tests/.htpasswd ./tests/.htpasswd

USER node

# Wrap the command so that signals can be sent to container
CMD ["node", "src/index.js"]

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl --fail localhost || exit 1