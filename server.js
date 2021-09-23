const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
);

console.log(
    ` _______  __   __  _______  ___      _______  __   __  _______  _______    _______  ______    _______  _______  ___   _  _______  ______   
|       ||  |_|  ||       ||   |    |       ||  | |  ||       ||       |  |       ||    _ |  |   _   ||       ||   | | ||       ||    _ |  
|    ___||       ||    _  ||   |    |   _   ||  |_|  ||    ___||    ___|  |_     _||   | ||  |  |_|  ||       ||   |_| ||    ___||   | ||  
|   |___ |       ||   |_| ||   |    |  | |  ||       ||   |___ |   |___     |   |  |   |_||_ |       ||       ||      _||   |___ |   |_||_ 
|    ___||       ||    ___||   |___ |  |_|  ||_     _||    ___||    ___|    |   |  |    __  ||       ||      _||     |_ |    ___||    __  |
|   |___ | ||_|| ||   |    |       ||       |  |   |  |   |___ |   |___     |   |  |   |  | ||   _   ||     |_ |    _  ||   |___ |   |  | |
|_______||_|   |_||___|    |_______||_______|  |___|  |_______||_______|    |___|  |___|  |_||__| |__||_______||___| |_||_______||___|  |_|
` + "\n"
);

initialQuestions();

function initialQuestions() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'starter',
            message: 'Select from the below options.',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Update an Employee Role',
                'Quit'
            ]
        }
    ]).then((response) => {
        switch (response.starter) {
            case 'View All Departments':
                viewDepartment();
                break;
            case 'View All Roles':
                viewRoles();
                break;
            case 'View All Employees':
                viewEmployees();
                break;
            case 'Add a Department':
                addDepartment();
                break;
            case 'Add a Role':
                addRole();
                break;
            case 'Add an Employee':
                addEmployee();
                break;
            case 'Update an Employee Role':
                updateRole();
                break;
            case 'Quit':
                process.exit(0);
        }
    }).catch((err) => {
        console.log(err);
        initialQuestions();
    })
}

function viewDepartment() {
    db.query(`SELECT * FROM department`, function (err, results) {
        if (err) return console.log(err);
        console.table(results);
        initialQuestions();
    });
}

function viewRoles() {
    db.query(`SELECT * FROM role`, function (err, results) {
        if (err) return console.log(err);
        console.table(results);
        initialQuestions();
    });
}

function viewEmployees() {
    db.query(`
    SELECT employee.id, employee.first_name, employee.last_name, 
    role.title AS role, role.salary, 
    department.name AS department, employee.manager_id
    FROM employee
    LEFT JOIN employee AS manager
    ON employee.manager_id = manager.id
    JOIN role
    ON role.id = employee.role_id
    JOIN department
    ON role.department_id = department.id
    ORDER BY employee.id
    `, function (err, results) {
        if (err) return console.log(err);
        console.table(results);
        initialQuestions();
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'What is the name of the new department?'
        }
    ]).then((response) => {
        db.query(`
        INSERT INTO department (name)
        VALUES (?)`, response.departmentName, function (err) {
            if (err) return console.log(err);
            initialQuestions();
        })
    })
}

function addRole() {
    db.query(`SELECT * FROM department`, function (err, departments) {
        if (err) return console.log(err);

        inquirer.prompt([
            {
                type: 'input',
                name: 'roleTitle',
                message: 'What is the title of the new role?'
            },
            {
                type: 'input',
                name: 'roleSalary',
                message: 'What is the salary?'
            },
            {
                type: 'list',
                name: 'deptName',
                message: 'Which department should this role belong?',
                choices: departments.map(department =>
                ({
                    name: department.name,
                    value: department.id
                })
                )
            }
        ]).then((response) => {
            console.log(response.deptName);
            db.query(`
                INSERT INTO role (title, salary, department_id)
                VALUES (?, ?, ?)`,
                [response.roleTitle, response.roleSalary, response.deptName],
                function (err) {
                    if (err) return console.log(err);
                    initialQuestions();
                })
        })
    });
}

function addEmployee() {
    db.query(`SELECT * FROM role`, function (err, roles) {
        if (err) return console.log(err);
        inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'What is the employee\'s first name?'
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'What is the employee\'s last name?'
            },
            {
                type: 'list',
                name: 'roleName',
                message: 'Which is this employee\'s role?',
                choices: roles.map(role =>
                ({
                    name: role.title,
                    value: role.id
                })
                )
            },
            {
                type: 'list',
                name: 'manager',
                message: 'Who is the employee\'s manager?',
                choices: [
                    {
                        name: 'Karen Smith',
                        value: 1
                    },
                    {
                        name: 'John Jameson',
                        value: 2
                    },
                    {
                        name: 'Andy Poe',
                        value: 3
                    },
                    {
                        name: 'Jeff Peters',
                        value: 4
                    },
                    {
                        name: 'No Manager',
                        value: null,
                    }
                ]
            }
        ]).then((response) => {
            db.query(`
                INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES (?, ?, ?, ?)`,
                [response.firstName, response.lastName, response.roleName, response.manager],
                function (err) {
                    if (err) return console.log(err);
                    initialQuestions();
                })
        });
    });
}

function updateRole() {
    db.query(`SELECT * FROM employee`, function (err, employees) {
        if (err) return console.log(err);
        inquirer.prompt([
            {
                type: 'list',
                name: 'updatedEmp',
                message: 'What employee do you want to update?',
                choices: employees.map(employee =>
                ({
                    name: employee.first_name + ' ' + employee.last_name,
                    value: employee.id
                })
                )
            },
            {
                type: 'input',
                name: 'updatedRole',
                message: 'What is the role ID to update the employee\'s role?'
            }
        ]).then((response) => {
            db.query(`
            UPDATE employee SET role_id = ? WHERE id = ?`, [response.updatedRole, response.updatedEmp],
                function (err) {
                    if (err) return console.log(err);
                    initialQuestions();
                })
        })
    });
}
