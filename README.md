# goatendi_site

## Deploy

Este repo tem pipeline proprio de deploy para a VPS via `docker build` + `docker save` + `docker load` + Portainer API.

Pre-requisitos:

- `./.env` com:
  - `SOLLUCION_DEV_HOST`
  - `SOLLUCION_DEV_USER`
  - `SOLLUCION_DEV_PASSWORD`
  - `SOLLUCION_DEV_PORTAINER_URL`
  - `SOLLUCION_DEV_PORTAINER_TOKEN`
  - opcional: `SOLLUCION_DEV_PORTAINER_ENDPOINT_ID`
  - opcional: `GO_ATENDI_DATABASE_PASSWORD`
  - `SECRET_KEY_BASE`

Comando:

```bash
node scripts/deploy_portainer_stack.mjs
```

Sem check final de URL:

```bash
node scripts/deploy_portainer_stack.mjs --skip-url-check
```

Arquivos do pipeline:

- `deploy/stack.template.yml`
- `scripts/deploy_portainer_stack.mjs`
