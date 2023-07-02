import "./Feed.scss";
import { useEffect, useState } from "react";
// Models
import AssignmentModel from "../../../Models/AssignmentModel";
import EmployeeModel from "../../../Models/EmployeeModel";
// Services
import notifyService from "../../../Services/NotifyService";
import assignmentsService from "../../../Services/assignmentsService";
// Redux
import { assignmentsStore } from "../../../Redux/AssignmentsState";
// Components
import FeedCard from "../../UtilsArea/FeedCard/FeedCard";

interface FeedProps
{
    employee: EmployeeModel;
    selectedAssignment: AssignmentModel;
}

function Feed ( props: FeedProps ): JSX.Element
{

    // Assignments State
    const [ assignments, setAssignment ] = useState<AssignmentModel[]>( [] );

    // Selected assignment State
    const [ selectedAssignment, setSelectedAssignment ] = useState<AssignmentModel>();

    // Is Assignment filtered stat
    const [ isFiltered, setIsFiltered ] = useState<Boolean>( false );

    // Get all assignments by department from server, and listing to redux for changes
    useEffect( () =>
    {
        try
        {
            assignmentsService.getAssignmentsByDepartment( props.employee && props.employee.departmentId )
                .then( dbAssignments => { setAssignment( dbAssignments ); } );

            const unsubscribe = assignmentsStore.subscribe( () =>
            {
                const state = assignmentsStore.getState().assignments;
                setAssignment( state );

            } );

            return () =>
            {
                unsubscribe();
            };
        }
        catch ( err: any )
        {
            notifyService.error( err );
        }
    }, [] );

    // Re-render component when props changes
    useEffect( () =>
    {
        if ( props.selectedAssignment )
        {
            setSelectedAssignment( props.selectedAssignment );
            setIsFiltered( true );
        }

    }, [ props.selectedAssignment ] );

    // Close filter assignment
    function closeFilteredAssignment ()
    {
        setIsFiltered( !isFiltered );
        setSelectedAssignment( null );
    }
    return (
        <div className="Feed">
            { isFiltered
                ? <FeedCard key={ props.selectedAssignment._id } assignment={ props.selectedAssignment } employee={ props.employee } close={ closeFilteredAssignment } isSelected={ isFiltered } />
                : assignments && assignments.map( a => <FeedCard key={ a._id } assignment={ a } employee={ props.employee } close={ closeFilteredAssignment } isSelected={ isFiltered } /> )
            }
        </div>
    );
}

export default Feed;
