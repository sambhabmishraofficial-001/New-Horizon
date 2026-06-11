from __future__ import annotations

import textwrap


def download_script() -> str:
    return textwrap.dedent(
        r'''
        from __future__ import annotations

        import json
        import urllib.parse
        import urllib.request
        from datetime import datetime, timezone
        from pathlib import Path


        ROOT = Path(__file__).resolve().parents[1]
        DATA = ROOT / "data"
        DATA.mkdir(exist_ok=True)

        QUERY = "(reviewed:true) AND (ec:*)"
        URL = "https://rest.uniprot.org/uniprotkb/search?" + urllib.parse.urlencode(
            {"query": QUERY, "format": "fasta", "size": "200"}
        )

        request = urllib.request.Request(
            URL,
            headers={"User-Agent": "NewHorizonVRI/0.1 local data fetch"},
        )
        with urllib.request.urlopen(request, timeout=45) as response:
            fasta = response.read().decode("utf-8")

        if not fasta.startswith(">"):
            raise RuntimeError("UniProt did not return FASTA content.")

        fasta_path = DATA / "uniprot_reviewed_enzymes.fasta"
        meta_path = DATA / "uniprot_download.json"
        fasta_path.write_text(fasta, encoding="utf-8")
        count = sum(1 for line in fasta.splitlines() if line.startswith(">"))
        meta_path.write_text(
            json.dumps(
                {
                    "source": "UniProtKB REST API",
                    "query": QUERY,
                    "url": URL,
                    "records": count,
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "note": "This is sequence data only. Numeric pH labels still need a curated source.",
                },
                indent=2,
            ),
            encoding="utf-8",
        )
        print(json.dumps({"fasta": str(fasta_path), "records": count}))
        '''
    ).strip() + "\n"


def feature_script() -> str:
    return textwrap.dedent(
        r'''
        from __future__ import annotations

        import csv
        import json
        from pathlib import Path


        ROOT = Path(__file__).resolve().parents[1]
        FASTA = ROOT / "data" / "uniprot_reviewed_enzymes.fasta"
        OUT = ROOT / "processed" / "sequence_features.csv"
        OUT.parent.mkdir(exist_ok=True)
        AAS = "ACDEFGHIKLMNPQRSTVWY"


        def read_fasta(path: Path):
            current_id = None
            description = ""
            seq_parts = []
            for raw in path.read_text(encoding="utf-8").splitlines():
                line = raw.strip()
                if not line:
                    continue
                if line.startswith(">"):
                    if current_id and seq_parts:
                        yield current_id, description, "".join(seq_parts)
                    description = line[1:]
                    current_id = description.split()[0].split("|")[1] if "|" in description else description.split()[0]
                    seq_parts = []
                else:
                    seq_parts.append(line)
            if current_id and seq_parts:
                yield current_id, description, "".join(seq_parts)


        def features(sequence: str) -> dict[str, float | int | str]:
            length = len(sequence)
            if length == 0:
                raise ValueError("Empty sequence.")
            row: dict[str, float | int | str] = {
                "length": length,
                "charged_fraction": sum(sequence.count(aa) for aa in "DEKRH") / length,
                "acidic_fraction": sum(sequence.count(aa) for aa in "DE") / length,
                "basic_fraction": sum(sequence.count(aa) for aa in "KRH") / length,
                "aromatic_fraction": sum(sequence.count(aa) for aa in "FWY") / length,
                "hydrophobic_fraction": sum(sequence.count(aa) for aa in "AILMFWV") / length,
            }
            for aa in AAS:
                row[f"aa_{aa}"] = sequence.count(aa) / length
            return row


        if not FASTA.exists():
            raise FileNotFoundError(f"Missing FASTA file: {FASTA}")

        rows = []
        for sequence_id, description, sequence in read_fasta(FASTA):
            row = {"sequence_id": sequence_id, "description": description}
            row.update(features(sequence))
            rows.append(row)

        if not rows:
            raise RuntimeError("No FASTA records parsed.")

        with OUT.open("w", newline="", encoding="utf-8") as handle:
            writer = csv.DictWriter(handle, fieldnames=list(rows[0].keys()))
            writer.writeheader()
            writer.writerows(rows)

        print(json.dumps({"features": str(OUT), "rows": len(rows), "columns": len(rows[0])}))
        '''
    ).strip() + "\n"


def inspect_script() -> str:
    return textwrap.dedent(
        r'''
        from __future__ import annotations

        import csv
        import json
        from pathlib import Path


        ROOT = Path(__file__).resolve().parents[1]
        FEATURES = ROOT / "processed" / "sequence_features.csv"
        REPORT = ROOT / "reports" / "dataset_report.json"
        REPORT.parent.mkdir(exist_ok=True)

        if not FEATURES.exists():
            raise FileNotFoundError(f"Missing feature table: {FEATURES}")

        with FEATURES.open(encoding="utf-8") as handle:
            reader = csv.DictReader(handle)
            rows = list(reader)

        lengths = [int(float(row["length"])) for row in rows]
        report = {
            "feature_table": str(FEATURES),
            "rows": len(rows),
            "columns": len(reader.fieldnames or []),
            "min_length": min(lengths) if lengths else None,
            "max_length": max(lengths) if lengths else None,
            "mean_length": round(sum(lengths) / len(lengths), 2) if lengths else None,
            "label_status": "missing_numeric_optimal_ph_labels",
            "next_step": "Curate sequence_id,optimal_ph labels in data/ph_labels_template.csv, then run scripts/train_ph_regressor.py.",
        }
        REPORT.write_text(json.dumps(report, indent=2), encoding="utf-8")
        print(json.dumps(report))
        '''
    ).strip() + "\n"


def train_script() -> str:
    return textwrap.dedent(
        r'''
        from __future__ import annotations

        import csv
        import json
        from pathlib import Path

        from sklearn.ensemble import RandomForestRegressor
        from sklearn.metrics import mean_absolute_error, r2_score
        from sklearn.model_selection import train_test_split


        ROOT = Path(__file__).resolve().parents[1]
        FEATURES = ROOT / "processed" / "sequence_features.csv"
        LABELS = ROOT / "data" / "ph_labels_template.csv"
        REPORT = ROOT / "reports" / "model_report.json"
        REPORT.parent.mkdir(exist_ok=True)

        if not FEATURES.exists():
            raise FileNotFoundError("Run prepare_sequence_features.py first.")
        if not LABELS.exists():
            raise FileNotFoundError("Add labels to data/ph_labels_template.csv first.")

        with FEATURES.open(encoding="utf-8") as handle:
            features = {row["sequence_id"]: row for row in csv.DictReader(handle)}
        with LABELS.open(encoding="utf-8") as handle:
            labels = {
                row["sequence_id"]: float(row["optimal_ph"])
                for row in csv.DictReader(handle)
                if row.get("sequence_id") and row.get("optimal_ph")
            }

        if len(labels) < 20:
            raise RuntimeError("Need at least 20 labeled sequence_id,optimal_ph rows before training.")

        x_rows = []
        y = []
        feature_names = []
        for sequence_id, label in labels.items():
            row = features.get(sequence_id)
            if not row:
                continue
            numeric = {
                key: float(value)
                for key, value in row.items()
                if key not in {"sequence_id", "description"}
            }
            if not feature_names:
                feature_names = list(numeric.keys())
            x_rows.append([numeric[name] for name in feature_names])
            y.append(label)

        if len(y) < 20:
            raise RuntimeError("Fewer than 20 labels matched downloaded feature rows.")

        x_train, x_test, y_train, y_test = train_test_split(x_rows, y, test_size=0.2, random_state=13)
        model = RandomForestRegressor(n_estimators=200, random_state=13)
        model.fit(x_train, y_train)
        predictions = model.predict(x_test)
        report = {
            "rows": len(y),
            "features": feature_names,
            "mae": mean_absolute_error(y_test, predictions),
            "r2": r2_score(y_test, predictions),
            "note": "Use external validation before treating this as a real pH predictor.",
        }
        REPORT.write_text(json.dumps(report, indent=2), encoding="utf-8")
        print(json.dumps(report))
        '''
    ).strip() + "\n"


def scripts_readme(is_protein_sequence_job: bool) -> str:
    selected = "yes" if is_protein_sequence_job else "no"
    return f"""# Generated VRI Scripts

Sequence/protein data pipeline selected: `{selected}`

Run order:

```bash
venv/bin/python scripts/download_uniprot_sequences.py
venv/bin/python scripts/prepare_sequence_features.py
venv/bin/python scripts/inspect_dataset.py
```

The generated training script needs real `sequence_id,optimal_ph` labels before it can train:

```bash
venv/bin/python scripts/train_ph_regressor.py
```

The current automatic data fetch downloads sequence data from UniProt. It does not invent numeric pH labels.
"""
