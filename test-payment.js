const testPayment = async () => {
    try {
        console.log("Submitting payment with Bill ID 1...");
        const response = await fetch('http://localhost:5000/api/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bill_id: 1,
                amount: 1500,
                payment_mode: 'Cash'
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Success:", data);
        } else {
            console.error("Error Status:", response.status);
            console.error("Error Data:", data);
        }
    } catch (error) {
        console.error("Network Error:", error.message);
    }
};

testPayment();
