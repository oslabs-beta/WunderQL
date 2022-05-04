const fs = require("fs");
const {
  exec
} = require("child_process");
const logFilePath = "./dev-scripts/webpack-dev-server.log";
const errorLogFilePath = "./dev-scripts/webpack-dev-server-error.log";
const interval = 100;


const intervalId = setInterval(function () {
  try {
    if (fs.existsSync(logFilePath)) {
      const log = fs.readFileSync(logFilePath, {
        encoding: "utf8"
      });

      if (log.indexOf("Compiled successfully.") >= 0) {
        console.log("Webpack development server is ready, launching Electron app.");
        clearInterval(intervalId);

        const electronProcess = exec("cross-env NODE_ENV=development electron .");
        electronProcess.stdout.on("data", function(data) {
          process.stdout.write(data);
        });
        electronProcess.stderr.on("data", function(data) {
          process.stdout.write(data);
        });
      } else if (log.indexOf("Failed to compile.") >= 0) {

        if (fs.existsSync(errorLogFilePath)) {
          const errorLog = fs.readFileSync(errorLogFilePath, {
            encoding: "utf8"
          });

          console.log(errorLog);
          console.log(`Webpack failed to compile; this error has also been logged to '${errorLogFilePath}'.`);
          clearInterval(intervalId);

          return process.exit(1);
        } else {
          console.log("Webpack failed to compile, but the error is unknown.")
          clearInterval(intervalId);

          return process.exit(1);
        }
      }
    }
  } catch (error) {

    console.error("Webpack or electron fatal error" + error);
    clearInterval(intervalId);

    return process.exit(1);
  }
}, interval);