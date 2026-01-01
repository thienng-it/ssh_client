# Git Setup and Deployment Guide

This guide documents the complete process to initialize a local Git repository and push it to GitHub, specifically covering how to handle multiple GitHub accounts using SSH.

## 1. Local Setup

First, initialize the repository in your project folder.

```bash
# Initialize Git
git init

# Check status (optional, but good practice)
git status

# Stage all files
git add .

# Create the first commit
git commit -m "Initial commit"
```

## 2. GitHub Repository Setup

1. Go to [github.com/new](https://github.com/new).
2. Enter your repository name (e.g., `ssh_client`).
3. **Important**: Select "Public" or "Private", but **DO NOT** check "Add a README file", "Add .gitignore", or "Choose a license". Creating an empty repository makes the first push much easier.
4. Click **Create repository**.

## 3. SSH Configuration (For Multiple Accounts)

If you use multiple GitHub accounts (e.g., personal vs. work), using SSH config is the best way to manage them.

### Step 3.1: Generate a specific SSH key
If you haven't already:
```bash
# Generate a key for the specific account (e.g., thienng-it)
ssh-keygen -t ed25519 -C "your_email@example.com" -f ~/.ssh/id_thienng
```

### Step 3.2: Add Public Key to GitHub
1. Copy the public key:
   ```bash
   pbcopy < ~/.ssh/id_thienng.pub
   ```
2. Go to GitHub Settings > **SSH and GPG keys**.
3. Click **New SSH key**, give it a Title, and paste the key.

### Step 3.3: Configure SSH Config
Edit your config file:
```bash
micro ~/.ssh/config
```

Add a host alias for your specific account:
```text
# Account 2 (thienng-it)
Host github-thienng
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_thienng
```

## 4. Connect and Push

Now, link your local repository to the GitHub repository using the alias you defined in Step 3.3.

```bash
# Add remote using the CUSTOM HOST ALIAS (github-thienng)
# Format: git remote add origin git@<YOUR_HOST_ALIAS>:<USERNAME>/<REPO>.git
git remote add origin git@github-thienng:thienng-it/ssh_client.git

# Verify the remote URL
git remote -v

# Push the code
git push -u origin main
```

### Troubleshooting: "Repository not found"
- ensure you created the repo on GitHub.
- ensure your `Host` in `~/.ssh/config` matches what you used in `git remote add`.
- ensure the SSH key is added to the correct GitHub account.

### Troubleshooting: "Updates were rejected" (Force Push)
If you accidentally initialized the repo on GitHub with a README or License, Git will reject your push because the histories don't match. You can force push to overwrite the remote with your local code:

```bash
git push -u origin main --force
```
