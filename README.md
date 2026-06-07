# GitHub Repository Analytics System

Node.js project that uses the GitHub REST API to fetch:
- User information
- Repositories for a user
- Latest commit(s) (per repository and per selected repository)
- “Ratings” for repositories (implemented as a check whether the authenticated user has starred the repo)

## Features
- CLI-based interactive workflow using `inquirer`
- Works in **Normal user** mode (no token) and **Authenticated user** mode (token required for higher rate limits and starring checks)
- Simple Express server bootstrap (starts the CLI script)

## Project Structure
- `server.js` – starts an Express server and spawns the CLI (`index.js`)
- `index.js` – interactive CLI menu
- `app/utils/githubFunc.js` – all GitHub API calls
- `app/middlewares/setHeaders.js` – Express middleware for CORS-like headers

## Prerequisites
- Node.js installed
- A GitHub account
- (Optional but recommended) A GitHub Personal Access Token for authenticated mode

## Setup
1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables (optional):
   - Create a `.env` file in the project root.
   - Supported variables:

   ```env
   GITHUB_API=https://api.github.com
   PORT=3011
   ```

> Note: the CLI also prompts for a token when you choose **Authenticated user**.

## Run
Start the application (Express server + CLI):

```bash
npm start
```

Then follow the prompts:
1. Choose **Normal user** or **Authenticated user**
2. Pick an action:
   - View user info
   - List all repositories
   - List latest commits in repositories
   - List latest commit in a particular repository
   - View ratings of repositories
   - View ratings of a particular repository

## API / Implementation Notes
### Commits
- Uses `GET /repos/{owner}/{repo}/commits` with `per_page=100` (though the code returns only `data[0]`, i.e., the latest commit).

### “Ratings”
- Implemented via `GET /user/starred/{owner}/{repo}`.
- If the authenticated request returns a status code in **[200, 400]**, the repo is treated as “rated”.

## Scripts
- `npm start` – runs `nodemon server.js`

## Troubleshooting
- If you hit GitHub rate limits, switch to **Authenticated user** mode and provide a token.
- Ensure your token has the required permissions for the endpoints used (at least basic read access; for starring checks it needs to access the authenticated user context).

## License
ISC

