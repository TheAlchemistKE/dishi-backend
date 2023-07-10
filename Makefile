.PHONY: run lint clean

run: 
	@echo running the server
	@npm run start

lint: 
	@echo "Linting the project..."
	@npm run lint:fix

clean: 
	@echo cleaning the project
	@rm -rf node_modules
	@npm cache clean --force


	