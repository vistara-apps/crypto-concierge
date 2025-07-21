import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  CreditCard, 
  Wallet,
  Check,
  ArrowLeft,
  Loader2,
  Zap
} from 'lucide-react';
import { usePaymentContext } from '../hooks/usePaymentContext';
import NearIntentsPayment from './NearIntentsPayment';

const CheckoutDemo = () => {
  const [step, setStep] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [showNearIntents, setShowNearIntents] = useState(false);
  
  const { createSession } = usePaymentContext();

  const product = {
    name: 'Premium Crypto Trading Course',
    description: 'Learn advanced crypto trading strategies from industry experts',
    price: 199,
    image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=400&h=300&fit=crop'
  };

  const currencies = [
    { 
      id: 'btc', 
      name: 'Bitcoin', 
      symbol: 'BTC', 
      price: '0.00312 BTC', 
      color: 'bg-crypto-gold',
      network: 'Bitcoin'
    },
    { 
      id: 'eth', 
      name: 'Ethereum', 
      symbol: 'ETH', 
      price: '0.095 ETH', 
      color: 'bg-crypto-ethereum',
      network: 'Ethereum'
    },
    { 
      id: 'near', 
      name: 'NEAR Protocol', 
      symbol: 'NEAR', 
      price: '42.5 NEAR', 
      color: 'bg-crypto-near',
      network: 'NEAR'
    },
    { 
      id: 'sol', 
      name: 'Solana', 
      symbol: 'SOL', 
      price: '1.85 SOL', 
      color: 'bg-crypto-solana',
      network: 'Solana'
    },
    { 
      id: 'usdc', 
      name: 'USD Coin', 
      symbol: 'USDC', 
      price: '199 USDC', 
      color: 'bg-blue-600',
      network: 'Multi-chain'
    }
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      await createSession();
      setTimeout(() => {
        setIsProcessing(false);
        setPaymentComplete(true);
        setStep(4);
      }, 3000);
    } catch (error) {
      console.error('Payment failed:', error);
      setIsProcessing(false);
    }
  };

  const resetDemo = () => {
    setStep(1);
    setSelectedCurrency('');
    setSelectedPaymentMethod('');
    setPaymentComplete(false);
    setIsProcessing(false);
    setShowNearIntents(false);
  };

  const handleNearIntentsSuccess = (details) => {
    setPaymentComplete(true);
    setStep(4);
    setShowNearIntents(false);
  };

  const handleNearIntentsError = (error) => {
    console.error('NEAR Intents payment failed:', error);
    setShowNearIntents(false);
  };

  const handleNearIntentsCancel = () => {
    setShowNearIntents(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crypto Payment Demo</h1>
          <p className="text-gray-600">Experience our seamless multi-chain payment flow</p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center mb-8 space-x-4"
        >
          {[1, 2, 3, 4].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNum 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {stepNum < step || paymentComplete ? (
                  <Check className="w-5 h-5" />
                ) : (
                  stepNum
                )}
              </div>
              {stepNum < 4 && (
                <div className={`w-16 h-1 mx-2 ${
                  step > stepNum ? 'bg-primary-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {/* Step 1: Product Selection */}
          {step === 1 && (
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="crypto-card"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full md:w-48 h-48 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      ${product.price}
                    </span>
                    <button
                      onClick={() => setStep(2)}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Buy Now</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Payment Method Selection */}
          {step === 2 && (
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="crypto-card"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Choose Payment Method
                </h3>
                <button 
                  onClick={() => setStep(1)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-3 mb-6">
                <button 
                  onClick={() => {
                    setSelectedPaymentMethod('near-intents');
                    setShowNearIntents(true);
                  }}
                  className="w-full p-4 border-2 border-green-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200 relative overflow-hidden"
                >
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    NEW
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">Pay with NEAR Intents</div>
                      <div className="text-sm text-gray-600">Lightning-fast cross-chain payments (~3s)</div>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => {
                    setSelectedPaymentMethod('crypto');
                    setStep(3);
                  }}
                  className="w-full p-4 border-2 border-primary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">Traditional Crypto</div>
                      <div className="text-sm text-gray-600">Bitcoin, Ethereum, and 50+ more</div>
                    </div>
                  </div>
                </button>
                
                <button className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-all duration-200 opacity-60 cursor-not-allowed">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-500">Credit Card</div>
                      <div className="text-sm text-gray-400">Traditional payment (disabled in demo)</div>
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Currency Selection */}
          {step === 3 && (
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="crypto-card"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Select Cryptocurrency
                </h3>
                <button 
                  onClick={() => setStep(2)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-3 mb-6">
                {currencies.map((currency) => (
                  <button
                    key={currency.id}
                    onClick={() => setSelectedCurrency(currency.id)}
                    className={`w-full p-4 border-2 rounded-lg transition-all duration-200 ${
                      selectedCurrency === currency.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`crypto-logo ${currency.color}`}>
                          {currency.symbol}
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-gray-900">{currency.name}</div>
                          <div className="text-sm text-gray-600">{currency.network}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{currency.price}</div>
                        <div className="text-sm text-gray-600">≈ ${product.price}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              {selectedCurrency && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <Wallet className="w-4 h-4" />
                        <span>Pay Now</span>
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 4: Payment Confirmation */}
          {step === 4 && paymentComplete && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="crypto-card text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-600 mb-6">
                Your crypto payment has been processed successfully. You'll receive a confirmation email shortly.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-sm">0x1234...abcd</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">
                    {currencies.find(c => c.id === selectedCurrency)?.price}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Network:</span>
                  <span>{currencies.find(c => c.id === selectedCurrency)?.network}</span>
                </div>
              </div>
              <button
                onClick={resetDemo}
                className="btn-secondary"
              >
                Try Another Transaction
              </button>
            </motion.div>
          )}
        </div>

        {/* NEAR Intents Payment Modal */}
        {showNearIntents && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <NearIntentsPayment
                  amount={product.price}
                  currency="USD"
                  onSuccess={handleNearIntentsSuccess}
                  onError={handleNearIntentsError}
                  onCancel={handleNearIntentsCancel}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CheckoutDemo;
