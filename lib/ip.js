const os = require("os");
let ipInfo = os.networkInterfaces();
const chalk = require("chalk");
const terminalLink = require("terminal-link");
class Ip {
  constructor(options) {
    this.options = options || {};
    process.nextTick(() => {
      this.handleCmd(this.options);
    });
  }
  handleCmd(option) {
    if (option.port) {
      return this.scanIp(option.port);
    }
    this.scanIp();
  }
  scanIp(port) {
    let ipList = [];
    for (let ips in ipInfo) {
      ipInfo[ips].forEach(v => {
        if (this.isValidIP(v.address)) {
          ipList.push(v.address);
        }
      });
    }
    ipList.forEach(v => {
      let link = v;
      if (port) {
        link = v + ":" + port;
      }
      console.log(chalk.underline.blue(link));
    });
  }
  isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    return reg.test(ip);
  }
}

module.exports = Ip;
