const fs = require("fs-extra");
const classes =  require("./tagClasses.js");

class HlsParser {
  constructor(inputFile, outputFile, testMode = false) {
    this.inputFile = inputFile;
    this.testMode = testMode;
    this.outputFile = outputFile;
  }
  readFile() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.inputFile, "utf-8", (err, data) => {
        if(err){
          reject(err)
        }
        this.proccessFile(data);
        resolve(data)
      })
    })
  }
  proccessFile(data) {
    const items = data.split("#").slice(1);
    this.manifest = new Manifest(data, this.outputFile);
    this.getTagType(items, this.manifest.tags);
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
  getSupportedTags() {
    return classes;
  }
}

class Manifest {
  constructor(originalManifest, outputFile = "./out.m3u8") {
    this.originalManifest = originalManifest;
    this.tags = [];
    this.outputFile = outputFile;
  }
  test(writtenManifest) {
    return writtenManifest === this.originalManifest; //
  }
  write() {
    let writtenManifest = "";
    this.tags.forEach((item, index) => {
      const line = item.print();
      writtenManifest += line;
    });
    return writtenManifest;
  }
  writeToFile() {

    fs.writeFile(this.outputFile, this.write()).
    then(() => {
      console.log("file written");
    })
  }
  getSegmentsToReplace() {
    const segmentsToReplace = [];
    let cueOut, cueIn;
    this.tags.forEach((item, index) => {
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
  getTags(type) {
    const tags = this.tags.filter((item) => {
      return item.validator(type);
    });
    return tags;
  }
}

module.exports.HlsParser = HlsParser;

const inputFile = process.env.file || "./dev_assets/index.m3u8";
const outputFile = "./dev_assets/out.m3u8";
const parser = new HlsParser(inputFile, outputFile, false);
parser.readFile().then(() => {
  //console.log(parser.getSupportedTags());
  //console.log(parser.manifest);
});
