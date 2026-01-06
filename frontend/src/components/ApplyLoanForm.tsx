'use client';

import { useState, useEffect } from 'react';
import { useApplyLoan } from '@/hooks/useEduLoanWrite';
import { useMinLoan, useMaxLoan } from '@/hooks/useEduLoan';
import { formatEther } from 'viem';

interface ApplyLoanFormProps {
  onSuccess?: () => void;
}

export function ApplyLoanForm({ onSuccess }: ApplyLoanFormProps) {
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');

  const { data: minLoan } = useMinLoan();
  const { data: maxLoan } = useMaxLoan();

  const { applyLoan, isPending, isConfirming, isSuccess, error } = useApplyLoan();

  const minAmount = minLoan ? parseFloat(formatEther(minLoan)) : 0.01;
  const maxAmount = maxLoan ? parseFloat(formatEther(maxLoan)) : 10;

  useEffect(() => {
    if (isSuccess) {
      setAmount('');
      setPurpose('');
      onSuccess?.();
    }
  }, [isSuccess, onSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && purpose) {
      applyLoan(amount, purpose);
    }
  };

  const isDisabled = isPending || isConfirming || !amount || !purpose;

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
      <h3 className="text-2xl font-bold text-white mb-4">Apply for a Loan</h3>

      <div>
        <label className="block text-gray-400 text-sm mb-2">Loan Amount (MNT)</label>
        <input
          type="number"
          step="0.01"
          min={minAmount}
          max={maxAmount}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={`Min: ${minAmount} MNT, Max: ${maxAmount} MNT`}
          className="input-field"
          disabled={isPending || isConfirming}
        />
        <p className="text-xs text-gray-500 mt-1">
          Minimum: {minAmount} MNT | Maximum: {maxAmount} MNT
        </p>
      </div>

      <div>
        <label className="block text-gray-400 text-sm mb-2">Purpose of Loan</label>
        <textarea
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="e.g., Tuition fees, Books and supplies, Living expenses..."
          className="input-field min-h-[100px] resize-none"
          disabled={isPending || isConfirming}
        />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <p className="text-red-400 text-sm">Error: {error.message}</p>
        </div>
      )}

      {isSuccess && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
          <p className="text-green-400 text-sm">✅ Application submitted successfully!</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isDisabled}
        className="btn-gradient w-full flex items-center justify-center gap-2"
      >
        {isPending || isConfirming ? (
          <>
            <div className="spinner" />
            {isPending ? 'Submitting...' : 'Confirming...'}
          </>
        ) : (
          '📝 Submit Application'
        )}
      </button>
    </form>
  );
}
