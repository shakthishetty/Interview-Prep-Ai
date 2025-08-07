# 🔧 Windows Permission Error Fix

## The Problem
You're getting an `EPERM: operation not permitted` error when trying to start the dev server. This is a common Windows issue with Next.js.

## Quick Fix (Choose one method):

### Method 1: Delete .next directory (Recommended)
```bash
# Close any running dev servers first (Ctrl+C)
# Then run these commands:

# Delete the .next directory
rmdir /s .next

# Or use PowerShell:
Remove-Item -Recurse -Force .next

# Then try starting again:
npm run dev
```

### Method 2: Run as Administrator
```bash
# Right-click Command Prompt or PowerShell
# Select "Run as administrator"
# Navigate to your project directory
# Then run:
npm run dev
```

### Method 3: Kill Node processes and cleanup
```bash
# Kill any running Node processes
taskkill /f /im node.exe

# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall (if needed)
rmdir /s node_modules
npm install

# Delete .next directory
rmdir /s .next

# Try again
npm run dev
```

## After Fixing, Test Google Pay:

Once your dev server starts (you should see "Ready - started server on http://localhost:3000"):

### 1. Quick Google Pay Test:
1. **Chrome browser** → Go to `http://localhost:3000`
2. **Sign into Google**: Open new tab → `google.com` → sign in
3. **Set up Google Pay**: Go to `pay.google.com` → add test card `4111 1111 1111 1111`
4. **Test debug page**: Visit `http://localhost:3000/debug/google-pay-v2`

### 2. Expected Results:
- ✅ Browser: "Chrome ✓"
- ✅ Stripe: "Yes ✓"
- ✅ Google Pay test: "Yes ✓"

## Why This Happens:
- Windows file permissions
- Antivirus software blocking file access
- Multiple Node processes running
- Previous build artifacts with locked files

## Prevention:
- Always stop dev server with Ctrl+C before closing terminal
- Don't delete files while dev server is running
- Consider using WSL (Windows Subsystem for Linux) for development

---

**Try Method 1 first** - it usually fixes the issue immediately!
