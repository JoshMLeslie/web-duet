# Websocket Connection
## WebRTC + Video Chat
Better than WebRTC for data passing stuff bc after establishing a connection, doesn't require the server to be in the middle
https://mattbutterfield.com/blog/2021-05-02-adding-video-chat


## PeerJs a WebRTC client
https://peerjs.com/

### via https://gist.github.com/sagivo/3a4b2f2c7ac6e1b5267c2f1f59ac6c6b#gistcomment-3648786
> Also facing same problem.. My app works fine if both peer on same network if they are own different network they not connect. I try many stun server form list even almost no one work? Can any one mentioned currently working stun server? or i need to create one on my vps.. Can any one please guide how i can make stun server on window base VPS. Thanks

> Google's STUN servers are still operational. You can check their (Google's and others) operational status here:

https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/

> If they return a result of type srflx (for STUN) or relay (for TURN) they work. These (STUN servers) vastly help connections with different network configurations depending on the ISP, but sometimes they're not enough. TURN servers come into play when that happens and fills the gap left by the STUN (which is a really small percent, but it still considerable).

> I would recommend installing your own server following this tutorial:

https://ourcodeworld.com/articles/read/1175/how-to-create-and-configure-your-own-stun-turn-server-with-coturn-in-ubuntu-18-04

> and this too:

https://meetrix.io/blog/webrtc/coturn/installation.html

> They are both good references and it's not that complicated to get one running.

## AWS WS stuff
AWS WS Article - https://aws.amazon.com/blogs/compute/announcing-websocket-apis-in-amazon-api-gateway/

# Midi / Recorded data to Sound
## ToneJs
https://tonejs.github.io/

### Piano built w/ ToneJS
- https://dev.to/shimphillip/building-a-piano-with-tone-js-5c2f
- https://codepen.io/shimphillip/pen/mZBQvg

## Midi to Sound
https://medium.com/swinginc/playing-with-midi-in-javascript-b6999f2913c3

## Math of Better Notes
https://keithwhor.com/music/

### Implementation of library
- https://keithwhor.github.io/audiosynth/
- https://github.com/keithwhor/audiosynth
- https://github.com/1000mileworld/Piano-Keyboard/blob/master/playKeyboard.js

## Karplus-Strong javascript implementation for realistic audio based on Andre Michelle's work
I think this is specifically applicable to stringed instruments / guitars
https://github.com/mrahtz/javascript-karplus-strong/tree/master/karplus-strong

## MDN WebAudio API
https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

### Basics
https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API

### Advanced
https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Advanced_techniques