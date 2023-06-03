FROM node:16-alpine

# Install utils
RUN apk add --no-cache python3 make g++ curl nano git
# Install pm2
RUN npm install pm2 -g

# Read build args
ARG project
ARG environment
ARG port

# Create app dir
RUN mkdir -p /usr/src/app && chown node:node /usr/src/app

# Switch to node user
USER node

# Set workdir to app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image
COPY --chown=node package.json package-lock.json ./
RUN npm i

# Copy local code to the container image
COPY --chown=node apps ./apps
COPY --chown=node libs ./libs
COPY --chown=node certs ./certs
COPY --chown=node jest.config.ts jest.preset.js \
  nx.json tsconfig.base.json schema.gql ./

# Create dist dir for build output, set ownership + permissions on contents
RUN mkdir -p dist && \
  chmod -R +rwx dist && \
  chown -R node:node dist && \
  chmod -R +rwx dist/. && chown -R node:node dist/.

# Build for production
RUN npm run build

EXPOSE $port
ENV PORT=$port
ENV command="node dist/apps/user-api/main.js"
CMD $command
