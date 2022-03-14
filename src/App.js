import logo from './logo.svg';
import './App.css';
import { Howl, Howler } from 'howler';
import * as Tone from 'tone';
import AudioRecorder from 'audio-recorder-polyfill';
import React, { useState } from 'react';
import * as nodeAudioPeaks from "node-audio-peaks";
import WaveformData from 'waveform-data';


function App() {
	const audioContextStart = () => {
		const audioContext = new AudioContext();
		fetch('http://localhost/cvetinite.ogg')
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
			drawWave(waveform);
			console.log(waveform._data.buffer);
			// console.log(`Data: ${waveform.data}`);
			// console.log(`Waveform has ${waveform.channels} channels`);
			// console.log(`Waveform has length ${waveform.length} points`);
			console.log(waveform);
			console.log(waveform._channels[0]._waveformData._data);
			// console.log(Object.getPrototypeOf(waveform._data.buffer));

			var gosho = new Uint8Array(waveform._data.buffer);
			console.log(gosho);

			// const findMaxima = (arr = []) => {
		 //    let positions = []
		 //    let maximas = []
		 //    for (let i = 1; i < arr.length - 1; i++) {
		 //        if (arr[i] > arr[i - 1]) {
		 //            if (arr[i] > arr[i + 1]) {
		 //                positions.push(i)
		 //                maximas.push(arr[i])
		 //            }   else if (arr[i] === arr[i + 1]) {
		 //                let temp = i
		 //                while (arr[i] === arr[temp]) i++
		 //                if (arr[temp] > arr[i]) {
		 //                    positions.push(temp)
		 //                    maximas.push(arr[temp])
		 //                }
		 //             }
		 //         }
		 //    }

 		// 		return { maximas, positions };
			// };

			// const findMaximaOfMaxima = (arr = []) => {
		 //    let positions = []
		 //    let maximas = []
		 //    for (let i = 1; i < arr.length - 1; i++) {
		 //        if (arr.maximas[i] > arr.maximas[i - 1]) {
		 //            if (arr.maximas[i] > arr.maximas[i + 1]) {
		 //                positions.push(arr.positions[i])
		 //                maximas.push(arr.maximas[i])
		 //            }   else if (arr.maximas[i] === arr.maximas[i + 1]) {
		 //                let temp = i
		 //                while (arr.maximas[i] === arr.maximas[temp]) i++
		 //                if (arr.maximas[temp] > arr.maximas[i]) {
		 //                    positions.push(arr.positions[i])
		 //                    maximas.push(arr.maximas[temp])
		 //                }
		 //             }
		 //         }
		 //    }

 		// 		return { maximas, positions };
			// };
			// console.log((findMaxima(gosho)));


			// var dv = new DataView(waveform._data.buffer, 0);
			// console.log(dv.getInt16());
			// var enc = new TextDecoder("utf-8");
			// console.log(enc.decode(waveform._data.buffer));
		});
	};

	


	// let recorder;
	// const [audio, setAudio] = useState('');
	// const [intervalInput, setIntervalInput] = useState(100);
	
	// let audioPeaks = nodeAudioPeaks.getAudioPeaks("./cvetinite.wav");
	// audioPeaks.subscribe(console.log);
	// const recordingStart = () => {
	// 	navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
	// 		recorder = new MediaRecorder(stream)
		 
	// 		// Set record to <audio> when recording will be finished
	// 		recorder.addEventListener('dataavailable', e => {
	// 		  setAudio(URL.createObjectURL(e.data));
	// 		})
	// 		// Start recording
	// 		recorder.start()
	// 	  })
	// }
	// const recordingStop = () => {
	// 	// Stop recording
	// 	recorder.stop()
	// 	// Remove “recording” icon from browser tab
	// 	recorder.stream.getTracks().forEach(i => i.stop())
	// 	const oscillator = new Tone.Oscillator().toDestination().start();
	// 	const freqEnv = new Tone.FrequencyEnvelope({
	// 		attack: 0.2,
	// 		baseFrequency: "C2",
	// 		octaves: 4
	// 	});
	// 	freqEnv.connect(oscillator.frequency);
	// 	freqEnv.triggerAttack();
	// };
	
	// const setIntervaInput = () => {

	// }
  return (
    <div className="App">
				{/* <input type='number' onChange={(event) => setIntervalInput(event.target.value)}></input> */}
			<button onClick={audioContextStart}>Start</button>
				{/* <button onClick={recordingStop}>Stop</button> */}
				{/* <audio controls src={audio}></audio> */}
			<canvas id='canvas'></canvas>
    </div>
  );
}

const drawWave = (waveform) => {
	// const waveform = WaveformData.create(raw_data);

	const scaleY = (amplitude, height) => {
		const range = 2000;
		const offset = 128;

		return height - ((amplitude + offset) * height) / range;
	}
	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');
	ctx.beginPath();

	const channel = waveform.channel(0);

	// Loop forwards, drawing the upper half of the waveform
	for (let x = 0; x < waveform.length; x++) {
		const val = channel.max_sample(x);

		ctx.lineTo(x + 0.5, scaleY(val, canvas.height) + 0.5);
	}

	// Loop backwards, drawing the lower half of the waveform
	for (let x = waveform.length - 1; x >= 0; x--) {
		const val = channel.min_sample(x);

		ctx.lineTo(x + 0.5, scaleY(val, canvas.height) + 0.5);
	}

	ctx.closePath();
	ctx.stroke();
	// ctx.fill();
}

export default App;
