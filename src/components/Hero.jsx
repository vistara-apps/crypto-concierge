import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  const cryptoIcons = [
    { name: 'BTC', color: 'bg-crypto-gold' },
    { name: 'ETH', color: 'bg-crypto-ethereum' },
    { name: 'NEAR', color: 'bg-crypto-near' },
    { name: 'SOL', color: 'bg-crypto-solana' },
    { name: 'USDC', color: 'bg-blue-600' },
    { name: 'USDT', color: 'bg-green-600' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-purple-50 py-20 lg:py-32">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-8"
          >
            <Zap className="w-4 h-4 mr-2" />
            Now supporting 50+ cryptocurrencies
          </motion.div>

          {/* Main heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
          >
            The one-stop shop for{' '}
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              seamless, cross-chain
            </span>{' '}
            crypto payments
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto"
          >
            Accept payments in any cryptocurrency across multiple blockchains with a single API. 
            No-code setup, frictionless experience, and automatic conversion to your preferred currency.
          </motion.p>

          {/* Crypto icons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex justify-center space-x-4 mb-12"
          >
            {cryptoIcons.map((crypto, index) => (
              <motion.div
                key={crypto.name}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className={`crypto-logo ${crypto.color} animate-float`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {crypto.name}
              </motion.div>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link to="/dashboard" className="btn-primary inline-flex items-center">
              Get Started Free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link to="/checkout" className="btn-secondary inline-flex items-center">
              View Live Demo
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-4">
                <Globe className="w-6 h-6 text-primary-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">50+</div>
              <div className="text-gray-600">Supported Currencies</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">99.9%</div>
              <div className="text-gray-600">Uptime Guarantee</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">Bank-Level</div>
              <div className="text-gray-600">Security</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;