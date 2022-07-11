BIN = node_modules/.bin
	
.PHONY: install
install:
	npm install

.PHONY: format
format:
	${BIN}/prettier --write static/html/src
	${BIN}/prettier --write static/js/src

.PHONY: serve
serve:
	${BIN}/live-server .

.PHONY: clean
clean:
	rm -Rf static/js/dist/*

.PHONY: build-ts
build-ts:
	${BIN}/tsc --build --listEmittedFiles .

.PHONY: build-html
build-html:
	html-stitcher ./static/html/src/index.html -o ./index.html

.PHONY: build-bundles
build-bundles:
	${BIN}/browserify --debug -t browserify-css ./static/js/dist/app.js > ./static/js/dist/bundle.js 

.PHONY: minify
minify:
	${BIN}/uglifyjs ./static/js/dist/bundle.js -o ./static/js/dist/bundle.js

.PHONY: build
build: build-html build-ts build-bundles

.PHONY: build-release
build-release: clean build minify
