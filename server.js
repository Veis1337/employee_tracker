const mysql = require("mysql2");
const inquirer = require("inquirer");

const db = mysql.createConnection(
    {
    host: "localhost",
    user: "root",
    password: "water1",
    database: "employee_db",
},
    console.log("Connected to the employee_db database.")
);
// Home page upon boot
const appStart = () => {
    return inquirer
        .prompt([
            {
                type: "list",
                name: "whereTo",
                message: "Where to?",
                choices: [
                    "View All Departments",
                    "View All Roles",
                    "View All Employees",
                    "Add a Department",
                    "Add an Employee",
                    "Add an Employee Role",
                    "Update Employee Role",
                ],
            },
        ])
        .then((data) => {
            switch (data.whereTo) {
                case "View All Departments":
                    Departments();
                    break;
                case "View All Roles":
                    Roles();
                    break;
                case "View All Employees":
                    Employees();
                    break;
                case "Add a Department":
                    addDept();
                    break;
                case "Add an Employee":
                    addEmp();
                    break;
                case "Add an Employee Role":
                    addRole();
                    break;
                case "Update Employee Role":
                    updateRole();
                    break;
            }
        });
};

function Departments() {
    db.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        appStart();
    });
};

function Roles() {
    db.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        console.table(res);
        appStart();
    });
};

function Employees() {
    db.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.table(res);
        appStart();
    });
};

function addDept() {
    inquirer
        .prompt([
            {
                name: "newDept",
                type: "input",
                message: "What is the name of the Department you would like to add?",
            },
        ])
        .then((res) => {
            const query = {
                dept_name: res.newDept,
            };
            db.query("INSERT INTO department SET ?", query, (err) => {
                if (err) throw err;
                appStart();
            })
        });
};

function addEmp() {
    inquirer
        .prompt([
            {
                name: "first",
                type: "input",
                message: "First Name?",
            },
            {
                name: "last",
                type: "input",
                message: "Last Name?",
            },
            {
                name: "role",
                type: "list",
                message: "Role? 1-Sales Lead, 2-Salesperson, 3-Lead Engineer, 4-Software Engineer, 5-Account Manager, 6-Accountant, 7-Legal Team Lead, 8-Lawyer",
                choices: [1, 2, 3, 4, 5, 6, 7, 8],
            },
            {
                name: "manager",
                type: "list",
                message: "Manager? 1-John Doe, 2-Mike Chan, 3-Ashley Rodriguez, 4-Kevin Tupik, 5-Kunal Singh, 6-Malia Brown, 7-Sarah Lourd, 8-Tom Allen",
                choices: [1, 2, 3, 4, 5, 6, 7, 8],
            },
        ])
        .then ((res) => {
            const newEmployee = {
                first_name: res.first,
                last_name: res.last,
                role_id: res.role,
                manager_id: res.manager,   
            };

            db.query("INSERT INTO employee SET ?", newEmployee, (err) => {
                if (err) throw err;
                appStart();
            });
        });
};

function addRole() {
    inquirer
        .prompt([
            {
                name: "newRole",
                type: "input",
                message: "What is the name of the Role you would like to add?",
            },
            {
                name: "newSalary",
                type: "input",
                message: "What is the salary of this new role?",
            },
            {
                name: "department",
                type: "list",
                message: "What department does this new role fall under? 1-Engineering, 2-Fincance, 3-Legal, 4-Sales",
                choices: [1, 2, 3, 4],
            },
        ])
        .then((res) => {
            const query = {
                title: res.newRole,
                salary: res.newSalary,
                dept_id: res.department,
            };
            db.query("INSERT INTO role SET ?", query, (err) => {
                if (err) throw err;
                appStart();
            })
        });
};

function updateRole() {
    
};
appStart();