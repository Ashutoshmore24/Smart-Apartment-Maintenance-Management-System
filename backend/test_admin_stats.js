/* Everything Ready */
const axios = require('axios');

async function testStats() {
    try {
        const response = await axios.get('http://localhost:8080/api/requests/stats/admin');
        console.log('Stats data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error fetching stats:', error.message);
    }
}

testStats();
