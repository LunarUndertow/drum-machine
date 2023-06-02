import { useState, useEffect, useRef, useMemo } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import { useSelector, useDispatch } from 'react-redux';
import { togglePlaying } from '../features/steps/stepsSlice';
import Step from './Step';
import { ToggleButton } from '@mui/material';

function SampleSequencer(props) {
    const track = props.track;
    const sampleSrc = props.src;
    const audioCtx = props.audioCtx;
    
    // store value in useRef hooks so that they can be updated
    // immediately to prevent unpredictable behaviour resulting
    // from async updates
    const steps = useSelector(state => state.steps.stepValues[track]);
    const stepsRef = useRef(steps);
    const nextNoteTime = useSelector(state => state.steps.nextNoteTime);
    const nextNoteTimeRef = useRef(nextNoteTime);
    const playing = useSelector(state => state.steps.playing[track]);
    const playingRef = useRef(playing);
    
    // use local state instead of store for
    // the sample as it's not needed elsewhere
    const [sample, setSample] = useState(null);
    const playbackRate = 1;
    const currentNote = useSelector(state => state.steps.currentNote);
    const dispatch = useDispatch();
    // let timerID;

    // when the player advances to the next note, schedule
    // note and play sample if the step is toggled on
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

    
    // useEffect hooks to update references to state in order
    // to be always up to date and prevent unpredictabilities
    // that might result from async updates
    useEffect(() => {
        stepsRef.current = steps;
    }, [steps]);


    useEffect(() => {
        playingRef.current = playing;
    }, [playing]);
  

    useEffect(() => {
        nextNoteTimeRef.current = nextNoteTime;
    }, [nextNoteTime]);
  

    // load the sample given as prop when the component is created
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
  

    // re-render step components only when steps array changes
    // to prevent re-renders when playback advances to next note
    // in order to improve performance
    const stepsRendered = useMemo(
        () => (steps.map((step, index) => (
            <Step key={index} id={index} track={track} />
            ))
        ), steps
    );

  
    // step components, a button to toggle the playing status of the individual
    // track withan icon that changes along with the status, and track name
    return (
        <div className="trackContainer">
            { stepsRendered }
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
