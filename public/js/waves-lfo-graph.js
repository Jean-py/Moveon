import * as lfo from 'waves-lfo/client';
import * as controllers from '@ircam/basic-controllers';


const muteDisplayCoefs = [0, 0, 0, 0, 0, 0, 0, 0];

/**
 * Phone
 */

const socketReceive = new lfo.source.SocketReceive({ port: 5010 });
socketReceive.processStreamParams({
  frameType: 'vector',
  frameSize: 8,
  frameRate: 1 / 0.02,
});

// filter display output
const phoneMuteDisplay = new lfo.operator.Multiplier({ factor: muteDisplayCoefs });

const phoneDisplay = new lfo.sink.BpfDisplay({
  canvas: '#phone',
  width: 400,
  height: 200,
  duration: 5,
});

socketReceive.connect(phoneMuteDisplay);
phoneMuteDisplay.connect(phoneDisplay);


/**
 * R-ioT
 */

const riotSocketReceive = new lfo.source.SocketReceive({ port: 5011 });
riotSocketReceive.processStreamParams({
  frameType: 'vector',
  frameSize: 8,
  frameRate: 0,
});

const riotMuteDisplay = new lfo.operator.Multiplier({ factor: muteDisplayCoefs });

const riotDisplay = new lfo.sink.BpfDisplay({
  canvas: '#riot',
  width: 400,
  height: 200,
  duration: 5,
});

riotSocketReceive.connect(riotMuteDisplay);
riotMuteDisplay.connect(riotDisplay);