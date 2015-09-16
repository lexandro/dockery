#!/usr/bin/env bash
echo Preparing Dockery release
rm dockery.zip
zip -9r dockery.zip app assets background.js manifest.json index.html window.html

