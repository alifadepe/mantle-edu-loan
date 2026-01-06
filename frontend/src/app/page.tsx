'use client';

import { ConnectButton } from '@/components/ConnectButton';
import { LoanStats } from '@/components/LoanStats';
import { useAccount } from 'wagmi';
import Link from 'next/link';

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🎓</div>
              <h1 className="text-2xl font-bold gradient-text">EduLoan</h1>
            </div>
            <div className="flex items-center gap-4">
              {isConnected && (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link href="/admin" className="text-gray-300 hover:text-white transition-colors">
                    Admin
                  </Link>
                </>
              )}
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16 slide-up">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Decentralized Student Loans on <span className="gradient-text">Mantle Network</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Access educational funding through blockchain technology. Transparent, secure, and
            accessible student loans without traditional banking barriers.
          </p>

          {!isConnected ? (
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          ) : (
            <div className="flex justify-center gap-4">
              <Link href="/dashboard" className="btn-gradient">
                Go to Dashboard
              </Link>
              <Link href="/admin" className="btn-outline">
                Admin Panel
              </Link>
            </div>
          )}
        </div>

        {/* Stats */}
        {isConnected && (
          <div className="mb-16">
            <LoanStats />
          </div>
        )}

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="glass-card p-6 text-center fade-in">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-white mb-2">Secure & Transparent</h3>
            <p className="text-gray-400">
              All transactions recorded on the blockchain for complete transparency and security
            </p>
          </div>

          <div className="glass-card p-6 text-center fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-white mb-2">Fast Processing</h3>
            <p className="text-gray-400">
              Quick loan approvals and instant disbursements powered by smart contracts
            </p>
          </div>

          <div className="glass-card p-6 text-center fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold text-white mb-2">Flexible Repayment</h3>
            <p className="text-gray-400">
              Make payments at your own pace with transparent tracking of your loan status
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="glass-card p-8 md:p-12">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">How It Works</h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                  1
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Connect Your Wallet</h4>
                  <p className="text-gray-400 text-sm">
                    Connect your Web3 wallet to get started on Mantle Sepolia testnet
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                  2
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Apply for a Loan</h4>
                  <p className="text-gray-400 text-sm">
                    Submit your loan application with amount and purpose
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                  3
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Wait for Approval</h4>
                  <p className="text-gray-400 text-sm">
                    Admin reviews and approves your application
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                  4
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Receive Funds</h4>
                  <p className="text-gray-400 text-sm">
                    Once disbursed, funds are sent directly to your wallet
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                  5
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Make Payments</h4>
                  <p className="text-gray-400 text-sm">
                    Repay your loan at your own pace with flexible payment options
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                  6
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Track Progress</h4>
                  <p className="text-gray-400 text-sm">
                    Monitor your repayment progress in real-time on your dashboard
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p className="text-sm mt-2">EduLoan - Decentralized Student Loan System</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
