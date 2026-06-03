# VRI Backend

FastAPI backend for New Horizon VRI investigations.

## Stack

- FastAPI HTTP API
- LangGraph investigation workflow
- LangChain OpenAI integration
- Postgres persistence
- Docker Compose for local API + database
- LangSmith disabled by default

## Environment

Create a root `.env` beside `package.json` and `docker-compose.yml`:

```env
OPENAI_API_KEY=your_openai_key
MODEL_PROVIDER=openai
OPENAI_MODEL=gpt-4o-mini
OPENAI_TEMPERATURE=0.2
LANGSMITH_TRACING=false
```

The root `.env` is ignored by git. Do not put real API keys in `.env.example`.
Docker Compose automatically reads the root `.env`.

## Run With Docker

```bash
docker compose up --build
```

API: `http://localhost:8000`

## Run Without Docker

Postgres still needs to be available and `DATABASE_URL` must point to it.

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Smoke Tests

```bash
curl http://localhost:8000/health
curl http://localhost:8000/v1/capabilities
```

Create an investigation:

```bash
curl -X POST http://localhost:8000/v1/investigations \
  -H "Content-Type: application/json" \
  -d '{
    "objective": "Find possible causes of drug resistance in a cancer cell line",
    "domain": "oncology",
    "context": "We have transcriptomics and CRISPR screen results."
  }'
```

Run the investigation:

```bash
curl -X POST http://localhost:8000/v1/investigations/{id}/run \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Tests

```bash
cd backend
pip install -r requirements-dev.txt
pytest
```
