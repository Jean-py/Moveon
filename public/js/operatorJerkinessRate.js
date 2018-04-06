import { BaseLfo } from 'waves-lfo/core';
// define class parameters
const parameters = {
  factor: {
    type: 'integer',
    default: 1,
  },
};

class Multiplier extends BaseLfo {
  constructor(options = {}) {
    // set the parameters and options of the node
    super(parameters, options);
  }
  
  // allow the node to handle incoming `vector` frames
  processVector(frame) {
    const frameSize = this.streamParams.frameSize;
    const factor = this.params.get('factor');
    
    // transfer data from `frame` (output of previous node)
    // to the current node's frame, data from the incoming frame
    // should never be modified
    for (let i = 0; i < frameSize; i++)
      this.frame.data[i] = frame.data[i] * factor;
  }
}

const multiplier = new Multiplier({ factor: 4 });