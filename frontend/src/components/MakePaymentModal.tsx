'use client';

import { useState, useEffect } from 'react';
import { useMakePayment } from '@/hooks/useEduLoanWrite';
import { useRemainingAmount } from '@/hooks/useEduLoan';
import { formatWeiToEth } from '@/lib/utils';

interface MakePaymentModalProps {
  loanId: bigint;
  isOpen: boolean;
  onClose: () => void;
}

export function MakePaymentModal({ loanId, isOpen, onClose }: MakePaymentModalProps) {
  const [amount, setAmount] = useState('');

  const { data: remaining } = useRemainingAmount(loanId);
  const { makePayment, isPending, isConfirming, isSuccess, error } = useMakePayment();

  const remainingAmount = remaining ? parseFloat(formatWeiToEth(remaining)) : 0;

  useEffect(() => {
    if (isSuccess) {
      setAmount('');
      setTimeout(onClose, 2000); // Close modal after 2 seconds on success
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && loanId) {
      makePayment(loanId, amount);
    }
  };

  const setPercentage = (percent: number) => {
    const paymentAmount = ((remainingAmount * percent) / 100).toFixed(4);
    setAmount(paymentAmount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card p-6 max-w-md w-full slide-up">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">Make Payment</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
            disabled={isPending || isConfirming}
          >
            x
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-400 text-sm mb-1">Remaining Balance</p>
          <p className="text-3xl font-bold gradient-text">{remainingAmount.toFixed(4)} MNT</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Payment Amount (MNT)</label>
            <input
              type="number"
              step="0.0001"
              min="0"
              max={remainingAmount}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0000"
              className="input-field text-lg"
              disabled={isPending || isConfirming}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPercentage(25)}
              className="btn-outline flex-1 py-2 text-sm"
              disabled={isPending || isConfirming}
            >
              25%
            </button>
            <button
              type="button"
              onClick={() => setPercentage(50)}
              className="btn-outline flex-1 py-2 text-sm"
              disabled={isPending || isConfirming}
            >
              50%
            </button>
            <button
              type="button"
              onClick={() => setPercentage(75)}
              className="btn-outline flex-1 py-2 text-sm"
              disabled={isPending || isConfirming}
            >
              75%
            </button>
            <button
              type="button"
              onClick={() => setPercentage(100)}
              className="btn-outline flex-1 py-2 text-sm"
              disabled={isPending || isConfirming}
            >
              100%
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error.message}</p>
            </div>
          )}

          {isSuccess && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <p className="text-green-400 text-sm">✅ Payment successful!</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending || isConfirming || !amount}
            className="btn-gradient w-full flex items-center justify-center gap-2"
          >
            {isPending || isConfirming ? (
              <>
                <div className="spinner" />
                {isPending ? 'Sending...' : 'Confirming...'}
              </>
            ) : (
              '💸 Send Payment'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
