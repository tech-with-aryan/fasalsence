from dataclasses import dataclass


@dataclass
class UserRecord:
    id: int
    name: str
    contact: str
