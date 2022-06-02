import React, { Component } from "react";
import Multiselect from "multiselect-react-dropdown";
//import StudentService from "../service/StudentService";
import StudentService from "../service/StudentService";
import DepartmentService from "../service/DepartmentService";
import StudentDisplay from "./StudentDisplay";
import "react-datepicker/dist/react-datepicker.css";
import CustomDatePicker from "./CustomDatePicker";
import { FormErrors } from "./FormErrors";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departmentSelected: [],
      departmentList: [],
      studentsList: [],
      formErrors: { email: "", mobile: "" },
      emailValid: false,
      mobileValid: false,
      formValid: false,
      buttonStatus: "Add",
      currentStudent: { dateOfBirth: this.getdateString(new Date()) },
    };
  }

  componentDidMount = async () => {
    const departmentService = new DepartmentService();
    let currentDepartmentList = await departmentService.getAllDepartments();
    this.setState({
      departmentList: [...this.state.departmentList, ...currentDepartmentList],
    });

    const studentService = new StudentService();
    let currentStudentsList = await studentService.getAllStudents();

    this.setState({
      studentsList: [...this.state.studentsList, ...currentStudentsList],
    });
  };

  onFirstNameChange = (e) => {
    this.setState({
      currentStudent: {
        ...this.state.currentStudent,
        firstName: e.target.value,
      },
    });
  };

  onLastNameChange = (e) => {
    this.setState({
      currentStudent: {
        ...this.state.currentStudent,
        lastName: e.target.value,
      },
    });
  };

  onEmailChange = (e) => {
    this.validateField("email", e.target.value);
    this.setState({
      currentStudent: {
        ...this.state.currentStudent,
        email: e.target.value,
      },
    });
  };

  onMobileChange = (e) => {
    this.validateField("mobile", e.target.value);
    this.setState({
      currentStudent: {
        ...this.state.currentStudent,
        mobile: e.target.value,
      },
    });
  };

  departmentAddedOrRemoved = (selected) => {
    this.setState({
      departmentSelected: selected,
    });
  };

  setDepartments = () => {
    let selectedDepartments = this.state.departmentSelected
      .map((option) => option.departmentId)
      .join(",");
    let newStudentData = this.state.currentStudent;
    newStudentData.departments = selectedDepartments;
    this.setState({
      currentStudent: newStudentData,
    });
  };

  handleDateChange = (changedDate) => {
    let newStudentData = this.state.currentStudent;
    newStudentData.dateOfBirth = this.getdateString(changedDate);
    this.setState({ currentStudent: newStudentData });
  };

  getdateString = (date) => {
    return (
      date.getDate().toString().padStart(2, "0") +
      "/" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "/" +
      date.getFullYear()
    );
  };

  getISODate = (currentDateString) => {
    let newformattedDate =
      currentDateString === undefined
        ? new Date()
        : Date.parse(
            currentDateString.substring(3, 5) +
              "/" +
              currentDateString.substring(0, 2) +
              "/" +
              currentDateString.substring(6, 10)
          );
    return newformattedDate;
  };

  handleEdit = (selectedstudent) => {
    let selectedDepartments = selectedstudent.departments
      .split(",")
      .map(Number);
    console.log(selectedDepartments);
    let newOptionsSelected = this.state.departmentList.filter((deparment) =>
      selectedDepartments.includes(deparment.departmentId)
    );
    this.setState({
      buttonStatus: "Update",
      currentStudent: selectedstudent,
      departmentSelected: newOptionsSelected,
      mobileValid: true,
      emailValid: true,
      formValid: true,
    });
  };

  handleDelete = (selectedstudent) => {
    const studentService = new StudentService();
    studentService.deleteStudent(selectedstudent.studentId).then((result) => {
      if (result.status === 204) {
        alert("Student Deleted Successfully.");
      }

      let updatedstudentsList = this.state.studentsList.filter(
        (student) => student.studentId !== selectedstudent.studentId
      );

      this.setState({
        studentsList: updatedstudentsList,
      });
    });
  };

  handleReset = () => {
    let emptyStudent = { dateOfBirth: this.getdateString(new Date()) };
    this.setState({
      currentStudent: emptyStudent,
      departmentSelected: [],
      buttonStatus: "Add",
      formValid: false,
      emailValid: false,
      mobileValid: false,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setDepartments();
    let emptyStudent = { dateOfBirth: this.getdateString(new Date()) };
    const studentService = new StudentService();
    if (this.state.buttonStatus === "Add") {
      studentService.addStudent(this.state.currentStudent).then((result) => {
        if (result.status === 201) {
          let newStudent = result.data;
          this.setState({
            studentsList: [...this.state.studentsList, newStudent],
            currentStudent: emptyStudent,
            departmentSelected: [],
            formValid: false,
            emailValid: false,
            mobileValid: false,
          });
          alert("Student Added Successfully.");
          event.target.reset();
        }
      });
    } else if (this.state.buttonStatus === "Update") {
      studentService.updateStudent(this.state.currentStudent).then((result) => {
        console.log(result);
        if (result.status === 204) {
          let newStudentList = this.state.studentsList.filter(
            (student) =>
              student.studentId !== this.state.currentStudent.studentId
          );
          let currentStudent = this.state.currentStudent;
          this.setState({
            studentsList: [...newStudentList, currentStudent],
            currentStudent: emptyStudent,
            departmentSelected: [],
            buttonStatus: "Add",
            formValid: false,
            emailValid: false,
            mobileValid: false,
          });
          alert("Student Details Updated Successfully.");
          event.target.reset();
        }
      });
    }
  };

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;
    let mobileValid = this.state.mobileValid;

    switch (fieldName) {
      case "email":
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.email = emailValid ? "" : " is invalid";
        break;
      case "mobile":
        console.log(value);
        mobileValid = value.match(/^[0-9]{10}$/i);
        fieldValidationErrors.mobile = mobileValid
          ? ""
          : " is too short or not in the correct format";
        break;
      default:
        break;
    }

    this.setState(
      {
        formErrors: fieldValidationErrors,
        emailValid: emailValid,
        mobileValid: mobileValid,
      },
      this.validateForm
    );
  }
  validateForm = () => {
    this.setState({
      formValid: this.state.emailValid && this.state.mobileValid,
    });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <h3 className="center">Student Management System</h3>
          <div className="divborder">
            <div className="row">
              <div className="col s6">
                <label htmlFor="firstName" className="inputlabel">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  maxLength="50"
                  required
                  value={this.state.currentStudent.firstName}
                  onChange={this.onFirstNameChange}
                />
              </div>
              <div className="col s6">
                <label htmlFor="lastName" className="inputlabel">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  maxLength="50"
                  required
                  value={this.state.currentStudent.lastName}
                  onChange={this.onLastNameChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col s6">
                <label htmlFor="dateOfBirth" className="inputlabel">
                  Date of birth
                </label>
                <CustomDatePicker
                  currentDate={this.getISODate(
                    this.state.currentStudent.dateOfBirth
                  )}
                  handleChange={this.handleDateChange}
                />
              </div>
              <div className="col s6">
                <label htmlFor="mobile" className="inputlabel">
                  Mobile
                </label>
                <input
                  id="mobile"
                  type="text"
                  maxLength="10"
                  className="validate"
                  required
                  value={this.state.currentStudent.mobile}
                  onChange={this.onMobileChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col s6">
                <label htmlFor="email" className="inputlabel">
                  Email{" "}
                </label>
                <input
                  id="email"
                  type="Email"
                  maxLength="320"
                  required
                  value={this.state.currentStudent.email}
                  onChange={this.onEmailChange}
                />
              </div>
              <div className="col s6 divwithFixedHight">
                <label className="inputlabel">Departments</label>
                <Multiselect
                  options={this.state.departmentList}
                  selectedValues={this.state.departmentSelected}
                  onSelect={this.departmentAddedOrRemoved}
                  onRemove={this.departmentAddedOrRemoved}
                  displayValue="name"
                />
              </div>
              <div className="row">
                <div className="col s6">
                  <button
                    className="btn"
                    type="submit"
                    disabled={!this.state.formValid}
                  >
                    {this.state.buttonStatus}
                  </button>
                  <input
                    type="reset"
                    className="btn"
                    onClick={this.handleReset}
                  />
                </div>
                <div className="col s6"></div>
              </div>
            </div>
            <div className="panel panel-default">
              <FormErrors formErrors={this.state.formErrors} />
            </div>
          </div>
          <div>
            <StudentDisplay
              studentList={this.state.studentsList}
              handleEdit={this.handleEdit}
              handleDelete={this.handleDelete}
              departmentList={this.state.departmentList}
            />
          </div>
        </div>
      </form>
    );
  }
}

export default App;
