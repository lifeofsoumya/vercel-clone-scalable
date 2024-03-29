#!/bin/bash

export GIT_REPOSITORY_URL="$GIT_REPOSITORY_URL"

git clone --depth 1 "$GIT_REPOSITORY_URL" /home/app/output

echo "Contents of /home/app/output:"
ls -al /home/app/output
cd /home/app/output

echo "Started installing ..."
npm install
npm i @rollup/rollup-linux-x64-gnu -D # this one is just for vite's bug of missing package
echo "Installation completed >> Initiating build process" 

npm run build
echo "Build Process completed <0_0>"

# cd dist
# echo "Listing down the dist directory >>"
# ls -a

# echo "Compressing dist folder..."
# tar -czf dist.tar.gz ./dist #skipped zip and upload as it would need a lambda to unzip then again put to s3

## going back from dist > output > build_server
pwd
cd /home/app # while using docker maybe we have to use ~ for root only
pwd
exec node script.js