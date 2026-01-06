import { useReadContract, useAccount } from 'wagmi';
import { EDULOAN_ABI, EDULOAN_CONTRACT_ADDRESS, type Loan } from '@/constants/contract';

/**
 * Hook to get loan details by ID
 */
export function useLoanDetails(loanId: bigint | undefined) {
  return useReadContract({
    address: EDULOAN_CONTRACT_ADDRESS,
    abi: EDULOAN_ABI,
    functionName: 'getLoanDetails',
    args: loanId ? [loanId] : undefined,
    query: {
      enabled: !!loanId && loanId > 0n,
    },
  });
}

/**
 * Hook to get current user's loan IDs
 */
export function useMyLoans() {
  const { address } = useAccount();

  return useReadContract({
    address: EDULOAN_CONTRACT_ADDRESS,
    abi: EDULOAN_ABI,
    functionName: 'getMyLoans',
    account: address,
    query: {
      enabled: !!address,
    },
  });
}

/**
 * Hook to get remaining amount for a loan
 */
export function useRemainingAmount(loanId: bigint | undefined) {
  return useReadContract({
    address: EDULOAN_CONTRACT_ADDRESS,
    abi: EDULOAN_ABI,
    functionName: 'getRemainingAmount',
    args: loanId ? [loanId] : undefined,
    query: {
      enabled: !!loanId && loanId > 0n,
    },
  });
}

/**
 * Hook to get contract balance
 */
export function useContractBalance() {
  return useReadContract({
    address: EDULOAN_CONTRACT_ADDRESS,
    abi: EDULOAN_ABI,
    functionName: 'getContractBalance',
  });
}

/**
 * Hook to get total number of loans
 */
export function useTotalLoans() {
  return useReadContract({
    address: EDULOAN_CONTRACT_ADDRESS,
    abi: EDULOAN_ABI,
    functionName: 'getTotalLoans',
  });
}

/**
 * Hook to get contract owner address
 */
export function useContractOwner() {
  return useReadContract({
    address: EDULOAN_CONTRACT_ADDRESS,
    abi: EDULOAN_ABI,
    functionName: 'owner',
  });
}

/**
 * Hook to check if current user is admin (contract owner)
 */
export function useIsAdmin() {
  const { address } = useAccount();
  const { data: owner } = useContractOwner();

  return {
    isAdmin: !!address && !!owner && address.toLowerCase() === owner.toLowerCase(),
    ownerAddress: owner,
  };
}

/**
 * Hook to get MIN_LOAN constant
 */
export function useMinLoan() {
  return useReadContract({
    address: EDULOAN_CONTRACT_ADDRESS,
    abi: EDULOAN_ABI,
    functionName: 'MIN_LOAN',
  });
}

/**
 * Hook to get MAX_LOAN constant
 */
export function useMaxLoan() {
  return useReadContract({
    address: EDULOAN_CONTRACT_ADDRESS,
    abi: EDULOAN_ABI,
    functionName: 'MAX_LOAN',
  });
}

/**
 * Hook to get LOAN_DURATION constant
 */
export function useLoanDuration() {
  return useReadContract({
    address: EDULOAN_CONTRACT_ADDRESS,
    abi: EDULOAN_ABI,
    functionName: 'LOAN_DURATION',
  });
}
