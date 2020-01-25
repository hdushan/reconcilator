lint:
	./node_modules/eslint/bin/eslint.js src test

lintFix:
	./node_modules/eslint/bin/eslint.js src test --fix

testUnit:
	./node_modules/mocha/bin/mocha --require @babel/register  --recursive test/unit

test: lint testUnit

install:
	yarn install

deploy:
	sls deploy -v

remove:
	sls remove -v
	rm -fr .serverless