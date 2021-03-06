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
        <FocusDuration focusDurationMinutes={focusDurationMinutes} decreaseFocusDuration={decreaseFocusDuration} increaseFocusDuration={increaseFocusDuration} />
        <BreakDuration breakDurationMinutes={breakDurationMinutes} decreaseBreakDuration={decreaseBreakDuration} increaseBreakDuration={increaseBreakDuration} />
      </div>
      <PlayStop playPause={playPause} classNames={classNames} isTimerRunning={isTimerRunning} stopButton={stopButton} />
      <div style={activeSession ? {display: "block"} : {display: "none"}}>
        <div className="row mb-2">
          <div className="col">
            <h2 data-testid="session-title">
              {!onBreak ? "Focusing" : "On Break"} for {!onBreak ? minutesToDuration(initialDuration) : minutesToDuration(initialBreakDuration)} minutes
          </h2>
            <p className="lead" data-testid="session-sub-title">
              {secondsToDuration((durationMinutes * 60) + durationSeconds)} remaining
          </p>
          {!isTimerRunning ? <h2>PAUSED</h2> : null}
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
                aria-valuenow={durationProgress}
                style={{ width: `${durationProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pomodoro;
