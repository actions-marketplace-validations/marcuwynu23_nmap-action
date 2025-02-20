
#### How to use:

```yml
name: Nmap Scan

on:
  workflow_dispatch:
    inputs:
      target:
        description: "Domain to scan"
        required: true
        default: "example.com"

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Run Nmap Scan
        uses: your-username/nmap-action@main
        with:
          target: ${{ github.event.inputs.target }}

      - name: Display Scan Output
        run: echo "${{ steps.nmap.outputs.scan_result }}"
```