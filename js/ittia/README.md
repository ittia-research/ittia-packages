A npm package connects to the ITTIA APIs or self-hosted ones.

## How-to
### Check
Demo on how to fact-check a text:
```js
const Check = require("./index");

(async () => {
  const baseUrl = "https://check.ittia.net";
  const format = "json"; // or 'markdown'.

  const check = new Check(baseUrl, format);

  const query = "Germany hosted the 2024 Olympics";

  try {
    const result = await check.call(query);
    console.log(result);
  } catch (error) {
    console.error("Error:", error.message);
  }
})();
```

## Self-host API
- Check: https://github.com/ittia-research/check
