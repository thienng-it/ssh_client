# Deploying to GitHub Pages

I have set up a GitHub Actions workflow that will automatically deploy your application to GitHub Pages whenever you push to the `main` branch.

## Setup Instructions

### 1. Verify Configuration
I have already made these changes for you:
- Updated `vite.config.js` with `base: '/ssh_client/'`.
- Created `.github/workflows/deploy.yml`.

### 2. Push Changes
To trigger the first deployment, you need to commit and push these new files:

```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push -u origin main
```

### 3. Enable GitHub Pages (Critical Step)
After pushing, go to your repository on GitHub:
1. Click **Settings** (top right tab).
2. On the left sidebar, click **Pages**.
3. Under **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: Select **gh-pages** (This branch will be created automatically by the Action after a few minutes).
   - Folder: `/ (root)`
4. Click **Save**.

### 4. Access Your App
Once the deployment finishes (check the **Actions** tab for progress), your app will be live at:
`https://thienng-it.github.io/ssh_client/`
