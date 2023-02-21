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
                message: "What is the employee's role?",
                choices: ["Sales Lead", "Salesperson", "Lead Engineer", "Software Engineer", "Account Manager", "Accountant", "Legal Team Lead", "Lawyer"],
            },
            {
                name: "manager",
                type: "list",
                message: "Who is the employee's manager?",
                choices: ["John Doe", "Mike Chan", "Ashley Rodriguez", "Kevin Tupik", "Kunal Singh", "Malia Brown", "Sarah Lourd", "Tom Allen"],
            },
        ])
        .then ((res) => {
            const newEmployee = {
                first_name: res.first,
                last_name: res.last,
                manager_id: manager_id,
                role_id: role_id,
            };

            db.query("INSERT INTO employee SET ?", newEmployee, (err) => {
                if (err) throw err;
                appStart();
            });
        });
};

function updateRole() {

    

}
appStart();