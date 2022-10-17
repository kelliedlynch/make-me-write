// React Components
import React, { useState, useEffect, useRef, useCallback } from "react";

// React-Bootstrap Components
import Form from "react-bootstrap/Form";

// App Components
// import isLetter from "./Utility";
import WriterOptionsMenu from "./WriterOptionsMenu";
// import { startConfettiInner, stopConfettiInner } from "./ConfettiAnimation";

function WriterEditor(props) {
  const didChangeWordCount = useRef((words) => props.didChangeWordCount(words));
  const didPushKey = props.didPushKey;
  const showOptionsMenu = props.showOptionsMenu;
  // const sprintIsPunishing = props.sprintIsPunishing;

  // const [sprintIsPunishing, setSprintIsPunishing] = useState(props.sprintIsPunishing);
  const [currentWordCount, setCurrentWordCount] = useState(0);
  const [writerText, setWriterText] = useState("");
  // const [recentWordTimestamps, setRecentWordTimestamps] = useState([]);
  // const [showOptionsMenu, setShowOptionsMenu] = useState(props.showOptionsMenu);

  const currentWordCountRef = useRef(currentWordCount);
  useEffect(() => {
    console.log("updating ref", currentWordCount, currentWordCountRef.current);
    currentWordCountRef.current = currentWordCount;
  });

  async function didEnterText(event) {
    let currentText = event.target.value;
    if(props.sprintIsReady) {
      console.log("start timer");
      props.beginSprint();
    }
    if(writerText.length <= currentText.length) {
      didPushKey();
    }
    setWriterText(currentText);
    // console.log(event.target.value.slice(-1), isLetter(event.target.value.slice(-1)));
  }

  // function countWords(text) {
  const countWords = useCallback((text) => {
    let newWordCount;
    if(text === "") {
      newWordCount = 0;
    } else {
      // TODO: better word count logic
      newWordCount = text.split(" ").length - 1;
      if(newWordCount < 0) { newWordCount = 0 }
    }
    return newWordCount;
  }, []);

  useEffect(() => {
    let wordCount = countWords(writerText);
    console.log("writerText changed", wordCount, currentWordCountRef);
    if(wordCount !== currentWordCountRef.current) {
      console.log("calling didChangeWordCount")
      didChangeWordCount.current(wordCount);
      setCurrentWordCount(wordCount);
    }
  }, [writerText, countWords]);

  function hideOptionsMenu() {
    props.didToggleOptionsMenu();
  }

  return (
    <>
      <Form>
        <Form.Group>
          <Form.Control
          as="textarea"
          placeholder="Write something or else..."
          rows={8}
          onChange={event => didEnterText(event)}
          value={writerText}
          className = {props.sprintIsPunishing ? "writerEditor punishing" : "writerEditor" }
          />
        </Form.Group>
      </Form>
      <WriterOptionsMenu
        show={showOptionsMenu}
        hide={hideOptionsMenu}
        wordCountGoal={props.wordCountGoal}
        didChangeWordCountGoal={props.didChangeWordCountGoal}
        sprintLengthInMinutes={props.sprintLengthInMinutes}
        didChangeSprintLength={props.didChangeSprintLength}
        hideOptionsMenu={hideOptionsMenu}
      />
    </>
  );
}

export default WriterEditor;
