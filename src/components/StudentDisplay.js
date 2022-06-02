import React from "react";
import StudentRecord from "./StudentRecord";

const StudentDisplay = (props) => {
  if (props.studentList.length === 0) {
    return (
      <div className="nostudentdisplay divborderridge">
        <span>No Student Records to display</span>
      </div>
    );
  } else {
    return [
      <div className="row divborderridge">
        <div className="col s2">First Name</div>
        <div className="col s2">Last Name</div>
        <div className="col s1">Date Of Birth</div>
        <div className="col s2">Mobile</div>
        <div className="col s1">Email</div>
        <div className="col s3">Departments</div>
        <div className="col s1">Operations</div>
      </div>,
      props.studentList.map((student) => (
        <StudentRecord
          departmentList={props.departmentList}
          key={student.studentId}
          student={student}
          onStudentEdit={() => {
            props.handleEdit(student);
          }}
          onStudentDelete={() => {
            props.handleDelete(student);
          }}
        />
      )),
    ];
  }
};

export default StudentDisplay;
