SRC_FILES=$(shell find src -name *.js)
LIB_FILES=$(patsubst src/%.js, lib/%.js, $(SRC_FILES))

all: $(LIB_FILES)

lib/%.js: src/%.js
	mkdir -p $(@D)
	node_modules/.bin/babel $< -o $@
