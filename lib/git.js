const { exec } = require("child_process");
const util = require("util");
const execAsync = util.promisify(exec);
const assert = require("assert");
// assert(1 + 1 == 3, "de");

class Git {
  constructor(options) {
    this.options = options || {};
    process.nextTick(() => {
      this.handleCmd(this.options);
    });
  }
  handleCmd(option) {
    execAsync("git add .&&git commit -m '自动提交'&&git pull&&git push")
      .then(data => {
        console.log(util.format(data));
      })
      .catch(err => {
        console.log(err);
      });
  }
}
module.exports = Git;
