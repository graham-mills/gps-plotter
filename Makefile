SHELL := /bin/bash
.PHONY : clean

install:
	npm install

clean:
	rm -R ./static/js/dist/*

build:
	source .env
	tsc --build --listEmittedFiles .
	browserify --debug ./static/js/dist/app.js -o ./static/js/dist/bundle.js 

minify:
	uglifyjs ./static/js/dist/bundle.js -o ./static/js/dist/bundle.js

build-release: clean build minify

format:
	source .env
	prettier --write index.html
	prettier --write static/js/src

serve:
	source .env
	live-server .