import os
import asyncio

os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"
os.environ["OPENAI_API_KEY"] = ""
os.environ["LANGSMITH_TRACING"] = "false"

import pytest  # noqa: E402
from fastapi import HTTPException  # noqa: E402

from app.config import get_settings  # noqa: E402
from app.db import Base, SessionLocal, engine, init_db  # noqa: E402
from app.routers.health import health  # noqa: E402
from app.routers.investigations import (  # noqa: E402
    add_message,
    create_investigation,
    get_investigation,
    run_investigation,
)
from app.schemas import InvestigationCreate, MessageCreate  # noqa: E402


@pytest.fixture()
def db():
    Base.metadata.drop_all(bind=engine)
    init_db()
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def test_health_reports_missing_openai_key_without_crashing(db):
    payload = health(db=db, settings=get_settings())

    assert payload.database == "ok"
    assert payload.model_provider == "openai"
    assert payload.model_configured is False


def test_investigation_crud_and_message(db):
    investigation = create_investigation(
        InvestigationCreate(
            objective="Find possible causes of drug resistance.",
            domain="oncology",
            context="Transcriptomics and CRISPR screen results are available.",
        ),
        db=db,
    )

    message = add_message(
        investigation.id,
        MessageCreate(role="user", content="Prioritize falsifiable hypotheses."),
        db=db,
    )
    detail = get_investigation(investigation.id, db=db)

    assert detail.id == investigation.id
    assert message.investigation_id == investigation.id
    assert len(detail.messages) == 1


def test_run_returns_clear_error_without_openai_key(db):
    investigation = create_investigation(
        InvestigationCreate(objective="Map resistance mechanisms."),
        db=db,
    )

    with pytest.raises(HTTPException) as exc_info:
        asyncio.run(
            run_investigation(
                investigation.id,
                payload=None,
                db=db,
                settings=get_settings(),
            )
        )

    assert exc_info.value.status_code == 400
    assert "OPENAI_API_KEY" in exc_info.value.detail["error"]
