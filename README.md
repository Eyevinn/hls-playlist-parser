A Javascript library to parse and edit Hls playlists. Based on specification https://tools.ietf.org/html/draft-pantos-http-live-streaming-23

## Usage (Node JS)

```
npm install --save hls-playlist-parser
```

The library creates a programatically editable Object from the manifest. Supported tags are editable. Unsupported
or unidentified tag are preserved but not editable. May be used to replace segments in server side ad-insertion.

```
const HlsParser = require('hls-playlist-parser').HlsParser

const parser = HlsParser("example.m3u8", "outfile.m3u8")
parser.readFile()
.then(() => {
  console.log(parser.manifest.tags) // all tags and segments in the manifest
  });
```
## Supported tags
*   EXTM3U
*   EXT-X-VERSION
*   EXTINF
*   EXT-X-DISCONTINUITY
*   EXT-X-KEY
*   EXT-X-MAP
*   EXT-X-DATERANGE
*   EXT-X-TARGETDURATION
*   EXT-X-MEDIA-SEQUENCE
*   EXT-X-ENDLIST
*   EXT-X-BYTERANGE


## Contributing
All contributions are welcome but before you submit a Pull Request make sure you follow the same
code conventions and that you have written unit tests
