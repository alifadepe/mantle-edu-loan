'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useTotalLoans, useLoanDetails, useIsAdmin, useContractBalance } from '@/hooks/useEduLoan';
import {
  useApproveLoan,
  useRejectLoan,
  useDisburseLoan,
  useDepositFunds,
  useWithdrawFunds,
} from '@/hooks/useEduLoanWrite';
import { LoanCard } from '@/components/LoanCard';
import { LoanStats } from '@/components/LoanStats';
import { ConnectButton } from '@/components/ConnectButton';
import { formatWeiToEth } from '@/lib/utils';
import Link from 'next/link';

export default function AdminPage() {
  const { isConnected } = useAccount();
  const { isAdmin } = useIsAdmin();
  const { data: totalLoans } = useTotalLoans();
  const { data: contractBalance, refetch: refetchBalance } = useContractBalance();

  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [rejectLoanId, setRejectLoanId] = useState<bigint | null>(null);

  const { depositFunds, isPending: isDepositing, isSuccess: depositSuccess, hash: depositHash } = useDepositFunds();
  const {
    withdrawFunds,
    isPending: isWithdrawing,
    isSuccess: withdrawSuccess,
    hash: withdrawHash,
  } = useWithdrawFunds();

  // Refetch balance when deposit completes
  useEffect(() => {
    if (depositSuccess && depositHash) {
      refetchBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depositHash, depositSuccess]);

  // Refetch balance when withdrawal completes
  useEffect(() => {
    if (withdrawSuccess && withdrawHash) {
      refetchBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withdrawHash, withdrawSuccess]);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-6">Please connect your wallet to access the admin panel</p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  const loanIds = totalLoans
    ? Array.from({ length: Number(totalLoans) }, (_, i) => BigInt(i + 1))
    : [];

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (depositAmount) {
      depositFunds(depositAmount);
      setDepositAmount('');
    }
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount) {
      withdrawFunds(withdrawAmount);
      setWithdrawAmount('');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="text-3xl">🎓</div>
                <h1 className="text-2xl font-bold gradient-text">EduLoan</h1>
              </Link>
              <span className="text-gray-500">|</span>
              <span className="text-gray-300">Admin Panel</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h2>
          <p className="text-gray-400">Manage loan applications and contract funds</p>
        </div>

        {/* Stats */}
        <LoanStats />

        {/* Fund Management */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Deposit Funds */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">💳 Deposit Funds</h3>
            <form onSubmit={handleDeposit} className="space-y-4">
              <input
                type="number"
                step="0.01"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Amount in MNT"
                className="input-field"
                disabled={isDepositing || !isAdmin}
              />
              <button
                type="submit"
                disabled={isDepositing || !depositAmount || !isAdmin}
                className="btn-gradient w-full"
              >
                {isDepositing ? 'Depositing...' : 'Deposit'}
              </button>
              {depositSuccess && <p className="text-green-400 text-sm">✅ Deposit successful!</p>}
            </form>
          </div>

          {/* Withdraw Funds */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">💸 Withdraw Funds</h3>
            <p className="text-sm text-gray-400 mb-2">
              Available: {contractBalance ? formatWeiToEth(contractBalance) : '0'} MNT
            </p>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <input
                type="number"
                step="0.01"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Amount in MNT"
                className="input-field"
                disabled={isWithdrawing || !isAdmin}
              />
              <button
                type="submit"
                disabled={isWithdrawing || !withdrawAmount || !isAdmin}
                className="btn-gradient w-full"
              >
                {isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
              </button>
              {withdrawSuccess && (
                <p className="text-green-400 text-sm">✅ Withdrawal successful!</p>
              )}
            </form>
          </div>
        </div>

        {/* All Loans */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">All Loan Applications</h3>

          {loanIds.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h4 className="text-xl font-semibold text-white mb-2">No Loans Yet</h4>
              <p className="text-gray-400">No loan applications have been submitted yet</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loanIds.map((loanId) => (
                <AdminLoanCard
                  key={loanId.toString()}
                  loanId={loanId}
                  onRejectClick={(id) => setRejectLoanId(id)}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Reject Modal */}
      {rejectLoanId && (
        <RejectModal
          loanId={rejectLoanId}
          isOpen={!!rejectLoanId}
          onClose={() => setRejectLoanId(null)}
        />
      )}
    </div>
  );
}

// Admin Loan Card Wrapper
function AdminLoanCard({
  loanId,
  onRejectClick,
  isAdmin,
}: {
  loanId: bigint;
  onRejectClick: (id: bigint) => void;
  isAdmin: boolean;
}) {
  const { data: loan, isLoading, refetch } = useLoanDetails(loanId);
  const { approveLoan, isPending: isApproving } = useApproveLoan();
  const { disburseLoan, isPending: isDisbursing } = useDisburseLoan();

  // Show skeleton while initial loading
  if (isLoading || !loan) {
    return (
      <div className="glass-card p-6">
        <div className="skeleton h-8 w-32 mb-4" />
        <div className="skeleton h-6 w-full mb-2" />
        <div className="skeleton h-6 w-3/4" />
      </div>
    );
  }

  const isPerformingAction = isApproving || isDisbursing;

  return (
    <div className="relative">
      {/* Loading overlay when performing action */}
      {isPerformingAction && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="spinner" />
            <p className="text-white text-sm">
              {isApproving ? 'Approving...' : 'Disbursing...'}
            </p>
          </div>
        </div>
      )}

      <LoanCard
        loan={loan}
        showAdminActions={true}
        disableAdminActions={!isAdmin}
        onApproveClick={(id) => {
          approveLoan(id);
          setTimeout(() => refetch(), 2000);
        }}
        onRejectClick={onRejectClick}
        onDisburseClick={(id) => {
          disburseLoan(id);
          setTimeout(() => refetch(), 2000);
        }}
      />
    </div>
  );
}

// Reject Modal Component
function RejectModal({
  loanId,
  isOpen,
  onClose,
}: {
  loanId: bigint;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [reason, setReason] = useState('');
  const { rejectLoan, isPending, isConfirming, isSuccess } = useRejectLoan();

  // Auto-close modal after successful rejection
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        onClose();
        setReason(''); // Reset reason after closing
      }, 2000); // Close after 2 seconds
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]); // Only run when isSuccess changes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason) {
      rejectLoan(loanId, reason);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card p-6 max-w-md w-full slide-up">
        <h3 className="text-2xl font-bold text-white mb-4">Reject Loan #{loanId.toString()}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for rejection..."
            className="input-field min-h-[100px]"
            disabled={isPending}
          />
          {isSuccess && <p className="text-green-400 text-sm">✅ Loan rejected</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline flex-1"
              disabled={isPending}
            >
              Cancel
            </button>
            <button type="submit" disabled={isPending || !reason || isConfirming || isSuccess} className="btn-gradient flex-1">
              {isPending ? 'Rejecting...' : 'Reject Loan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
