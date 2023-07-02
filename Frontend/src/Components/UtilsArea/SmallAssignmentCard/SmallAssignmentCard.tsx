import "./SmallAssignmentCard.scss";
import { useState } from "react";
// Models
import AssignmentModel from "../../../Models/AssignmentModel";
import EmployeeModel from "../../../Models/EmployeeModel";
// Services
import assignmentsService from "../../../Services/assignmentsService";

interface SmallAssignmentCardProps
{
  assignment: AssignmentModel;
  user: EmployeeModel;
  showAssignment: ( assignment: AssignmentModel ) => void;
}


function SmallAssignmentCard ( props: SmallAssignmentCardProps ): JSX.Element
{

  // Priority changes window state
  const [ isPriority, setIsPriority ] = useState<boolean>( false );

  // Format date
  function formatDate ( date: Date ): { date: string; time: string; }
  {
    date = new Date( date );
    const formattedDate = date.toLocaleDateString( "en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    } );

    const formattedTime = date.toLocaleTimeString( "en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    } );

    return { date: formattedDate, time: formattedTime };
  }

  // handle show assignment -> send to parent selected assignment
  const handleShowAssignment = () =>
  {
    props.showAssignment( props.assignment );
  };

  // Toggle priority selection
  function togglePrioritySelection ()
  {
    setIsPriority( !isPriority );
  }

  // Set selected priority and update assignment in server + redux
  function handlePrioritySelection ( e: React.MouseEvent<HTMLLIElement> )
  {
    const value = e.currentTarget.getAttribute( "value" );
    props.assignment.priority = value;
    assignmentsService.editAssignment( props.user.departmentId, props.assignment );
    setIsPriority( !isPriority );
  }

  return (
    <div className="SmallAssignmentCard" >
      <div onClick={ togglePrioritySelection } className={ `${ props.assignment.priority === "low" ? "low-priority" : props.assignment.priority === "medium" ? "medium-priority" : "high-priority" } ${ isPriority ? "active" : "" }` }></div>
      { isPriority &&
        <div className={ `priority-list ${ isPriority ? "visible" : "" }` }>
          <ul>
            <li onClick={ handlePrioritySelection } value={ "low" }>  </li>
            <li onClick={ handlePrioritySelection } value={ "medium" }>  </li>
            <li onClick={ handlePrioritySelection } value={ "high" }>  </li>
          </ul>
        </div>
      }
      <div onClick={ isPriority ? togglePrioritySelection : handleShowAssignment }>
        <h2>{ props.assignment.title }</h2>
        <p> Start date: { formatDate( props.assignment.startDate ).date } | { formatDate( props.assignment.startDate ).time }</p>
        <p> Due date: { formatDate( props.assignment.dueDate ).date } | { formatDate( props.assignment.dueDate ).time }</p>
      </div>

    </div>
  );
}

export default SmallAssignmentCard;
