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
appStart();