const tagClasses = require("./../tagClasses.js")
const fs = require("fs");



describe("Classes", () => {
  let extInfMock;
  beforeEach((done) => {
    fs.readFile("./dev_assets/index.m3u8", "utf-8", (err, data) => {
      extInfMock = data
      done();
    });
  })
  describe("EXTINF", () => {
    it("init", () => {
      const tag = new tagClasses.EXTINF("type", extInfMock.split("#")[6]);
      console.log(tag);
      expect(tag.tagType).toBe("type");
      expect(tag.segmentFile).toBe("index1.ts");
      expect(tag.value).toBe("8.333333,");
    })
  });
});
