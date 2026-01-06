import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mantleSepoliaTestnet } from 'wagmi/chains';

// Get WalletConnect project ID from environment
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

if (!projectId) {
  console.warn('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set');
}

// Create wagmi config using RainbowKit's default config
export const config = getDefaultConfig({
  appName: 'EduLoan - Decentralized Student Loans',
  projectId,
  chains: [mantleSepoliaTestnet],
  ssr: true, // Enable server-side rendering support for Next.js
});
