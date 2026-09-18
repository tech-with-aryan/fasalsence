from dataclasses import dataclass


@dataclass
class AdvisoryRecord:
    category: str
    title: str
    explanation: str
    action: str
