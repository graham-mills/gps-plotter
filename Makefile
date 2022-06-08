BIN = node_modules/.bin
	
.PHONY: install
install:
	npm install

.PHONY: clean
clean:
	rm -Rf static/js/dist/*

.PHONY: build
build:
	${BIN}/tsc --build --listEmittedFiles .
	${BIN}/browserify --debug -t browserify-css ./static/js/dist/app.js > ./static/js/dist/bundle.js 

.PHONY: minify
minify:
	${BIN}/uglifyjs ./static/js/dist/bundle.js -o ./static/js/dist/bundle.js

.PHONY: build-release
build-release: clean build minify

.PHONY: format
format:
	${BIN}/prettier --write index.html
	${BIN}/prettier --write static/js/src

.PHONY: serve
serve:
	${BIN}/live-server .