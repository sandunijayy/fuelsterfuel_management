import Employee from "../model/adminStaffModel.js"

export const addEmployee = async (req, res) => {
    const { fullName, email, position, joinDate, username, password } = req.body;

    try {
        if (!fullName || !email || !position || !joinDate || !username || !password) {
            throw new Error("Please fill in all fields.");
        }

        const emailExists = await Employee.findOne({ email });
        if (emailExists) return res.status(400).json({ message: "Email is already used." });

        const usernameExists = await Employee.findOne({ username });
        if (usernameExists) return res.status(400).json({ message: "Username is already used." });

        // You can choose to hash the password like in the signup controller if needed
        const employeeDocument = await Employee.create({
            fullName,
            email,
            position,
            joinDate,
            username,
            password, // You can hash it before saving if you like
        });

        if (employeeDocument) {
            return res.status(201).json({
                employee: {
                    id: employeeDocument._id,
                    fullName: employeeDocument.fullName,
                    email: employeeDocument.email,
                    position: employeeDocument.position,
                    joinDate: employeeDocument.joinDate.toISOString().split('T')[0],
                    username: employeeDocument.username,
                },
                message: "Employee added successfully."
            });
        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find(); // Fetch all employees
        if (!employees || employees.length === 0) {
            return res.status(404).json({ message: "No employees found." });
        }

        res.status(200).json({ employees });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getEmployeeById = async (req, res) => {
    const { id } = req.params;

    try {
        const employee = await Employee.findById(id); // Find employee by ID

        if (!employee) {
            return res.status(404).json({ message: "Employee not found." });
        }

        // Send the employee details in response
        res.status(200).json({
            employee: {
                id: employee._id,
                fullName: employee.fullName,
                email: employee.email,
                position: employee.position,
                joinDate: employee.joinDate.toISOString().split('T')[0], // Format Date
                username: employee.username,
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { fullName, email, position, joinDate, username, password } = req.body;

    try {
        // Check if the employee exists
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found." });
        }

        // Check if email or username already exists for another employee
        const emailExists = await Employee.findOne({ email, _id: { $ne: id } });
        if (emailExists) return res.status(400).json({ message: "Email is already used." });

        const usernameExists = await Employee.findOne({ username, _id: { $ne: id } });
        if (usernameExists) return res.status(400).json({ message: "Username is already used." });

        // Update employee details
        employee.fullName = fullName || employee.fullName;
        employee.email = email || employee.email;
        employee.position = position || employee.position;
        employee.joinDate = joinDate ? new Date(joinDate) : employee.joinDate;
        employee.username = username || employee.username;
        if (password) employee.password = password; // Hash if needed

        const updatedEmployee = await employee.save();

        res.status(200).json({
            employee: {
                id: updatedEmployee._id,
                fullName: updatedEmployee.fullName,
                email: updatedEmployee.email,
                position: updatedEmployee.position,
                joinDate: updatedEmployee.joinDate.toISOString().split('T')[0], // Format Date
                username: updatedEmployee.username,
            },
            message: "Employee updated successfully."
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        const employee = await Employee.findById(id);

        if (!employee) {
            return res.status(404).json({ message: "Employee not found." });
        }

        // Delete the employee
        await Employee.findByIdAndDelete(id);

        res.status(200).json({ message: "Employee deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};