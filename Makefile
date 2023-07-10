.PHONY: run lint

run: 
	@npm run start

lint: 
	@echo "Linting the project..."
	@npm run lint:fix
	