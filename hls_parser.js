const fs = require("fs-extra");
const classes =  require("./tagClasses.js");

class HlsParser {
  constructor(inputFile, outputFile, testMode = false) {
    this.inputFile = inputFile;
    this.testMode = testMode;
    this.outputFile = outputFile || "./out.m3u8";
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
  constructor(originalManifest, outputFile) {
    this.originalManifest = originalManifest;
    this.tags = [];
    this.outputFile = outputFile;
  }
  test() {
    return this.write() === this.originalManifest; //
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
  getSegmentsInsideDateRange() {
    const segmentsToReplace = [];
    let sectionList = [];
    let cueOut, cueIn;
    this.tags.forEach((item, index) => {
      if(item instanceof classes.EXTXDATERANGE && item.value[" SCTE35-OUT"]){
        sectionList.push(item.value[" PLANNED-DURATION"])
        cueOut = true;
        cueIn = false;
      }else if (item instanceof classes.EXTXDATERANGE && item.value[" SCTE35-IN"]) {
        cueIn = true;
        cueOut = false;
      }
      if(cueOut && item instanceof classes.EXTINF){
        sectionList.push({segment: item, index: index});
      }else if (cueIn) {
        cueIn = null;
        segmentsToReplace.push(sectionList);
        sectionList = [];
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

/*const parser = new HlsParser("./dev_assets/index.m3u8", "./dev_assets/out.m3u8", false);
parser.readFile().then(() => {
  console.log(parser.manifest.tags);
})*/
