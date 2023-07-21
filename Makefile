BIN = node_modules/.bin
	
.PHONY: install
install:
	npm install

.PHONY: format
format:
	${BIN}/prettier --write ./src

.PHONY: clean
clean:
	rm -Rf ./build

.PHONY: build
build:
	npm run build

.PHONY: serve
serve:
	serve -s build
