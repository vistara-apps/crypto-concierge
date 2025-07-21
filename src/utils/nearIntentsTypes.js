/**
 * NEAR Intents API Types and Constants
 */

// API Base URL
export const NEAR_INTENTS_API_BASE = 'https://1click.near-intents.org';

// Swap Types
export const SWAP_TYPES = {
  EXACT_INPUT: 'EXACT_INPUT',
  EXACT_OUTPUT: 'EXACT_OUTPUT'
};

// Deposit Types
export const DEPOSIT_TYPES = {
  ORIGIN_CHAIN: 'ORIGIN_CHAIN',
  VIRTUAL_CHAIN: 'VIRTUAL_CHAIN'
};

// Recipient Types
export const RECIPIENT_TYPES = {
  DESTINATION_CHAIN: 'DESTINATION_CHAIN',
  VIRTUAL_CHAIN: 'VIRTUAL_CHAIN'
};

// Payment Status Types
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  QUOTE_GENERATED: 'QUOTE_GENERATED',
  DEPOSIT_DETECTED: 'DEPOSIT_DETECTED',
  KNOWN_DEPOSIT_TX: 'KNOWN_DEPOSIT_TX',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
};

// Supported Assets (example mapping)
export const SUPPORTED_ASSETS = {
  // Ethereum assets
  ETH: 'nep141:eth-0x0000000000000000000000000000000000000000.omft.near',
  USDC_ETH: 'nep141:eth-0xa0b86a33e6441e6c7d3e4081f7567f8b8e8b8b8b.omft.near',
  
  // Bitcoin
  BTC: 'nep141:btc-0x0000000000000000000000000000000000000000.omft.near',
  
  // Solana assets
  SOL: 'nep141:sol-0x0000000000000000000000000000000000000000.omft.near',
  USDC_SOL: 'nep141:sol-5ce3bf3a31af18be40ba30f721101b4341690186.omft.near',
  
  // NEAR
  NEAR: 'nep141:near.omft.near',
  
  // Arbitrum
  USDC_ARB: 'nep141:arb-0xaf88d065e77c8cc2239327c5edb3a432268e5831.omft.near'
};

// Error Types
export const ERROR_TYPES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  INVALID_QUOTE: 'INVALID_QUOTE',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  TIMEOUT: 'TIMEOUT',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

/**
 * Quote Request Interface
 * @typedef {Object} QuoteRequest
 * @property {boolean} dry - Whether this is a dry run
 * @property {string} swapType - Type of swap (EXACT_INPUT or EXACT_OUTPUT)
 * @property {number} slippageTolerance - Slippage tolerance in basis points
 * @property {string} originAsset - Origin asset identifier
 * @property {string} depositType - Deposit type
 * @property {string} destinationAsset - Destination asset identifier
 * @property {string} amount - Amount to swap
 * @property {string} refundTo - Refund address
 * @property {string} refundType - Refund type
 * @property {string} recipient - Recipient address
 * @property {string} virtualChainRecipient - Virtual chain recipient
 * @property {string} virtualChainRefundRecipient - Virtual chain refund recipient
 * @property {string} recipientType - Recipient type
 * @property {string} deadline - Deadline timestamp
 * @property {string} referral - Referral code
 * @property {number} quoteWaitingTimeMs - Quote waiting time in milliseconds
 * @property {Array} appFees - Application fees
 */

/**
 * Quote Response Interface
 * @typedef {Object} QuoteResponse
 * @property {string} timestamp - Quote timestamp
 * @property {string} signature - Quote signature
 * @property {QuoteRequest} quoteRequest - Original quote request
 * @property {Object} quote - Quote details
 */

/**
 * Swap Status Response Interface
 * @typedef {Object} SwapStatusResponse
 * @property {QuoteResponse} quoteResponse - Quote response
 * @property {string} status - Current status
 * @property {string} updatedAt - Last update timestamp
 * @property {Object} swapDetails - Swap details
 */

