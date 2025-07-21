import { useState, useEffect, useCallback } from 'react';
import nearIntentsService from '../services/nearIntentsService.js';
import { PAYMENT_STATUS } from '../utils/nearIntentsTypes.js';

/**
 * Hook for tracking NEAR Intent payment status
 * @param {string} swapId - The swap ID to track
 * @param {Object} options - Configuration options
 * @returns {Object} Status tracking state and methods
 */
export function useNearIntentStatus(swapId, options = {}) {
  const {
    pollInterval = 2000, // 2 seconds
    maxAttempts = 60, // 2 minutes total
    onStatusChange,
    onComplete,
    onError
  } = options;

  const [status, setStatus] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState(null);
  const [attempts, setAttempts] = useState(0);

  const updateStatus = useCallback((newStatus) => {
    setStatus(newStatus);
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  }, [onStatusChange]);

  const startPolling = useCallback(async () => {
    if (!swapId || isPolling) return;

    setIsPolling(true);
    setError(null);
    setAttempts(0);

    const poll = async () => {
      try {
        const response = await nearIntentsService.getSwapStatus(swapId);
        updateStatus(response);

        // Check if completed
        if (response.status === PAYMENT_STATUS.COMPLETED) {
          setIsPolling(false);
          if (onComplete) {
            onComplete(response);
          }
          return;
        }

        // Check if failed
        if (response.status === PAYMENT_STATUS.FAILED || response.status === PAYMENT_STATUS.REFUNDED) {
          setIsPolling(false);
          const errorMsg = `Payment ${response.status.toLowerCase()}`;
          setError(errorMsg);
          if (onError) {
            onError(new Error(errorMsg));
          }
          return;
        }

        // Continue polling if not at max attempts
        setAttempts(prev => {
          const newAttempts = prev + 1;
          if (newAttempts >= maxAttempts) {
            setIsPolling(false);
            const timeoutError = new Error('Status polling timeout');
            setError('Polling timeout - payment may still be processing');
            if (onError) {
              onError(timeoutError);
            }
            return newAttempts;
          }

          // Schedule next poll
          setTimeout(poll, pollInterval);
          return newAttempts;
        });

      } catch (err) {
        console.error('Error polling swap status:', err);
        setIsPolling(false);
        setError(err.message || 'Failed to get payment status');
        if (onError) {
          onError(err);
        }
      }
    };

    // Start polling
    poll();
  }, [swapId, isPolling, maxAttempts, pollInterval, updateStatus, onComplete, onError]);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
  }, []);

  const reset = useCallback(() => {
    setStatus(null);
    setError(null);
    setAttempts(0);
    setIsPolling(false);
  }, []);

  // Auto-start polling when swapId is provided
  useEffect(() => {
    if (swapId && !isPolling && !status) {
      startPolling();
    }
  }, [swapId, isPolling, status, startPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setIsPolling(false);
    };
  }, []);

  return {
    status,
    isPolling,
    error,
    attempts,
    progress: maxAttempts > 0 ? Math.min((attempts / maxAttempts) * 100, 100) : 0,
    startPolling,
    stopPolling,
    reset,
    // Computed status helpers
    isPending: status?.status === PAYMENT_STATUS.PENDING,
    isProcessing: status?.status === PAYMENT_STATUS.PROCESSING || 
                  status?.status === PAYMENT_STATUS.DEPOSIT_DETECTED ||
                  status?.status === PAYMENT_STATUS.KNOWN_DEPOSIT_TX,
    isCompleted: status?.status === PAYMENT_STATUS.COMPLETED,
    isFailed: status?.status === PAYMENT_STATUS.FAILED,
    isRefunded: status?.status === PAYMENT_STATUS.REFUNDED,
    // Status message helper
    statusMessage: getStatusMessage(status?.status),
    // Estimated time remaining (rough calculation)
    estimatedTimeRemaining: isPolling ? Math.max(0, (maxAttempts - attempts) * (pollInterval / 1000)) : 0
  };
}

/**
 * Get user-friendly status message
 * @param {string} status - Payment status
 * @returns {string} User-friendly message
 */
function getStatusMessage(status) {
  const messages = {
    [PAYMENT_STATUS.PENDING]: 'Preparing payment...',
    [PAYMENT_STATUS.QUOTE_GENERATED]: 'Quote generated, waiting for deposit...',
    [PAYMENT_STATUS.DEPOSIT_DETECTED]: 'Deposit detected, processing...',
    [PAYMENT_STATUS.KNOWN_DEPOSIT_TX]: 'Processing your payment...',
    [PAYMENT_STATUS.PROCESSING]: 'Executing cross-chain swap...',
    [PAYMENT_STATUS.COMPLETED]: 'Payment completed successfully!',
    [PAYMENT_STATUS.FAILED]: 'Payment failed',
    [PAYMENT_STATUS.REFUNDED]: 'Payment refunded'
  };
  return messages[status] || 'Processing...';
}

export default useNearIntentStatus;

