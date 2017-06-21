const HlsParser = require("./hls_parser.js").HlsParser
const classes = require("./tagClasses.js")

const parser = new HlsParser("./dev_assets/index.m3u8", "./dev_assets/out.m3u8", false);
const adParser = new HlsParser("./dev_assets/commercials.m3u8", "./dev_assets/out.m3u8", false);

parser.readFile()
.then(() => {
  adParser.readFile()
  .then(() => {
    replaceSegments(parser.manifest.tags, parser.manifest.getSegmentsToReplace(), adParser.manifest.tags);
    parser.manifest.writeToFile(parser.manifest.write());
  })
})

const replaceSegments = (manifest, itemsToReplace, ads) => {
  itemsToReplace.forEach((item, index) => {
    if(ads[index]){
      manifest[item.index] = ads[index];
    }else{
      manifest.splice(item.index, 1)
    }
  })
}
