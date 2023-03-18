import { useState, useEffect } from "react";

function App() {

  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [isPlay, setIsPlay] = useState(false);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [timerLabel, setTimerLabel] = useState('Session');

  function handleReset() {
    setBreakLength(5);
    setSessionLength(25);
    setIsPlay(false);
    setTimeLeft(25 * 60);
    setTimerLabel('Session');

    document.querySelectorAll('button').forEach(button => button.disabled = false);
  }

  function handleStartStop() {
    const timeButtons = document.querySelectorAll('.time-button');

    setIsPlay(prevIsPlay => !prevIsPlay);

    timeButtons.forEach(button => {
      button.disabled = isPlay ? false : true;
    })

  }

  function formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return `${minutes}:${seconds}`;
  }

  function breakIncrement() {
    if (breakLength === 60) return
    setBreakLength(breakLength + 1);
  }

  function breakDecrement() {
    if (breakLength === 1) return;
    setBreakLength(breakLength - 1);
  }

  function sessionIncrement() {
    if (sessionLength === 60) return;
    setSessionLength(sessionLength + 1);
  }

  function sessionDecrement() {
    if (sessionLength === 1) return;
    setSessionLength(sessionLength - 1);
  }

  useEffect(() => {
    let interval;

    if (isPlay && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTimeLeft => prevTimeLeft - 1);

      }, 1000);
    } else if (timeLeft === 0) {
      setTimerLabel(prevTimerLabel =>
        prevTimerLabel === 'Session' ? 'Break' : 'Session'
      );
      setTimeLeft(timerLabel === 'Session' ? breakLength * 60 : sessionLength * 60);
      document.querySelector('#beep').play();
    }
    document.querySelector('#timer-wrapper').style.color = timeLeft < 60 ? 'red' : 'black';
    return () => clearInterval(interval);

  }, [breakLength, sessionLength, isPlay, timeLeft, timerLabel])

  useEffect(() => {
    if (timerLabel === 'Session') setTimeLeft(sessionLength * 60);
  }, [sessionLength, timerLabel]);

  useEffect(() => {
    if (timerLabel === 'Break') setTimeLeft(breakLength * 60);
  }, [breakLength, timerLabel]);


  return (
    <div className="App">
      <h1>Pomodoro Timer</h1>
      <div id='options-wrapper'>
        <div id="break-wrapper">
          <span id="break-label">Break Length</span>
          <div id='break-buttons'>
            <button id="break-decrement" className="time-button" onClick={breakDecrement}>-</button>
            <span id="break-length">{breakLength}</span>
            <button id="break-increment" className="time-button" onClick={breakIncrement}>+</button>
          </div>
        </div>
        <div id='session-wrapper'>
          <span id="session-label">Session Length</span>
          <div id='session-buttons'>
            <button id="session-decrement" className="time-button" onClick={sessionDecrement}>-</button>
            <span id="session-length">{sessionLength}</span>
            <button id="session-increment" className="time-button" onClick={sessionIncrement}>+</button>
          </div>
        </div>
      </div>
      <div id='timer-wrapper'>
        <span id="timer-label">{timerLabel}</span>
        <span id="time-left">{formatTime(timeLeft)}</span>
      </div>
      <div id='buttons-wrapper'>
        <button id="start_stop" onClick={handleStartStop}>{isPlay ? 'Stop' : 'Play'}</button>
        <button id="reset" onClick={handleReset}>Refresh</button>
      </div>
      <audio id="beep" preload="auto" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></audio>
    </div>
  );
}

export default App;
