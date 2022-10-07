// React Components
import React, { useState, useEffect, useRef, useCallback } from "react";

// React-Bootstrap Components
import {Offcanvas, InputGroup, Form, Stack, Row, Col} from "react-bootstrap";
import RangeSlider from "react-bootstrap-range-slider";

// App Components
// import isLetter from "./Utility";

function WriterOptionsMenu(props) {
  const didChangeSprintLength = props.didChangeSprintLength;
  const [wordCountGoal, setWordCountGoal] = useState(props.wordCountGoal)
  const [sprintLengthInMinutes, setSprintLengthInMinutes] = useState(props.sprintLengthInMinutes)

  const sprintMinutesField = useRef(null);

  const submitWordCountOnEnter = event => { if( event.key === "Enter" ) props.didChangeWordCountGoal(wordCountGoal); }
  // const submitTimeOnEnter = event => { if(event.key === "Enter") props.didChangeSprintLength(sprintLengthInMinutes); }

  useEffect(() => {
    didChangeSprintLength(sprintLengthInMinutes);
  }, [sprintLengthInMinutes, didChangeSprintLength])

  return (
    <Offcanvas show={props.show} placement={"bottom"} onHide={props.hide}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Options Menu</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Stack direction={"horizontal"}>
          <InputGroup>
            <InputGroup.Text id="basic-addon1">Goal</InputGroup.Text>
            <Form.Control
              defaultValue={wordCountGoal.toString()}
              onKeyDown={submitWordCountOnEnter}
              onChange={event => setWordCountGoal(event.target.value)}
            />
            <InputGroup.Text id="basic-addon1">words</InputGroup.Text>
          </InputGroup>

          <Form>

            <Form.Group as={Stack} direction={"horizontal"}>
              <Form.Label column sm="4">
                Time:
              </Form.Label>

              <Form.Range
                value={sprintLengthInMinutes.toString()}
                onChange={e => setSprintLengthInMinutes(e.target.value)}
                min={1}
                max={120}
              />


              <Form.Control
                value={sprintLengthInMinutes.toString()}
                onChange={e => setSprintLengthInMinutes(e.target.value)}
                ref={sprintMinutesField}
              />

            </Form.Group>
          </Form>

        </Stack>
      </Offcanvas.Body>
    </Offcanvas>
  )
}

export default WriterOptionsMenu;