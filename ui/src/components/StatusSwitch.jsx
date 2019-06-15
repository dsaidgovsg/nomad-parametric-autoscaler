import React from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import axios from "axios";

// TODO convert to functional
class StatusSwitch extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    if (event.target.checked) {
      const resumeUrl = new URL(
        "/state/resume",
        window.config.env.REACT_APP_NOPAS_ENDPOINT
      );
      axios.put(resumeUrl);
    } else {
      const pauseUrl = new URL(
        "/state/pause",
        window.config.env.REACT_APP_NOPAS_ENDPOINT
      );
      axios.put(pauseUrl);
    }

    this.props.refreshState()
  }

  render() {
    return (
      <FormControlLabel
        control={
          <Switch checked={this.props.isRunning} onChange={this.handleChange} />
        }
        label={this.props.isRunning ? "Running" : "Paused"}
      />
    );
  }
}

export default StatusSwitch;
