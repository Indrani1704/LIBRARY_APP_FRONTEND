import { useState } from "react";

export default function CheckoutPage() {
  const [payment, setPayment] = useState("cod");

  return (
    <div className="container py-5">

      <h3>Delivery Address</h3>

      <div className="checkout-form">
        <input placeholder="Full Name" />
        <input placeholder="Phone" />
        <input placeholder="Address" />
        <input placeholder="City" />
        <input placeholder="Pincode" />
      </div>

      <h4 className="mt-4">Payment Method</h4>

      <div className="payment-options">
        <label>
          <input
            type="radio"
            checked={payment === "cod"}
            onChange={() => setPayment("cod")}
          />
          Cash on Delivery
        </label>

        <label>
          <input
            type="radio"
            checked={payment === "upi"}
            onChange={() => setPayment("upi")}
          />
          UPI / Card
        </label>
      </div>

      <button className="place-order mt-4">
        Confirm Order →
      </button>

    </div>
  );
}