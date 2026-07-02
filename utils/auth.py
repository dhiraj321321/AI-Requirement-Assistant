"""Simple user authentication backed by a local JSON database."""

import hashlib
import json
from pathlib import Path

DB_PATH = Path(__file__).resolve().parents[1] / "data" / "users.json"


def _ensure_db_exists():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    if not DB_PATH.exists():
        DB_PATH.write_text("{}", encoding="utf-8")


def _load_users():
    _ensure_db_exists()
    return json.loads(DB_PATH.read_text(encoding="utf-8"))


def _save_users(users):
    DB_PATH.write_text(json.dumps(users, indent=2), encoding="utf-8")


def _hash_password(password):
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def register_user(username: str, password: str) -> bool:
    users = _load_users()
    if username in users:
        return False
    users[username] = _hash_password(password)
    _save_users(users)
    return True


def authenticate_user(username: str, password: str) -> bool:
    users = _load_users()
    return users.get(username) == _hash_password(password)
