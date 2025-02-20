const core = require("@actions/core");
const exec = require("child_process").exec;

async function run() {
  try {
    const target = core.getInput("target");

    if (!target) {
      core.setFailed("No target domain provided.");
      return;
    }

    console.log(`Scanning target: ${target}`);
    
    exec(`nmap ${target} -A`, (error, stdout, stderr) => {
      if (error) {
        core.setFailed(`Error running Nmap: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Nmap stderr: ${stderr}`);
      }

      console.log(`Nmap Scan Results:\n${stdout}`);
      core.setOutput("scan_result", stdout);
    });

  } catch (error) {
    core.setFailed(`Action failed: ${error.message}`);
  }
}

run();
