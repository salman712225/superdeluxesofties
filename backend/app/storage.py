import json
import logging
import os
import shutil
import tempfile
import threading
from pathlib import Path
from typing import Dict, Any

try:
    from backend.app.models import FullRotationData
except ImportError:
    from app.models import FullRotationData

logger = logging.getLogger(__name__)

# Search for data dir in backend/data, then parent / data
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
if not DATA_DIR.exists():
    DATA_DIR = BASE_DIR.parent / "data"

ROTATION_FILE = DATA_DIR / "flavour_rotation.json"
DEFAULT_FILE = DATA_DIR / "default_data.json"

_lock = threading.Lock()


class StorageManager:
    def __init__(self, file_path: Path = ROTATION_FILE, default_path: Path = DEFAULT_FILE):
        self.file_path = Path(file_path)
        self.default_path = Path(default_path)
        self.file_path.parent.mkdir(parents=True, exist_ok=True)

    def load_data(self) -> FullRotationData:
        with _lock:
            if not self.file_path.exists():
                logger.warning(f"File {self.file_path} not found. Loading defaults.")
                return self._load_default()

            try:
                with open(self.file_path, "r", encoding="utf-8") as f:
                    raw = json.load(f)
                return FullRotationData(**raw)
            except Exception as e:
                logger.error(f"Error reading {self.file_path}: {e}. Falling back to default.")
                return self._load_default()

    def _load_default(self) -> FullRotationData:
        if self.default_path.exists():
            with open(self.default_path, "r", encoding="utf-8") as f:
                raw = json.load(f)
            data = FullRotationData(**raw)
            self.save_data(data)
            return data
        raise FileNotFoundError(f"Neither {self.file_path} nor {self.default_path} exists.")

    def save_data(self, data: FullRotationData) -> None:
        with _lock:
            payload = data.model_dump()
            target_dir = self.file_path.parent
            target_dir.mkdir(parents=True, exist_ok=True)

            fd, tmp_path = tempfile.mkstemp(dir=target_dir, prefix="rotation_", suffix=".tmp")
            try:
                with open(fd, "w", encoding="utf-8") as f:
                    json.dump(payload, f, indent=2, ensure_ascii=False)
                os.replace(tmp_path, self.file_path)
            except Exception:
                if os.path.exists(tmp_path):
                    os.remove(tmp_path)
                raise

    def reset_to_defaults(self) -> FullRotationData:
        with _lock:
            if not self.default_path.exists():
                raise FileNotFoundError(f"Default data file {self.default_path} does not exist.")
            with open(self.default_path, "r", encoding="utf-8") as f:
                raw = json.load(f)
            data = FullRotationData(**raw)
            self.save_data(data)
            return data
