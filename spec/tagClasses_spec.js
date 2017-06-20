const classes = require("./../tagClasses.js");
const fs = require("fs");
const HlsParser = require("./../hls_parser.js").HlsParser;


describe("Classes", () => {
  let parser;
  beforeEach((done) => {
    parser = new HlsParser(false);
    parser.readFile("./dev_assets/index.m3u8", done);
  })
  describe("readFile, create manifest object", () => {
    it("init", () => {
      expect(parser.manifest.manifest[6] instanceof classes.EXTINF).toBeTruthy();
      expect(parser.manifest.manifest[0] instanceof classes.EXTM3U).toBeTruthy();
      expect(parser.manifest.manifest[parser.manifest.manifest.length -1] instanceof classes.EXTENDLIST).toBeTruthy();
    })
  });
});
