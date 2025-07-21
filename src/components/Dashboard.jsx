import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Users,
  Plus,
  Copy,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';

const Dashboard = () => {
  const [showAPIKey, setShowAPIKey] = useState(false);
  
  const stats = [
    {
      title: 'Total Revenue',
      value: '$12,847',
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      title: 'Transactions',
      value: '1,284',
      change: '+8.2%',
      icon: BarChart3,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'Success Rate',
      value: '99.8%',
      change: '+0.3%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      title: 'Active Users',
      value: '847',
      change: '+15.4%',
      icon: Users,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    }
  ];

  const recentTransactions = [
    { id: '1', amount: '$125.00', currency: 'ETH', status: 'Completed', time: '2 minutes ago' },
    { id: '2', amount: '$89.50', currency: 'BTC', status: 'Completed', time: '5 minutes ago' },
    { id: '3', amount: '$245.00', currency: 'USDC', status: 'Pending', time: '10 minutes ago' },
    { id: '4', amount: '$67.25', currency: 'SOL', status: 'Completed', time: '15 minutes ago' },
    { id: '5', amount: '$156.80', currency: 'NEAR', status: 'Completed', time: '22 minutes ago' },
  ];

  const supportedCurrencies = [
    { symbol: 'BTC', name: 'Bitcoin', color: 'bg-crypto-gold' },
    { symbol: 'ETH', name: 'Ethereum', color: 'bg-crypto-ethereum' },
    { symbol: 'NEAR', name: 'NEAR Protocol', color: 'bg-crypto-near' },
    { symbol: 'SOL', name: 'Solana', color: 'bg-crypto-solana' },
    { symbol: 'USDC', name: 'USD Coin', color: 'bg-blue-600' },
    { symbol: 'USDT', name: 'Tether', color: 'bg-green-600' },
  ];

  const apiKey = 'cc_live_1234567890abcdef1234567890abcdef';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Monitor your crypto payment performance and manage integrations</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="crypto-card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className={`text-sm ${stat.color}`}>{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* API Setup */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="crypto-card mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">API Integration</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Key
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type={showAPIKey ? 'text' : 'password'}
                      value={apiKey}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm"
                    />
                    <button
                      onClick={() => setShowAPIKey(!showAPIKey)}
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      {showAPIKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(apiKey)}
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Quick Start</h3>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
{`curl -X POST https://api.cryptoconcierge.com/payments \\
  -H "Authorization: Bearer ${apiKey}" \\
  -d '{"amount": 100, "currency": "USD", "accept": ["BTC", "ETH"]}'`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="crypto-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
                <button className="text-primary-600 text-sm hover:text-primary-700">
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className={`crypto-logo ${transaction.currency === 'BTC' ? 'bg-crypto-gold' : 
                        transaction.currency === 'ETH' ? 'bg-crypto-ethereum' :
                        transaction.currency === 'SOL' ? 'bg-crypto-solana' :
                        transaction.currency === 'NEAR' ? 'bg-crypto-near' :
                        'bg-blue-600'}`}>
                        {transaction.currency}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.amount}</p>
                        <p className="text-sm text-gray-500">{transaction.time}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Supported Currencies */}
            <div className="crypto-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Supported Currencies</h3>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {supportedCurrencies.map((currency) => (
                  <div key={currency.symbol} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`crypto-logo ${currency.color}`}>
                        {currency.symbol}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {currency.name}
                      </span>
                    </div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 flex items-center justify-center space-x-2 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600">
                <Plus className="w-4 h-4" />
                <span className="text-sm">Add Currency</span>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="crypto-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  Create Payment Link
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  Generate Webhook
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  Download SDK
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  View Documentation
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;