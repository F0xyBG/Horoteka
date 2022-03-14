const WaveformData = require('waveform-data');
const AudioContext = window.AudioContext || window.webkitAudioContext;

const audioContext = new AudioContext();

fetch('./song.wav')
  .then(response => response.arrayBuffer())
  .then(buffer => {
    const options = {
      audio_context: audioContext,
      array_buffer: buffer,
      scale: 128
    };

    return new Promise((resolve, reject) => {
      WaveformData.createFromAudio(options, (err, waveform) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(waveform);
        }
      });
    });
  })
  .then(waveform => {
    console.log(`Waveform has ${waveform.channels} channels`);
    console.log(`Waveform has length ${waveform.length} points`);
  });