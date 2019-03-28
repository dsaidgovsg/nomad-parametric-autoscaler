import React from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import axios from "axios";

class StatusSwitch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: true,
      status: "Running"
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    if (event.target.checked) {
      const resumeUrl = new URL(
        "/resume",
        window.config.env.REACT_APP_NOPAS_ENDPOINT
      );
      axios.put(resumeUrl);
    } else {
      const pauseUrl = new URL(
        "/pause",
        window.config.env.REACT_APP_NOPAS_ENDPOINT
      );
      axios.put(pauseUrl);
    }

    this.setState({
      checked: event.target.checked,
      status: event.target.checked ? "Running" : "Paused"
    });
  }

  render() {
    return (
      <FormControlLabel
        control={
          <Switch checked={this.state.checked} onChange={this.handleChange} />
        }
        label={this.state.status}
      />
    );
  }
}

export default StatusSwitch;
