# Digital-Library
This is the project repository for the Digital Library senior project. The Digital Library is a web and mobile based application that allows users to scan or enter books into a personalized library. In addition to the digital bookshelf, the Digital Library provides AI reccommendations based on the books in a user's bookshelf.

# Team Setup Guide – Digital Library

This guide gets all contributors (Mac & Windows) onto the same development environment.
Follow **every step in order**.

---

## 1) Required Downloads

### All Users

1. **Git**

   * Windows: [https://git-scm.com/download/win](https://git-scm.com/download/win)
   * Mac (Homebrew):

     ```bash
     brew install git
     ```

2. **Node Version Manager (NVM)**
   We standardize Node versions so everyone runs the same runtime.

---

## 2) Install Node (Version-locked)

### Mac

```bash
brew install nvm
mkdir ~/.nvm

echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && . "/opt/homebrew/opt/nvm/nvm.sh"' >> ~/.zshrc

source ~/.zshrc

nvm install --lts
nvm use --lts
```

Verify:

```bash
node -v
npm -v
```

---

### Windows

1. Install **nvm-windows**:
   [https://github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases)

2. Open PowerShell as Administrator:

```powershell
nvm install lts
nvm use lts
```

Verify:

```powershell
node -v
npm -v
```

---

## 3) Install Cursor

All contributors must use Cursor for consistency.

Download: [https://cursor.sh](https://cursor.sh)

---

## 4) Clone the Repository

Open Terminal (Mac) or PowerShell (Windows):

```bash
git clone https://github.com/YOUR_ORG_OR_USER/digital-library.git
cd digital-library
```

---

## 5) Load Correct Node Version

From project root:

```bash
nvm use
```

This reads the `.nvmrc` file.

---

## 6) Backend Setup

```bash
cd backend
npm install
```

Create environment file:

`backend/.env`

```
PORT=5000
```

Start backend:

```bash
node index.js
```

Verify:
Open browser → [http://localhost:5000](http://localhost:5000)

---

## 7) Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Verify:
Browser auto-opens → React starter page

---

## 8) Required Git Workflow

### Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### Save Work

```bash
git add .
git commit -m "Describe change"
```

### Upload Branch

```bash
git push --set-upstream origin feature/your-feature-name
```

---

## 9) Pull Latest Changes (Before Working)

Every session:

```bash
git checkout main
git pull
git checkout feature/your-feature-name
git merge main
```

---

## 11) Folder Structure Reference

```
digital-library/
 ├── backend/
 │   ├── index.js
 │   ├── package.json
 │   └── .env
 ├── frontend/
 │   ├── package.json
 │   ├── src/
 │   └── ...
 ├── .gitignore
 ├── README.md
 └── .nvmrc
```
