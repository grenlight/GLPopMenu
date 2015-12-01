#!/bin/sh

cd ~/blog/ReaderInteraction
webpack --display-error-details
webpack --config webpack.config.js
# bundle exec jekyll serve
cd bin
cp -f gren.js /Users/grenlight/江苏云媒阅读平台/Retech\ Apps/EpubReader\ 2.0/ymepubreader/YMEpubReader/YMEpubReader/renderer.bundle/app/hooks
cp -f gren.min.js /Users/grenlight/江苏云媒阅读平台/Retech\ Apps/EpubReader\ 2.0/ymepubreader/YMEpubReader/YMEpubReader/renderer.bundle/app/hooks
