install:
	npm install

start:
	npx babel-node src/bin/retranslator.js

test:
	npx babel-node src/test.js

publish:
	npm publish --dry-run

lint:
	npx eslint .

build:
	npm run-script build

record:
	 asciinema rec ./records/recording.json

togif:
	asciicast2gif ./records/recording.json ./gif/recording.gif
