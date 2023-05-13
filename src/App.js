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
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

function App() {
    // make useRef hooks for store values in order to prevent
    // unpredictable behaviour due to async updates
    const isPlaying = useSelector(state => state.steps.isPlaying);
    const isPlayingRef = useRef(isPlaying);
    const tempo = useSelector(state => state.steps.tempo);
    const tempoRef = useRef(tempo);

    // store audioCtx in a useRef to prevent creating new
    // instances on re-renders. the audiocontext is only used
    // for sample playback and is not transformed, so I decided
    // to do it this way and hand the reference down as a prop
    // instead of putting it in store and using useSelector. that
    // might be subject to change depending on upcoming features.
    const audioCtx = useRef(new AudioContext());
    const dispatch = useDispatch();

    // values for scheduling playback of upcoming notes
    const nextNoteTime = useRef(audioCtx.current.currentTime)
    const scheduleAheadTime = 0.1;
    const lookahead = 25.0;

    // toggle playing status of the whole drum machine
    const play = () => {
        dispatch(toggleIsPlaying());
    };


    // whenever isPlaying status changes, resume or suspend the
    // audiocontext accordingly, and start scheduling notes to
    // play if playing
    useEffect(() => {
        // if not playing, do nothing. otherwise schedule notes
        // and call self recursively while playing
        const scheduler = () => {
            if (!isPlaying) return;
            while (nextNoteTime.current < audioCtx.current.currentTime + scheduleAheadTime) {
                nextNote();
            }
            setTimeout(scheduler, lookahead);
        };
        
        // update secondsPerSixteenth so that the playback reacts
        // to the tempo slider in real time. advancing to the next note
        // triggers playback in SampleSequencer component if the step is
        // toggled on
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


    // change tempo value in store
    const changeTempo = (event, newValue) => {
        dispatch(setTempo(newValue));
    };


    // keep the tempo useRef hook up to date to prevent  unpredictable
    // behaviour due to async updating. tempoRef used in nextNote() to
    // update the tempo on real time as the tempo slider value changes
    useEffect(() => {
        tempoRef.current = tempo;
    }, [tempo]);


    // use dark theme to make the app readable against the dark background
    const darkTheme = createTheme({
        palette: {
          mode: 'dark',
        },
      });


    // create a drum machine with a playback button, a tempo slider,
    // and four individual tracks with sixteen steps and an on/off button.
    // tempo limits and sample set here.
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <div className="App">
                <header className="App-header">
                    <ToggleButton onChange={play} value={isPlayingRef}>
                        {isPlaying ? <PlayArrowIcon /> : <PlayArrowOutlinedIcon />}
                    </ToggleButton>
                    <Box sx={{width: 300}} className="tempo">
                        <Slider 
                            aria-label="tempo" 
                            defaultValue={tempoRef.current}
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
        </ThemeProvider>
    );
}

export default App;
