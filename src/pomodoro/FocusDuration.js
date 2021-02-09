  
import React from "react";
import { minutesToDuration } from '../utils/duration';

export default function FocusDuration(props) {
  const {
    focusDuration,
    increaseFocusDuration,
    decreaseFocusDuration,
  } = props;
  return (
    <div className="col">
      <div className="input-group input-group-lg mb-2">
        <span className="input-group-text" data-testid="duration-focus">
          Focus Duration: {minutesToDuration(focusDuration)}
        </span>
        <div className="input-group-append">
          <button
            onClick={decreaseFocusDuration}
            type="button"
            className="btn btn-secondary"
            data-testid="decrease-focus"
          >
            <span className="oi oi-minus" />
          </button>
          <button
            onClick={increaseFocusDuration}
            type="button"
            className="btn btn-secondary"
            data-testid="increase-focus"
          >
            <span className="oi oi-plus" />
          </button>
        </div>
      </div>
    </div>
  );
}