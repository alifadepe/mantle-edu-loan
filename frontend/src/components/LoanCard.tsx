'use client';

import { Loan, LoanStatus } from '@/constants/contract';
import { StatusBadge } from './ui/StatusBadge';
import {
  formatWeiToEth,
  formatTimestamp,
  truncateAddress,
  calculateProgress,
  getTimeRemaining,
} from '@/lib/utils';

interface LoanCardProps {
  loan: Loan;
  onPaymentClick?: (loanId: bigint) => void;
  onApproveClick?: (loanId: bigint) => void;
  onRejectClick?: (loanId: bigint) => void;
  onDisburseClick?: (loanId: bigint) => void;
  showAdminActions?: boolean;
  disableAdminActions?: boolean;
  isOwner?: boolean;
}

export function LoanCard({
  loan,
  onPaymentClick,
  onApproveClick,
  onRejectClick,
  onDisburseClick,
  showAdminActions = false,
  disableAdminActions = false,
  isOwner = false,
}: LoanCardProps) {
  const progress = calculateProgress(loan.amountRepaid, loan.totalAmount);
  const remaining = loan.totalAmount - loan.amountRepaid;

  const showPayButton =
    loan.status === LoanStatus.Active && !showAdminActions && isOwner && remaining > 0n;

  const showAdminButtons =
    showAdminActions && (loan.status === LoanStatus.Pending || loan.status === LoanStatus.Approved);

  return (
    <div className="glass-card p-6 fade-in">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Loan #{loan.loanId.toString()}</h3>
          <p className="text-sm text-gray-400">{truncateAddress(loan.borrower)}</p>
        </div>
        <StatusBadge status={loan.status} />
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-400">Total Amount</span>
          <span className="text-white font-semibold">{formatWeiToEth(loan.totalAmount)} MNT</span>
        </div>

        {loan.status >= LoanStatus.Active && loan.status !== LoanStatus.Rejected && (
          <>
            <div className="flex justify-between">
              <span className="text-gray-400">Repaid</span>
              <span className="text-green-400 font-semibold">
                {formatWeiToEth(loan.amountRepaid)} MNT
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Remaining</span>
              <span className="text-white font-semibold">{formatWeiToEth(remaining)} MNT</span>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Progress</span>
                <span className="text-purple-400 font-semibold">{progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </>
        )}

        <div className="flex justify-between">
          <span className="text-gray-400">Applied</span>
          <span className="text-white">{formatTimestamp(loan.applicationTime)}</span>
        </div>

        {loan.deadline > 0n && (
          <div className="flex justify-between">
            <span className="text-gray-400">Time Remaining</span>
            <span className="text-white">{getTimeRemaining(loan.deadline)}</span>
          </div>
        )}

        {loan.purpose && (
          <div>
            <span className="text-gray-400 block mb-1">Purpose</span>
            <p className="text-white text-sm italic">"{loan.purpose}"</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {showPayButton && (
        <button onClick={() => onPaymentClick?.(loan.loanId)} className="btn-gradient w-full">
          Make Payment
        </button>
      )}

      {showAdminButtons && (
        <div className="space-y-2">
          {loan.status === LoanStatus.Pending && (
            <div className="flex gap-2">
              <button
                onClick={() => onApproveClick?.(loan.loanId)}
                className="btn-gradient flex-1"
                disabled={disableAdminActions}
              >
                ✓ Approve
              </button>
              <button
                onClick={() => onRejectClick?.(loan.loanId)}
                className="btn-outline flex-1"
                disabled={disableAdminActions}
              >
                ✗ Reject
              </button>
            </div>
          )}

          {loan.status === LoanStatus.Approved && (
            <button
              onClick={() => onDisburseClick?.(loan.loanId)}
              className="btn-gradient w-full"
              disabled={disableAdminActions}
            >
              💸 Disburse Funds
            </button>
          )}
        </div>
      )}
    </div>
  );
}
