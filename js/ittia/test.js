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