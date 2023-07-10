.PHONY: run lint

run: 
	@echo running the server
	@npm run start

lint: 
	@echo "Linting the project..."
	@npm run lint:fix
	