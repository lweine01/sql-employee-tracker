INSERT INTO department (name)
VALUES ("Therapy"),
       ("Nursing"),
       ("Food Services"),
       ("Maintenance");


INSERT INTO role (title, salary, department_id)
VALUES ("Rehab Aid", 35000, 1),
       ("Physical Therapist", 85000, 1),
       ("Occupational Therapist", 85000, 1),
       ("Exercise Specialist", 45000, 1),
       ("Therapy Coordinator", 100000, 1),
       ("Nurse Aid", 30000, 2),
       ("Registered Nurse", 50000, 2),
       ("Nurse Lead", 70000, 2),
       ("Nutritionist", 50000, 3),
       ("Nutrition Service", 35000, 3),
       ("Food Services Lead", 65000, 3),
       ("Maintenance Person", 50000, 4),
       ("Maintenance Manager", 65000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Karen", "Smith", 5, NULL),
       ("John", "Jameson", 8, 1),
       ("Andy", "Poe", 11, 1),
       ("Jeff", "Peters", 13, 1);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;