# Public Agency Agents source inventory

Inspected 2026-10-07. All information in this document describes the public upstream repository; it contains no private project identifiers, customer data, credentials or internal execution references.

- Repository: https://github.com/msitarzewski/agency-agents
- Inspected revision: `5baafd5f1452e9785c413065b033ec083ab27757`.
- License: MIT, Copyright (c) 2025 AgentLand Contributors. Include the upstream license when copying substantial source content.
- Inventory: 267 Markdown files starting with agent-name frontmatter in the 18 divisions declared by the upstream `divisions.json`. Conversion outputs and playbooks are excluded.

| Responsibility | Upstream source |
| --- | --- |
| Paid media | `paid-media/paid-media-ppc-strategist.md` |
| Sales coaching | `sales/sales-coach.md` |
| Social content | `marketing/marketing-content-creator.md` |
| SEO | `marketing/marketing-seo-specialist.md` |

These are prompt-role definitions. Installing them does not provide advertising API access, WhatsApp credentials or an execution runtime. A WhatsApp sales workflow requires adapting a sales role and implementing or reusing an authenticated messaging integration.

## Reproduce the count

Run in the checked-out upstream revision:

```python
import json
from pathlib import Path

root = Path('.')
divisions = json.loads((root / 'divisions.json').read_text())['divisions']
roles = [path for division in divisions
         for path in (root / division).glob('*.md')
         if path.read_text().startswith('---\nname:')]
assert len(roles) == 267
assert len(divisions) == 18
```
