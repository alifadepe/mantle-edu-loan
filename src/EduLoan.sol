// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {
    ReentrancyGuard
} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title EduLoan - Decentralized Student Loan System
/// @author [Nama Anda]
/// @notice Sistem pinjaman pendidikan terdesentralisasi di Mantle Network
/// @dev Challenge Final Mantle Co-Learning Camp

contract EduLoan is Ownable, ReentrancyGuard {
    // ============================================
    // CUSTOM ERRORS (Gas Efficient!)
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

    event LoanApplied(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 amount,
        string purpose
    );
    event LoanApproved(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 totalAmount
    );
    event LoanRejected(
        uint256 indexed loanId,
        address indexed borrower,
        string reason
    );
    event LoanDisbursed(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 amount
    );
    event PaymentMade(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 amount,
        uint256 remaining
    );
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

    /// @notice Mahasiswa mengajukan pinjaman
    /// @param _amount Jumlah pinjaman yang diajukan
    /// @param _purpose Tujuan pinjaman
    function applyLoan(uint256 _amount, string memory _purpose) public {
        // 1. Validasi amount (MIN_LOAN <= amount <= MAX_LOAN)
        if (_amount < MIN_LOAN || _amount > MAX_LOAN) revert InvalidAmount();

        // 2. Increment loanCounter
        ++loanCounter;

        // 3. Buat Loan struct baru
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

        // 4. Simpan di mapping
        loans[loanCounter] = loan;

        // 5. Tambahkan loanId ke borrowerLoans
        borrowerLoans[msg.sender].push(loanCounter);

        // 6. Emit event
        emit LoanApplied(loanCounter, msg.sender, _amount, _purpose);
    }

    /// @notice Admin menyetujui pinjaman
    /// @param _loanId ID pinjaman yang disetujui
    function approveLoan(
        uint256 _loanId
    )
        public
        onlyOwner
        loanExists(_loanId)
        inStatus(_loanId, LoanStatus.Pending)
    {
        // 1. Update status ke Approved
        loans[_loanId].status = LoanStatus.Approved;
        loans[_loanId].approvalTime = block.timestamp;

        // 2. Emit event
        emit LoanApproved(
            _loanId,
            loans[_loanId].borrower,
            loans[_loanId].totalAmount
        );
    }

    /// @notice Admin menolak pinjaman
    /// @param _loanId ID pinjaman yang ditolak
    /// @param _reason Alasan penolakan
    function rejectLoan(
        uint256 _loanId,
        string memory _reason
    )
        public
        onlyOwner
        loanExists(_loanId)
        inStatus(_loanId, LoanStatus.Pending)
    {
        // 1. Update status ke Rejected
        loans[_loanId].status = LoanStatus.Rejected;

        // 2. Emit event
        emit LoanRejected(_loanId, loans[_loanId].borrower, _reason);
    }

    /// @notice Admin mencairkan dana pinjaman
    /// @param _loanId ID pinjaman yang dicairkan
    function disburseLoan(
        uint256 _loanId
    )
        public
        onlyOwner
        nonReentrant
        loanExists(_loanId)
        inStatus(_loanId, LoanStatus.Approved)
    {
        Loan storage loan = loans[_loanId];

        // 1. Validasi contract balance cukup
        if (address(this).balance < loan.totalAmount)
            revert InsufficientBalance();

        // 2. Set deadline
        unchecked {
            loan.deadline = block.timestamp + LOAN_DURATION;
        }

        // 3. Update status ke Active
        loan.status = LoanStatus.Active;

        // 4. Transfer dana ke borrower
        (bool success, ) = payable(loan.borrower).call{value: loan.totalAmount}(
            ""
        );
        if (!success) revert TransferFailed();

        // 5. Emit event
        emit LoanDisbursed(_loanId, loan.borrower, loan.totalAmount);
    }

    /// @notice Borrower membayar cicilan
    /// @param _loanId ID pinjaman
    function makePayment(
        uint256 _loanId
    )
        public
        payable
        onlyBorrower(_loanId)
        loanExists(_loanId)
        inStatus(_loanId, LoanStatus.Active)
    {
        // 1. Validasi msg.value > 0
        if (msg.value == 0) revert InvalidAmount();

        // 2. Ambil data loan
        Loan storage loan = loans[_loanId];

        // 3. Update amountRepaid
        unchecked {
            loan.amountRepaid += msg.value;
        }

        // 4. Jika lunas, update status ke Repaid
        uint256 remaining = 0;
        if (loan.amountRepaid >= loan.totalAmount) {
            loan.status = LoanStatus.Repaid;
            emit LoanRepaid(_loanId, loan.borrower);
        } else {
            remaining = loan.totalAmount - loan.amountRepaid;
        }

        emit PaymentMade(_loanId, loan.borrower, msg.value, remaining);
    }

    /// @notice Cek apakah pinjaman sudah default
    /// @param _loanId ID pinjaman
    function checkDefault(
        uint256 _loanId
    ) external loanExists(_loanId) inStatus(_loanId, LoanStatus.Active) {
        Loan storage loan = loans[_loanId];

        // Jika melewati deadline dan belum lunas, set status Defaulted
        if (
            block.timestamp > loan.deadline &&
            loan.amountRepaid < loan.totalAmount
        ) {
            loan.status = LoanStatus.Defaulted;
            emit LoanDefaulted(_loanId, loan.borrower);
        }
    }

    // ============================================
    // VIEW FUNCTIONS
    // ============================================

    /// @notice Lihat detail pinjaman
    function getLoanDetails(
        uint256 _loanId
    ) public view loanExists(_loanId) returns (Loan memory) {
        return loans[_loanId];
    }

    /// @notice Lihat semua pinjaman milik caller
    function getMyLoans() public view returns (uint256[] memory) {
        return borrowerLoans[msg.sender];
    }

    /// @notice Lihat sisa yang harus dibayar
    function getRemainingAmount(
        uint256 _loanId
    ) public view loanExists(_loanId) returns (uint256) {
        Loan memory loan = loans[_loanId];
        if (loan.amountRepaid >= loan.totalAmount) return 0;
        unchecked {
            return loan.totalAmount - loan.amountRepaid;
        }
    }

    /// @notice Lihat saldo contract
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getTotalLoans() public view returns (uint256) {
        return loanCounter;
    }

    // ============================================
    // ADMIN FUNCTIONS
    // ============================================

    /// @notice Admin deposit dana ke contract
    function depositFunds() public payable onlyOwner {
        if (msg.value == 0) revert InvalidAmount();
        emit FundsDeposited(msg.sender, msg.value);
    }

    /// @notice Admin withdraw dana dari contract
    function withdrawFunds(uint256 _amount) public onlyOwner {
        if (address(this).balance < _amount) revert InsufficientBalance();
        (bool success, ) = payable(owner()).call{value: _amount}("");
        if (!success) revert TransferFailed();
        emit FundsWithdrawn(msg.sender, _amount);
    }
}
