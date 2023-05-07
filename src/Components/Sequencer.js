import React, { useState, useEffect } from 'react';

function Sequencer() {
  const [sample, setSample] = useState(null);
  const audioCtx = new AudioContext();
  const playbackRate = 1;
  const [steps, setSteps] = useState([1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0]);
  
  let currentNote = 0;
  let nextNoteTime = audioCtx.currentTime;
  let tempo = 120;
  const lookahead = 25.0;
  const scheduleAheadTime = 0.1;
  let timerID;

  const play = async (time) => {
    if (sample) {
      const sampleSource = audioCtx.createBufferSource();
      sampleSource.buffer = sample;
      sampleSource.playbackRate.value = playbackRate;
      sampleSource.connect(audioCtx.destination);
      sampleSource.start(time);
      return sampleSource;
    }
  };


  const nextNote = () => {
    const secondsPerSixteenth = 60.0 / tempo / 4;
    nextNoteTime += secondsPerSixteenth;
    currentNote = (currentNote + 1) % 16;
  }


  const scheduleNote = (beatNumber, time) => {
    if (steps[beatNumber] === 1) play(time);
  }


  const scheduler = () => {
    while (nextNoteTime < audioCtx.currentTime + scheduleAheadTime) {
      scheduleNote(currentNote, nextNoteTime);
      nextNote();
    }
    timerID = setTimeout(scheduler, lookahead);
  }


  async function getSample() {
    const response = await fetch('./kick.mp3');
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    return audioBuffer;
  };


  useEffect(() => {
    getSample().then((buffer) => {
      setSample(buffer);
    });
  }, []);


  return (
    <div>
      <button onClick={scheduler} id="playBtn">
        Play
      </button>
      <checkbox></checkbox>
    </div>
  );
}

export default Sequencer;