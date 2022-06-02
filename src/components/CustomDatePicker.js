import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class CustomDatePicker extends Component {
  render() {
    return (
      <DatePicker
        selected={this.props.currentDate}
        maxDate={new Date()}
        dateFormat="dd/MM/yyyy"
        placeholderText="Select Date of birth"
        onChange={(date) => this.props.handleChange(date)}
      />
    );
  }
}

export default CustomDatePicker;
