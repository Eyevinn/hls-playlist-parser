const fs = require("fs-extra");
const util = require("./util/util.js")
const classes =  require("./tagClasses.js");

class HlsParser {
  constructor(inputFile, outputFile, testMode = false) {
    console.log("const");
    this.inputFile = inputFile;
    this.testMode = testMode;
    this.outputFile = outputFile;
  }
  readFile() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.inputFile, "utf-8", (err, data) => {
        if(err){
          console.log("err");
          reject()
        }
        this.proccessFile(data);
        console.log("before res");
        resolve(data)
      })
    })
  }
  proccessFile(data) {
    console.log("proccessFile");
    const items = data.split("#").slice(1);
    this.manifest = new Manifest(data, this.outputFile);
    this.getTagType(items, this.manifest.manifest);
  }
  getTagType(items, saveObj) {
    items.forEach((item) => {
      let unidentified = true;
      for(let i in classes){
        if(classes[i].prototype.validator(item)){
          saveObj.push(new classes[i](item, item));
          unidentified = false;
          break;
        }
      }
      if(unidentified){
        saveObj.push(new classes.UnidentifiedTag(item, item));
      }
    });
  }
}

class Manifest {
  constructor(originalManifest, outputFile = "./out.m3u8") {
    this.originalManifest = originalManifest;
    this.manifest = [];
    this.outputFile = outputFile;
  }
  test(writtenManifest) {
    return writtenManifest === this.originalManifest; //
  }
  write(test) {

    let writtenManifest = "";
    this.manifest.forEach((item, index) => {
      const line = item.print();
      writtenManifest += line;
    });
    test ? console.log(this.test(writtenManifest)) : null;
    fs.writeFile(this.outputFile, writtenManifest)
    return writtenManifest;
  }
  getSegmentsToReplace() {
    const segmentsToReplace = [];
    let cueOut, cueIn;
    this.manifest.forEach((item, index) => {
      if(item instanceof classes.EXTXDATERANGE && item.value[" SCTE35-OUT"]){
        cueOut = true;
        cueIn = false;
      }else if (item instanceof classes.EXTXDATERANGE && item.value[" SCTE35-IN"]) {
        cueIn = true;
        cueOut = false;
      }
      if(cueOut && item instanceof classes.EXTINF){
        segmentsToReplace.push({segment: item, index: index});
      }
    })
    return segmentsToReplace;
  }
}

module.exports.HlsParser = HlsParser;

const inputFile = process.env.file || "./dev_assets/index.m3u8";
const outputFile = "./dev_assets/out.m3u8";
const parser = new HlsParser(inputFile, outputFile, false);
parser.readFile()
