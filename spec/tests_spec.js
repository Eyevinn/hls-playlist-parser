const classes = require("./../tagClasses.js");
const fs = require("fs");
const HlsParser = require("./../hls_parser.js").HlsParser;


describe("Classes", () => {
  let parser, inputFile, outputFile;
  beforeEach((done) => {
    inputFile = "./dev_assets/index.m3u8";
    outputFile = "./dev_assets/out.m3u8";
    parser = new HlsParser(inputFile, outputFile, false);
    parser.readFile()
    .then(done);
  })
  describe("Read and write manifest", () => {
    it("parses and writes a correctly structured manifest", () => {
      expect(parser.manifest.test(parser.manifest.write())).toBeTruthy();
    });
  });
});
