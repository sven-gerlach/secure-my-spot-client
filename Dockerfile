# similar to dockerfile.dev
# main sources:
# https://youtu.be/3xDAU5cvi5E
# https://dev.to/levelupkoodarit/deploying-containerized-nginx-to-heroku-how-hard-can-it-be-3g14
# Note: this Dockerfile should be named Dockerfile.prod but due to the "Deploy to Heroku" Github Action the naming of
# this file must be Dockerfile instead


# naming base build-stage as build
FROM node:16 as build
LABEL maintainer="svengerlach@me.com"
WORKDIR /app

# copy both dependency files
COPY package*.json ./
RUN npm install

ENV PATH="./node_modules/.bin:$PATH"

COPY . .

# make React create build directory (app/build) with production build of the app at container compile-time
RUN npm run build

# replace React server with nginx server to serve key files by utilising docker's multi-stage build functionality
# build an nginx container from the default nginx image
FROM nginx

# make use of multi-stage build process, using the build-stage named build as dependency
# copy the content of the /app/build folder into the nginx folder that is reserved for serving website content
# see documentation of nginx server for the location where the build files need to be copied to
# https://hub.docker.com/_/nginx
COPY --from=build /app/build /usr/share/nginx/html

# by default nginx listens to port 80
# however, Heroku provides the PORT as an environment variable and which is subject to change
# specify the root (index.html) and the port which nginx needs to listen on in nginx-setup.conf
# replace the contents of nginx' default.conf with nginx-setup.conf
COPY nginx-setup.conf /etc/nginx/conf.d/default.conf

# use bash stream editor to replace PORT inside default.conf with Heroku's $PORT param at run-time
# Since the PORT is only stipulated by Heroku at run-time and not when the container is built CMD must be used
# -i -> in-place
# -e -> append editing commands to the list of commands
# replace PORT in default.conf with $PORT variable
# "damon off" keeps nginx running in foreground and prevents container from closing down
# alternatively to sed, envsubst apk could be used and might actually be a cleaner solution
# https://developer.okta.com/blog/2020/06/24/heroku-docker-react#create-a-dockerfile-and-nginx-configuration
# https://nickjanetakis.com/blog/using-envsubst-to-merge-environment-variables-into-config-files
CMD sed -i -e 's/PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
