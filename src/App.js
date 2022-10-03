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

  const [wordCountGoal, setWordCountGoal] = useState(500);
  const [currentWordCount, setCurrentWordCount] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(15);
  const [sprintIsRunning, setSprintIsRunning] = useState(false);
  const [sprintIsPunishing, setSprintIsPunishing] = useState(false);
  const [secondsSinceKeymash, setSecondsSinceKeymash] = useState(0);
  const [secondsSinceNewWord, setSecondsSinceNewWord] = useState(0);
  const [recentWordTimestamps, setRecentWordTimestamps] = useState([]);
  const [currentWordsPerMinute, setCurrentWordsPerMinute] = useState(0);

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

  const intervalDidTick = useCallback(() => {
    // console.log("setInterval sets seconds remaining", secondsRemaining - 1);
    setSecondsRemaining(oldValue => oldValue - 1);
    setSecondsSinceKeymash(oldValue => oldValue + 1);
    setSecondsSinceNewWord(oldValue => oldValue + 1);
    if(secondsSinceNewWordRef > wpmDecayRate) {
      addNewTimestamp();
    }
    // setCurrentWordCount(currentWordCountRef.current);
  }, [addNewTimestamp]);

  useEffect(() => {
    if(sprintIsRunningRef.current) {
      console.log("recentWordTimestamps", recentWordTimestamps);
      let intervals = [recentWordTimestamps[0]["timeStamp"]];
      let totalWordsWritten = 0;
      for(let i=1; i<recentWordTimestamps.length; i++) {
        if(recentWordTimestamps[i-1]["wordCount"] > recentWordTimestamps[i]["wordCount"]) {
          //word count went down this interval
        } else {
          //word count went up this interval
          totalWordsWritten += (recentWordTimestamps[i]["wordCount"] - recentWordTimestamps[i-1]["wordCount"]);
          intervals.push(recentWordTimestamps[i]["timeStamp"])
        }
      }
      // only update WPM display every X seconds
      if(secondsRemainingRef.current % 2 === 0) {
        let timePassed = (intervals[intervals.length - 1] - intervals[0]) / 1000;
        console.log(totalWordsWritten, timePassed)
        let wordsPerMinute = totalWordsWritten / (timePassed / 60);
        setCurrentWordsPerMinute(Math.floor(wordsPerMinute));
      }
    }
  }, [recentWordTimestamps])

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
    }
  }

  function didMashKey() {
    if(sprintIsRunningRef.current) {
      setSprintIsPunishing(false);
      setSecondsSinceKeymash(0);
    }
  }

  function didChangeTypingSpeed(wpm) {
    if(sprintIsRunningRef.current) {
      setCurrentWordsPerMinute(wpm)
    }
  }

  return (
    <Container>
      <Stack gap={2}>
        <WriterStatusBar
          wordsRemaining={wordCountGoal - currentWordCount}
          currentWordsPerMinute = {currentWordsPerMinute}
          secondsRemaining={secondsRemaining} />
        <WriterEditor
          beginSprint={beginSprint}
          sprintIsRunning={sprintIsRunning}
          didChangeWordCount={didChangeWordCount}
          didMashKey={didMashKey}
          sprintIsPunishing={sprintIsPunishing}
          didChangeTypingSpeed={didChangeTypingSpeed}/>
      </Stack>
    </Container>
  );
}

export default App;
