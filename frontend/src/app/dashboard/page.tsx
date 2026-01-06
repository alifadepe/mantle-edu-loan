'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useMyLoans, useLoanDetails } from '@/hooks/useEduLoan';
import { LoanCard } from '@/components/LoanCard';
import { ApplyLoanForm } from '@/components/ApplyLoanForm';
import { MakePaymentModal } from '@/components/MakePaymentModal';
import { ConnectButton } from '@/components/ConnectButton';
import Link from 'next/link';

export default function DashboardPage() {
  const { isConnected, address } = useAccount();
  const { data: myLoanIds, isLoading, refetch } = useMyLoans();
  const [showApplyForm, setShowApplyForm] = useState(false);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-6">Please connect your wallet to view your dashboard</p>
          <ConnectButton />
        </div>
      </div>
    );
  }

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
              <span className="text-gray-300">Student Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-300 hover:text-white transition-colors">
                Admin
              </Link>
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
          <p className="text-gray-400">Manage your student loans and track your progress</p>
        </div>

        {/* Apply Form Toggle */}
        <div className="mb-8">
          <button onClick={() => setShowApplyForm(!showApplyForm)} className="btn-gradient">
            {showApplyForm ? '← Back to Loans' : '📝 Apply for New Loan'}
          </button>
        </div>

        {/* Apply Form or Loans List */}
        {showApplyForm ? (
          <ApplyLoanForm
            onSuccess={() => {
              setShowApplyForm(false);
              refetch();
            }}
          />
        ) : (
          <>
            {/* My Loans */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">My Loans</h3>

              {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="glass-card p-6">
                      <div className="skeleton h-8 w-32 mb-4" />
                      <div className="skeleton h-6 w-full mb-2" />
                      <div className="skeleton h-6 w-3/4" />
                    </div>
                  ))}
                </div>
              ) : !myLoanIds || myLoanIds.length === 0 ? (
                <div className="glass-card p-12 text-center">
                  <div className="text-6xl mb-4">📋</div>
                  <h4 className="text-xl font-semibold text-white mb-2">No Loans Yet</h4>
                  <p className="text-gray-400 mb-6">
                    You haven't applied for any loans yet. Click the button above to get started!
                  </p>
                  <button onClick={() => setShowApplyForm(true)} className="btn-gradient">
                    Apply for Your First Loan
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myLoanIds.map((loanId) => (
                    <LoanCardWrapper key={loanId.toString()} loanId={loanId} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>


    </div>
  );
}

// Wrapper to load loan details and manage payment modal
function LoanCardWrapper({ loanId }: { loanId: bigint }) {
  const { data: loan, isLoading, refetch } = useLoanDetails(loanId);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  if (isLoading || !loan) {
    return (
      <div className="glass-card p-6">
        <div className="skeleton h-8 w-32 mb-4" />
        <div className="skeleton h-6 w-full mb-2" />
        <div className="skeleton h-6 w-3/4" />
      </div>
    );
  }

  return (
    <>
      <LoanCard loan={loan} onPaymentClick={() => setShowPaymentModal(true)} isOwner={true} />

      {/* Each loan has its own payment modal */}
      {showPaymentModal && (
        <MakePaymentModal
          loanId={loanId}
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            refetch(); // Refetch THIS loan's details
          }}
        />
      )}
    </>
  );
}
