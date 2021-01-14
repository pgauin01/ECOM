import React from "react";
import { Button, View } from "react-native";
import RazorpayCheckout from "react-native-razorpay";

const Payment = () => {
  const PaymentHandler = () => {
    var options = {
      description: "Credits towards consultation",
      image: "https://i.imgur.com/3g7nmJC.png",
      currency: "INR",
      key: "rzp_test_3AfxbwgtHAwMrO", // Your api key
      amount: "5000",
      name: "foo",
      prefill: {
        email: "void@razorpay.com",
        contact: "+917017740154",
        name: "Razorpay Software",
      },
      theme: { color: "#F37254" },
    };
    RazorpayCheckout.open(options)
      .then((data) => {
        // handle success
        alert(`Success: ${data.razorpay_payment_id}`);
      })
      .catch((error) => {
        // handle failure
        alert(`Error: ${error.code} | ${error.description}`);
      });
  };
  return (
    <View style={{ marginTop: 100 }}>
      <Button title="RazorPay" onPress={PaymentHandler} />
    </View>
  );
};

export default Payment;
