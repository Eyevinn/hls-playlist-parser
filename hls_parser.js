const fs = require("fs");
const classes =  require("./tagClasses.js");

class HlsParser {
  constructor() {
    this.validator = new TagValidator();
    this.testMode = true;
  }
  readFile(file) {
    fs.readFile(file, "utf-8", (err, data) => {
      if(err){
        throw err
      }
      this.proccessFile(data);
    })
  }
  proccessFile(data) {
    const items = data.split("#").slice(1);
    const manifest = new Manifest(data);
    this.getTagType(items, manifest.manifest);
    manifest.write(this.testMode);
  }
  getTagType(items, saveObj) {
    let val
    items.forEach((item, index) => {
      let unidentified;
      for(const i in this.validator.methods){
        const val = this.validator.methods[i](item, saveObj);
        if(val){
          unidentified = false;
          break;
        }else{
          unidentified = true;
        }
      }
      if(unidentified){
        saveObj.push(new classes.UnidentifiedTag("test", item))
      }
    })
    return val
  }
}

class TagValidator {
  constructor() {
    this.methods = {
      extInf:(tag, saveObj) => {
        if(tag.match("EXTINF")){
            saveObj.push(new classes.EXTINF("EXTINF", tag));
            return "EXTINF";
        }
        return false;
      },
      extDaterange: (tag, saveObj) => {
        if(tag.match("EXT-X-DATERANGE")){
            saveObj.push(new classes.EXTXDATERANGE("EXT-X-DATERANGE", tag));
            return "EXT-X-DATERANGE";
        }
        return false;
      },
      extTargetduration: (tag, saveObj) => {
        if(tag.match("EXT-X-TARGETDURATION")){
            saveObj.push(new classes.EXTTARGETDURATION("EXT-X-TARGETDURATION", tag));
            return "EXT-X-TARGETDURATION";
        }
        return false;
      },
      extm3u: (tag, saveObj) => {
        if(tag.match("EXTM3U")){
            saveObj.push(new classes.EXTM3U("EXTM3U", tag));
            return "EXTM3U";
        }
        return false;
      },
      extVersion: (tag, saveObj) => {
        if(tag.match("EXT-X-VERSION")){
            saveObj.push(new classes.EXTXVERSION("EXT-X-VERSION", tag));
            return "EXT-X-VERSION";
        }
        return false;
      },
      extEndList: (tag, saveObj) => {
        if(tag.match("EXT-X-ENDLIST")){
            saveObj.push(new classes.EXTENDLIST("EXT-X-ENDLIST", tag));
            return "EXT-X-ENDLIST";
        }
        return false;
      },
      extMediaSequence: (tag, saveObj) => {
        if(tag.match("EXT-X-MEDIA-SEQUENCE")){
            saveObj.push(new classes.EXTMEDIASEQUENCE("EXT-X-MEDIA-SEQUENCE", tag));
            return "EXT-X-MEDIA-SEQUENCE";
        }
        return false;
      },
    }
  }
}

class Manifest {
  constructor(originalManifest) {
    this.originalManifest = originalManifest;
    this.manifest = [];
  }

  test(writtenManifest) {
    console.log("writtenManifest: ", writtenManifest);
    console.log("originalManifest: ", this.originalManifest);
    return writtenManifest === this.originalManifest; //
  }

  write(test) {
    let writtenManifest = "";
    this.manifest.forEach((item, index) => {
      const line = item.print();
      writtenManifest += line;
    });

    test ? console.log(this.test(writtenManifest)) : null;
    fs.writeFile("out.m3u8", writtenManifest)
    return writtenManifest;
  }

  getSegmentTags() {
    let segmentTags = [];
    this.manifest.forEach((item) => {
      item.getType() === "SegmentTag" ? segmentTags.push(item) : null;
    })
    return segmentTags;
  }
  getPlaylistTags() {
    let playListTags = [];
    this.manifest.forEach((item) => {
      item.getType() === "PlaylistTag" ? playListTags.push(item) : null;
    })
    return playListTags;
  }
}





parser = new HlsParser();
parser.readFile(process.env.file)
