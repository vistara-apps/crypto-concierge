import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2,
  RefreshCw,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { usePaymentContext } from '../hooks/usePaymentContext';

const NearIntentsPayment = ({ 
  amount, 
  currency = 'USD', 
  onSuccess, 
  onError, 
  onCancel 
}) => {
  const {
    getNearIntentQuote,
    createNearIntent,
    resetNearIntentStatus,
    nearIntentStatus,
    nearIntentLoading,
    estimateSwapTime
  } = usePaymentContext();

  const [step, setStep] = useState('select'); // select, quote, confirm, processing, complete
  const [selectedFromAsset, setSelectedFromAsset] = useState('');
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState(null);

  // Available assets for NEAR Intents
  const availableAssets = [
    { symbol: 'ETH', name: 'Ethereum', color: 'bg-blue-500', network: 'Ethereum' },
    { symbol: 'BTC', name: 'Bitcoin', color: 'bg-orange-500', network: 'Bitcoin' },
    { symbol: 'SOL', name: 'Solana', color: 'bg-purple-500', network: 'Solana' },
    { symbol: 'NEAR', name: 'NEAR Protocol', color: 'bg-green-500', network: 'NEAR' },
    { symbol: 'USDC_ETH', name: 'USDC (Ethereum)', color: 'bg-blue-600', network: 'Ethereum' },
    { symbol: 'USDC_SOL', name: 'USDC (Solana)', color: 'bg-purple-600', network: 'Solana' }
  ];

  // Reset component state when opened
  useEffect(() => {
    resetNearIntentStatus();
    setStep('select');
    setQuote(null);
    setError(null);
  }, [resetNearIntentStatus]);

  // Handle status updates
  useEffect(() => {
    if (nearIntentStatus) {
      if (nearIntentStatus.status === 'COMPLETED') {
        setStep('complete');
        if (onSuccess) {
          onSuccess(nearIntentStatus.details);
        }
      } else if (nearIntentStatus.status === 'FAILED') {
        setError(nearIntentStatus.message);
        if (onError) {
          onError(nearIntentStatus.error);
        }
      }
    }
  }, [nearIntentStatus, onSuccess, onError]);

  const handleGetQuote = async () => {
    if (!selectedFromAsset) return;

    try {
      setError(null);
      setStep('quote');
      
      // Convert USD amount to appropriate format
      const quoteResponse = await getNearIntentQuote(
        selectedFromAsset,
        'USDC_ETH', // Default to USDC for USD payments
        amount.toString()
      );
      
      setQuote(quoteResponse);
      setStep('confirm');
    } catch (err) {
      console.error('Quote error:', err);
      setError(err.message || 'Failed to get quote');
      setStep('select');
    }
  };

  const handleConfirmPayment = async () => {
    if (!quote) return;

    try {
      setError(null);
      setStep('processing');
      await createNearIntent(quote);
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed');
      setStep('confirm');
    }
  };

  const handleRetry = () => {
    setError(null);
    resetNearIntentStatus();
    setStep('select');
    setQuote(null);
  };

  const getSelectedAsset = () => {
    return availableAssets.find(asset => asset.symbol === selectedFromAsset);
  };

  const formatAmount = (amount, decimals = 6) => {
    if (!amount) return '0';
    const num = parseFloat(amount);
    return num.toFixed(decimals);
  };

  return (
    <div className="max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {/* Asset Selection Step */}
        {step === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Pay with NEAR Intents
              </h3>
              <p className="text-gray-600 text-sm">
                Lightning-fast cross-chain payments in ~3 seconds
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose your payment asset:
              </label>
              {availableAssets.map((asset) => (
                <button
                  key={asset.symbol}
                  onClick={() => setSelectedFromAsset(asset.symbol)}
                  className={`w-full p-4 border-2 rounded-lg transition-all duration-200 ${
                    selectedFromAsset === asset.symbol
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 ${asset.color} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                      {asset.symbol.split('_')[0]}
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold text-gray-900">{asset.name}</div>
                      <div className="text-sm text-gray-600">{asset.network}</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={onCancel}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleGetQuote}
                disabled={!selectedFromAsset}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Get Quote
              </button>
            </div>
          </motion.div>
        )}

        {/* Quote Loading Step */}
        {step === 'quote' && (
          <motion.div
            key="quote"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-8"
          >
            <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Getting Best Quote
            </h3>
            <p className="text-gray-600">
              Finding the optimal cross-chain route...
            </p>
          </motion.div>
        )}

        {/* Quote Confirmation Step */}
        {step === 'confirm' && quote && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Confirm Payment
              </h3>
              <p className="text-gray-600 text-sm">
                Review your cross-chain payment details
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">You pay:</span>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {formatAmount(quote.quote?.amountInFormatted)} {getSelectedAsset()?.symbol.split('_')[0]}
                  </div>
                  <div className="text-sm text-gray-600">
                    ≈ ${quote.quote?.amountInUsd}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">You receive:</span>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {formatAmount(quote.quote?.amountOutFormatted)} USDC
                  </div>
                  <div className="text-sm text-gray-600">
                    ≈ ${quote.quote?.amountOutUsd}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Estimated time:</span>
                <div className="flex items-center space-x-1 text-green-600">
                  <Clock className="w-4 h-4" />
                  <span className="font-semibold">
                    ~{quote.quote?.timeEstimate || estimateSwapTime(selectedFromAsset, 'USDC')}s
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Cross-chain payment</p>
                  <p>Your payment will be processed across multiple blockchains using NEAR Intents for optimal speed and cost.</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setStep('select')}
                className="flex-1 btn-secondary"
              >
                Back
              </button>
              <button
                onClick={handleConfirmPayment}
                className="flex-1 btn-primary"
              >
                Confirm Payment
              </button>
            </div>
          </motion.div>
        )}

        {/* Processing Step */}
        {step === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-8"
          >
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                <Loader2 className="w-10 h-10 animate-spin text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-yellow-800" />
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Processing Payment
            </h3>
            
            {nearIntentStatus && (
              <div className="space-y-2">
                <p className="text-gray-600">{nearIntentStatus.message}</p>
                {nearIntentStatus.swapId && (
                  <p className="text-xs text-gray-500 font-mono">
                    ID: {nearIntentStatus.swapId}
                  </p>
                )}
              </div>
            )}

            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Typical completion time: 2-3 seconds</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Success Step */}
        {step === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Payment Successful!
            </h3>
            <p className="text-gray-600 mb-6">
              Your cross-chain payment has been completed successfully.
            </p>

            {nearIntentStatus?.details && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-semibold text-gray-900 mb-3">Transaction Details</h4>
                <div className="space-y-2 text-sm">
                  {nearIntentStatus.details.swapDetails?.originChainTxHashes?.map((tx, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-600">Origin TX:</span>
                      <a 
                        href={tx.explorerUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                      >
                        <span className="font-mono text-xs">{tx.hash.slice(0, 10)}...</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                  {nearIntentStatus.details.swapDetails?.destinationChainTxHashes?.map((tx, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-600">Destination TX:</span>
                      <a 
                        href={tx.explorerUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                      >
                        <span className="font-mono text-xs">{tx.hash.slice(0, 10)}...</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={onCancel}
              className="btn-primary"
            >
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div className="flex items-start space-x-2">
            <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800">Payment Error</h4>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={handleRetry}
                className="mt-2 text-sm text-red-600 hover:text-red-800 flex items-center space-x-1"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default NearIntentsPayment;

