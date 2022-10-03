// React Components
import React, { useState, useEffect, useRef, useCallback } from "react";

// React-Bootstrap Components
import Form from "react-bootstrap/Form";

// App Components
// import isLetter from "./Utility";

function WriterEditor(props) {
  const didChangeWordCount = useRef((words) => props.didChangeWordCount(words));
  const didMashKey = props.didMashKey;

  // const [isPunishing, setIsPunishing] = useState(props.sprintIsPunishing);
  const [currentWordCount, setCurrentWordCount] = useState(0);
  const [writerText, setWriterText] = useState("");
  // const [recentWordTimestamps, setRecentWordTimestamps] = useState([]);

  const currentWordCountRef = useRef(currentWordCount);
  useEffect(() => {
    console.log("updating ref", currentWordCount, currentWordCountRef.current);
    currentWordCountRef.current = currentWordCount;
  });

  async function didEnterText(event) {
    let currentText = event.target.value;
    if(!props.sprintIsRunning) {
      console.log("start timer");
      props.beginSprint();
    }
    if(writerText.length <= currentText.length) {
      didMashKey();
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
      newWordCount = text.split(" ").length;
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

  return (
    <Form>
      <Form.Group>
        <Form.Control
        as="textarea"
        placeholder="Write something or else..."
        rows={3}
        onChange={event => didEnterText(event)}
        value={writerText}
        className = {props.sprintIsPunishing ? "writerEditor punishing" : "writerEditor" }
        />
      </Form.Group>
    </Form>
  );
}

export default WriterEditor;
