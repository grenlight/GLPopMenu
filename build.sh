#!/bin/sh

cd ~/blog/ReaderInteraction
webpack --display-error-details
webpack --config webpack.config.js
# bundle exec jekyll serve
cd bin
cp -f gren.js /Users/grenlight/江苏云媒阅读平台/Retech\ Apps/EpubReader\ 2.0/ymepubreader/YMEpubReader/YMEpubReader/renderer.bundle/app/hooks
cp -f gren.min.js /Users/grenlight/江苏云媒阅读平台/Retech\ Apps/EpubReader\ 2.0/ymepubreader/YMEpubReader/YMEpubReader/renderer.bundle/app/hooks

# 启动模拟器
cd ~
xcrun instruments -w "iPhone 5s (9.1)"
# execute this to using simctl control simulator
xcrun instruments -s
# 删除App
xcrun simctl uninstall booted YMEpubReaderDemo
