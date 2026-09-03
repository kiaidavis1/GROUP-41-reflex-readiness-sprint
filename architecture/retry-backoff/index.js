// index.js
const mockEndpoint = require('./mockEndpoint');
const retryWithBackoff = require('./retry');

retryWithBackoff(mockEndpoint, 3, 1000)
  .then(res => console.log("Final result:", res))
  .catch(err => console.log("Final failure:", err.message));