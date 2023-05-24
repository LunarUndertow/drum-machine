# A simple drum machine with React and Redux

A sixteen step drum sequencer with a tempo slider. Individual track can be switched on and off and the tempo changed on the fly. Comprised of components for 1) individual step (Step.js), 2) individual track (SampleSequencer.js), 3) drum machine (App.js).

[Try it out](https://lunarundertow.github.io/drum-machine/)

![Screenshot of the application](/img/screencap.png)

App state is handled with Redux store in order to keep it in one place without having to stuff everything in the top level component. Exceptions to this are sample files and AudioContext. The file paths are handed to individual tracks as props and handled as local states because they're not needed elsewhere. AudioContext is handled with a useRef hook and handed down as prop, because it's only used for sample playback and not intended to be transformed in any way. This might change in later versions if new features so require.

Future features might might include alternate samples, triplets, multiple bars, swing and what have you.
