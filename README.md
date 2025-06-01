# TSender Fork

A modern Web3 airdrop application that allows you to send ERC20 tokens to multiple recipients in a single transaction. This is a fork of the original TSender with enhanced features and improved user experience.

![TSender Interface](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Wagmi](https://img.shields.io/badge/Wagmi-1C1B1F?style=for-the-badge)

## ✨ Features

### 🚀 Core Functionality
- **Batch Token Transfers**: Send ERC20 tokens to multiple recipients in one transaction
- **Multi-Chain Support**: Works on Ethereum, Optimism, Arbitrum, Base, zkSync, and Sepolia
- **Smart Contract Integration**: Uses efficient TSender contracts for gas-optimized airdrops
- **Automatic Approvals**: Handles token approvals automatically when needed

### 🎨 Enhanced User Experience
- **🌙 Dark/Light Mode Toggle**: Seamless theme switching with system preference detection
- **📱 Responsive Design**: Works perfectly on desktop and mobile devices
- **🔌 Modern Wallet Integration**: Uses RainbowKit with support for multiple wallet providers
- **⚡ Real-time Validation**: Instant feedback on token addresses, balances, and input validation

### 🔧 Advanced Input Handling
- **Scientific Notation Support**: Accepts inputs like `100e18` for large token amounts
- **Flexible Separators**: Supports comma, space, and newline-separated values
- **Smart Parsing**: Automatically handles mixed input formats
- **Input Persistence**: Saves form data to localStorage for better UX
- **Input Verifrification**: Real-time validation of token addresses, amounts and allowe inputs to ensure no failed transactions

### 🛡️ Safety Features
- **Balance Validation**: Ensures sufficient token balance before transactions
- **Token Verification**: Validates token contracts and fetches metadata
- **Transaction Status Tracking**: Real-time updates on transaction progress
- **Error Handling**: Comprehensive error states and user feedback

## 🌐 Supported Networks

| Network | Chain ID | TSender Contract |
|---------|----------|------------------|
| Ethereum Mainnet | 1 | `0x3aD9F29AB266E4828450B33df7a9B9D7355Cd821` |
| Optimism | 10 | `0xAaf523DF9455cC7B6ca5637D01624BC00a5e9fAa` |
| Arbitrum | 42161 | `0xA2b5aEDF7EEF6469AB9cBD99DE24a6881702Eb19` |
| Base | 8453 | `0x31801c3e09708549c1b2c9E1CFbF001399a1B9fa` |
| zkSync Era | 324 | `0x7e645Ea4386deb2E9e510D805461aA12db83fb5E` |
| Sepolia (Testnet) | 11155111 | `0xa27c5C77DA713f410F9b15d4B0c52CAe597a973a` |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- A Web3 wallet (MetaMask, WalletConnect, etc.)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/CasinoCompiler/tsender-fork
cd tsender-fork
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your WalletConnect Project ID:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_KEY=your_project_id_here
```

4. Run the development server:
```bash
npx run dev
# or
yarn dev
```

## 📖 How to Use

1. **Connect Your Wallet**: Click the "Connect Wallet" button and select your preferred wallet
2. **Enter Token Address**: Paste the ERC20 token contract address you want to airdrop
3. **Add Recipients**: Enter wallet addresses (comma, space, or newline separated)
4. **Specify Amounts**: Enter token amounts in wei (supports scientific notation like `100e18`)
5. **Review Transaction**: Check the transaction details and token balance
6. **Send Tokens**: Click "Send Tokens" and confirm the transaction in your wallet

### Input Format Examples

**Recipients:**
```
0x1234..., 0x5678..., 0x9ABC...
```

**Amounts (supports multiple formats):**
```
1000000000000000000, 500e18, 2000000000000000000
1e18
2.5e18
1000000000000000000
```

## 🔄 Differences from Original TSender

| Feature | Original TSender | This Fork |
|---------|------------------|-----------|
| **Mode Selection** | ✅ Safe/Unsafe Mode | ❌ Single secure mode only |
| **Theme Support** | ❌ Light mode only | ✅ Dark/Light mode toggle |
| **Scientific Notation** | ❌ Not supported | ✅ Supports `100e18` format |
| **Input Persistence** | ❌ Form resets | ✅ LocalStorage persistence |
| **Modern UI** | ⚠️ Basic styling | ✅ Enhanced with gradients & animations |

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Web3**: Wagmi v2, RainbowKit, Viem
- **State Management**: React Hooks, TanStack Query
- **Testing**: Vitest, playwright, React Testing Library
- **Deployment**: Vercel (recommended)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original [TSender](https://github.com/Cyfrin/ts-tsender-ui-cu) by Cyfrin
- [RainbowKit](https://www.rainbowkit.com/) for wallet integration
- [Wagmi](https://wagmi.sh/) for React hooks for Ethereum
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Join our community discussions

---

**⚠️ Disclaimer**: This application interacts with smart contracts on various blockchains. Always verify contract addresses and transactions before usage. Use at your own risk.