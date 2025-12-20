// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test} from "forge-std/Test.sol";
import {EduLoan} from "../src/EduLoan.sol";
import {RejectReceiver} from "./RejectReceiver.sol";

contract EduLoanTest is Test {
    EduLoan public eduLoan;

    address public admin;
    address public alice;
    address public bob;

    uint256 public constant LOAN_AMOUNT = 1 ether;
    string public constant LOAN_PURPOSE = "SPP Semester 5";

    // ============================================
    // SETUP
    // ============================================

    function setUp() public {
        admin = address(this);
        alice = makeAddr("alice");
        bob = makeAddr("bob");

        eduLoan = new EduLoan();

        vm.deal(alice, 100 ether);
        vm.deal(bob, 100 ether);
        vm.deal(admin, 100 ether);
    }

    receive() external payable {}

    // ============================================
    // HELPER FUNCTIONS
    // ============================================

    function _setupActiveLoan() internal {
        eduLoan.depositFunds{value: 10 ether}();
        vm.prank(alice);
        eduLoan.applyLoan(LOAN_AMOUNT, LOAN_PURPOSE);
        eduLoan.approveLoan(1);
        eduLoan.disburseLoan(1);
    }

    // ============================================
    // CONSTRUCTOR TESTS
    // ============================================

    function test_ConstructorSetsAdmin() public view {
        assertEq(eduLoan.owner(), admin);
    }

    function test_InitialLoanCounterIsZero() public view {
        assertEq(eduLoan.getTotalLoans(), 0);
    }

    // ============================================
    // DEPOSIT FUNDS TESTS
    // ============================================

    function test_DepositFunds() public {
        eduLoan.depositFunds{value: 10 ether}();
        assertEq(eduLoan.getContractBalance(), 10 ether);
    }

    function test_DepositFundsEmitsEvent() public {
        vm.expectEmit(true, false, false, true);
        emit EduLoan.FundsDeposited(admin, 10 ether);
        eduLoan.depositFunds{value: 10 ether}();
    }

    function test_RevertWhen_DepositZero() public {
        vm.expectRevert(EduLoan.InvalidAmount.selector);
        eduLoan.depositFunds{value: 0}();
    }

    function test_RevertWhen_NonAdminDeposits() public {
        vm.prank(alice);
        vm.expectRevert();
        eduLoan.depositFunds{value: 1 ether}();
    }

    // ============================================
    // WITHDRAW FUNDS TESTS
    // ============================================

    function test_WithdrawFunds() public {
        eduLoan.depositFunds{value: 10 ether}();
        uint256 balanceBefore = admin.balance;

        eduLoan.withdrawFunds(5 ether);

        assertEq(eduLoan.getContractBalance(), 5 ether);
        assertEq(admin.balance, balanceBefore + 5 ether);
    }

    function test_RevertWhen_WithdrawInsufficientBalance() public {
        eduLoan.depositFunds{value: 1 ether}();
        vm.expectRevert(EduLoan.InsufficientBalance.selector);
        eduLoan.withdrawFunds(10 ether);
    }

    // ============================================
    // APPLY LOAN TESTS
    // ============================================

    function test_ApplyLoan() public {
        vm.prank(alice);
        eduLoan.applyLoan(LOAN_AMOUNT, LOAN_PURPOSE);

        assertEq(eduLoan.getTotalLoans(), 1);

        vm.prank(alice);
        assertEq(eduLoan.getMyLoans().length, 1);

        EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);
        assertEq(loan.borrower, alice);
        assertEq(loan.totalAmount, LOAN_AMOUNT);
        assertEq(uint256(loan.status), uint256(EduLoan.LoanStatus.Pending));
    }

    function test_ApplyLoanEmitsEvent() public {
        vm.expectEmit(true, true, false, true);
        emit EduLoan.LoanApplied(1, alice, LOAN_AMOUNT, LOAN_PURPOSE);

        vm.prank(alice);
        eduLoan.applyLoan(LOAN_AMOUNT, LOAN_PURPOSE);
    }

    function test_RevertWhen_LoanTooSmall() public {
        vm.prank(alice);
        vm.expectRevert(EduLoan.InvalidAmount.selector);
        eduLoan.applyLoan(0.001 ether, LOAN_PURPOSE);
    }

    function test_RevertWhen_LoanTooBig() public {
        vm.prank(alice);
        vm.expectRevert(EduLoan.InvalidAmount.selector);
        eduLoan.applyLoan(11 ether, LOAN_PURPOSE);
    }

    // ============================================
    // APPROVE LOAN TESTS
    // ============================================

    function test_ApproveLoan() public {
        vm.prank(alice);
        eduLoan.applyLoan(LOAN_AMOUNT, LOAN_PURPOSE);

        eduLoan.approveLoan(1);

        EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);
        assertEq(uint256(loan.status), uint256(EduLoan.LoanStatus.Approved));
    }

    function test_RevertWhen_NonAdminApproves() public {
        vm.prank(alice);
        eduLoan.applyLoan(LOAN_AMOUNT, LOAN_PURPOSE);

        vm.prank(bob);
        vm.expectRevert();
        eduLoan.approveLoan(1);
    }

    function test_RevertWhen_LoanNotFound() public {
        vm.expectRevert(EduLoan.LoanNotFound.selector);
        eduLoan.approveLoan(1);
    }

    // ============================================
    // REJECT LOAN TESTS
    // ============================================

    function test_RejectLoan() public {
        vm.prank(alice);
        eduLoan.applyLoan(LOAN_AMOUNT, LOAN_PURPOSE);

        eduLoan.rejectLoan(1, "Dokumen tidak lengkap");

        EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);
        assertEq(uint256(loan.status), uint256(EduLoan.LoanStatus.Rejected));
    }

    // ============================================
    // DISBURSE LOAN TESTS
    // ============================================

    function test_DisburseLoan() public {
        eduLoan.depositFunds{value: 10 ether}();

        vm.prank(alice);
        eduLoan.applyLoan(LOAN_AMOUNT, LOAN_PURPOSE);
        eduLoan.approveLoan(1);

        uint256 aliceBalanceBefore = alice.balance;
        eduLoan.disburseLoan(1);

        assertEq(alice.balance, aliceBalanceBefore + LOAN_AMOUNT);

        EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);
        assertEq(uint256(loan.status), uint256(EduLoan.LoanStatus.Active));
    }

    function test_RevertWhen_DisburseInsufficientFunds() public {
        vm.prank(alice);
        eduLoan.applyLoan(LOAN_AMOUNT, LOAN_PURPOSE);
        eduLoan.approveLoan(1);

        vm.expectRevert(EduLoan.InsufficientBalance.selector);
        eduLoan.disburseLoan(1);
    }

    // ============================================
    // MAKE PAYMENT TESTS
    // ============================================

    function test_MakePayment() public {
        _setupActiveLoan();

        vm.prank(alice);
        eduLoan.makePayment{value: 0.5 ether}(1);

        EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);
        assertEq(loan.amountRepaid, 0.5 ether);
    }

    function test_MakePaymentFullRepayment() public {
        _setupActiveLoan();

        EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);

        vm.prank(alice);
        eduLoan.makePayment{value: loan.totalAmount}(1);

        EduLoan.Loan memory loanAfter = eduLoan.getLoanDetails(1);
        assertEq(uint256(loanAfter.status), uint256(EduLoan.LoanStatus.Repaid));
    }

    function test_RevertWhen_NonBorrowerPays() public {
        _setupActiveLoan();

        vm.prank(bob);
        vm.expectRevert(EduLoan.NotBorrower.selector);
        eduLoan.makePayment{value: 0.5 ether}(1);
    }

    // ============================================
    // CHECK DEFAULT TESTS
    // ============================================

    function test_CheckDefault() public {
        _setupActiveLoan();

        vm.warp(block.timestamp + 365 days + 1);

        eduLoan.checkDefault(1);

        EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);
        assertEq(uint256(loan.status), uint256(EduLoan.LoanStatus.Defaulted));
    }

    function test_NotDefaultBeforeDeadline() public {
        _setupActiveLoan();

        vm.warp(block.timestamp + 100 days);
        eduLoan.checkDefault(1);

        EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);
        assertEq(uint256(loan.status), uint256(EduLoan.LoanStatus.Active));
    }

    // ============================================
    // FUZZ TESTS
    // ============================================

    function testFuzz_ApplyLoan(uint256 amount) public {
        amount = bound(amount, 0.01 ether, 10 ether);

        vm.prank(alice);
        eduLoan.applyLoan(amount, "Test");

        EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);
        assertEq(loan.totalAmount, amount);
    }

    function testFuzz_MakePayment(uint256 paymentAmount) public {
        _setupActiveLoan();

        EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);
        paymentAmount = bound(paymentAmount, 1, loan.totalAmount);

        vm.prank(alice);
        eduLoan.makePayment{value: paymentAmount}(1);

        EduLoan.Loan memory loanAfter = eduLoan.getLoanDetails(1);
        assertEq(loanAfter.amountRepaid, paymentAmount);
    }

    // ============================================
    // VIEW FUNCTIONS TESTS
    // ============================================

    function test_GetRemainingAmount() public {
        _setupActiveLoan();

        EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);
        assertEq(eduLoan.getRemainingAmount(1), loan.totalAmount);

        vm.prank(alice);
        eduLoan.makePayment{value: 0.5 ether}(1);

        assertEq(eduLoan.getRemainingAmount(1), loan.totalAmount - 0.5 ether);
    }

    function test_GetRemainingAmount_FullyRepaid() public {
        _setupActiveLoan();

        EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);

        vm.prank(alice);
        eduLoan.makePayment{value: loan.totalAmount}(1);

        assertEq(eduLoan.getRemainingAmount(1), 0);
    }

    // ==========================================
    // COVERAGE HELPERS: Transfer Failures
    // ==========================================

    function test_RevertWhen_DisburseTransferFails() public {
        // 1. Create a borrower that cannot receive ETH
        RejectReceiver rejector = new RejectReceiver();
        address borrower = address(rejector);

        // 2. Setup Loan
        vm.deal(borrower, 1 ether);
        vm.prank(borrower);
        eduLoan.applyLoan(LOAN_AMOUNT, LOAN_PURPOSE);

        // Approve
        eduLoan.approveLoan(1);

        // 3. Admin tries to disburse
        eduLoan.depositFunds{value: 5 ether}(); // Ensure contract has funds

        // Expect revert due to transfer failure
        vm.expectRevert(EduLoan.TransferFailed.selector);
        eduLoan.disburseLoan(1);
    }

    function test_RevertWhen_WithdrawTransferFails() public {
        // 1. Setup contract with funds
        eduLoan.depositFunds{value: 5 ether}();

        // 2. Transfer ownership to a contract that rejects ETH
        RejectReceiver rejector = new RejectReceiver();
        eduLoan.transferOwnership(address(rejector));

        // 3. Prank as the new owner (rejector) and try to withdraw
        vm.prank(address(rejector));
        vm.expectRevert(EduLoan.TransferFailed.selector);
        eduLoan.withdrawFunds(1 ether);
    }

    // ==========================================
    // COVERAGE HELPERS: Other Failures
    // ==========================================

    function test_RevertWhen_PaymentZero() public {
        _setupActiveLoan();
        vm.prank(alice);
        vm.expectRevert(EduLoan.InvalidAmount.selector);
        eduLoan.makePayment{value: 0}(1);
    }

    function test_RevertWhen_ApproveWrongStatus() public {
        vm.prank(alice);
        eduLoan.applyLoan(LOAN_AMOUNT, LOAN_PURPOSE);

        // First approval success
        eduLoan.approveLoan(1);

        // Second approval should fail (Status is already Approved, not Pending)
        vm.expectRevert(EduLoan.InvalidStatus.selector);
        eduLoan.approveLoan(1);
    }

    function test_RevertWhen_DisburseWrongStatus() public {
        vm.prank(alice);
        eduLoan.applyLoan(LOAN_AMOUNT, LOAN_PURPOSE);
        // Status Pending

        // Try to disburse without approval
        vm.expectRevert(EduLoan.InvalidStatus.selector);
        eduLoan.disburseLoan(1);
    }

    function test_RevertWhen_MakePaymentWrongStatus() public {
        vm.prank(alice);
        eduLoan.applyLoan(LOAN_AMOUNT, LOAN_PURPOSE);
        eduLoan.approveLoan(1);
        // Status Approved (not Active yet)

        vm.prank(alice);
        vm.expectRevert(EduLoan.InvalidStatus.selector);
        eduLoan.makePayment{value: 1 ether}(1);
    }
}
