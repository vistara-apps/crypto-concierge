import { useWalletClient } from "wagmi";
import { useCallback } from "react";
import axios from "axios";
import { withPaymentInterceptor, decodeXPaymentResponse } from "x402-axios";

export function usePaymentContext() {
  const { data: walletClient, isError, isLoading } = useWalletClient();

  const createSession = useCallback(async () => {
    if (!walletClient || !walletClient.account) {
      throw new Error("Please connect your wallet to continue with the payment");
    }
    if (isError) throw new Error("Wallet connection error - please try reconnecting");
    if (isLoading) throw new Error("Wallet is loading - please wait a moment");
    
    try {
      const baseClient = axios.create({
        baseURL: "https://payments.vistara.dev",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const apiClient = withPaymentInterceptor(baseClient, walletClient);
      const response = await apiClient.post("/api/payment", { amount: "$199" });
      
      const paymentResponse = response.config.headers["X-PAYMENT"];
      if (!paymentResponse) throw new Error("Payment response not received");
      
      const decoded = decodeXPaymentResponse(paymentResponse);
      console.log(`Payment successful: ${JSON.stringify(decoded)}`);
      
      return decoded;
    } catch (error) {
      console.error("Payment failed:", error);
      throw error;
    }
  }, [walletClient, isError, isLoading]);

  return { createSession };
}