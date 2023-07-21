BIN = node_modules/.bin
	
.PHONY: install
install:
	npm install

.PHONY: format
format:
	${BIN}/prettier --write ./src

.PHONY: serve
serve:
	${BIN}/live-server .

.PHONY: clean
clean:
	rm -Rf ./build

.PHONY: build
build:
	npm run build
