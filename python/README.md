A python package connects to the ITTIA APIs.

## How-to
### Check
Demo on how to fact-check a text:
```python
import asyncio
from ittia import Check

base_url = "https://check.ittia.net"
format = "json"  # or markdown

check = Check(base_url=base_url, format=format)

query = "Germany hosted the 2024 Olympics"

result = asyncio.run(check(query))

print(result)
```

## Self-host API
- Check: https://github.com/ittia-research/check
