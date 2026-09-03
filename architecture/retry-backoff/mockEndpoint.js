// mockEndpoint.js
let attemptCount = 0;

function mockEndpoint() {
    attemptCount++;
    return new Promise((resolve, reject) => {
        if (attemptCount <= 2) {
            reject(new Error(`Simulated failure #${attemptCount}`));
        } else {
            resolve({ status: "success", data: "warehouse stock: 42 units" });
        }
    });
}

module.exports = mockEndpoint;