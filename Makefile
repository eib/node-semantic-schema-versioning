CD=$(shell pwd)
YARN=yarn
NODE=node
NVM=nvm
NPM=npm
NODE_VER=8.0.0
MOCHA=mocha

### High-level targets

all: build
init: node-install global-packages npm-install
test: npm-install mocha-once
watch: npm-install mocha-watch


### Low-level targets

# Tests
mocha-once:
	$(MOCHA) start --single-run || true

mocha-watch:
	$(MOCHA) start || true

# Package Managers
node-install:
	$(NVM) install $(NODE_VER)
	$(NVM) use $(NODE_VER)

global-packages:
	$(NPM) install --global yarn@0.20.3 mocha@1.21.4 || true

npm-install:
	$(YARN)


.PHONY: all init test watch \
	mocha-once mocha-watch \
	node-install global-packages npm-install
