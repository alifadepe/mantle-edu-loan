# EduLoan - Decentralized Student Loan System 🎓

EduLoan is a smart contract-based student loan platform built on the **Mantle Network**. It provides a transparent, secure, and decentralized way for students to apply for loans and for administrators to manage them.

## 🌟 Features

*   **Loan Application**: Students can apply for loans with a specific amount and purpose.
*   **Approval System**: Administrators can review, approve, or reject loan applications.
*   **Repayment**: Flexible repayment mechanism with tracking.
*   **Default Management**: Automatic status updates for overdue loans.
*   **Gas Efficient**: Optimized with **Custom Errors** and standard Solidity patterns.
*   **Secure**: Protected against reentrancy attacks and unauthorized access (Ownable).

## 🛠️ Tech Stack

*   **Solidity** (^0.8.30)
*   **Foundry**
*   **Mantle Network** (Layer 2)
*   **OpenZeppelin Contracts**

## 📁 Project Structure

```
mantle-edu-loan/
├── contract/          # Smart contract code
│   ├── src/           # Contract source files
│   ├── test/          # Test files
│   ├── script/        # Deployment scripts
│   ├── lib/           # Dependencies
│   └── README.md      # Contract documentation
├── frontend/          # Next.js frontend application
│   ├── src/           # Frontend source code
│   ├── public/        # Static assets
│   └── package.json   # Frontend dependencies
└── README.md          # This file
```

## Documentation

For detailed smart contract documentation, deployment guides, and technical specifications, see:

**[📖 Smart Contract Documentation →](./contract/README.md)**

## 📜 Contract Architecture

### Main Contract: `EduLoan.sol`

**Roles:**
- `Owner` (Admin) - Can approve/reject loans, disburse funds, manage contract
- `Borrower` (Student) - Can apply for loans, make payments

**Loan States:**
```
Pending -> Approved -> Active -> Repaid OR Defaulted (if overdue).
```

**Key Features:**
- Loan amount limits: 0.01 - 10 ETH
- Loan duration: 365 days
- Custom error handling for gas efficiency
- Reentrancy protection
- **100% test coverage** - Comprehensive test suite ensuring reliability and security

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

[MIT](https://choosealicense.com/licenses/mit/)

---

Built with ❤️ for the Mantle Co-Learning Camp
