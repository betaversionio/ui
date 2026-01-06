.PHONY: help install dev build start lint test clean docker-build docker-up docker-down

# Default target
help:
	@echo "Available commands:"
	@echo "  make install       - Install dependencies"
	@echo "  make dev           - Start development server"
	@echo "  make build         - Build for production"
	@echo "  make start         - Start production server"
	@echo "  make lint          - Run linter"
	@echo "  make format        - Format code with Prettier"
	@echo "  make test          - Run tests"
	@echo "  make clean         - Clean build artifacts"
	@echo "  make docker-build  - Build Docker image"
	@echo "  make docker-up     - Start Docker containers"
	@echo "  make docker-down   - Stop Docker containers"
	@echo "  make docker-dev    - Start Docker development environment"

# Install dependencies
install:
	pnpm install

# Development
dev:
	pnpm dev

# Build
build:
	pnpm build

# Start production server
start:
	pnpm start

# Linting
lint:
	pnpm lint

# Format code
format:
	pnpm prettier --write .

# Type check
type-check:
	pnpm tsc --noEmit

# Run all checks
check: lint type-check
	@echo "All checks passed!"

# Clean build artifacts
clean:
	rm -rf .next
	rm -rf out
	rm -rf dist
	rm -rf build
	rm -rf node_modules/.cache

# Docker commands
docker-build:
	docker build -t website .

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-dev:
	docker-compose -f docker-compose.dev.yml up

docker-logs:
	docker-compose logs -f

# Security audit
audit:
	pnpm audit

# Update dependencies
update:
	pnpm update --latest

# Fresh install (remove node_modules and reinstall)
fresh-install: clean
	rm -rf node_modules
	pnpm install
