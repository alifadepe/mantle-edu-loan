import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mantleSepoliaTestnet } from 'wagmi/chains';
import { createConfig, http } from 'wagmi';

// Get WalletConnect project ID from environment
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

if (!projectId && typeof window !== 'undefined') {
  console.warn('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set');
}

// Create wagmi config using RainbowKit's default config
// Only initialize with wallets when in browser environment
export const config = typeof window !== 'undefined'
  ? getDefaultConfig({
    appName: 'EduLoan - Decentralized Student Loans',
    projectId,
    chains: [mantleSepoliaTestnet],
    ssr: true, // Enable server-side rendering support for Next.js
  })
  : createConfig({
    chains: [mantleSepoliaTestnet],
    transports: {
      [mantleSepoliaTestnet.id]: http(),
    },
    ssr: true,
  });
