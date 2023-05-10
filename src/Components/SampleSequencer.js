import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { togglePlaying } from '../features/steps/stepsSlice';
import Step from './Step';

function SampleSequencer(props) {
    const track = props.track;
    // store steps in a useRef object that doesn't reset on re-renders
    const steps = useSelector((state) => state.steps.stepValues[track]);
    const stepsRef = useRef(steps);
    const sampleSrc = props.src;
    
    let tempo = useSelector((state) => state.steps.tempo);
    const tempoRef = useRef(tempo);
    const audioCtx = props.audioCtx;

    const [sample, setSample] = useState(null);
    const playbackRate = 1;
    
    let currentNote = 0;
    let nextNoteTime = audioCtx.currentTime;
    const lookahead = 25.0;
    const scheduleAheadTime = 0.1;
    const playing = useSelector((state) => state.steps.playing[track]);
    const playingRef = useRef(playing);
    const isPlaying = useSelector((state) => state.steps.isPlaying);
    const isPlayingRef = useRef(isPlaying);

    const dispatch = useDispatch();
    // let timerID;
  
    const playSample = async (time) => {
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
        const secondsPerSixteenth = 60.0 / tempoRef.current / 4;
        nextNoteTime += secondsPerSixteenth;
        currentNote = (currentNote + 1) % 16;
    }
  
  
    const scheduleNote = (beatNumber, time) => {
        if (stepsRef.current[beatNumber]) playSample(time);
    }


    const scheduler = () => {
        if (!isPlayingRef.current) return;
        if (playingRef.current) {
            while (nextNoteTime < audioCtx.currentTime + scheduleAheadTime) {
                scheduleNote(currentNote, nextNoteTime);
                nextNote();
            }
            // timerID = setTimeout(scheduler, lookahead);
            setTimeout(scheduler, lookahead);
        }
    }

  
    async function getSample() {
        const response = await fetch(sampleSrc);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        return audioBuffer;
    };

    
    useEffect(() => {
        stepsRef.current = steps;
    }, [steps]);
  
    
    useEffect(() => {
        tempoRef.current = tempo;
    }, [tempo]);


    useEffect(() => {
        playingRef.current = playing;
        scheduler();
    }, [playing]);
  

    useEffect(() => {
        isPlayingRef.current = isPlaying;
        scheduler();
    }, [isPlaying]);


    useEffect(() => {
        getSample().then((buffer) => {
            setSample(buffer);
        });
    }, []);
  
  
    return (
        <div className="trackContainer">
            {steps.map((step, index) => (
                <Step key={index} id={index} track={track} />
            ))}
            <button onClick={() => {dispatch(togglePlaying({track}))}} id="playBtn">
                Play
            </button>
            <span className="trackName">
                {props.name}
            </span>
        </div>
    );
}

export default SampleSequencer;
