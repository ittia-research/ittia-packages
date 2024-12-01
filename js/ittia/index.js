const axios = require("axios");

/**
 * Fact-check a string and return verdicts in markdown or JSON formats.
 */
class Check {
  /**
   * @param {string} baseUrl - API base URL.
   * @param {string} format - Response format: 'markdown' | 'json'.
   * @param {number} timeout - Request timeout in milliseconds.
   */
  constructor(baseUrl = "https://check.ittia.net", format = "markdown", timeout = 600000) {
    this.baseUrl = baseUrl;
    this.format = format;
    this.timeout = timeout; // Set higher because the process might take a long time.

    this.headers = {
      "X-Return-Format": this.format,
      Accept: "text/event-stream",
    };

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      headers: this.headers,
    });
  }

  /**
   * Makes a request to the API and streams the response.
   * @param {string} query - Text to check.
   * @returns {Promise<string>} - The final verdict or result.
   */
  async call(query) {
    const url = `/${encodeURIComponent(query)}`;
    let result = null;

    try {
      const response = await this.client.get(url, {
        responseType: "stream",
      });

      const stream = response.data;

      return new Promise((resolve, reject) => {
        let buffer = "";

        stream.on("data", (chunk) => {
          buffer += chunk.toString();

          // Attempt to parse JSON from the buffer.
          try {
            while (buffer) {
              const { json, remainingBuffer } = parseJSON(buffer);
              buffer = remainingBuffer;

              if (json.stage === "final") {
                result = json.content;
                stream.destroy(); // Stop the stream after getting the final result.
              }
            }
          } catch (error) {
            // Ignore JSON parsing errors and wait for more chunks.
          }
        });

        stream.on("end", () => {
          if (result) {
            resolve(result);
          } else {
            console.warn("No result found");
            resolve(null);
          }
        });

        stream.on("error", (error) => {
          reject(error);
        });
      });
    } catch (error) {
      console.error("Error during API call:", error.message);
      throw error;
    }
  }
}

/**
 * Parses a JSON object from a string buffer.
 * @param {string} buffer - String buffer to parse.
 * @returns {{ json: object, remainingBuffer: string }} - Parsed JSON and the remaining buffer.
 */
function parseJSON(buffer) {
  const regex = /^\s*({.*?})(?=\s*{|\s*$)/s; // Match a single JSON object.
  const match = buffer.match(regex);

  if (!match) {
    throw new Error("No complete JSON object found in buffer.");
  }

  const json = JSON.parse(match[1]);
  const remainingBuffer = buffer.slice(match[0].length).trim();

  return { json, remainingBuffer };
}

module.exports = Check;