import { useSelector, useDispatch } from 'react-redux';
import { setStep } from '../features/steps/stepsSlice';
import ToggleButton from '@mui/material/ToggleButton';

function Step(props) {
    // id represents step number and array
    // index, track the index of the track
    // the steps belongs to
    const id = props.id;
    const track = props.track;
    const dispatch = useDispatch();
    // boolean for whether the step is active
    const active = useSelector(state => state.steps.stepValues[track][id]);

    // toggle step value in store
    const handleToggle = () => {
        dispatch(setStep({track, id}));
    }

    
    // represent step as a togglebutton
    // steps shown to user start at one
    // due to convention in music notation
    return (
            <ToggleButton 
                value="step"
                onChange={handleToggle}
                size="medium"
                selected={active}
                className="ToggleButton"
            >
                {id+1}
            </ToggleButton>
    );
}

export default Step;
