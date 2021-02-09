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
      setFocusDuration(minutes => minutes -= 5);
    }
  }

  const increaseFocusDuration = () => {
    if(focusDuration < 60 && !isTimerRunning && play) {
      setFocusDuration(minutes => minutes += 5);
    }
  }

  const decreaseBreakDuration = () => {
    if(breakDuration > 1 && !isTimerRunning && play) {
      setBreakDuration(minutes => minutes--);
    }
  }

  const increaseBreakDuration = () => {
    if(breakDuration < 15 && !isTimerRunning && play) {
      setBreakDuration(minutes => minutes++);
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
          setDurationMinutes(minutes => minutes = durationMinutes--);
        }
      });

      if(onBreak) {
        setProgressBar(progress => progress = percentage(durationMinutes, durationSeconds, initialBreakTime));
      } else {
        setProgressBar(progress => progress = percentage(durationMinutes, durationSeconds, initialFocusTime));
      }

      if (durationMinutes === 0 && durationSeconds === 1) {
        timeExpired();
      } 

    },
    isTimerRunning ? 1000 : null
  );

  function timeExpired() {
    if (!onBreak) {
      focusTimeExpired();
    } else {
      breakTimeExpired();
    }
  }


  function focusTimeExpired() {
    new Audio(`https://bigsoundbank.com/UPLOAD/mp3/1482.mp3`).play();
    setOnBreak(state => state = true);
    setProgressBar(progress => progress = 0);
    setDurationSeconds(seconds => seconds = 0);
    setDurationMinutes(minutes => minutes = initialBreakTime);
  }

  function breakTimeExpired() {
    new Audio(`https://bigsoundbank.com/UPLOAD/mp3/0899.mp3`).play();
    setOnBreak(state => state = false);
    setProgressBar(progress => progress = 0);
    setDurationSeconds(seconds => seconds = 0);
    setDurationMinutes(minutes => minutes = initialFocusTime);
  }

  function playPause() {
    if(play) {
      setInitialFocusTime(duration => duration = focusDuration);
      setInitialBreakTime(duration => duration = breakDuration);
      setDurationMinutes(duration => duration = focusDuration);
      setPlay(state => state = false);
    }
    setFocusSession(state => state = true)
    setIsTimerRunning((prevState) => !prevState);
  }

  function stopButton() {
    setPlay(state => state = true);
    setIsTimerRunning(state => state = false);
    setOnBreak(state => state = false);
    setFocusSession(state => state = false);
    setProgressBar(progress => progress = 0);
    setDurationSeconds(seconds => seconds = 0);
    setDurationMinutes(duration => duration = focusDuration);
    setInitialFocusTime(duration => duration = focusDuration);
    setInitialBreakTime(duration => duration = breakDuration);
  }

  return (
    <div className="pomodoro">
      <div className="row">
        <FocusDuration focusDuration={focusDuration} decreaseFocusDuration={decreaseFocusDuration} increaseFocusDuration={increaseFocusDuration} />
        <BreakDuration breakDuration={breakDuration} decreaseBreakDuration={decreaseBreakDuration} increaseBreakDuration={increaseBreakDuration} />
      </div>
      <PlayStop playPause={playPause} classNames={classNames} isTimerRunning={isTimerRunning} stopButton={stopButton} />
      <div style={focusSession ? {display: "block"} : {display: "none"}}>
        <div className="row mb-2">
          <div className="col">
            <h2 data-testid="session-title">
              {!onBreak ? "Focusing" : "On Break"} for {!onBreak ? minutesToDuration(initialFocusTime) : minutesToDuration(initialBreakTime)} minutes
          </h2>
            <p className="lead" data-testid="session-sub-title">
              {secondsToDuration((durationMinutes * 60) + durationSeconds)} remaining
          </p>
          {!isTimerRunning ? <h3>PAUSED</h3> : null}
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
                aria-valuenow={progressBar}
                style={{ width: `${progressBar}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pomodoro;
