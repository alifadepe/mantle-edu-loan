# EduLoan Smart Contract

> Decentralized educational loan system on Mantle Network

This directory contains the Solidity smart contracts, tests, and deployment scripts for the EduLoan platform.

## 📋 Table of Contents

- [Installation](#-installation)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contract Details](#-contract-details)
- [Security](#-security)

## 📦 Installation

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation) installed
- Git for cloning dependencies

### Setup

```bash
# Install dependencies
forge install

# Build contracts
forge build
```

## 🧪 Testing

We have achieved **100% Test Coverage** ensuring reliability and security.

### Run Tests

```bash
# Run all tests
forge test

# Run tests with verbosity
forge test -vvv

# Run specific test
forge test --match-test testApplyLoan

# Run tests with gas reporting
forge test --gas-report
```

### Check Coverage

```bash
# Generate coverage report
forge coverage

# Generate detailed coverage report
forge coverage --report lcov
```

### Test Files

- `test/EduLoan.t.sol` - Comprehensive test suite with 100% coverage
  - Application tests
  - Approval/rejection tests
  - Disbursement tests
  - Payment tests
  - Default checking tests
  - Edge cases and error handling

## 🚀 Deployment

### 🔐 Keystore Setup (Recommended)

For secure private key management, use Foundry's encrypted keystore instead of storing raw private keys.

#### Create a Keystore

```bash
# Import your private key into an encrypted keystore
cast wallet import YOUR_KEYSTORE_NAME --interactive
```

You'll be prompted to:
- Enter your private key (without `0x` prefix)
- Create a password to encrypt it

#### Verify Keystore

```bash
# List all keystores
cast wallet list

# Get address from keystore
cast wallet address --account YOUR_KEYSTORE_NAME
```

**Keystore Location:** `~/.foundry/keystores/YOUR_KEYSTORE_NAME`

**Benefits:**
- ✅ Encrypted with your password
- ✅ No raw private keys in files
- ✅ Industry standard practice
- ✅ Manage multiple accounts easily

### 🌐 Deploy to Mantle Sepolia

#### 1. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values
nano .env
```

**`.env` file:**
```ini
MANTLE_SEPOLIA_RPC=https://rpc.sepolia.mantle.xyz
ETHERSCAN_API_KEY=your_etherscan_key
```

> **Note**: For Mantle testnet, the Etherscan key uses Blockscout explorer API

#### 2. Deploy Contract

```bash
# Deploy to Mantle Sepolia
forge script script/DeployEduLoan.s.sol:DeployEduLoan \
    --rpc-url mantle_sepolia \
    --account YOUR_KEYSTORE_NAME \
    --broadcast \
    --verify
```

**Flags:**
- `--rpc-url mantle_sepolia` - Use RPC endpoint from foundry.toml
- `--account YOUR_KEYSTORE_NAME` - Use encrypted keystore
- `--broadcast` - Broadcast transaction to network
- `--verify` - Verify contract on block explorer

#### 3. Verify Deployment

After deployment, you'll see:
```
EduLoan deployed to: 0x...
Owner: 0x...
```

## 📜 Contract Details

### `EduLoan.sol`

Main contract implementing the educational loan system.

#### Key Parameters

```solidity
uint256 public constant LOAN_DURATION = 365 days;  // 1 year
uint256 public constant MIN_LOAN = 0.01 ether;     // Minimum loan
uint256 public constant MAX_LOAN = 10 ether;       // Maximum loan
```

#### Roles

**Owner (Admin)**
- Approve/reject loan applications
- Disburse approved loans
- Deposit funds to contract
- Withdraw excess funds
- Check for defaulted loans

**Borrower (Student)**
- Apply for loans
- Make repayments
- View loan details

#### Loan States

```
┌─────────┐
│ Pending │ ──┐
└─────────┘   │
              ├──► Rejected
              │
              ▼
         ┌──────────┐
         │ Approved │
         └──────────┘
              │
              ▼
         ┌────────┐
         │ Active │──┐
         └────────┘  │
              │      │
              │      ├──► Defaulted (if overdue)
              │      │
              ▼      ▼
         ┌────────┐
         │ Repaid │
         └────────┘
```

## 🔒 Security

### Security Features

- ✅ **ReentrancyGuard** - Protection against reentrancy attacks
- ✅ **Ownable** - Access control for admin functions
- ✅ **Custom Errors** - Gas-efficient error handling
- ✅ **Input Validation** - All inputs validated
- ✅ **Safe Math** - Using Solidity ^0.8.30 built-in overflow checks

## 📊 Gas Optimization

- Uses `custom errors` instead of require strings
- `unchecked` blocks where overflow is impossible
- Efficient storage patterns
- Minimal SLOAD operations

## 🤝 Contributing

When contributing to the smart contracts:

1. Write comprehensive tests for new features
2. Maintain 100% code coverage
3. Follow Solidity style guide
4. Add NatSpec comments
5. Run `forge fmt` before committing
6. Ensure all tests pass

## 📄 License

[MIT](../LICENSE)

---

For general project information, see the [root README](../README.md).
