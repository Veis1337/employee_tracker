const mysql = require("mysql2");
const inquirer = require("inquirer");
require('console.table')

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
    const query = `SELECT
    role.id,
    role.title,
    role.salary,
    role.title,
    department.dept_name AS department,
    role.dept_id
    FROM
    role
    LEFT JOIN department on role.dept_id = department.id;`;
        db.query(query, function (err, res) {
            if (err) throw err;
            console.table(res);
            appStart();
        });
};

function Employees() {
    const query = `SELECT
    employee.id,
    employee.first_name,
    employee.last_name,
    role.title,
    department.dept_name AS department,
    role.salary,
    CONCAT(manager.first_name, " ", manager.last_name) AS manager
    FROM
    employee
    LEFT JOIN role on employee.role_id = role.id
    LEFT JOIN department on role.dept_id = department.id
    LEFT JOIN employee manager on manager.id = employee.manager_id;`;
        db.query(query, function (err, res) {
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

async function addEmp() {
    const data = await db.promise().query("SELECT * FROM role;");
    const data2 = await db.promise().query("SELECT * FROM employee;");
    const empDb = await data2[0].map(({ first_name, last_name, id }) => ({
        name: first_name + " " + last_name,
        value: id,
    }))
    const roleDb = await data[0].map(({ title, id }) => ({
        name: title,
        value: id,
    }))
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
                message: "Role?",
                choices: roleDb,
            },
            {
                name: "manager",
                type: "list",
                message: "Who is their manager?",
                choices: empDb,
            },
        ])
        .then((res) => {
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

async function addRole() {
    const data = await db.promise().query("SELECT * FROM department;");
    const deptDb = await data[0].map(({ dept_name, id }) => ({
        name: dept_name,
        value: id,
    }))
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
                message: "What department does this new role fall under?",
                choices: deptDb,
            },
        ])
        .then((res) => {
            const roleNew = {
                title: res.newRole,
                salary: res.newSalary,
                dept_id: res.department,
            };

            db.query("INSERT INTO role SET ?", roleNew, (err) => {
                if (err) throw err;
                appStart();
            })
        });
};

async function updateRole() {
    const data = await db.promise().query("SELECT * FROM role;");
    const data2 = await db.promise().query("SELECT * FROM employee;");

    const roleDb = await data[0].map(({ title, id }) => ({
        name: title,
        value: id,
    }))
    const empDb = await data2[0].map(({ first_name, last_name, id}) => ({
        name: first_name + " " + last_name,
        value: id,
    }))

    inquirer
        .prompt([
            {
                type: "list",
                name: "empList",
                message: "Select the employee you wish to update",
                choices: empDb
            },
            {
                type: "list",
                name: "roleList",
                message: "Select the new role for this employee",
                choices: roleDb
            },
        ])
        .then((res) => {
            db.query(`UPDATE employee SET role_id = ${res.roleList} WHERE id = ${res.empList}`, (err) => {
                if (err) throw err;
                appStart();
            });
            })
};
appStart();