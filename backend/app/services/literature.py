from __future__ import annotations

import json
import urllib.parse
import urllib.request
from typing import Any


EUROPE_PMC_URL = "https://www.ebi.ac.uk/europepmc/webservices/rest/search"


def search_literature(query: str, page_size: int = 8) -> list[dict[str, Any]]:
    params = urllib.parse.urlencode(
        {
            "query": query,
            "format": "json",
            "pageSize": str(page_size),
            "resultType": "core",
        }
    )
    request = urllib.request.Request(
        f"{EUROPE_PMC_URL}?{params}",
        headers={"User-Agent": "NewHorizonVRI/0.1 local research workspace"},
    )
    with urllib.request.urlopen(request, timeout=20) as response:
        payload = json.loads(response.read().decode("utf-8"))

    results = payload.get("resultList", {}).get("result", [])
    normalized: list[dict[str, Any]] = []
    for item in results:
        title = item.get("title")
        if not title:
            continue
        normalized.append(
            {
                "title": title,
                "authors": item.get("authorString"),
                "year": item.get("pubYear"),
                "journal": item.get("journalTitle"),
                "doi": item.get("doi"),
                "pmid": item.get("pmid"),
                "source": item.get("source"),
                "url": _result_url(item),
                "abstract": item.get("abstractText"),
            }
        )
    return normalized


def search_literature_many(queries: list[str], page_size: int = 8) -> tuple[list[dict[str, Any]], list[str]]:
    seen: set[str] = set()
    merged: list[dict[str, Any]] = []
    attempted: list[str] = []
    for query in queries:
        clean = " ".join(query.split())
        if not clean or clean in attempted:
            continue
        attempted.append(clean)
        try:
            results = search_literature(clean, page_size=page_size)
        except Exception:
            continue
        for item in results:
            key = item.get("doi") or item.get("pmid") or item.get("title")
            if not key or key in seen:
                continue
            seen.add(str(key))
            merged.append(item)
        if len(merged) >= page_size:
            break
    return merged[:page_size], attempted


def _result_url(item: dict[str, Any]) -> str | None:
    doi = item.get("doi")
    if doi:
        return f"https://doi.org/{doi}"
    pmid = item.get("pmid")
    if pmid:
        return f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/"
    return None
