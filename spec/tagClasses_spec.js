const tagClasses = require("./../tagClasses.js")
console.log(tagClasses);


describe("Classes", () => {
  describe("EXTINF", () => {
    it("init", () => {
      const extInfMock = `#EXTINF:10,
      http://media.example.com/fileSequence7796.ts`
      const tag = new tagClasses.EXTINF("type", extInfMock)
      expect(tag.tagType).toBe("type")
    })
  });
});
