class Tag {
  constructor(tagType, tagData) {
    this.tagType = tagType;
    //this.tagData = tagData.split("\n");
    this.prefix = this.getPrefix(tagData.split("\n"));
  }

  getPrefix(data) {
    return data[0].split(":")[0];
  }
}

class PlaylistTag extends Tag {
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
    this.type = tagType;
    this.value = tagData;
  }
  print() {
    return `#${this.value}`;
  }
}

class SegmentTag extends Tag {
  constructor(tagType, tagData) {
    super(tagType, tagData);
    this.value = tagData.split(":")[1];
  }
  getType() {
    return "SegmentTag";
  }
}



module.exports.EXTINF = class EXTINF extends SegmentTag {
  constructor(tagType, tagData) {
    super(tagType, tagData);
    this.value  = tagData.split("\n")[0].split(":")[1];
    this.segmentFile = tagData.split("\n")[1];
  }
  print() {
    return `#${this.prefix}:${this.value}\n${this.segmentFile}\n`
  }
}

module.exports.EXTM3U = class EXTM3U extends PlaylistTag {
  constructor(tagType, tagData) {
    super(tagType, tagData);
  }
  print() {
    return `#${this.prefix}\n`;
  }
}

module.exports.EXTXVERSION = class EXTXVERSION extends PlaylistTag {
  constructor(tagType, tagData) {
    super(tagType, tagData);
    this.value = parseInt(this.value);
  }
  print() {
    return `#${this.prefix}:${this.value}\n`
  }
}

module.exports.EXTMEDIASEQUENCE = class EXTXVERSION extends PlaylistTag {
  constructor(tagType, tagData) {
    super(tagType, tagData);
    this.value = parseInt(this.value);
  }
  print() {
    return `#${this.prefix}:${this.value}\n`
  }
}

module.exports.EXTENDLIST = class EXTXVERSION extends PlaylistTag {
  constructor(tagType, tagData) {
    super(tagType, tagData);
  }
  print() {
    return `#${this.prefix}\n`;
  }
}

module.exports.EXTTARGETDURATION = class EXTTARGETDURATION extends PlaylistTag {
  constructor(tagType, tagData) {
    super(tagType, tagData);
    this.value = parseInt(this.value);
  }
  print() {
    return `#${this.prefix}:${this.value}\n`
  }
}

module.exports.EXTXDATERANGE = class EXTXDATERANGE extends SegmentTag {
  constructor(tagType, tagData) {
    super(tagType, tagData);
    this.value = {};
    this.valuePairs = tagData.split(",");
    this.valuePairs[0] = this.valuePairs[0].split(":")[1];
    this.valuePairs.forEach((item) => {
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
}
