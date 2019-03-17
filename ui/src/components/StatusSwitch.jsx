import React from "react"
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import axios from 'axios';

class StatusSwitch extends React.Component {
    constructor(props) {
        super(props)
    
        this.state  = {
            checked: true,
            status: "Running"
        }

        this.handleChange = this.handleChange.bind(this)
      }
    
    handleChange = event => {
        if (event.target.checked) {
            axios.put('http://localhost:8080/resume')
        } else {
            axios.put('http://localhost:8080/pause')
        }
        
        this.setState({
            checked: event.target.checked,
            status: event.target.checked  ? "Running" : "Paused",
        })
    };
    
    render() {
        return (
            <FormControlLabel
              control={
                <Switch
                  checked={this.props.status}
                  onChange={this.handleChange}
                />
              }
              label={this.state.status}
            />
        )
    };
};

 export default StatusSwitch