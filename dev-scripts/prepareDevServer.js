const fs = require("fs");
const {
  exec
} = require("child_process");
const logFilePath = "./dev-scripts/webpack-dev-server.log";
const errorLogFilePath = "./dev-scripts/webpack-dev-server-error.log";

console.log("Preparing webpack development server.");

try {
  fs.unlinkSync(logFilePath);
} catch (error) {
}


try {
  fs.unlinkSync(errorLogFilePath);
} catch (error) {
}

exec("npm run dev-server");