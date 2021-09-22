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

db.query(`SELECT * FROM movies`, function (err, results) {
    if(err) return res.status(500).json(err);
    return res.json(results);
});

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
                'Update an Employee Role'
            ]
        }
    ]).then(function (response) {
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
        }
    })
}