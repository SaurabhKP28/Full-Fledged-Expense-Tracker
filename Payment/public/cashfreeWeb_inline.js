const cashfree = Cashfree({
  mode: "sandbox",
});

document.getElementById("renderBtn").addEventListener("click", async () => {
  try {
      // Fetch payment session ID from backend
      const response = await fetch("http://localhost:3000/pay", {
          method: "POST",
      });
      
      if (!response.ok) {
          throw new Error("Failed to fetch payment session ID");
      }
      
      const data = await response.json();
      const paymentSessionId = data.paymentSessionId;

      // Initialize checkout options
      let checkoutOptions = {
          paymentSessionId: paymentSessionId, // New page payment options 
          redirectTarget: document.getElementById("cf_checkout"),
          appearance: {
              width: "325px",
              height: "325px",
          },
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
          const orderResponse = await fetch(`http://localhost:3000/order/${orderId}`, {
              method: "GET",
          });
          
          if (!orderResponse.ok) {
              throw new Error("Failed to fetch order status");
          }
          
          const orderData = await orderResponse.json();
          alert("Your payment is " + orderData.order.orderStatus);
      }
  } catch (error) {
      console.error("Error during payment process:", error);
  }
});
