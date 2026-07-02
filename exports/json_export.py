"""JSON export helper."""

import json


class JSONExport:
    def export(self, content, output_path):
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(content, f, indent=2)
        return output_path
