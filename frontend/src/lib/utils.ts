import { formatEther, parseEther } from 'viem';
import { LoanStatus } from '@/constants/contract';

/**
 * Format Wei to ETH with specified decimals
 */
export function formatWeiToEth(wei: bigint, decimals: number = 4): string {
  const eth = formatEther(wei);
  const num = parseFloat(eth);
  return num.toFixed(decimals);
}

/**
 * Format ETH to Wei
 */
export function formatEthToWei(eth: string): bigint {
  return parseEther(eth);
}

/**
 * Format timestamp to readable date
 */
export function formatTimestamp(timestamp: bigint): string {
  if (timestamp === 0n) return 'N/A';
  return new Date(Number(timestamp) * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format timestamp to relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(timestamp: bigint): string {
  if (timestamp === 0n) return 'N/A';

  const now = Date.now();
  const date = Number(timestamp) * 1000;
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * Calculate time remaining until deadline
 */
export function getTimeRemaining(deadline: bigint): string {
  if (deadline === 0n) return 'N/A';

  const now = Math.floor(Date.now() / 1000);
  const deadlineSeconds = Number(deadline);

  if (deadlineSeconds <= now) return 'Overdue';

  const diffSeconds = deadlineSeconds - now;
  const days = Math.floor(diffSeconds / (60 * 60 * 24));

  if (days > 30) return `${Math.floor(days / 30)} months`;
  if (days > 0) return `${days} days`;

  const hours = Math.floor(diffSeconds / (60 * 60));
  return `${hours} hours`;
}

/**
 * Truncate address for display
 */
export function truncateAddress(
  address: string,
  startChars: number = 6,
  endChars: number = 4
): string {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Get loan status label
 */
export function getLoanStatusLabel(status: LoanStatus): string {
  switch (status) {
    case LoanStatus.Pending:
      return 'Pending';
    case LoanStatus.Approved:
      return 'Approved';
    case LoanStatus.Active:
      return 'Active';
    case LoanStatus.Repaid:
      return 'Repaid';
    case LoanStatus.Defaulted:
      return 'Defaulted';
    case LoanStatus.Rejected:
      return 'Rejected';
    default:
      return 'Unknown';
  }
}

/**
 * Get loan status color class
 */
export function getLoanStatusColor(status: LoanStatus): string {
  switch (status) {
    case LoanStatus.Pending:
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case LoanStatus.Approved:
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case LoanStatus.Active:
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case LoanStatus.Repaid:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    case LoanStatus.Defaulted:
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case LoanStatus.Rejected:
      return 'bg-red-700/20 text-red-300 border-red-700/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}

/**
 * Calculate repayment progress percentage
 */
export function calculateProgress(amountRepaid: bigint, totalAmount: bigint): number {
  if (totalAmount === 0n) return 0;
  const progress = (Number(amountRepaid) / Number(totalAmount)) * 100;
  return Math.min(Math.round(progress), 100);
}

/**
 * Format large numbers with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}
