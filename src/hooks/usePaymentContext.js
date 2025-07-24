import { useWalletClient } from "wagmi";
import { useCallback, useState } from "react";
import axios from "axios";
import { withPaymentInterceptor, decodeXPaymentResponse } from "x402-axios";
import nearIntentsService from "../services/nearIntentsService.js";

export function usePaymentContext() {
  const { data: walletClient, isError, isLoading } = useWalletClient();
  const [nearIntentStatus, setNearIntentStatus] = useState(null);
  const [nearIntentLoading, setNearIntentLoading] = useState(false);

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

  // NEAR Intents payment methods
  const getNearIntentQuote = useCallback(async (fromAsset, toAsset, amount) => {
    if (!walletClient || !walletClient.account) {
      throw new Error("Please connect your wallet to get a quote");
    }

    try {
      setNearIntentLoading(true);
      const quote = await nearIntentsService.getQuote({
        fromAsset,
        toAsset,
        amount,
        recipient: walletClient.account.address,
        refundTo: walletClient.account.address,
        slippageTolerance: 100 // 1% slippage
      });
      return quote;
    } catch (error) {
      console.error("Failed to get NEAR Intent quote:", error);
      throw error;
    } finally {
      setNearIntentLoading(false);
    }
  }, [walletClient]);

  const createNearIntent = useCallback(async (quoteResponse) => {
    if (!walletClient || !walletClient.account) {
      throw new Error("Please connect your wallet to create intent");
    }

    try {
      setNearIntentLoading(true);
      setNearIntentStatus({ status: 'CREATING_INTENT', message: 'Creating payment intent...' });

      const swapResponse = await nearIntentsService.createSwap(
        quoteResponse,
        walletClient.account.address
      );

      setNearIntentStatus({ 
        status: 'INTENT_CREATED', 
        message: 'Intent created, processing payment...',
        swapId: swapResponse.swapId 
      });

      // Start polling for status updates
      const finalStatus = await nearIntentsService.pollSwapStatus(
        swapResponse.swapId,
        (status) => {
          setNearIntentStatus({
            status: status.status,
            message: getStatusMessage(status.status),
            swapId: swapResponse.swapId,
            details: status
          });
        }
      );

      setNearIntentStatus({
        status: 'COMPLETED',
        message: 'Payment completed successfully!',
        swapId: swapResponse.swapId,
        details: finalStatus
      });

      return finalStatus;
    } catch (error) {
      console.error("NEAR Intent payment failed:", error);
      setNearIntentStatus({
        status: 'FAILED',
        message: error.message || 'Payment failed',
        error
      });
      throw error;
    } finally {
      setNearIntentLoading(false);
    }
  }, [walletClient]);

  const resetNearIntentStatus = useCallback(() => {
    setNearIntentStatus(null);
    setNearIntentLoading(false);
  }, []);

  // Helper function to get user-friendly status messages
  const getStatusMessage = (status) => {
    const messages = {
      'PENDING': 'Preparing payment...',
      'QUOTE_GENERATED': 'Quote generated, waiting for deposit...',
      'DEPOSIT_DETECTED': 'Deposit detected, processing...',
      'KNOWN_DEPOSIT_TX': 'Processing your payment...',
      'PROCESSING': 'Executing cross-chain swap...',
      'COMPLETED': 'Payment completed successfully!',
      'FAILED': 'Payment failed',
      'REFUNDED': 'Payment refunded'
    };
    return messages[status] || 'Processing...';
  };

  return { 
    createSession,
    // NEAR Intents methods
    getNearIntentQuote,
    createNearIntent,
    resetNearIntentStatus,
    nearIntentStatus,
    nearIntentLoading,
    // Utility methods
    getSupportedAssets: () => nearIntentsService.getSupportedAssets(),
    estimateSwapTime: (from, to) => nearIntentsService.estimateSwapTime(from, to)
  };
}
