const cashfree = Cashfree({mode: "sandbox",});

document.getElementById("renderBtn").addEventListener("click", async () => {
    try {
        const response = await fetch("http://localhost:3000/api/payments/pay", {  // Ensure correct route
            method: "POST",
        });


        const data = await response.json();
        const paymentSessionId = data.paymentSessionId;

        let checkoutOptions = { 
            paymentSessionId: paymentSessionId,
            redirectTraget: "_self"
        };

        await cashfree.checkout(checkoutOptions);
        
    } catch (error) {
        console.error("Payment error:", error);
    }
});
