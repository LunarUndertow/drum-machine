import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setStep } from '../features/steps/stepsSlice';
import ToggleButton from '@mui/material/ToggleButton';

function Step(props) {
    let id = props.id;
    const track = props.track;
    const dispatch = useDispatch();
    const active = useSelector((state) => state.steps.stepValues[track][id]);

    const handleToggle = () => {
        dispatch(setStep({track, id}));
    }

    return (
            <ToggleButton 
                value="step"
                onChange={handleToggle}
                size="medium"
                selected={active}
                color="success"
                className="ToggleButton"
            >
                {id+1}
            </ToggleButton>
    );
}

export default Step;
