#### How to use:

```yml
name: "Run Nmap Scan"

on:
  push:
    branches:
      - main

permissions:
  contents: read
  issues: write # ✅ Required for issue creation

jobs:
  nmap_scan:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Run Nmap Scan
        uses: ./ # Run local action
        with:
          target: "example.com"
          issue_title: "🚨 Nmap Security Scan Alert"
          fail_action: "true"
          allow_issue_writing: "true"
```
