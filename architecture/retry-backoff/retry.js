// retry.js
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryWithBackoff(fn, maxRetries = 3, baseDelayMs = 1000) {
  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      console.log(`Attempt ${attempt}...`);
      const result = await fn();
      console.log(` Success on attempt ${attempt}:`, result);
      return result;
    } catch (err) {
      console.log(` Attempt ${attempt} failed: ${err.message}`);

      if (attempt > maxRetries) {
        console.log(" Max retries reached. Giving up.");
        throw err;
      }

      const waitTime = baseDelayMs * Math.pow(2, attempt - 1); // 1s, 2s, 4s...
      console.log(` Waiting ${waitTime / 1000}s before retrying...`);
      await delay(waitTime);
    }
  }
}

module.exports = retryWithBackoff;