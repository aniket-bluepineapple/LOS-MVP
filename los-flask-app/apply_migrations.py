from pathlib import Path
from sqlalchemy import create_engine, text
from los.config import Config


def apply_sql_file(engine, path: Path) -> None:
    """Apply a single .sql file, splitting on semicolons."""
    with path.open() as f:
        sql = f.read()
    statements = [s.strip() for s in sql.split(";") if s.strip()]
    with engine.begin() as conn:  # begin() ensures commit/rollback
        for stmt in statements:
            conn.execute(text(stmt))


def main() -> None:
    engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)
    migrations_dir = Path(__file__).resolve().parent / "migrations"
    files = sorted(migrations_dir.glob("*.sql"))
    for file in files:
        print(f"Applying {file.name}...")
        apply_sql_file(engine, file)
    print("Migrations applied successfully.")


if __name__ == "__main__":
    main()
