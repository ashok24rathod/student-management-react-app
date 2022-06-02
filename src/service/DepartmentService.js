import axios from "axios";

class DepartmentService {
  getAllDepartments = async () => {
    const response = await axios
      .get("http://localhost:5000/api/department")
      .then((response) => response.data)
      .catch((error) =>
        console.log("There is some error in retrieving departments " + error)
      );
    return response;
  };
}

export default DepartmentService;
