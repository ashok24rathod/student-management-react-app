import axios from "axios";

class StudentService {
  getAllStudents = async () => {
    const response = await axios
      .get("http://localhost:5000/api/student")
      .then((response) => response.data)
      .catch((error) => console.log("This is the error " + error));
    return response;
  };

  deleteStudent = async (studentId) => {
    const response = await axios
      .delete("http://localhost:5000/api/student/ +" + studentId)
      .then((response) => response)
      .catch((error) => console.log("This is the error " + error));
    return response;
  };

  addStudent = async (student) => {
    const response = await axios
      .post("http://localhost:5000/api/student", student)
      .then((response) => response)
      .catch((error) => console.log("This is the error " + error));
    return response;
  };

  updateStudent = async (student) => {
    const response = await axios
      .put("http://localhost:5000/api/student/" + student.studentId, student)
      .then((response) => response)
      .catch((error) => console.log("This is the error " + error));
    return response;
  };
}

export default StudentService;
