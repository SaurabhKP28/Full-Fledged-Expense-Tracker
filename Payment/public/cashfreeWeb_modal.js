const cashfree = Cashfree({
  mode: "sandbox",
});

document.getElementById("renderBtn").addEventListener("click", async () => {
  try {
      // Fetch payment session ID from backend
      const response = await fetch("http://localhost:3000/pay", {
          method: "POST",
      });
      
      
      const data = await response.json();
      const paymentSessionId = data.paymentSessionId;
     // const orderId = data.orderId;

      // Initialize checkout options
      let checkoutOptions = {
          paymentSessionId: paymentSessionId, // New page payment options 
          redirectTarget: "_modal",
      };
      
      const result = await cashfree.cashout(checkoutOptions);
      
      if (result.error) {
          console.log("Error:", result.error);
      }
      
      if (result.redirect) {
          console.log("Payment will be redirected");
      }
      
      if (result.paymentDetails) {
          console.log("Payment has been completed");
          console.log(result.paymentDetails.paymentMessage);
          
          // Fetch order status
          const orderId = data.orderId; // Ensure orderId is correctly retrieved from response
          const orderResponse = await fetch(`http://localhost:3000/payment-status/${orderId}`, {
              method: "GET",
          });
          
          
          const orderData = await orderResponse.json();
          alert("Your payment is " + orderDataorderStatus);
      }
  } catch (error) {
      console.error("Error during payment process:", error);
  }
});
