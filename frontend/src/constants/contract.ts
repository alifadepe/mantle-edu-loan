// Contract ABI for EduLoan
export const EDULOAN_ABI = [
  // Read Functions
  {
    inputs: [{ internalType: 'uint256', name: '_loanId', type: 'uint256' }],
    name: 'getLoanDetails',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'loanId', type: 'uint256' },
          { internalType: 'address', name: 'borrower', type: 'address' },
          { internalType: 'uint256', name: 'totalAmount', type: 'uint256' },
          { internalType: 'uint256', name: 'amountRepaid', type: 'uint256' },
          { internalType: 'uint256', name: 'applicationTime', type: 'uint256' },
          { internalType: 'uint256', name: 'approvalTime', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'enum EduLoan.LoanStatus', name: 'status', type: 'uint8' },
          { internalType: 'string', name: 'purpose', type: 'string' },
        ],
        internalType: 'struct EduLoan.Loan',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getMyLoans',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_loanId', type: 'uint256' }],
    name: 'getRemainingAmount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getContractBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTotalLoans',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MIN_LOAN',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_LOAN',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'LOAN_DURATION',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Write Functions
  {
    inputs: [
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
      { internalType: 'string', name: '_purpose', type: 'string' },
    ],
    name: 'applyLoan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_loanId', type: 'uint256' }],
    name: 'approveLoan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_loanId', type: 'uint256' },
      { internalType: 'string', name: '_reason', type: 'string' },
    ],
    name: 'rejectLoan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_loanId', type: 'uint256' }],
    name: 'disburseLoan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_loanId', type: 'uint256' }],
    name: 'makePayment',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_loanId', type: 'uint256' }],
    name: 'checkDefault',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'depositFunds',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
    name: 'withdrawFunds',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'loanId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'borrower', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'purpose', type: 'string' },
    ],
    name: 'LoanApplied',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'loanId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'borrower', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'totalAmount', type: 'uint256' },
    ],
    name: 'LoanApproved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'loanId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'borrower', type: 'address' },
      { indexed: false, internalType: 'string', name: 'reason', type: 'string' },
    ],
    name: 'LoanRejected',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'loanId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'borrower', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'LoanDisbursed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'loanId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'borrower', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'remaining', type: 'uint256' },
    ],
    name: 'PaymentMade',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'loanId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'borrower', type: 'address' },
    ],
    name: 'LoanRepaid',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'loanId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'borrower', type: 'address' },
    ],
    name: 'LoanDefaulted',
    type: 'event',
  },
] as const;

// Contract Address
export const EDULOAN_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_EDULOAN_CONTRACT_ADDRESS as `0x${string}`;

// Loan Status Enum (matches Solidity)
export enum LoanStatus {
  Pending = 0,
  Approved = 1,
  Active = 2,
  Repaid = 3,
  Defaulted = 4,
  Rejected = 5,
}

// Loan Type
export interface Loan {
  loanId: bigint;
  borrower: `0x${string}`;
  totalAmount: bigint;
  amountRepaid: bigint;
  applicationTime: bigint;
  approvalTime: bigint;
  deadline: bigint;
  status: LoanStatus;
  purpose: string;
}
