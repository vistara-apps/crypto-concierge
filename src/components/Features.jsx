import React from 'react';
import { motion } from 'framer-motion';
import { 
  Coins, 
  Layers, 
  Code, 
  Zap, 
  Shield, 
  BarChart3,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Features = () => {
  const features = [
    {
      icon: Coins,
      title: 'Multicurrency Checkout',
      description: 'Accept payments in Bitcoin, Ethereum, USDC, and 50+ other cryptocurrencies. Let customers pay with their preferred crypto.',
      color: 'bg-crypto-gold',
      benefits: ['Higher conversion rates', 'Global reach', 'Customer choice']
    },
    {
      icon: Zap,
      title: 'Seamless Onboarding',
      description: 'Non-technical payment flow that guides customers through crypto payments with the simplicity of traditional checkout.',
      color: 'bg-primary-600',
      benefits: ['No wallet complexity', 'Guided experience', 'Instant payments']
    },
    {
      icon: Layers,
      title: 'Single API, Multiple Chains',
      description: 'One integration supports Ethereum, NEAR, Solana, and more. Switch between blockchains without code changes.',
      color: 'bg-purple-600',
      benefits: ['Unified interface', 'Multi-chain support', 'Easy integration']
    },
    {
      icon: Code,
      title: 'No-Code Setup',
      description: 'Drag-and-drop payment button builder. Embed crypto payments into your site without technical knowledge.',
      color: 'bg-green-600',
      benefits: ['Visual builder', 'Instant deployment', 'No coding required']
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Everything you need for{' '}
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              crypto payments
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive tools and APIs that make accepting cryptocurrency payments 
            as easy as traditional payment processing.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="feature-card group"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <ul className="space-y-1">
                    {feature.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center text-sm text-gray-500">
                        <ArrowRight className="w-3 h-3 mr-2 text-primary-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional benefits */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl p-8 lg:p-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Built for scale, designed for simplicity
              </h3>
              <p className="text-gray-600 mb-6">
                From startups to enterprises, our platform grows with your business. 
                Start free and scale seamlessly as your transaction volume increases.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">Enterprise Security</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">Real-time Analytics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium">Instant Settlements</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Code className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium">Developer Tools</span>
                </div>
              </div>
              <Link to="/dashboard" className="btn-primary">
                Start Building Today
              </Link>
            </div>
            <div className="space-y-4">
              <div className="crypto-card">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">Monthly Volume</span>
                  <span className="text-lg font-bold text-gray-900">$127,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full w-3/4"></div>
                </div>
              </div>
              <div className="crypto-card">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">Success Rate</span>
                  <span className="text-lg font-bold text-green-600">99.8%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full w-full"></div>
                </div>
              </div>
              <div className="crypto-card">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">Active Merchants</span>
                  <span className="text-lg font-bold text-purple-600">2,847</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;