// React Components
import React, { useState, useEffect } from "react";

// React-Bootstrap Components
import Stack from "react-bootstrap/Stack";

function WriterStatusBar(props) {
	// const timeyWimey = new ;
	// const [secondsRemaining, setSecondsRemaining] = useState(props.secondsRemaining);
	const [timeAsString, setTimeAsString] = useState("")

	useEffect(() => {
		// console.log("secondsRemaining", secondsRemaining);
		setTimeAsString(new Date(props.secondsRemaining * 1000).toISOString().substr(11, 8));
	}, [props.secondsRemaining, setTimeAsString])

	return (
		<Stack direction="horizontal">
      <div>Goal: {props.wordsRemaining}</div>
			<div className="ms-auto">WPM: {props.currentWordsPerMinute}</div>
      <div className="ms-auto">Time: {timeAsString}</div>
    </Stack>
	);
}

export default WriterStatusBar;
