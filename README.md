# SubDomain Scanner


![Screenshot 2025-04-27 230223](https://github.com/user-attachments/assets/f4daeaff-169c-42cf-a622-c19ff28528d3)



A modern, neon-themed web application built with Next.js to discover subdomains for a given domain. It utilizes a backend API (powered by RapidAPI's Subdomain Scan) to fetch subdomain data and presents it in a stylish, terminal-like interface.

## Features

-   **Neon Terminal UI**: A visually appealing interface inspired by retro terminal aesthetics.
-   **Subdomain Scanning**: Enter a domain name (e.g., `google.com`) to find associated subdomains.
-   **Real-time Feedback**: Loading indicators and status messages keep the user informed during the scan.
-   **Error Handling**: Clear error messages for invalid input or API issues.
-   **Responsive Design**: Adapts to different screen sizes.
-   **Built with Modern Tech**: Leverages Next.js App Router, Server Actions, TypeScript, Tailwind CSS, and Shadcn/UI.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/)
-   **State Management**: React Hooks (`useState`, `useForm`)
-   **API**: [RapidAPI - Subdomain Scan](https://rapidapi.com/securitymaster/api/subdomain-scan1) (Requires API Key)
-   **Linting/Formatting**: ESLint (Implicit via Next.js), Prettier (Recommended)

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (Version 18 or later recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/)
-   A RapidAPI Account and API Key for the [Subdomain Scan API](https://rapidapi.com/securitymaster/api/subdomain-scan1).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd subneon-scanner
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set up Environment Variables:**
    -   The application requires a RapidAPI key to function. Currently, the key is hardcoded in `src/app/actions.ts`.
    -   **IMPORTANT**: For production or sharing, **DO NOT** commit your API key directly into the code. Use environment variables:
        1.  Create a file named `.env.local` in the root of the project.
        2.  Add your RapidAPI key to this file:
            ```env
            RAPIDAPI_KEY=your_rapidapi_key_here
            ```
        3.  Modify `src/app/actions.ts` to read the key from `process.env.RAPIDAPI_KEY` instead of the hardcoded value. *This step is crucial for security.*

            ```typescript
            // src/app/actions.ts - Replace the hardcoded key with:
            const apiKey = process.env.RAPIDAPI_KEY;
            ```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:9002](http://localhost:9002) (or the specified port) in your browser to see the application.

## Usage

1.  Navigate to the application in your browser.
2.  Enter a valid domain name (e.g., `google.com`, `github.com`) into the input field.
3.  Click the "Scan" button.
4.  The application will display a loading state while fetching data.
5.  Once the scan is complete, the results (list of subdomains) will be displayed in the terminal-like output area.
6.  If no subdomains are found or an error occurs, appropriate messages will be shown.

![SubNeon Scanner Placeholder Screenshot 2](placeholder-screenshot-2.png)
*(Replace `placeholder-screenshot-2.png` with a screenshot showing scan results)*

## Building for Production

```bash
npm run build
npm run start
```

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` file for more information (if applicable - create a LICENSE file if needed).
