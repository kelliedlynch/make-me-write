// React Components
import React, { useState, useEffect, useRef } from "react";

// React-Bootstrap Components
import {Offcanvas, InputGroup, Form, Stack, Button, OverlayTrigger, Tooltip, Badge, Popover} from "react-bootstrap";
// import RangeSlider from "react-bootstrap-range-slider";

// App Components
// import isLetter from "./Utility";

function WriterOptionsMenu(props) {
  // const didChangeSprintLength = props.didChangeSprintLength;
  const [wordCountGoal, setWordCountGoal] = useState(props.wordCountGoal)
  const [sprintLengthInMinutes, setSprintLengthInMinutes] = useState(props.sprintLengthInMinutes)

  // const sprintMinutesField = useRef(null);
  const wordCountGoalTooltip = (
    // <>
      <Tooltip id={"goal-tooltip"}>Number of words to write this sprint.</Tooltip>
    // </>
    // <Popover id="popover-basic">
    //   <Popover.Header as="h3">Popover right</Popover.Header>
    //   <Popover.Body>
    //     And here's some <strong>amazing</strong> content. It's very engaging.
    //     right?
    //   </Popover.Body>
    // </Popover>
  );

  function numberValidator(value, setter) {
    const re = /^[0-9\b]+$/;
    console.log("value", value, "test", re.test(value));
    if (value === '' || re.test(value)) {
      console.log("should be setting");
      setter(value);
    }
  }

  // const submitWordCountOnEnter = event => { if( event.key === "Enter" ) props.didChangeWordCountGoal(wordCountGoal); }
  // const submitTimeOnEnter = event => { if(event.key === "Enter") props.didChangeSprintLength(sprintLengthInMinutes); }


  function submitSprintOptions() {
    props.didChangeSprintLength(sprintLengthInMinutes);
    props.didChangeWordCountGoal(wordCountGoal);
    props.hideOptionsMenu();
  }

  return (
    <Offcanvas show={props.show} placement={"start"} onHide={props.hide}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Options Menu</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
          <Stack gap={3}>
            {/*<InputGroup>*/}
            {/*  <InputGroup.Text id="basic-addon1">Goal</InputGroup.Text>*/}
            {/*  <Form.Control*/}
            {/*    value={wordCountGoal.toString()}*/}
            {/*    onChange={e => numberValidator(e.target.value, setWordCountGoal)}*/}

            {/*  />*/}
            {/*  <InputGroup.Text id="basic-addon1">words</InputGroup.Text>*/}
            {/*</InputGroup>*/}

            <Form>
              <Form.Group as={Stack} direction={"horizontal"}>

                <Form.Label column>Goal:
                  <OverlayTrigger
                    placement="right"
                    trigger="click"
                    overlay={wordCountGoalTooltip}
                  >
                    {/*<Button*/}
                    {/*  variant="success"*/}
                    {/*  size="sm">ⓘ</Button>*/}
                    <div className={"tooltipIcon"}>i</div>
                  </OverlayTrigger>

                </Form.Label>


                <Form.Range
                  value={wordCountGoal.toString()}
                  onChange={e => setWordCountGoal(e.target.value)}
                  min={1}
                  max={2000}
                />

                <InputGroup>
                  <Form.Control
                    value={wordCountGoal.toString()}
                    onChange={e => numberValidator(e.target.value, setWordCountGoal)}
                  />
                  <InputGroup.Text id="basic-addon1">words</InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </Form>



            <Form className={"ms-auto"}>
              <Form.Group as={Stack} direction={"horizontal"}>
                <Form.Label column>Time:</Form.Label>

                <Form.Range
                  value={sprintLengthInMinutes.toString()}
                  onChange={e => setSprintLengthInMinutes(e.target.value)}
                  min={1}
                  max={120}
                />

                <InputGroup>
                  <Form.Control
                    value={sprintLengthInMinutes.toString()}
                    onChange={e => numberValidator(e.target.value, setSprintLengthInMinutes)}
                  />
                  <InputGroup.Text id="basic-addon1">minutes</InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </Form>

          </Stack>
          <Button onClick={submitSprintOptions}>Submit</Button>
      </Offcanvas.Body>
    </Offcanvas>
  )
}

export default WriterOptionsMenu;