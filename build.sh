#!/bin/sh

cd ~/blog/GLPopMenu
webpack --display-error-details
webpack --config webpack.config.js
# bundle exec jekyll serve
