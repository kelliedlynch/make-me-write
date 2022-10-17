// General CSS
import './App.css';

// React Components
import React, { useState, useEffect, useRef, useCallback } from 'react';

// React-Bootstrap Components
import Stack from "react-bootstrap/Stack";
import Container from "react-bootstrap/Container";

// App Components
// import SprintData from "./SprintData"
import WriterEditor from "./WriterEditor"
import WriterStatusBar from "./WriterStatusBar"
import { startConfettiInner, stopConfettiInner } from "./ConfettiAnimation";


function App() {
  const gracePeriod = 2;
  const wpmDecayRate = 2;
  const sprintLengthInMinutes = 5;

  const [wordCountGoal, setWordCountGoal] = useState(3);
  const [currentWordCount, setCurrentWordCount] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(sprintLengthInMinutes * 1);
  const [sprintIsReady, setSprintIsReady] = useState(true);
  const [sprintIsRunning, setSprintIsRunning] = useState(false);
  const [sprintIsPunishing, setSprintIsPunishing] = useState(false);
  const [secondsSinceKeystroke, setSecondsSinceKeystroke] = useState(0);
  const [secondsSinceNewWord, setSecondsSinceNewWord] = useState(0);
  const [recentWordTimestamps, setRecentWordTimestamps] = useState([]);
  const [currentWordsPerMinute, setCurrentWordsPerMinute] = useState(0);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [sprintGoalReached, setSprintGoalReached] = useState(false);

  let sprintTimer = useRef(null);

  // const wordCountGoalRef = useRef(wordCountGoal);
  const sprintIsRunningRef = useRef(sprintIsRunning);
  const sprintIsPunishingRef = useRef(sprintIsPunishing);
  const secondsSinceNewWordRef = useRef(secondsSinceNewWord);
  const currentWordCountRef = useRef(currentWordCount);
  const recentWordTimestampsRef = useRef(recentWordTimestamps);
  const secondsRemainingRef = useRef(secondsRemaining);

  useEffect(() => {
    sprintIsPunishingRef.current = sprintIsPunishing;
  }, [sprintIsPunishing]);

  useEffect(() => {
    secondsSinceNewWordRef.current = secondsSinceNewWord;
  }, [secondsSinceNewWord]);

  const endSprint = useCallback(() => {
    setSprintIsRunning(false);
    setSprintIsPunishing(false);
    clearInterval(sprintTimer.current);
  }, []);

  useEffect(() => {
      // console.log("secondsRemaining", secondsRemaining);
      if(sprintIsRunningRef.current && secondsRemaining <= 0) {
        endSprint();
      }
      secondsRemainingRef.current = secondsRemaining;
  }, [secondsRemaining, endSprint]);

  const addNewTimestamp = useCallback(() => {
    // console.log("addNewTimestamp");
    let newTimestamps;
    // 50 here is arbitrary number of words over which to calculate WPM
    if(recentWordTimestampsRef.current.length >= 50) {
      newTimestamps = recentWordTimestampsRef.current.slice(-49);
    } else {
      newTimestamps = [...recentWordTimestampsRef.current];
    }
    newTimestamps.push({ wordCount: currentWordCountRef.current, timeStamp: Date.now()});
    setRecentWordTimestamps(newTimestamps);
  }, []);

  const calculateTypingSpeed = useCallback(() => {
    // console.log("recentWordTimestamps", recentWordTimestamps);
    let timestamps = recentWordTimestampsRef.current;
    let intervals = [timestamps[0]["timeStamp"]];
    let totalWordsWritten = 0;
    for(let i=1; i<timestamps.length; i++) {
      if(timestamps[i-1]["wordCount"] > timestamps[i]["wordCount"]) {
        //word count went down this interval
      } else {
        //word count went up this interval
        totalWordsWritten += (timestamps[i]["wordCount"] - timestamps[i-1]["wordCount"]);
        intervals.push(timestamps[i]["timeStamp"])
      }
    }
    let timePassed = (intervals[intervals.length - 1] - intervals[0]) / 1000;
    let wordsPerMinute = Math.floor(totalWordsWritten / (timePassed / 60));
    // only update WPM display every X seconds
    if(secondsRemainingRef.current % 2 === 0) {
      setCurrentWordsPerMinute(wordsPerMinute);
    }
    return wordsPerMinute;
  }, []);

  const intervalDidTick = useCallback(() => {
    // console.log("setInterval sets seconds remaining", secondsRemaining - 1);
    if(sprintIsRunningRef.current) {
      setSecondsRemaining(oldValue => oldValue - 1);
      setSecondsSinceKeystroke(oldValue => oldValue + 1);
      setSecondsSinceNewWord(oldValue => oldValue + 1);
      if (secondsSinceNewWordRef.current > wpmDecayRate) {
        addNewTimestamp();
      }
      calculateTypingSpeed()
    }
      // setCurrentWordCount(currentWordCountRef.current);
  }, [addNewTimestamp, calculateTypingSpeed]);



  useEffect(() => {
    if(sprintIsRunningRef.current === true) {
      calculateTypingSpeed();
    }
    recentWordTimestampsRef.current = recentWordTimestamps;
  }, [recentWordTimestamps, calculateTypingSpeed])



  useEffect(() => {
    // console.log("seconds passed", secondsSinceKeystroke);
    if(sprintIsRunningRef.current && sprintIsPunishingRef.current === false && secondsSinceKeystroke >= gracePeriod) {
      console.log("setting punishing true");
      setSprintIsPunishing(true);
    }
  }, [secondsSinceKeystroke]);

  useEffect(() => {
    if(sprintIsRunning && !sprintTimer.current) {
          sprintTimer.current = !sprintTimer.current && setInterval(intervalDidTick, 1000);
    }
    sprintIsRunningRef.current = sprintIsRunning;
    console.log("sprintIsRunning", sprintIsRunning);
  }, [sprintIsRunning, intervalDidTick])

  useEffect(() => {
    addNewTimestamp();
    currentWordCountRef.current = currentWordCount;
  }, [currentWordCount, addNewTimestamp])

  function beginSprint() {
    setSprintIsReady(false);
    setSprintIsRunning(true);
    addNewTimestamp();
  }

  function didChangeWordCount(words) {
    if(sprintIsRunningRef.current) {
      if (words > currentWordCount) {
        setSecondsSinceNewWord(0);
        addNewTimestamp();
      }
      setCurrentWordCount(words);
      if(words >= wordCountGoal) {
        setSprintGoalReached(true);
      }
      calculateTypingSpeed();
    }
  }

  const splashConfetti = useCallback(() => {
    startConfettiInner();
    setTimeout(stopConfettiInner, 1000);
  },[]);

  useEffect(() => {
    console.log("sprintGoalReached", sprintGoalReached, "sprintIsRunningRef", sprintIsRunningRef.current);
    if(sprintGoalReached && sprintIsRunningRef.current) {
      splashConfetti();
    }
  }, [sprintGoalReached, splashConfetti])

  function didPushKey() {
    if(sprintIsRunning) {
      setSprintIsPunishing(false);
      setSecondsSinceKeystroke(0);
    }
  }

  function didToggleOptionsMenu() {
    setShowOptionsMenu(!showOptionsMenu);
  }

  function didChangeWordCountGoal(newGoal) {
    setWordCountGoal(newGoal);
  }

  function didChangeSprintLength(minutes) {
    console.log("didChangeSprintLength")
    setSecondsRemaining(minutes * 60);
  }

  return (
    <Container>
      <Stack gap={2}>
        <WriterStatusBar
          // wordsRemaining={wordCountGoal - currentWordCount}
          wordCountGoal={wordCountGoal}
          currentWordCount={currentWordCount}
          currentWordsPerMinute = {currentWordsPerMinute}
          secondsRemaining={secondsRemaining}
          didToggleOptionsMenu={didToggleOptionsMenu}
        />
        <WriterEditor
          beginSprint={beginSprint}
          sprintIsReady={sprintIsReady}
          sprintIsRunning={sprintIsRunning}
          didChangeWordCount={didChangeWordCount}
          didPushKey={didPushKey}
          sprintIsPunishing={sprintIsPunishing}
          // didChangeTypingSpeed={didChangeTypingSpeed}
          showOptionsMenu={showOptionsMenu}
          didToggleOptionsMenu={didToggleOptionsMenu}
          didChangeWordCountGoal={didChangeWordCountGoal}
          wordCountGoal={wordCountGoal}
          sprintLengthInMinutes={Math.floor(secondsRemaining / 60)}
          didChangeSprintLength={didChangeSprintLength}
        />
      </Stack>
    </Container>
  );
}

export default App;
