import "./EmployeePage.scss";
import { useEffect, useState } from "react";
// Models
import EmployeeModel from "../../../Models/EmployeeModel";
// Services
import socketService from "../../../Services/socketService";
// Redux
import { authStore } from "../../../Redux/AuthState";
// Components
import EmployeeDetails from "../EmployeeDetails/EmployeeDetails";
import AssignmentCards from "../AssignmentCard/AssignmentCards";
import TeamMembers from "../TeamMembers/TeamMembers";
import Feed from "../Feed/Feed";
import AssignmentModel from "../../../Models/AssignmentModel";
import AuthMenu from "../../AuthArea/AuthMenu/AuthMenu";

function EmployeePage (): JSX.Element
{

  // Employee state
  const [ employee, setEmployee ] = useState<EmployeeModel>();

  // selected assignment state
  const [ selectedAssignment, setSelectedAssignment ] = useState<AssignmentModel>( null );

  // Get employee From redux
  useEffect( () =>
  {
    const loggedInEmployee = authStore.getState().user;
    if ( loggedInEmployee )
    {
      setEmployee( loggedInEmployee );
      joinSocketRoom( loggedInEmployee.departmentId );
    }
  }, [] );

  // Join Socket Room form automatically updates the assignment
  async function joinSocketRoom ( departmentId: string )
  {
    if ( departmentId )
    {
      await socketService.socketJoinRoom( departmentId );
    }
  }

  // Handle open assignment function - selectedAssignment is sent as props to "Feed"
  function handleOpenAssignment ( a: AssignmentModel )
  {
    setSelectedAssignment( a );

  }

  return (
    <div className="EmployeePage">
      <AuthMenu />
      { employee &&
        <>
          <div className="user-card">
            <EmployeeDetails employees={ employee } />
            <AssignmentCards employee={ employee } showAssignment={ handleOpenAssignment } />
            <TeamMembers user={ employee } />
          </div>
          <div className="feed-area">
            <Feed employee={ employee } selectedAssignment={ selectedAssignment ? selectedAssignment : null } />
          </div>
        </>
      }

    </div>
  );
}

export default EmployeePage;
