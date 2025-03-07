Wallet Explorer
A Next.js web application to explore Cardano wallet information, including balance, transaction history, and NFT collections. Powered by the Blockfrost API.
Features

Search for any Cardano wallet address
View wallet balance and transactions
Display NFT collections with images and metadata
Responsive design with Tailwind CSS
Dark mode support with theme customization

Technology Stack

Next.js
TypeScript
Tailwind CSS
Blockfrost API for Cardano blockchain data

Project Structure
Copywallet-explorer/
├── .next/
├── app/
│   ├── fonts/
│   ├── globals.css
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── page.tsx
│   └── components/
│       ├── nft-display.tsx
│       ├── recent-searches.tsx
│       ├── site-header.tsx
│       ├── theme.tsx
│       ├── transaction-list.tsx
│       ├── wallet-info.tsx
│       └── ui/
│           ├── badge.tsx
│           ├── button.tsx
│           ├── card.tsx
│           ├── dialog.tsx
│           ├── dropdown-menu.tsx
│           ├── input.tsx
│           ├── skeleton.tsx
│           ├── tabs.tsx
│           └── tooltip.tsx
├── lib/
├── node_modules/
├── .eslintrc.json
├── .gitignore
├── components.json
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.js
├── tailwind.config.ts
└── tsconfig.json
Installation
bashCopy# Clone the repository
git clone https://github.com/ishchuktaras/wallet-explorer.git

# Navigate to project directory
cd wallet-explorer

# Install dependencies
npm install

# Start development server
npm run dev
Environment Variables
Create a .env.local file in the root directory with:
CopyNEXT_PUBLIC_BLOCKFROST_API_KEY=mainnetRUrPjKhpsagz4aKOCbvfTPHsF0SmwhLc
NEXT_PUBLIC_BLOCKFROST_API_URL=https://cardano-mainnet.blockfrost.io/api/v0
Usage

Enter a Cardano wallet address in the search bar (default address is provided)
View the wallet's balance, transaction history, and NFT collection
Click on an NFT to view its details and metadata

API Integration
This project uses the Blockfrost API to retrieve Cardano blockchain data. The following endpoints are utilized:

/addresses/{address} - Get address information
/addresses/{address}/transactions - Get transaction history
/addresses/{address}/utxos - Get UTXOs
/assets/{asset} - Get asset details (for NFTs)

Contributing

Fork the repository
Create your feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

License
This project is licensed under the MIT License - see the LICENSE file for details.
Acknowledgments

Blockfrost for providing the Cardano API
Cardano blockchain community