// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title EduLoan - Decentralized Student Loan System
/// @notice Decentralized educational loan system on Mantle Network
/// @dev Challenge Final Mantle Co-Learning Camp

contract EduLoan is Ownable, ReentrancyGuard {
    // ============================================
    // CUSTOM ERRORS
    // ============================================

    error NotAdmin();
    error NotBorrower();
    error LoanNotFound();
    error InvalidStatus();
    error InvalidAmount();
    error InsufficientBalance();
    error TransferFailed();

    // ============================================
    // ENUMS & STRUCTS
    // ============================================

    enum LoanStatus {
        Pending,
        Approved,
        Active,
        Repaid,
        Defaulted,
        Rejected
    }

    struct Loan {
        uint256 loanId;
        address borrower;
        uint256 totalAmount;
        uint256 amountRepaid;
        uint256 applicationTime;
        uint256 approvalTime;
        uint256 deadline;
        LoanStatus status;
        string purpose;
    }

    // ============================================
    // STATE VARIABLES
    // ============================================

    uint256 public loanCounter;
    uint256 public constant LOAN_DURATION = 365 days;
    uint256 public constant MIN_LOAN = 0.01 ether;
    uint256 public constant MAX_LOAN = 10 ether;

    mapping(uint256 => Loan) public loans;
    mapping(address => uint256[]) public borrowerLoans;

    // ============================================
    // EVENTS
    // ============================================

    event LoanApplied(uint256 indexed loanId, address indexed borrower, uint256 amount, string purpose);
    event LoanApproved(uint256 indexed loanId, address indexed borrower, uint256 totalAmount);
    event LoanRejected(uint256 indexed loanId, address indexed borrower, string reason);
    event LoanDisbursed(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event PaymentMade(uint256 indexed loanId, address indexed borrower, uint256 amount, uint256 remaining);
    event LoanRepaid(uint256 indexed loanId, address indexed borrower);
    event LoanDefaulted(uint256 indexed loanId, address indexed borrower);
    event FundsDeposited(address indexed admin, uint256 amount);
    event FundsWithdrawn(address indexed admin, uint256 amount);

    // ============================================
    // MODIFIERS
    // ============================================

    modifier onlyBorrower(uint256 _loanId) {
        _onlyBorrower(_loanId);
        _;
    }

    function _onlyBorrower(uint256 _loanId) internal view {
        if (msg.sender != loans[_loanId].borrower) revert NotBorrower();
    }

    modifier loanExists(uint256 _loanId) {
        _loanExists(_loanId);
        _;
    }

    function _loanExists(uint256 _loanId) internal view {
        if (_loanId == 0 || _loanId > loanCounter) revert LoanNotFound();
    }

    modifier inStatus(uint256 _loanId, LoanStatus _status) {
        _inStatus(_loanId, _status);
        _;
    }

    function _inStatus(uint256 _loanId, LoanStatus _status) internal view {
        if (loans[_loanId].status != _status) revert InvalidStatus();
    }

    // ============================================
    // CONSTRUCTOR
    // ============================================

    constructor() Ownable(msg.sender) {}

    // ============================================
    // MAIN FUNCTIONS
    // ============================================

    /// @notice Student applies for a loan
    /// @param _amount Amount of loan to apply for
    /// @param _purpose Purpose of the loan
    function applyLoan(uint256 _amount, string memory _purpose) public {
        // 1. Validate amount (MIN_LOAN <= amount <= MAX_LOAN)
        if (_amount < MIN_LOAN || _amount > MAX_LOAN) revert InvalidAmount();

        // 2. Increment loanCounter
        ++loanCounter;

        // 3. Create new Loan struct
        Loan memory loan = Loan({
            loanId: loanCounter,
            borrower: msg.sender,
            totalAmount: _amount,
            amountRepaid: 0,
            applicationTime: block.timestamp,
            approvalTime: 0,
            deadline: 0,
            status: LoanStatus.Pending,
            purpose: _purpose
        });

        // 4. Save to mapping
        loans[loanCounter] = loan;

        // 5. Add loanId to borrowerLoans
        borrowerLoans[msg.sender].push(loanCounter);

        // 6. Emit event
        emit LoanApplied(loanCounter, msg.sender, _amount, _purpose);
    }

    /// @notice Admin approves loan
    /// @param _loanId Loan ID to approve
    function approveLoan(uint256 _loanId) public onlyOwner loanExists(_loanId) inStatus(_loanId, LoanStatus.Pending) {
        // 1. Update status to Approved
        loans[_loanId].status = LoanStatus.Approved;
        loans[_loanId].approvalTime = block.timestamp;

        // 2. Emit event
        emit LoanApproved(_loanId, loans[_loanId].borrower, loans[_loanId].totalAmount);
    }

    /// @notice Admin rejects loan
    /// @param _loanId Loan ID to reject
    /// @param _reason Reason for rejection
    function rejectLoan(uint256 _loanId, string memory _reason)
        public
        onlyOwner
        loanExists(_loanId)
        inStatus(_loanId, LoanStatus.Pending)
    {
        // 1. Update status to Rejected
        loans[_loanId].status = LoanStatus.Rejected;

        // 2. Emit event
        emit LoanRejected(_loanId, loans[_loanId].borrower, _reason);
    }

    /// @notice Admin disburses loan funds
    /// @param _loanId Loan ID to disburse
    function disburseLoan(uint256 _loanId)
        public
        onlyOwner
        nonReentrant
        loanExists(_loanId)
        inStatus(_loanId, LoanStatus.Approved)
    {
        Loan storage loan = loans[_loanId];

        // 1. Validate contract balance is sufficient
        if (address(this).balance < loan.totalAmount) {
            revert InsufficientBalance();
        }

        // 2. Set deadline
        unchecked {
            loan.deadline = block.timestamp + LOAN_DURATION;
        }

        // 3. Update status to Active
        loan.status = LoanStatus.Active;

        // 4. Transfer funds to borrower
        (bool success,) = payable(loan.borrower).call{value: loan.totalAmount}("");
        if (!success) revert TransferFailed();

        // 5. Emit event
        emit LoanDisbursed(_loanId, loan.borrower, loan.totalAmount);
    }

    /// @notice Borrower makes payment
    /// @param _loanId Loan ID
    function makePayment(uint256 _loanId)
        public
        payable
        onlyBorrower(_loanId)
        loanExists(_loanId)
        inStatus(_loanId, LoanStatus.Active)
    {
        // 1. Validate msg.value > 0
        if (msg.value == 0) revert InvalidAmount();

        // 2. Get loan data
        Loan storage loan = loans[_loanId];

        // 3. Update amountRepaid
        unchecked {
            loan.amountRepaid += msg.value;
        }

        // 4. If fully repaid, update status to Repaid
        uint256 remaining = 0;
        if (loan.amountRepaid >= loan.totalAmount) {
            loan.status = LoanStatus.Repaid;
            emit LoanRepaid(_loanId, loan.borrower);
        } else {
            remaining = loan.totalAmount - loan.amountRepaid;
        }

        emit PaymentMade(_loanId, loan.borrower, msg.value, remaining);
    }

    /// @notice Check if loan is defaulted
    /// @param _loanId Loan ID
    function checkDefault(uint256 _loanId) external loanExists(_loanId) inStatus(_loanId, LoanStatus.Active) {
        Loan storage loan = loans[_loanId];

        // If past deadline and not fully repaid, set status to Defaulted
        if (block.timestamp > loan.deadline && loan.amountRepaid < loan.totalAmount) {
            loan.status = LoanStatus.Defaulted;
            emit LoanDefaulted(_loanId, loan.borrower);
        }
    }

    // ============================================
    // VIEW FUNCTIONS
    // ============================================

    /// @notice View loan details
    function getLoanDetails(uint256 _loanId) public view loanExists(_loanId) returns (Loan memory) {
        return loans[_loanId];
    }

    /// @notice View all loans owned by caller
    function getMyLoans() public view returns (uint256[] memory) {
        return borrowerLoans[msg.sender];
    }

    /// @notice View remaining amount to be paid
    function getRemainingAmount(uint256 _loanId) public view loanExists(_loanId) returns (uint256) {
        Loan memory loan = loans[_loanId];
        if (loan.amountRepaid >= loan.totalAmount) return 0;
        unchecked {
            return loan.totalAmount - loan.amountRepaid;
        }
    }

    /// @notice View contract balance
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getTotalLoans() public view returns (uint256) {
        return loanCounter;
    }

    // ============================================
    // ADMIN FUNCTIONS
    // ============================================

    /// @notice Admin deposits funds to contract
    function depositFunds() public payable onlyOwner {
        if (msg.value == 0) revert InvalidAmount();
        emit FundsDeposited(msg.sender, msg.value);
    }

    /// @notice Admin withdraws funds from contract
    function withdrawFunds(uint256 _amount) public onlyOwner {
        if (address(this).balance < _amount) revert InsufficientBalance();
        (bool success,) = payable(owner()).call{value: _amount}("");
        if (!success) revert TransferFailed();
        emit FundsWithdrawn(msg.sender, _amount);
    }
}
