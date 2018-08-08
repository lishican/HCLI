const path = require("path");
const ora = require("ora");
const qn = require("qn");
const globby = require("globby");
const chalk = require("chalk");
const moment = require("moment");
const CONFIG = {
  bucket: "91marryu",
  origin: "http://ofvbasfrz.bkt.clouddn.com"
};
let LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage(path.resolve(__dirname, "../storage"));
class QnUpload {
  constructor(options) {
    this.options = options || {};
    this.client = null;
    process.nextTick(() => {
      this.handleCmd(this.options);
    });
  }
  handleCmd(option) {
    if (option.file) {
      this.uploadFile(option.file);
    }
    if (option.dir && option.name) {
      this.uploadDir(option.dir, option.name);
    }
    if (option.appId && option.key) {
      this.setQnCofig("appId", option.appId);
      this.setQnCofig("key", option.key);
    }
  }

  getQnCofig() {
    let appId = localStorage.getItem("appId");
    let key = localStorage.getItem("key");
    if (!appId || !key) {
      return false;
    }
    return { appId, key };
  }
  setQnCofig(key, value) {
    localStorage.setItem(key, value);
  }
  async uploadFile(file) {
    let fileName = moment().format("YYYYMMDDhhmmss") + "_" + file;
    let pathName = path.resolve(process.cwd(), file);
    let spinner = ora("文件上传中").start();
    console.log("");
    let url = await this.uploadToQn(pathName, fileName);
    spinner.succeed();
    console.log(chalk.green(url));
  }
  async uploadDir(pathName, versionName) {
    let Dir = path.resolve(process.cwd(), pathName);
    let filePaths = globby.sync(["**/*", "!**/node_modules/"], {
      cwd: Dir
    });
    let total = filePaths.length;
    let current = 0;

    let spinner = ora("文件上传中").start();
    console.log("");
    for (let file in filePaths) {
      let fileName = filePaths[file];
      let uploadPath = path.join(Dir, fileName);
      let keyName = versionName + "/" + fileName;
      let url = await this.uploadToQn(uploadPath, keyName);
      current++;
      console.log(chalk.blue(current + "/" + total + ": "), chalk.green(url));
    }
    spinner.text = "文件上传成功";
    spinner.succeed();
  }
  getClient() {
    if (this.client) {
      return this.client;
    }
    let qn_config = this.getQnCofig();
    if (!qn_config) {
      console.log(chalk.red("尚未配置七牛秘钥"));
      return false;
    }
    this.client = qn.create({
      accessKey: qn_config.appId,
      secretKey: qn_config.key,
      bucket: CONFIG.bucket,
      origin: CONFIG.origin,
      uploadURL: "http://up-z2.qiniup.com"
    });
    return this.client;
  }
  uploadToQn(pathName, oriName) {
    let client = this.getClient();
    if (!client) {
      return false;
    }
    return new Promise((resolve, reject) => {
      client.uploadFile(pathName, { key: oriName }, function(err, result) {
        if (err) {
          resolve(err);
        }
        resolve(result.url);
      });
    });
  }
}

module.exports = QnUpload;
