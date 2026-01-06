import { LoanStatus } from '@/constants/contract';
import { getLoanStatusLabel, getLoanStatusColor } from '@/lib/utils';

interface StatusBadgeProps {
  status: LoanStatus;
  showIcon?: boolean;
}

export function StatusBadge({ status, showIcon = true }: StatusBadgeProps) {
  const label = getLoanStatusLabel(status);
  const colorClass = getLoanStatusColor(status);

  const getIcon = () => {
    switch (status) {
      case LoanStatus.Pending:
        return '⏳';
      case LoanStatus.Approved:
        return '✓';
      case LoanStatus.Active:
        return '💰';
      case LoanStatus.Repaid:
        return '✅';
      case LoanStatus.Defaulted:
        return '⚠️';
      case LoanStatus.Rejected:
        return '❌';
      default:
        return '❓';
    }
  };

  return (
    <span className={`badge ${colorClass}`}>
      {showIcon && <span>{getIcon()}</span>}
      {label}
    </span>
  );
}
