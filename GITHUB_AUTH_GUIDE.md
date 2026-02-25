# How to Push to Personal GitHub (Multiple Accounts)

Since your terminal is using your company credentials (`devops2e4e`), you can use one of these two methods to push to your personal repository without logging out of your company account.

## Method 1: Change Remote URL (Easiest)

You can tell Git to use your personal username for this specific repository. This will force the Git Credential Manager to ask for your personal credentials.

1. **Get your Personal Access Token (PAT)**:
   - Go to GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic).
   - Generate a new token with `repo` scope. **Save this token!**

2. **Update the remote URL**:
   Run this in your terminal (replace `YOUR_USERNAME` with your personal GitHub username):
   ```bash
   git remote set-url origin https://YOUR_USERNAME@github.com/Kboy2000/Zepayra.git
   ```

3. **Push**:
   ```bash
   git push origin main
   ```
   - When prompted for a password, **paste your Personal Access Token (PAT)**, not your GitHub password.

---

## Method 2: Use SSH with a Host Alias (Best for Long Term)

If you use SSH, you can configure your `~/.ssh/config` file to use different keys for different GitHub "hosts".

1. **Generate a new SSH key** (if you don't have one for personal):
   ```bash
   ssh-keygen -t ed25519 -C "your_personal_email@example.com" -f ~/.ssh/id_ed25519_personal
   ```

2. **Add the key to your GitHub account**:
   - Copy the content of `~/.ssh/id_ed25519_personal.pub` and add it to your Personal GitHub account settings.

3. **Modify `~/.ssh/config`**:
   Add this block to your config file (usually at `C:\Users\YourName\.ssh\config` on Windows):
   ```text
   # Personal GitHub
   Host github.com-personal
     HostName github.com
     User git
     IdentityFile ~/.ssh/id_ed25519_personal
   ```

4. **Change the remote URL to use the alias**:
   ```bash
   git remote set-url origin git@github.com-personal:Kboy2000/Zepayra.git
   ```

5. **Push**:
   ```bash
   git push origin main
   ```

---

## Method 3: Local Repository Config (Commit Metadata Only)

Note that even if you authorize correctly, Git might still use your company email for the **commit author**. To fix this for this repository only:

```bash
git config user.email "your_personal_email@example.com"
git config user.name "Your Personal Name"
```
*(This doesn't fix the 403 error, but it ensures the commits look right on GitHub.)*
