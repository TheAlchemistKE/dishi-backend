.PHONY: run lint clean test

run: 
	@echo Running the server
	@npm run start

lint: 
	@echo Linting the project...
	@npm run lint:fix

clean: 
	@echo Cleaning the project
	@rm -rf node_modules
	@npm cache clean --force

test: 
	@echo Running Tests...
	@npm run test


	