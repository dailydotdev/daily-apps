#!/usr/bin/env bash

mkdir -p dist
docker run --rm -ti -v $PWD:/root/app node:10.23.3 /root/app/firefox.sh