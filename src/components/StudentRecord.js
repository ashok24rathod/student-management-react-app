import React, { Component } from "react";

class StudentRecord extends Component {
  getDepartmentDisplay = (departments) => {
    if (departments !== null) {
      let departmentIds = departments.split(",").map(Number);
      let usedDepartments = this.props.departmentList.filter((department) => {
        if (departmentIds.includes(department.departmentId)) {
          return department;
        } else {
          return null;
        }
      });

      return (
        <div>
          {usedDepartments.map((department) => {
            return (
              <p className="dept" key={department.departmentId}>
                {" "}
                {department.name}
              </p>
            );
          })}
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  render() {
    return (
      <div className="row divborderrecord" key={this.props.student.studentId}>
        <div className="col s2">
          <label>{this.props.student.firstName}</label>
        </div>
        <div className="col s2">
          <label>{this.props.student.lastName}</label>
        </div>
        <div className="col s1">
          <label>{this.props.student.dateOfBirth}</label>
        </div>
        <div className="col s2">
          <label>{this.props.student.mobile}</label>
        </div>
        <div className="col s1">
          <label>{this.props.student.email}</label>
        </div>
        <div className="col s3">
          {this.getDepartmentDisplay(this.props.student.departments)}
        </div>
        <div className="col s1 opcol">
          <input
            type="button"
            className="btn"
            onClick={this.props.onStudentEdit}
            value="Edit"
          />
          <input
            type="button"
            className="btn"
            value="Delete"
            onClick={this.props.onStudentDelete}
          />
        </div>
      </div>
    );
  }
}

export default StudentRecord;
