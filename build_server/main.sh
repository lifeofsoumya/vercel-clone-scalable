#!/bin/bash

export GIT_REPOSITORY_URL="$GIT_REPOSITORY_URL"

git clone "$GIT_REPOSITORY_URL" ./home/app/output

cd ./home/app/output

echo "Started installing ..."
npm install
echo "Installation completed >> Initiating build process" 

npm run build
echo "Build Process completed <0_0>"

# cd dist
# echo "Listing down the dist directory"
# ls -a

## going back from dist > output > build_server
pwd
cd ../../.. # while using docker maybe we have to use ~ for root only
pwd
exec node script.js