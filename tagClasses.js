class Tag {
  constructor(tagType, tagData) {
    this.prefix = this.getPrefix(tagData.split("\n"));
  }
  getPrefix(data) {
    return data[0].split(":")[0];
  }
  print() {
    return `#${this.prefix}`;
  }
  validator(tag) {
    console.log(this.prefix);
    return new Boolean(tag.match(this.prefix));
  }
}

class MediaPlaylistTag extends Tag {
  constructor(tagType, tagData) {
    super(tagType, tagData);
    this.value = tagData.split(":")[1];
  }
  getType() {
    return "PlaylistTag";
  }
}

module.exports.UnidentifiedTag = class UnidentifiedTag {
  constructor(tagType, tagData) {
    this.value = tagData;
  }
  print() {
    return `#${this.value}`;
  }
  validator() {
    return false;
  }
}

class MediaSegmentTag extends Tag {
  constructor(tagType, tagData) {
    super(tagType, tagData);
    this.value = tagData.split(":")[1];
  }
  getType() {
    return "SegmentTag";
  }
}

module.exports.EXTINF = class EXTINF extends MediaSegmentTag {
  constructor(tagType, tagData) {
    super(tagType, tagData);
    this.value  = tagData.split("\n")[0].split(":")[1];
    this.segmentFile = tagData.split("\n")[1];
  }
  print() {
    return `#${this.prefix}:${this.value}\n${this.segmentFile}\n`
  }
  validator(tag) {
    return tag.match("EXTINF");
  }
}

module.exports.EXTM3U = class EXTM3U extends MediaPlaylistTag {
  constructor(tagType, tagData) {
    super(tagType, tagData);
  }
  print() {
    return `#${this.prefix}\n`;
  }
  validator(tag) {
    return tag.match("EXTM3U");
  }
}

module.exports.EXTXVERSION = class EXTXVERSION extends MediaPlaylistTag {
  constructor(tagType, tagData) {
    super(tagType, tagData);
    this.value = parseInt(this.value);
  }
  print() {
    return `#${this.prefix}:${this.value}\n`
  }
  validator(tag) {
    return tag.match("EXT-X-VERSION");
  }
}

module.exports.EXTMEDIASEQUENCE = class EXTMEDIASEQUENCE extends MediaPlaylistTag {
  constructor(tagType, tagData) {
    super(tagType, tagData);
    this.value = parseInt(this.value);
  }
  print() {
    return `#${this.prefix}:${this.value}\n`
  }
  validator(tag) {
    return tag.match("EXT-X-MEDIA-SEQUENCE");
  }
}

module.exports.EXTENDLIST = class EXTENDLIST extends Tag {
  constructor(tagType, tagData) {
    super(tagType, tagData);
  }
  print() {
    return `#${this.prefix}\n`;
  }
  validator(tag) {
    return tag.match("EXT-X-ENDLIST");
  }
}

module.exports.EXTTARGETDURATION = class EXTTARGETDURATION extends MediaPlaylistTag {
  constructor(tagType, tagData) {
    super(tagType, tagData);
    this.value = parseInt(this.value);
  }
  print() {
    return `#${this.prefix}:${this.value}\n`
  }
  validator(tag) {
    return tag.match("EXT-X-TARGETDURATION");
  }
}

module.exports.EXTXDATERANGE = class EXTXDATERANGE extends MediaSegmentTag {
  constructor(tagType, tagData) {
    super(tagType, tagData);
    this.value = {};
    const valuePairs = tagData.split(",");
    valuePairs[0] = valuePairs[0].split(":")[1];
    valuePairs.forEach((item) => {
      const valuePair = item.split("=");
      this.value[valuePair[0]] = valuePair[1];
    })
  }
  print() {
    let valueString = "";
    for(const key in this.value) {
      valueString += `${key}=${this.value[key]},`
    }
    return `#${this.prefix}:${valueString.slice(0, valueString.length -2)}\n`
  }
  validator(tag) {
    return tag.match("EXT-X-DATERANGE");
  }
}

module.exports.EXTXDISCONTINUITY = class EXTXDISCONTINUITY extends Tag {
  constructor(tagType, tagData) {
    super(tagType, tagData)
  }
  print() {
    return `#${this.prefix}`
  }
  validator(tag) {
    return tag.match("EXT-X-DISCONTINUITY");
  }
}
