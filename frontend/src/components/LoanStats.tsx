'use client';

import { useTotalLoans, useContractBalance } from '@/hooks/useEduLoan';
import { formatWeiToEth } from '@/lib/utils';

export function LoanStats() {
  const { data: totalLoans, isLoading: loansLoading } = useTotalLoans();
  const { data: contractBalance, isLoading: balanceLoading } = useContractBalance();

  const stats = [
    {
      label: 'Total Loans',
      value: totalLoans ? totalLoans.toString() : '-',
      icon: '📊',
      loading: loansLoading,
    },
    {
      label: 'Contract Balance',
      value: contractBalance ? `${formatWeiToEth(contractBalance)} MNT` : '-',
      icon: '💰',
      loading: balanceLoading,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="glass-card p-6 fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              {stat.loading ? (
                <div className="skeleton h-8 w-32" />
              ) : (
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              )}
            </div>
            <div className="text-4xl">{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
