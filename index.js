const { exec } = require("child_process");
const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  try {
    const target = core.getInput("target");
    const issueTitle = core.getInput("issue_title");
    const failAction = core.getInput("fail_action") === "true";
    const allowIssueWriting = core.getInput("allow_issue_writing") === "true";

    console.log(`🔍 Running Nmap scan on: ${target}`);

    exec(`nmap ${target} -A`, async (error, stdout, stderr) => {
      if (error) {
        core.setFailed(`❌ Nmap scan failed: ${error.message}`);
        return;
      }

      if (stderr) {
        console.warn(`⚠️ Nmap warnings: ${stderr}`);
      }

      const scanResult = stdout;
      console.log("✅ Scan completed. Results:");
      console.log(scanResult);

      core.setOutput("scan_result", scanResult);

      // Check for vulnerabilities or open ports
      const vulnerabilitiesDetected = /open|vulnerable|CVE/i.test(scanResult);

      if (vulnerabilitiesDetected && allowIssueWriting) {
        console.log("🚨 Vulnerabilities detected! Creating GitHub Issue...");

        const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
        const { owner, repo } = github.context.repo;

        await octokit.rest.issues.create({
          owner,
          repo,
          title: issueTitle,
          body: `### 📌 Nmap Scan Results for **${target}**\n\`\`\`\n${scanResult}\n\`\`\`\n⚠️ **Potential vulnerabilities detected!**`,
        });

        console.log("✅ GitHub Issue created successfully.");
      } else {
        console.log("🛡️ No vulnerabilities detected. No issue created.");
      }

      if (vulnerabilitiesDetected && failAction) {
        core.setFailed("❌ Vulnerabilities detected. Failing the action.");
      }
    });
  } catch (error) {
    core.setFailed(`❌ Error: ${error.message}`);
  }
}

run();
