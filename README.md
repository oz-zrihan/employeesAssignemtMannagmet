## **Employees Assignment Management System**

This application is built with the following technologies:

Backend:
cors: ^2.8.5
cyber: ^1.0.23
express: ^4.18.2
express-fileupload: ^1.4.0
express-rate-limit: ^6.7.0
helmet: ^6.0.1
jsonwebtoken: ^9.0.0
mongoose: ^7.2.2
socket.io: ^4.6.2
striptags: ^3.2.0
Frontend:
axios: ^1.3.4
express-fileupload: ^1.4.0
jsonwebtoken: ^9.0.0
jwt-decode: ^3.1.2
notyf: ^3.10.0
react: ^18.2.0
react-beautiful-dnd: ^13.1.1
react-icons: ^4.8.0
redux: ^4.2.1
sass: ^1.60.0
socket.io-client: ^4.6.2
typescript: ^4.9.5
This application consists of a user interface and an admin interface. Both interfaces require users to log in.

![Login Screen](/screenshots/Login.png)

## **Admin Interface:**

The admin can register new users. When registering, the admin selects the employee's department, and the positions dropdown is automatically updated with the relevant positions for that department.

![Register screen - choose department](/screenshots/RegisterSelectDepartment.png)
![Register screen - choose position](/screenshots/RegisterSelectDepartment.png)
![Register screen](/screenshots/Register.png)

The admin can only see assignments that are relevant to their department. The assignments are displayed in a table view, categorized by assignment status. The admin can change the status of an assignment by dragging and dropping it, and they can change the priority by clicking on the color indicator. The assignment cards in this view include the title, start date, due date, and priority.

![Admin screen](/screenshots/AdminScreen.png)
![Admin drag and drop screen](/screenshots/AdminDragNDrop.png)
![Admin change priority screen](/screenshots/AdminChangePriority.png)

Clicking on an assignment opens a larger view that displays all the details of the assignment, including team members and their roles. The admin can add comments and attachments in this view.

![admin open assignment](/screenshots/adminOpenAssignment.png)

The admin can also create new assignments. The department is automatically selected based on the admin's department, but they can change it if needed. They can search and add employees to the assignment from the selected department, as well as attach reference images and files.

![admin new assignment](/screenshots/newAssignment.png)

## **User Interface:**

The user interface is divided into two sections: the left side displays the employee's details and their assignments, and the right side shows all the assignments for the department.

On the left side, the employee's personal details (name, department, position) are shown, along with their assigned tasks. Each task card includes the title, start date, due date, and priority indicator.

On the right side, a larger assignment card displays all the assignments for the department. The user can see and commit to tasks assigned to their colleagues. The assignment card includes the title, status, start date, due date, and priority indicator.

![User screen](/screenshots/UserScreen.png)
![user drag and drop](/screenshots/userDragNDrop.png)
![User change priority](/screenshots/UserChangePriority.png)

by clicking on an assignment the right side would show inly the selected assignment

![User select assignment](/screenshots/UserSelectAssignment.png)
