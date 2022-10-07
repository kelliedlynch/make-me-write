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

function App() {
  const gracePeriod = 2;
  const wpmDecayRate = 2;
  const sprintLengthInMinutes = 15

  const [wordCountGoal, setWordCountGoal] = useState(500);
  const [currentWordCount, setCurrentWordCount] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(sprintLengthInMinutes * 60);
  const [sprintIsRunning, setSprintIsRunning] = useState(false);
  const [sprintIsPunishing, setSprintIsPunishing] = useState(false);
  const [secondsSinceKeymash, setSecondsSinceKeymash] = useState(0);
  const [secondsSinceNewWord, setSecondsSinceNewWord] = useState(0);
  const [recentWordTimestamps, setRecentWordTimestamps] = useState([]);
  const [currentWordsPerMinute, setCurrentWordsPerMinute] = useState(0);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  let sprintTimer = useRef(null);

  const sprintIsRunningRef = useRef(sprintIsRunning);
  const secondsSinceNewWordRef = useRef(secondsSinceNewWord);
  const currentWordCountRef = useRef(currentWordCount);
  const recentWordTimestampsRef = useRef(recentWordTimestamps);
  const secondsRemainingRef = useRef(secondsRemaining);
  useEffect(() => {
    secondsSinceNewWordRef.current = secondsSinceNewWord;
    currentWordCountRef.current = currentWordCount;
    recentWordTimestampsRef.current = recentWordTimestamps;
    // console.log("setting ref", secondsRemaining);
    secondsRemainingRef.current = secondsRemaining;
    sprintIsRunningRef.current = sprintIsRunning;
  });

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
  }, [secondsRemaining, endSprint]);

  const addNewTimestamp = useCallback(() => {
    // console.log("addNewTimestamp");
    let newTimestamps = [];
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
    console.log(totalWordsWritten, timePassed)
    let wordsPerMinute = Math.floor(totalWordsWritten / (timePassed / 60));
    // only update WPM display every X seconds
    if(secondsRemainingRef.current % 2 === 0) {
      setCurrentWordsPerMinute(wordsPerMinute);
    }
    console.log("wordsPerMinute is", wordsPerMinute);
    return wordsPerMinute;
  }, []);

  const intervalDidTick = useCallback(() => {
    // console.log("setInterval sets seconds remaining", secondsRemaining - 1);
    setSecondsRemaining(oldValue => oldValue - 1);
    setSecondsSinceKeymash(oldValue => oldValue + 1);
    setSecondsSinceNewWord(oldValue => oldValue + 1);
    if(secondsSinceNewWordRef.current > wpmDecayRate) {
      addNewTimestamp();
    }
    calculateTypingSpeed()
      // setCurrentWordCount(currentWordCountRef.current);
  }, [addNewTimestamp, calculateTypingSpeed]);



  useEffect(() => {
    if(sprintIsRunningRef.current === true) {
      calculateTypingSpeed();
    }
  }, [recentWordTimestamps, calculateTypingSpeed])



  useEffect(() => {
    // console.log("seconds passed", secondsSinceKeymash);
    if(secondsSinceKeymash >= gracePeriod) {
      setSprintIsPunishing(true);
    }
  }, [secondsSinceKeymash]);

  useEffect(() => {
    console.log("sprintIsRunning has updated", sprintIsRunning);
    if(sprintIsRunning && !sprintTimer.current) {
          sprintTimer.current = !sprintTimer.current && setInterval(intervalDidTick, 1000);
    }
  }, [sprintIsRunning, intervalDidTick])

  useEffect(() => {
    addNewTimestamp();
  }, [currentWordCount, addNewTimestamp])

  function beginSprint() {
    setSprintIsRunning(true);
    addNewTimestamp();
  }

  function didChangeWordCount(words) {
    console.log("sprintIsRunningRef", sprintIsRunningRef.current);
    if(sprintIsRunningRef.current) {
      console.log("didChangeWordCount")
      if (words > currentWordCount) {
        setSecondsSinceNewWord(0);
        addNewTimestamp();
      }
      setCurrentWordCount(words);
      calculateTypingSpeed();
    }
  }

  function didMashKey() {
    if(sprintIsRunningRef.current) {
      setSprintIsPunishing(false);
      setSecondsSinceKeymash(0);
    }
  }

  // function didChangeTypingSpeed() {
  //   if(sprintIsRunningRef.current) {
  //     setCurrentWordsPerMinute(calculateTypingSpeed());
  //   }
  // }

  function didToggleOptionsMenu() {
    setShowOptionsMenu(!showOptionsMenu);
  }

  function didChangeWordCountGoal(newGoal) {
    setWordCountGoal(newGoal);
  }

  function didChangeSprintLength(minutes) {
    setSecondsRemaining(minutes * 60);
  }

  return (
    <Container>
      <Stack gap={2}>
        <WriterStatusBar
          wordsRemaining={wordCountGoal - currentWordCount}
          currentWordsPerMinute = {currentWordsPerMinute}
          secondsRemaining={secondsRemaining}
          didToggleOptionsMenu={didToggleOptionsMenu}
        />
        <WriterEditor
          beginSprint={beginSprint}
          sprintIsRunning={sprintIsRunning}
          didChangeWordCount={didChangeWordCount}
          didMashKey={didMashKey}
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
