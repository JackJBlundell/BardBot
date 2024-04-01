const util = require("util");
const childProcess = require("child_process");

const execFile = util.promisify(childProcess.execFile);

async function ffmpeg(params) {
  const { stdout, stderr } = await execFile("/opt/bin/ffmpeg", params);

  return {
    stdout: stdout,
    stderr: stderr,
  };
}

module.exports = { ffmpeg };
