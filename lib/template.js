const inquirer = require("inquirer");
const prompt = inquirer.createPromptModule();
const { exec } = require("child_process");
const ora = require("ora");
const chalk = require("chalk");

const GIT_LIST = {
  vue_simple: "http://120.76.45.115:10101/r/vue_simple_template.git",
  phaser_es6: "http://lishican@120.76.45.115:10101/r/phaser_es6_template.git",
  node: "http://lishican@120.76.45.115:10101/r/nodeAdmin.git",
  vue_webpack: "http://lishican@120.76.45.115:10101/r/plugins/vue_template.git",
  koa2: "http://lishican@120.76.45.115:10101/r/plugins/koa2.git",
  vue_admin: "http://lishican@120.76.45.115:10101/r/vue_admin_template.git",
  vue_phaser: "http://lishican@120.76.45.115:10101/r/vue_phaser_template.git"
};

class MyTemplate {
  constructor(options) {
    this.options = options;

    process.nextTick(() => {
      this.handleCmd(this.options);
    });
  }

  handleCmd(option) {
    let that = this;
    prompt([
      {
        name: "directory",
        message: "enter you app dirctory:",
        type: "input",
        required: true
      },
      {
        type: "list",
        name: "template",
        type: "list",
        message: "which template do you need:",
        choices: Object.keys(GIT_LIST)
      }
    ]).then(function(data) {
      that
        .downGitReop(data.template, data.directory)
        .then(data => {})
        .catch(err => {
          console.log(chalk.red(err));
        });
    });
  }
  downGitReop(name, dirName) {
    console.log(chalk.green(name, dirName));
    return new Promise((resolve, reject) => {
      if (dirName == "" || !dirName) {
        dirName = ".";
      }
      const spinner = ora(name + "正在下载中").start();
      exec(
        "git clone " + GIT_LIST[name] + " " + dirName,
        (err, stdout, stderr) => {
          if (err) {
            reject(err);
          }
          spinner.text = "模板下载成功";
          spinner.succeed();
          resolve(stdout);
        }
      );
    });
  }
}

module.exports = MyTemplate;
