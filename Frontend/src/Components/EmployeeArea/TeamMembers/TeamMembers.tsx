import "./TeamMembers.scss";
import { useEffect, useState } from "react";
// Models
import EmployeeModel from "../../../Models/EmployeeModel";
// Services
import employeesService from "../../../Services/employeesService";
import notifyService from "../../../Services/NotifyService";

interface TeamMembersProps
{
    user: EmployeeModel;
}
function TeamMembers ( props: TeamMembersProps ): JSX.Element
{

    // Team members state
    const [ teamMembers, setTeamMembers ] = useState<EmployeeModel[]>( [] );

    // Get all employees by department from server
    useEffect( () =>
    {
        employeesService.getEmployeesByDepartment( props.user.departmentId && props.user.departmentId )
            .then( employees =>
            {
                const filteredEmployees = employees.filter( employee => employee._id !== props.user._id );
                setTeamMembers( filteredEmployees );
            } )
            .catch( err => notifyService.error( err ) );
    }, [] );

    return (
        <div className="TeamMembers">
            <h3> Team Members</h3>
            <ul>
                { teamMembers && teamMembers.map( tm => <li key={ tm._id }> { tm.firstName } { tm.lastName } : { tm.position.name }</li> ) }
            </ul>
        </div>
    );
}

export default TeamMembers;
