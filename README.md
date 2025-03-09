Wallet Explorer
A simple blockchain wallet explorer application that allows users to browse cryptocurrency wallet contents, including tokens and NFTs.
Features

Search and display wallet information by wallet address
View basic wallet information
Display ERC-20 tokens
Browse NFT collections owned by the wallet
Simple UI focused on functionality

Technologies

React.js (Create React App)
TypeScript for type safety
React Router for navigation
Ethers.js for blockchain interactions
Basic CSS for styling (no CSS modules or advanced styling frameworks)
Public blockchain API endpoints for data fetching

Implementation Details
This is a proof-of-concept application created for a coding assignment. It's intentionally simple and focuses on demonstrating basic blockchain data retrieval and display capabilities. The application:

Uses a simple form to accept wallet addresses
Makes API calls to fetch wallet data
Renders token and NFT information in a basic layout
Has minimal error handling and loading states
Does not include advanced features like transaction history or portfolio tracking
Uses TypeScript interfaces to define data structures

Known Issues

NFT rendering issues: One of the NFT images doesn't display correctly. This could be due to CORS issues, invalid metadata, or problems with the image hosting.
Limited wallet information: Only displays basic token/NFT data
No caching mechanism for API responses
Simple UI with minimal styling
May have performance issues with wallets containing many tokens/NFTs

Installation

Clone the repository:

bashCopygit clone https://github.com/ishchuktaras/wallet-explorer.git
cd wallet-explorer

Install dependencies:

bashCopynpm install

Start the development server:

bashCopynpm start

Open http://localhost:3000 to view the application in your browser.

Future Improvements
If developing this into a production application, these improvements would be recommended:

Implement proper error handling
Add loading states and pagination
Improve UI/UX with better styling
Add comprehensive testing
Implement caching for API responses
Add support for multiple blockchain networks
Optimize TypeScript types for better code safety

License
This project is available as open source under the terms of the MIT License.