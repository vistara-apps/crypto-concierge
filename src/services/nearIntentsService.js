import axios from 'axios';
import {
  NEAR_INTENTS_API_BASE,
  SWAP_TYPES,
  DEPOSIT_TYPES,
  RECIPIENT_TYPES,
  PAYMENT_STATUS,
  SUPPORTED_ASSETS,
  ERROR_TYPES
} from '../utils/nearIntentsTypes.js';

/**
 * NEAR Intents Service
 * Handles all interactions with the NEAR Intents 1Click API
 */
class NearIntentsService {
  constructor() {
    this.apiClient = axios.create({
      baseURL: NEAR_INTENTS_API_BASE,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 second timeout
    });

    // Add response interceptor for error handling
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => this.handleApiError(error)
    );
  }

  /**
   * Get a quote for a NEAR Intents swap
   * @param {Object} params - Quote parameters
   * @param {string} params.fromAsset - Source asset symbol (e.g., 'ETH', 'BTC')
   * @param {string} params.toAsset - Destination asset symbol (e.g., 'USDC', 'NEAR')
   * @param {string} params.amount - Amount to swap
   * @param {string} params.recipient - Recipient address
   * @param {string} params.refundTo - Refund address
   * @param {number} params.slippageTolerance - Slippage tolerance (default: 100 = 1%)
   * @returns {Promise<Object>} Quote response
   */
  async getQuote({
    fromAsset,
    toAsset,
    amount,
    recipient,
    refundTo,
    slippageTolerance = 100
  }) {
    try {
      const originAsset = this.getAssetIdentifier(fromAsset);
      const destinationAsset = this.getAssetIdentifier(toAsset);

      if (!originAsset || !destinationAsset) {
        throw new Error(`Unsupported asset: ${fromAsset} or ${toAsset}`);
      }

      const quoteRequest = {
        dry: true, // Always start with dry run for quotes
        swapType: SWAP_TYPES.EXACT_INPUT,
        slippageTolerance,
        originAsset,
        depositType: DEPOSIT_TYPES.ORIGIN_CHAIN,
        destinationAsset,
        amount,
        refundTo,
        refundType: DEPOSIT_TYPES.ORIGIN_CHAIN,
        recipient,
        virtualChainRecipient: recipient,
        virtualChainRefundRecipient: refundTo,
        recipientType: RECIPIENT_TYPES.DESTINATION_CHAIN,
        deadline: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
        referral: 'crypto-concierge',
        quoteWaitingTimeMs: 3000,
        appFees: []
      };

      const response = await this.apiClient.post('/quote', quoteRequest);
      return response.data;
    } catch (error) {
      console.error('Failed to get NEAR Intents quote:', error);
      throw this.createServiceError(error, ERROR_TYPES.INVALID_QUOTE);
    }
  }

  /**
   * Create and execute a NEAR Intents swap
   * @param {Object} quoteResponse - Quote response from getQuote
   * @param {string} userAddress - User's wallet address
   * @returns {Promise<Object>} Swap response with tracking ID
   */
  async createSwap(quoteResponse, userAddress) {
    try {
      // Convert dry run quote to actual swap request
      const swapRequest = {
        ...quoteResponse.quoteRequest,
        dry: false, // Execute the actual swap
        refundTo: userAddress,
        virtualChainRefundRecipient: userAddress
      };

      const response = await this.apiClient.post('/swap', {
        quoteResponse,
        swapRequest
      });

      return response.data;
    } catch (error) {
      console.error('Failed to create NEAR Intents swap:', error);
      throw this.createServiceError(error, ERROR_TYPES.NETWORK_ERROR);
    }
  }

  /**
   * Get the status of a NEAR Intents swap
   * @param {string} swapId - Swap tracking ID
   * @returns {Promise<Object>} Swap status response
   */
  async getSwapStatus(swapId) {
    try {
      const response = await this.apiClient.get(`/swap/${swapId}/status`);
      return response.data;
    } catch (error) {
      console.error('Failed to get swap status:', error);
      throw this.createServiceError(error, ERROR_TYPES.NETWORK_ERROR);
    }
  }

  /**
   * Poll swap status until completion or timeout
   * @param {string} swapId - Swap tracking ID
   * @param {Function} onStatusUpdate - Callback for status updates
   * @param {number} maxAttempts - Maximum polling attempts (default: 60)
   * @param {number} intervalMs - Polling interval in milliseconds (default: 2000)
   * @returns {Promise<Object>} Final swap status
   */
  async pollSwapStatus(swapId, onStatusUpdate, maxAttempts = 60, intervalMs = 2000) {
    let attempts = 0;

    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          attempts++;
          const status = await this.getSwapStatus(swapId);
          
          if (onStatusUpdate) {
            onStatusUpdate(status);
          }

          // Check if swap is complete
          if (status.status === PAYMENT_STATUS.COMPLETED) {
            resolve(status);
            return;
          }

          // Check if swap failed
          if (status.status === PAYMENT_STATUS.FAILED || status.status === PAYMENT_STATUS.REFUNDED) {
            reject(new Error(`Swap ${status.status.toLowerCase()}: ${status.error || 'Unknown error'}`));
            return;
          }

          // Check if we've exceeded max attempts
          if (attempts >= maxAttempts) {
            reject(new Error('Swap status polling timeout'));
            return;
          }

          // Continue polling
          setTimeout(poll, intervalMs);
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  }

  /**
   * Get supported assets for NEAR Intents
   * @returns {Array} List of supported assets
   */
  getSupportedAssets() {
    return Object.keys(SUPPORTED_ASSETS).map(symbol => ({
      symbol,
      identifier: SUPPORTED_ASSETS[symbol],
      name: this.getAssetName(symbol)
    }));
  }

  /**
   * Get asset identifier for NEAR Intents API
   * @param {string} symbol - Asset symbol (e.g., 'ETH', 'BTC')
   * @returns {string|null} Asset identifier or null if not supported
   */
  getAssetIdentifier(symbol) {
    return SUPPORTED_ASSETS[symbol.toUpperCase()] || null;
  }

  /**
   * Get human-readable asset name
   * @param {string} symbol - Asset symbol
   * @returns {string} Asset name
   */
  getAssetName(symbol) {
    const names = {
      ETH: 'Ethereum',
      BTC: 'Bitcoin',
      SOL: 'Solana',
      NEAR: 'NEAR Protocol',
      USDC_ETH: 'USD Coin (Ethereum)',
      USDC_SOL: 'USD Coin (Solana)',
      USDC_ARB: 'USD Coin (Arbitrum)'
    };
    return names[symbol] || symbol;
  }

  /**
   * Handle API errors and convert to service errors
   * @param {Error} error - Original error
   * @returns {Error} Processed error
   */
  handleApiError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      console.error(`NEAR Intents API Error ${status}:`, data);
      
      if (status === 400) {
        return new Error(data.message || 'Invalid request parameters');
      } else if (status === 429) {
        return new Error('Rate limit exceeded. Please try again later.');
      } else if (status >= 500) {
        return new Error('NEAR Intents service is temporarily unavailable');
      }
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
      return new Error('Network error. Please check your connection.');
    }

    return error;
  }

  /**
   * Create a standardized service error
   * @param {Error} originalError - Original error
   * @param {string} type - Error type from ERROR_TYPES
   * @returns {Error} Service error
   */
  createServiceError(originalError, type) {
    const error = new Error(originalError.message);
    error.type = type;
    error.originalError = originalError;
    return error;
  }

  /**
   * Estimate swap time based on asset types
   * @param {string} fromAsset - Source asset
   * @param {string} toAsset - Destination asset
   * @returns {number} Estimated time in seconds
   */
  estimateSwapTime(fromAsset, toAsset) {
    // NEAR Intents typically completes in 2-3 seconds
    // Add some buffer for cross-chain operations
    const baseTime = 3; // 3 seconds base
    const crossChainPenalty = fromAsset !== toAsset ? 2 : 0; // 2 seconds for cross-chain
    return baseTime + crossChainPenalty;
  }
}

// Export singleton instance
export const nearIntentsService = new NearIntentsService();
export default nearIntentsService;

