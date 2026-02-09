const db = require('./backend/db');

const API_URL = 'http://localhost:5000/api';

async function testFlow() {
    try {
        console.log("1. Creating a new request...");
        const createRes = await fetch(`${API_URL}/requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                resident_id: 1, // Assuming resident 1 exists
                request_type: 'Plumbing',
                description: 'Leaky pipe test',
                request_category: 'FLAT'
            })
        });
        const createData = await createRes.json();
        console.log("Create Response:", createData);

        if (!createRes.ok) throw new Error(JSON.stringify(createData));

        const requestId = createData.id;

        console.log(`2. Completing request ${requestId} with cost 1500...`);
        const completeRes = await fetch(`${API_URL}/requests/complete/${requestId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cost: 1500 })
        });
        const completeData = await completeRes.json();
        console.log("Complete Response:", completeData);

        if (!completeRes.ok) throw new Error(JSON.stringify(completeData));

        console.log("3. Verifying bill in database...");

        // Simple wait to ensure DB update (though it should be immediate)
        setTimeout(() => {
            db.query('SELECT * FROM maintenance_request_bill WHERE request_id = ?', [requestId], (err, res) => {
                if (err) console.error(err);
                else console.log("Bill Record:", res);

                console.log("4. Attempting to complete the same request again (should fail)...");
                fetch(`${API_URL}/requests/complete/${requestId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cost: 2000 })
                }).then(async (res) => {
                    const data = await res.json();
                    if (res.ok) console.log("ERROR: Should have failed!", data);
                    else console.log("SUCCESS: Request failed as expected:", data);
                    process.exit();
                });
            });
        }, 1000);

    } catch (error) {
        console.error("Test Failed:", error);
        process.exit(1);
    }
}

testFlow();
