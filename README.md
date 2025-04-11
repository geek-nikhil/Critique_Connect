# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# CritiqueConnect

CritiqueConnect is a web platform that allows users to participate in Pools, submit and manage Entries, make Picks, and compete with others based on the outcomes of their Picks.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
- [User Flow](#user-flow)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Pool Management**: Browse available Pools and view details
- **Request System**: Submit up to 3 Requests per Pool
- **Secure Payment Processing**: Complete payments for Requests
- **Entry Management**: Manage up to 3 Entries per Pool, numbered 1-3
- **Pick Management**: Make Picks for each Entry separately
- **Deadline Enforcement**: Update Picks until game start or 1PM Sunday
- **Scoring System**: Automatic scoring after games complete
- **Result Tracking**: Win/Loss tracking for each Entry
- **Elimination Logic**: Entries with losses are eliminated from the Pool
- **Standings**: View Pool standings showing all Entries
- **Pick Visibility**: Pool members can view all Picks after scoring
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**:
  - React.js with Vite
  - TypeScript for type safety
  - Tailwind CSS for styling
  - Shadcn UI for component library
  
- **Backend** (separate repository):
  - Node.js with Express.js
  - MongoDB with Mongoose ODM
  
- **Authentication**:
  - Firebase Authentication
  
- **Deployment**:
  - Environment configuration for multiple environments
  - Docker support (optional)

## Project Structure

```
CritiqueConnect-Frontend/
├── public/             # Static assets
├── src/                # Source code
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # UI components
│   │   ├── SignUp.jsx  # User registration component
│   │   ├── ProtectedRoute.jsx # Route protection component
│   │   └── components/ # Nested components
│   ├── contexts/       # React context providers
│   ├── Utils/          # Utility functions
│   │   └── firebase.jsx # Firebase configuration
│   ├── App.jsx         # Root application component
│   ├── App.css         # App-specific styles
│   ├── index.css       # Global styles
│   └── main.jsx        # Entry point
├── .env                # Environment variables (not committed)
├── .env.example        # Example environment variables
├── .gitignore          # Git ignore file
├── index.html          # HTML entry point
├── package.json        # Project dependencies and scripts
├── vite.config.js      # Vite configuration
└── README.md           # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Firebase project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/CritiqueConnect-FrontEnd.git
   cd CritiqueConnect-FrontEnd
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables (see below)

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser to `http://localhost:5173`

### Environment Variables

This project uses environment variables to securely store sensitive information like Firebase credentials. To set up your environment:

1. Copy the `.env.example` file to a new file named `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual Firebase configuration values in the `.env` file:
   ```
   VITE_FIREBASE_API_KEY=your_actual_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_actual_auth_domain
   ...
   ```

3. Never commit your `.env` file to version control as it contains sensitive information.

## Usage

### User Flow

1. **Browse Pools**:
   - Users can view available Pools and their details
   - Each Pool displays relevant information like entry fees, prizes, and rules

2. **Submit Requests**:
   - Users can submit up to 3 Requests per Pool
   - Each Request requires payment to be processed

3. **Request Approval**:
   - Admin approves or rejects Requests
   - Approved Requests become Entries

4. **Entry Management**:
   - Each user can have up to 3 Entries per Pool
   - Entries are numbered 1, 2, 3
   - Picks are made and tracked separately for each Entry

5. **Making Picks**:
   - Users make Picks for each Entry separately
   - Picks can be updated until the deadline (game start or 1PM Sunday)

6. **Scoring and Ranking**:
   - Picks are scored after games complete
   - Win: Entry moves to next week
   - Loss: Entry is eliminated from Pool
   - Each Entry is ranked separately in Pool standings

7. **Viewing Results and Standings**:
   - Users can view Picks/scores for each Entry separately
   - Pool standings show all Entries (multiple per User possible)
   - Pool members can view all Picks after scoring

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
