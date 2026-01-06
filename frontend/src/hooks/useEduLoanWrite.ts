import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { EDULOAN_ABI, EDULOAN_CONTRACT_ADDRESS } from '@/constants/contract';
import { parseEther } from 'viem';

/**
 * Hook to apply for a loan
 */
export function useApplyLoan() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const applyLoan = (amount: string, purpose: string) => {
    writeContract({
      address: EDULOAN_CONTRACT_ADDRESS,
      abi: EDULOAN_ABI,
      functionName: 'applyLoan',
      args: [parseEther(amount), purpose],
    });
  };

  return {
    applyLoan,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to make a loan payment
 */
export function useMakePayment() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const makePayment = (loanId: bigint, amount: string) => {
    writeContract({
      address: EDULOAN_CONTRACT_ADDRESS,
      abi: EDULOAN_ABI,
      functionName: 'makePayment',
      args: [loanId],
      value: parseEther(amount),
    });
  };

  return {
    makePayment,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to approve a loan (admin only)
 */
export function useApproveLoan() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const approveLoan = (loanId: bigint) => {
    writeContract({
      address: EDULOAN_CONTRACT_ADDRESS,
      abi: EDULOAN_ABI,
      functionName: 'approveLoan',
      args: [loanId],
    });
  };

  return {
    approveLoan,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to reject a loan (admin only)
 */
export function useRejectLoan() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const rejectLoan = (loanId: bigint, reason: string) => {
    writeContract({
      address: EDULOAN_CONTRACT_ADDRESS,
      abi: EDULOAN_ABI,
      functionName: 'rejectLoan',
      args: [loanId, reason],
    });
  };

  return {
    rejectLoan,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to disburse a loan (admin only)
 */
export function useDisburseLoan() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const disburseLoan = (loanId: bigint) => {
    writeContract({
      address: EDULOAN_CONTRACT_ADDRESS,
      abi: EDULOAN_ABI,
      functionName: 'disburseLoan',
      args: [loanId],
    });
  };

  return {
    disburseLoan,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to check if a loan is defaulted
 */
export function useCheckDefault() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const checkDefault = (loanId: bigint) => {
    writeContract({
      address: EDULOAN_CONTRACT_ADDRESS,
      abi: EDULOAN_ABI,
      functionName: 'checkDefault',
      args: [loanId],
    });
  };

  return {
    checkDefault,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to deposit funds (admin only)
 */
export function useDepositFunds() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const depositFunds = (amount: string) => {
    writeContract({
      address: EDULOAN_CONTRACT_ADDRESS,
      abi: EDULOAN_ABI,
      functionName: 'depositFunds',
      value: parseEther(amount),
    });
  };

  return {
    depositFunds,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to withdraw funds (admin only)
 */
export function useWithdrawFunds() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const withdrawFunds = (amount: string) => {
    writeContract({
      address: EDULOAN_CONTRACT_ADDRESS,
      abi: EDULOAN_ABI,
      functionName: 'withdrawFunds',
      args: [parseEther(amount)],
    });
  };

  return {
    withdrawFunds,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
