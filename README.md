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

## 📦 Installation

Ensure you have [Foundry](https://book.getfoundry.sh/getting-started/installation) installed.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/alifadepe/mantle-edu-loan.git
    cd mantle-edu-loan
    ```

2.  **Install dependencies:**
    ```bash
    forge install
    ```

3.  **Build the project:**
    ```bash
    forge build
    ```

## 🧪 Testing

We have achieved **100% Test Coverage** ensuring reliability and security.

### Run Tests
```bash
forge test
```

### Check Coverage
```bash
forge coverage
```

## 🚀 Deployment (Mantle Sepolia)

### Prerequisites
1.  Set up your `.env` file (see `.env.example`):
    ```ini
    PRIVATE_KEY=your_private_key_here
    MANTLE_SEPOLIA_RPC=https://rpc.sepolia.mantle.xyz
    ETHERSCAN_API_KEY=your_etherscan_key
    ```
    *(Note: For Mantle testnet, Etherscan key might use the Blockscout explorer API)*

### Deploy Command

Use the provided script to deploy to Mantle Sepolia:

```bash
forge script script/DeployEduLoan.s.sol:DeployEduLoan \
    --rpc-url mantle_sepolia \
    --broadcast \
    --verify
```

*Note: Ensure `mantle_sepolia` is defined in your `foundry.toml` under `[rpc_endpoints]`.*

## 📜 Contract Architecture

### `EduLoan.sol`
*   **Roles**: `Owner` (Admin) and `Borrower`.
*   **States**: `Pending` -> `Approved` -> `Active` -> `Repaid` OR `Defaulted` (if overdue).
*   **Modifiers**: `onlyBorrower`, `loanExists`, `inStatus`, `nonReentrant`.

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

[MIT](https://choosealicense.com/licenses/mit/)
