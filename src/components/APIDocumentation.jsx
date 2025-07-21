import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Copy, 
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Book,
  Zap,
  Shield
} from 'lucide-react';

const APIDocumentation = () => {
  const [openSections, setOpenSections] = useState(['getting-started']);
  const [selectedLanguage, setSelectedLanguage] = useState('curl');

  const toggleSection = (sectionId) => {
    setOpenSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const languages = [
    { id: 'curl', name: 'cURL' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'go', name: 'Go' }
  ];

  const codeExamples = {
    curl: `curl -X POST https://api.cryptoconcierge.com/v1/payments \\
  -H "Authorization: Bearer sk_live_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 100.00,
    "currency": "USD",
    "accepted_currencies": ["BTC", "ETH", "USDC"],
    "customer": {
      "email": "customer@example.com"
    },
    "metadata": {
      "order_id": "order_123"
    }
  }'`,
    javascript: `const CryptoConcierge = require('crypto-concierge');
const cc = new CryptoConcierge('sk_live_your_api_key');

const payment = await cc.payments.create({
  amount: 100.00,
  currency: 'USD',
  accepted_currencies: ['BTC', 'ETH', 'USDC'],
  customer: {
    email: 'customer@example.com'
  },
  metadata: {
    order_id: 'order_123'
  }
});`,
    python: `import cryptoconcierge

cc = cryptoconcierge.Client('sk_live_your_api_key')

payment = cc.payments.create(
    amount=100.00,
    currency='USD',
    accepted_currencies=['BTC', 'ETH', 'USDC'],
    customer={
        'email': 'customer@example.com'
    },
    metadata={
        'order_id': 'order_123'
    }
)`,
    go: `package main

import (
    "github.com/cryptoconcierge/go-sdk"
)

func main() {
    client := cryptoconcierge.NewClient("sk_live_your_api_key")
    
    payment, err := client.Payments.Create(&cryptoconcierge.PaymentParams{
        Amount:   100.00,
        Currency: "USD",
        AcceptedCurrencies: []string{"BTC", "ETH", "USDC"},
        Customer: &cryptoconcierge.CustomerParams{
            Email: "customer@example.com",
        },
        Metadata: map[string]string{
            "order_id": "order_123",
        },
    })
}`
  };

  const apiSections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Book,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700">
            Welcome to the Crypto Concierge API! Our RESTful API allows you to accept cryptocurrency 
            payments across multiple blockchains with a single integration.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Base URL</h4>
            <code className="text-blue-800">https://api.cryptoconcierge.com/v1</code>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Authentication</h4>
            <p className="text-gray-700 mb-3">
              All API requests must be authenticated using your secret API key in the Authorization header:
            </p>
            <div className="bg-gray-900 rounded-lg p-4">
              <code className="text-green-400">Authorization: Bearer sk_live_your_api_key</code>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'create-payment',
      title: 'Create Payment',
      icon: Zap,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700">
            Create a new payment intent that allows customers to pay with their preferred cryptocurrency.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                  POST
                </span>
                <code className="text-gray-800">/v1/payments</code>
              </div>
              <div className="flex space-x-2">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLanguage(lang.id)}
                    className={`px-3 py-1 text-xs rounded ${
                      selectedLanguage === lang.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
              <code>{codeExamples[selectedLanguage]}</code>
            </pre>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Parameters</h4>
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <code className="text-sm font-medium text-primary-600">amount</code>
                    <span className="ml-2 text-red-500 text-sm">required</span>
                  </div>
                  <span className="text-sm text-gray-500">number</span>
                </div>
                <p className="text-sm text-gray-700 mt-1">The payment amount in the specified currency</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <code className="text-sm font-medium text-primary-600">currency</code>
                    <span className="ml-2 text-red-500 text-sm">required</span>
                  </div>
                  <span className="text-sm text-gray-500">string</span>
                </div>
                <p className="text-sm text-gray-700 mt-1">Three-letter ISO currency code (e.g., "USD", "EUR")</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <code className="text-sm font-medium text-primary-600">accepted_currencies</code>
                    <span className="ml-2 text-gray-500 text-sm">optional</span>
                  </div>
                  <span className="text-sm text-gray-500">array</span>
                </div>
                <p className="text-sm text-gray-700 mt-1">List of cryptocurrencies to accept. Defaults to all supported currencies</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'webhooks',
      title: 'Webhooks',
      icon: Shield,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700">
            Webhooks allow you to receive real-time notifications when payment events occur.
          </p>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Event Types</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <code className="text-sm text-primary-600">payment.created</code>
                <span className="text-sm text-gray-600">Payment intent created</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <code className="text-sm text-primary-600">payment.completed</code>
                <span className="text-sm text-gray-600">Payment successfully completed</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <code className="text-sm text-primary-600">payment.failed</code>
                <span className="text-sm text-gray-600">Payment failed or expired</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">API Documentation</h1>
          <p className="text-xl text-gray-600 mb-6">
            Everything you need to integrate crypto payments into your application
          </p>
          <div className="flex justify-center space-x-4">
            <a 
              href="https://github.com/cryptoconcierge"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Code className="w-4 h-4" />
              <span>View on GitHub</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <button className="btn-secondary">
              Download Postman Collection
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="crypto-card sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">Documentation</h3>
              <nav className="space-y-2">
                {apiSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => toggleSection(section.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                      openSections.includes(section.id)
                        ? 'bg-primary-50 text-primary-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <section.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{section.title}</span>
                    </div>
                    {openSections.includes(section.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-8"
          >
            {apiSections.map((section) => (
              openSections.includes(section.id) && (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="crypto-card"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <section.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
                  </div>
                  {section.content}
                </motion.div>
              )
            ))}

            {/* SDKs and Libraries */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="crypto-card"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">SDKs & Libraries</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Code className="w-4 h-4 text-yellow-600" />
                    </div>
                    <h3 className="font-medium text-gray-900">JavaScript SDK</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Full-featured SDK for Node.js and browser environments
                  </p>
                  <div className="bg-gray-900 rounded p-2">
                    <code className="text-xs text-green-400">npm install crypto-concierge</code>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Code className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-gray-900">Python SDK</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Python library with async support and comprehensive features
                  </p>
                  <div className="bg-gray-900 rounded p-2">
                    <code className="text-xs text-green-400">pip install cryptoconcierge</code>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                      <Code className="w-4 h-4 text-cyan-600" />
                    </div>
                    <h3 className="font-medium text-gray-900">Go SDK</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    High-performance Go library for backend integrations
                  </p>
                  <div className="bg-gray-900 rounded p-2">
                    <code className="text-xs text-green-400">go get github.com/cryptoconcierge/go-sdk</code>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Code className="w-4 h-4 text-purple-600" />
                    </div>
                    <h3 className="font-medium text-gray-900">PHP SDK</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    PHP library compatible with Laravel and other frameworks
                  </p>
                  <div className="bg-gray-900 rounded p-2">
                    <code className="text-xs text-green-400">composer require cryptoconcierge/php-sdk</code>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default APIDocumentation;