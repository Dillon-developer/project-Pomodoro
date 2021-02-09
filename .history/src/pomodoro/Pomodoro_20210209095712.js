import React, { useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import { minutesToDuration } from '../utils/duration';
import { secondsToDuration } from '../utils/duration';
import PlayStop from "./PlayStop";
import BreakDuration from "./BreakDuration";
import FocusDuration from "./FocusDuration";

function Pomodoro() {
  // Timer starts out paused
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [play, setPlay] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [focusSession, setFocusSession] = useState(false);

  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [initialFocusTime, setInitialFocusTime] = useState(25);
  const [initialBreakTime, setInitialBreakTime] = useState(5);

  const [progressBar, setProgressBar] = useState(0);

  const decreaseFocusDuration = () => {
    if (focusDuration > 5 && !isTimerRunning && play) {
      setFocusDuration(minutes => minutes -= 5)
    }
  }

  const increaseFocusDuration = () => {
    if(focusDuration < 60 && !isTimerRunning && play) {
      setFocusDuration(minutes => minutes += 5)
    }
  }

  const decreaseBreakDuration = () => {
    if(breakDuration > 1 && !isTimerRunning && play) {
      setBreakDuration(minutes => minutes--)
    }
  }

  const increaseBreakDuration = () => {
    if(breakDuration < 15 && !isTimerRunning && play) {
      setBreakDuration(minutes => minutes++)
    }
  }
  
  function percentage(currentMinutes, currentSeconds, initialMinutes) {
    return 100 - (((currentMinutes * 60) + currentSeconds) / (initialMinutes * 60) * 100);
  }
  


  useInterval(
    () => {
      // ToDo: Implement what should happen when the timer is running
      setDurationSeconds(second => {
        second === 0 ? second = 59 : second--;
        if (second === 59) {
          setDurationMinutes(minutes => minutes = durationMinutes--)
        }
      });

      if(onBreak) {
        setProgressBar(progress => progress = percentage(durationMinutes, durationSeconds, initialBreakTime))
      } else {
        setProgressBar(progress => progress = percentage(durationMinutes, durationSeconds, initialFocusTime))
      }
    },
    isTimerRunning ? 1000 : null
  );

  function playPause() {
    setIsTimerRunning((prevState) => !prevState);
  }

  return (
    <div className="pomodoro">
      <div className="row">
        <div className="col">
          <div className="input-group input-group-lg mb-2">
            <span className="input-group-text" data-testid="duration-focus">
              {/* TODO: Update this text to display the current focus session duration */}
              Focus Duration: 25:00
            </span>
            <div className="input-group-append">
              {/* TODO: Implement decreasing focus duration and disable during a focus or break session */}
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="decrease-focus"
              >
                <span className="oi oi-minus" />
              </button>
              {/* TODO: Implement increasing focus duration  and disable during a focus or break session */}
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="increase-focus"
              >
                <span className="oi oi-plus" />
              </button>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="float-right">
            <div className="input-group input-group-lg mb-2">
              <span className="input-group-text" data-testid="duration-break">
                {/* TODO: Update this text to display the current break session duration */}
                Break Duration: 05:00
              </span>
              <div className="input-group-append">
                {/* TODO: Implement decreasing break duration and disable during a focus or break session*/}
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="decrease-break"
                >
                  <span className="oi oi-minus" />
                </button>
                {/* TODO: Implement increasing break duration and disable during a focus or break session*/}
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="increase-break"
                >
                  <span className="oi oi-plus" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PlayStop />
      <div>
        {/* TODO: This area should show only when a focus or break session is running or pauses */}
        <div className="row mb-2">
          <div className="col">
            {/* TODO: Update message below to include current session (Focusing or On Break) and total duration */}
            <h2 data-testid="session-title">Focusing for 25:00 minutes</h2>
            {/* TODO: Update message below to include time remaining in the current session */}
            <p className="lead" data-testid="session-sub-title">
              25:00 remaining
            </p>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col">
            <div className="progress" style={{ height: "20px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow="0" // TODO: Increase aria-valuenow as elapsed time increases
                style={{ width: "0%" }} // TODO: Increase width % as elapsed time increases
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pomodoro;
