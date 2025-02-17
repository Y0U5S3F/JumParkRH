import axios from "axios";

const EMPLOYEE_API_URL = "http://127.0.0.1:8000/api/employe/employes/";

export const fetchEmployes = async () => {
  try {
    const response = await axios.get(EMPLOYEE_API_URL);
    return response.data.map((emp) => ({
      id: emp.matricule,
      ...emp,
      departement: emp.departement ? emp.departement.nom : "N/A",
      service: emp.service ? emp.service.nom : "N/A",
    }));
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

// Delete an employee by matricule
export const deleteEmployee = async (matricule) => {
  try {
    await axios.delete(`${EMPLOYEE_API_URL}${matricule}/`);
    console.log("Deleted employee with matricule:", matricule);
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};

export const addEmployee = async (employeeData) => {
  try {
    const response = await axios.post(EMPLOYEE_API_URL, employeeData);
    return response;
  } catch (error) {
    console.error("Error adding employee:", error);
    throw error;
  }
};



// // Get all employee
// // Add a new employee (data passed as an argument)
// export const addEmployee = (employee) => {
//   employeesData.push({ id: Date.now(), ...employee });
//   return employeesData; // Return updated list
// };

// // Delete an employee by ID
// export const deleteEmployee = (id) => {
//   const index = employeesData.findIndex(emp => emp.id === id);
//   if (index !== -1) employeesData.splice(index, 1);
//   return employeesData;
// };
