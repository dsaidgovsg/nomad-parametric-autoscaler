import React, { useState, useEffect } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import axios from "axios";

const StatusSwitch = () => {
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    const stateUrl = new URL(
      "/state",
      window.config.env.REACT_APP_NOPAS_ENDPOINT
    );

    axios.get(stateUrl)
    .then(rsp => setIsRunning(rsp.data))
    .catch(function (error) {
      console.log(error);
    })
  }, []);

  const handleChange = (event) => {
    if (event.target.checked) {
      const resumeUrl = new URL(
        "/state/resume",
        window.config.env.REACT_APP_NOPAS_ENDPOINT
      );
      axios.put(resumeUrl)
      .then(rsp => setIsRunning(true))
      .catch(err => {console.log(err)})

    } else {
      const pauseUrl = new URL(
        "/state/pause",
        window.config.env.REACT_APP_NOPAS_ENDPOINT
      );
      axios.put(pauseUrl)
      .then(rsp => setIsRunning(false))
      .catch(err => {console.log(err)})
    }
  }

  return (
    <FormControlLabel
      control={
        <Switch checked={isRunning} onChange={handleChange} />
      }
      label={isRunning ? "Running" : "Paused"}
    />
  );
}

export default StatusSwitch;
