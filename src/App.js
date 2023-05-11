import { useEffect, useRef } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import './App.css';
import SampleSequencer from './Components/SampleSequencer';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { useDispatch, useSelector } from 'react-redux';
import { setTempo, toggleIsPlaying, advance } from './features/steps/stepsSlice';
import { ToggleButton } from '@mui/material';

function App() {
    const isPlaying = useSelector((state) => state.steps.isPlaying);
    const isPlayingRef = useRef(isPlaying);
    const audioCtx = useRef(new AudioContext());
    const dispatch = useDispatch();

    const tempo = useSelector((state) => state.steps.tempo);
    const tempoRef = useRef(tempo);
    const nextNoteTime = useRef(audioCtx.current.currentTime)
    const scheduleAheadTime = 0.1;
    const lookahead = 25.0;

    const play = () => {
        dispatch(toggleIsPlaying());
    };


    useEffect(() => {
        const scheduler = () => {
            if (!isPlaying) return;
            while (nextNoteTime.current < audioCtx.current.currentTime + scheduleAheadTime) {
                nextNote();
            }
            setTimeout(scheduler, lookahead);
        };
        
        const nextNote = () => {
            const secondsPerSixteenth = 60.0 / tempoRef.current / 4;
            nextNoteTime.current += secondsPerSixteenth;
            dispatch(advance());
        };

        if (isPlaying) {
            audioCtx.current.resume();
            scheduler();
        } else {
            audioCtx.current.suspend();
        }
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);


    const changeTempo = (event, newValue) => {
        dispatch(setTempo(newValue));
    };


    useEffect(() => {
        tempoRef.current = tempo;
    }, [tempo]);


    return (
        <div className="App">
            <header className="App-header">
                <ToggleButton onChange={play} value={isPlayingRef}>
                    {isPlaying ? <PlayArrowIcon /> : <PlayArrowOutlinedIcon />}
                </ToggleButton>
                <Box sx={{width: 300}} className="tempo">
                    <Slider 
                        aria-label="tempo" 
                        defaultValue={120}
                        min={40}
                        max={260}
                        valueLabelDisplay='auto'
                        onChange={changeTempo}
                    />
                    <span className="tempoLabel">
                        {"tempo"}
                    </span>
                </Box>
                <SampleSequencer audioCtx={audioCtx.current} track={0} src={'./kick.mp3'} name={"kick"} />
                <SampleSequencer audioCtx={audioCtx.current} track={1} src={'./snare.mp3'} name={"snare"} />
                <SampleSequencer audioCtx={audioCtx.current} track={2} src={'./ch.mp3'} name={"closed hat"} />
                <SampleSequencer audioCtx={audioCtx.current} track={3} src={'./oh.mp3'} name={"open hat"} />
            </header>
        </div>
    );
}

export default App;
