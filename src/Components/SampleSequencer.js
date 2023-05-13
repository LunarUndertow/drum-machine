import { useState, useEffect, useRef } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import { useSelector, useDispatch } from 'react-redux';
import { togglePlaying } from '../features/steps/stepsSlice';
import Step from './Step';
import { ToggleButton } from '@mui/material';

function SampleSequencer(props) {
    const track = props.track;
    // store steps in a useRef object that doesn't reset on re-renders
    const steps = useSelector(state => state.steps.stepValues[track]);
    const stepsRef = useRef(steps);
    const sampleSrc = props.src;
    const audioCtx = props.audioCtx;
    const [sample, setSample] = useState(null);
    const playbackRate = 1;
    const nextNoteTime = useSelector(state => state.steps.nextNoteTime);
    const nextNoteTimeRef = useRef(nextNoteTime);
    const playing = useSelector(state => state.steps.playing[track]);
    const playingRef = useRef(playing);
    const currentNote = useSelector(state => state.steps.currentNote);
    const dispatch = useDispatch();
    // let timerID;
  
    useEffect(() => {
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

        const scheduleNote = (beatNumber, time) => {
            if (stepsRef.current[beatNumber]) playSample(time);
        };

        if (playingRef.current)
            scheduleNote(currentNote, nextNoteTimeRef.current);
    }, [currentNote]);

    
    useEffect(() => {
        stepsRef.current = steps;
    }, [steps]);


    useEffect(() => {
        playingRef.current = playing;
    }, [playing]);
  

    useEffect(() => {
        nextNoteTimeRef.current = nextNoteTime;
    }, [nextNoteTime]);
  

    useEffect(() => {
        async function getSample() {
            const response = await fetch(sampleSrc);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
            return audioBuffer;
        };

        getSample().then((buffer) => {
            setSample(buffer);
        });
    }, []);
  
  
    return (
        <div className="trackContainer">
            {steps.map((step, index) => (
                <Step key={index} id={index} track={track} />
            ))}
            <ToggleButton sx={{ml:2}} onChange={() => dispatch(togglePlaying({track}))} value={playingRef}>
                {playing ? <PlayArrowIcon /> : <PlayArrowOutlinedIcon />}
            </ToggleButton>
            <span className="trackName">
                {props.name}
            </span>
        </div>
    );
}

export default SampleSequencer;
