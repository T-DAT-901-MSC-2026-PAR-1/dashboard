default:
    just -l

# Start the dashboard stack (frontend, backend, postgres)
[group("Docker Compose")]
up ENV="dev":
    #!/bin/bash
    if [ "{{ENV}}" = "dev" ]; then
        docker compose -f docker/dev/compose.yml up -d --build;
    elif [ "{{ENV}}" = "prod" ]; then
        docker compose -f docker/prod/compose.yml up -d;
    else
        echo "Available environments: dev, prod" >&2
    fi

# Stop the dashboard stack
[group("Docker Compose")]
down ENV="dev":
    #!/bin/bash
    if [ "{{ENV}}" = "dev" ]; then
        docker compose -f docker/dev/compose.yml down;
    elif [ "{{ENV}}" = "prod" ]; then
        docker compose -f docker/prod/compose.yml down;
    else
        echo "Available environments: dev, prod" >&2
    fi

# View logs from all services or a specific service
[group("Docker Compose")]
logs ENV="dev" SERVICE="":
    #!/bin/bash
    if [ "{{ENV}}" = "dev" ]; then
        if [ -z "{{SERVICE}}" ]; then
            docker compose -f docker/dev/compose.yml logs -f;
        else
            docker compose -f docker/dev/compose.yml logs -f {{SERVICE}};
        fi
    elif [ "{{ENV}}" = "prod" ]; then
        if [ -z "{{SERVICE}}" ]; then
            docker compose -f docker/prod/compose.yml logs -f;
        else
            docker compose -f docker/prod/compose.yml logs -f {{SERVICE}};
        fi
    else
        echo "Available environments: dev, prod" >&2
    fi

# Rebuild and restart services
[group("Docker Compose")]
rebuild ENV="dev":
    #!/bin/bash
    if [ "{{ENV}}" = "dev" ]; then
        docker compose -f docker/dev/compose.yml up -d --build;
    elif [ "{{ENV}}" = "prod" ]; then
        docker compose -f docker/prod/compose.yml up -d --build;
    else
        echo "Available environments: dev, prod" >&2
    fi

# Show status of all services
[group("Docker Compose")]
ps ENV="dev":
    #!/bin/bash
    if [ "{{ENV}}" = "dev" ]; then
        docker compose -f docker/dev/compose.yml ps;
    elif [ "{{ENV}}" = "prod" ]; then
        docker compose -f docker/prod/compose.yml ps;
    else
        echo "Available environments: dev, prod" >&2
    fi

# Execute a command in a running service
[group("Docker Compose")]
exec ENV="dev" SERVICE="" *ARGS="":
    #!/bin/bash
    if [ -z "{{SERVICE}}" ]; then
        echo "Usage: just exec [ENV] SERVICE [COMMAND]" >&2
        exit 1
    fi

    if [ "{{ENV}}" = "dev" ]; then
        docker compose -f docker/dev/compose.yml exec {{SERVICE}} {{ARGS}};
    elif [ "{{ENV}}" = "prod" ]; then
        docker compose -f docker/prod/compose.yml exec {{SERVICE}} {{ARGS}};
    else
        echo "Available environments: dev, prod" >&2
    fi

# Clean volumes and remove all data (CAREFUL!)
[group("Docker Compose")]
clean ENV="dev":
    #!/bin/bash
    read -p "This will remove all volumes and data. Are you sure? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [ "{{ENV}}" = "dev" ]; then
            docker compose -f docker/dev/compose.yml down -v;
        elif [ "{{ENV}}" = "prod" ]; then
            docker compose -f docker/prod/compose.yml down -v;
        else
            echo "Available environments: dev, prod" >&2
        fi
    fi

# Access PostgreSQL CLI
[group("Database")]
db-shell ENV="dev":
    #!/bin/bash
    if [ "{{ENV}}" = "dev" ]; then
        docker compose -f docker/dev/compose.yml exec postgres psql -U postgres -d cryptoviz;
    elif [ "{{ENV}}" = "prod" ]; then
        docker compose -f docker/prod/compose.yml exec postgres psql -U postgres -d cryptoviz;
    else
        echo "Available environments: dev, prod" >&2
    fi

# Run database migrations (when you implement them)
[group("Database")]
db-migrate ENV="dev":
    #!/bin/bash
    echo "Running database migrations..."
    if [ "{{ENV}}" = "dev" ]; then
        docker compose -f docker/dev/compose.yml exec backend npm run typeorm migration:run;
    elif [ "{{ENV}}" = "prod" ]; then
        docker compose -f docker/prod/compose.yml exec backend npm run typeorm migration:run;
    else
        echo "Available environments: dev, prod" >&2
    fi
