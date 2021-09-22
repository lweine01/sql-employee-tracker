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

initialQuestions();

function initialQuestions () {
    inquirer.prompt ([
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
        switch (response.starter){
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
                console.log('Goodbye');
                break;

        }
    }).catch((err) => {
        console.log(err);
        initialQuestions();
    })
}

function viewDepartment() {
    db.query(`SELECT * FROM department`, function (err, results) {
        if(err) return console.log(err);
        console.table(results);
        initialQuestions();
    });
}

function viewRoles() {
    db.query(`SELECT * FROM role`, function (err, results) {
        if(err) return console.log(err);
        console.table(results);
        initialQuestions();
    });
}

function viewEmployees() {
    db.query(`SELECT * FROM employee`, function (err, results) {
        if(err) return console.log(err);
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
    ]).then ((response) => {
        db.query(`
        INSERT INTO department (name)
        VALUES (?)`, response.departmentName, function(err){
            if(err) return console.log(err);
            initialQuestions();
        })
    })
}

function addRole() {
    db.query(`SELECT * FROM department`, function (err, departments) {
        if(err) return console.log(err);
        
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
                function(err){
                    if(err) return console.log(err);
                    initialQuestions();
                })
            }
        )
    });
}