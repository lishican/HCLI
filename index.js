#!/usr/bin/env node
const program = require("commander");
const qiniu = require("./lib/qiniu");
const template = require("./lib/template");
const pkg = require("./package.json");
const ip = require("./lib/ip");
// https://www.npmjs.com/package/commander
program
  .version(pkg.version, "-v, --version")
  .command("test [one] [two] [three]")
  .description("测试的命令")
  .action((one, two, three) => {
    console.log(one, two, three);
  });

program
  .command("upload")
  .alias("up")
  .description("文件上传")
  .option("-d, --dir [dirName]", "上传目录")
  .option("-n, --name [nameName]", "空间名字")
  .option("-f, --file [fileName]", "文件名称")
  .option("-i, --appId [appId]", "appId")
  .option("-k, --key [key]", "key")
  .action(option => {
    new qiniu(option);
  });
program
  .command("ip")
  .description("测试的命令")
  .option("-p, --port [port]", "端口名称")
  .action(option => {
    new ip(option);
  });

program
  .command("init")
  .description("创建新的模块")
  .action(option => {
    new template(option);
  });

program.parse(process.argv);
