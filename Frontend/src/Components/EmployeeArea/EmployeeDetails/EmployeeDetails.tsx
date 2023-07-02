import { useEffect, useState } from "react";
import "./EmployeeDetails.scss";
// Models
import EmployeeModel from "../../../Models/EmployeeModel";
import AssignmentModel from "../../../Models/AssignmentModel";
// Services
import assignmentsService from "../../../Services/assignmentsService";
import notifyService from "../../../Services/NotifyService";
// Icons
import { HiOutlineUserCircle, HiOutlineUserGroup } from "react-icons/hi";
import { PiOfficeChair } from "react-icons/pi";

interface EmployeeDetailsProps
{
    employees: EmployeeModel;
}
function EmployeeDetails ( props: EmployeeDetailsProps ): JSX.Element
{

    // Assignments state
    const [ assignments, setAssignments ] = useState<AssignmentModel[]>( [] );

    // Get All user assignments from server
    useEffect( () =>
    {
        assignmentsService.getAssignmentsByEmployee( props.employees._id )
            .then( dbAssignments => setAssignments( dbAssignments ) )
            .catch( err => notifyService.error( err ) );
    }, [] );

    return (
        <div className="EmployeeDetails">
            <div className="employee-info">
                <div className="personal-details">
                    <h2> <span><HiOutlineUserCircle /></span> { props.employees.firstName } { props.employees.lastName }</h2>
                    <p> <span> <HiOutlineUserGroup /></span> { props.employees.department.name }</p>
                    <p> <span> <PiOfficeChair /></span> { props.employees.position.name }</p>
                </div>
            </div>
        </div>
    );
}

export default EmployeeDetails;
