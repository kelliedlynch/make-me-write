// React Components
import React, { useState, useEffect } from "react";

// React-Bootstrap Components
import { Stack, Button } from "react-bootstrap";

function WriterStatusBar(props) {
	// const timeyWimey = new ;
	// const [secondsRemaining, setSecondsRemaining] = useState(props.secondsRemaining);
	const [timeAsString, setTimeAsString] = useState("")
	const [showOptionsMenu, setShowOptionsMenu] = useState(false);

	useEffect(() => {
		// console.log("secondsRemaining", secondsRemaining);
		setTimeAsString(new Date(props.secondsRemaining * 1000).toISOString().substr(11, 8));
	}, [props.secondsRemaining, setTimeAsString])

	function toggleOptionsMenu() {
		props.didToggleOptionsMenu();
	}

	return (
		<Stack direction="horizontal">
			<Button variant={"light"} onClick={toggleOptionsMenu}>☰</Button>
      <div>Goal: {props.wordsRemaining}</div>
			<div className="ms-auto">WPM: {props.currentWordsPerMinute}</div>
      <div className="ms-auto">Time: {timeAsString}</div>
    </Stack>
	);
}

export default WriterStatusBar;
