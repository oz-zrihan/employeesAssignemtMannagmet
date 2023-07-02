import "./AdminAssignments.scss";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DroppableProvided } from "react-beautiful-dnd";
// Models
import AssignmentModel from "../../../Models/AssignmentModel";
import EmployeeModel from "../../../Models/EmployeeModel";
// Services
import assignmentsService from "../../../Services/assignmentsService";
import notifyService from "../../../Services/NotifyService";
// Redux
import { assignmentsStore } from "../../../Redux/AssignmentsState";
// Components
import SmallAssignmentCard from "../../UtilsArea/SmallAssignmentCard/SmallAssignmentCard";
import LargeAssignmentCard from "../../UtilsArea/LargAssignmentCard/LargAssignmentCard";

interface AdminAssignmentsProps
{
    admin: EmployeeModel;
}

function AdminAssignments ( props: AdminAssignmentsProps ): JSX.Element
{

    // Assignment state
    const [ assignments, setAssignments ] = useState<AssignmentModel[]>( [] );

    // Selected assignment state
    const [ selectedAssignment, setSelectedAssignment ] = useState<AssignmentModel>();

    // Open assignment state
    const [ isAssignmentOpen, setIsAssignmentOpen ] = useState<boolean>( false );

    // Get Assignments by department from server - and listing to redux for changes
    useEffect( () =>
    {
        try
        {
            assignmentsService.getAssignmentsByDepartment( props.admin && props.admin.departmentId )
                .then( dbAssignments =>
                {
                    setAssignments( dbAssignments );
                } );

            const unsubscribe = assignmentsStore.subscribe( () =>
            {
                const state = assignmentsStore.getState().assignments;
                const stateByDepartment = state.filter( s => s.departmentId === props.admin.departmentId );
                setAssignments( stateByDepartment );
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


    // Show assignment in large card
    const handleOpenAssignment = ( assignment: AssignmentModel ) =>
    {
        setSelectedAssignment( assignment );
        toggleOpenAssignment();
    };


    // Toggle open assignment 
    function toggleOpenAssignment (): void
    {
        setIsAssignmentOpen( !isAssignmentOpen );
    }

    // Handle drag and drop
    const handleDragEnd = ( result: any ) =>
    {
        if ( !result.destination ) return;

        const { source, destination, draggableId } = result;

        const updatedAssignments = [ ...assignments ];

        const draggedAssignmentIndex = updatedAssignments.findIndex(
            ( assignment ) => assignment._id === draggableId
        );

        const draggedAssignment = updatedAssignments[ draggedAssignmentIndex ];

        // Remove the assignment from its original position
        updatedAssignments.splice( draggedAssignmentIndex, 1 );

        // Update the status of the dragged assignment based on the destination column
        switch ( destination.droppableId )
        {
            case "waiting":
                draggedAssignment.status = "waiting";
                assignmentsService.editAssignment( props.admin.departmentId, draggedAssignment );
                break;
            case "inProgress":
                draggedAssignment.status = "inProgress";
                assignmentsService.editAssignment( props.admin.departmentId, draggedAssignment );
                break;
            case "waitingForApproval":
                draggedAssignment.status = "waitingForApproval";
                assignmentsService.editAssignment( props.admin.departmentId, draggedAssignment );
                break;
            case "backToRepairs":
                draggedAssignment.status = "backToRepairs";
                assignmentsService.editAssignment( props.admin.departmentId, draggedAssignment );
                break;
            case "managerApproved":
                draggedAssignment.status = "managerApproved";
                assignmentsService.editAssignment( props.admin.departmentId, draggedAssignment );
                break;
            default:
                break;
        }

        // Insert the assignment into the new position
        updatedAssignments.splice( destination.index, 0, draggedAssignment );

        setAssignments( updatedAssignments );
    };

    return (
        <div className="AdminAssignments">

            { isAssignmentOpen && <LargeAssignmentCard assignment={ selectedAssignment && selectedAssignment } admin={ props.admin && props.admin } close={ toggleOpenAssignment } /> }
            <DragDropContext onDragEnd={ handleDragEnd }>
                <Droppable droppableId="waiting">
                    { ( provided: DroppableProvided ) => (
                        <div
                            className="assignment-column"
                            ref={ provided.innerRef }
                            { ...provided.droppableProps }
                        >
                            <h2>Waiting</h2>
                            { assignments &&
                                assignments
                                    .filter( ( a ) => a.status === "waiting" )
                                    .map( ( a, index ) => (
                                        <Draggable
                                            key={ a._id }
                                            draggableId={ a._id }
                                            index={ index }

                                        >
                                            { ( provided ) => (
                                                <div
                                                    ref={ provided.innerRef }
                                                    { ...provided.draggableProps }
                                                    { ...provided.dragHandleProps }
                                                >

                                                    <SmallAssignmentCard
                                                        assignment={ a }
                                                        user={ props.admin && props.admin }
                                                        showAssignment={ handleOpenAssignment } // Pass the handleOpenAssignment function as the showAssignment prop
                                                    />
                                                </div>
                                            ) }
                                        </Draggable>
                                    ) ) }
                            { provided.placeholder }
                        </div>
                    ) }
                </Droppable>

                <Droppable droppableId="inProgress">
                    { ( provided: DroppableProvided ) => (
                        <div
                            className="assignment-column"
                            ref={ provided.innerRef }
                            { ...provided.droppableProps }
                        >
                            <h2>In Progress</h2>
                            { assignments &&
                                assignments
                                    .filter( ( a ) => a.status === "inProgress" )
                                    .map( ( a, index ) => (
                                        <Draggable
                                            key={ a._id }
                                            draggableId={ a._id }
                                            index={ index }
                                        >
                                            { ( provided ) => (
                                                <div
                                                    ref={ provided.innerRef }
                                                    { ...provided.draggableProps }
                                                    { ...provided.dragHandleProps }
                                                >
                                                    <SmallAssignmentCard
                                                        assignment={ a }
                                                        user={ props.admin && props.admin }
                                                        showAssignment={ handleOpenAssignment } // Pass the handleOpenAssignment function as the showAssignment prop
                                                    />
                                                </div>
                                            ) }
                                        </Draggable>
                                    ) ) }
                            { provided.placeholder }
                        </div>
                    ) }
                </Droppable>

                <Droppable droppableId="waitingForApproval">
                    { ( provided: DroppableProvided ) => (
                        <div
                            className="assignment-column"
                            ref={ provided.innerRef }
                            { ...provided.droppableProps }
                        >
                            <h2>Waiting For Approval</h2>
                            { assignments &&
                                assignments
                                    .filter( ( a ) => a.status === "waitingForApproval" )
                                    .map( ( a, index ) => (
                                        <Draggable
                                            key={ a._id }
                                            draggableId={ a._id }
                                            index={ index }
                                        >
                                            { ( provided ) => (
                                                <div
                                                    ref={ provided.innerRef }
                                                    { ...provided.draggableProps }
                                                    { ...provided.dragHandleProps }
                                                >
                                                    <SmallAssignmentCard
                                                        assignment={ a }
                                                        user={ props.admin && props.admin }
                                                        showAssignment={ handleOpenAssignment } // Pass the handleOpenAssignment function as the showAssignment prop
                                                    />
                                                </div>
                                            ) }
                                        </Draggable>
                                    ) ) }
                            { provided.placeholder }
                        </div>
                    ) }
                </Droppable>

                <Droppable droppableId="backToRepairs">
                    { ( provided: DroppableProvided ) => (
                        <div
                            className="assignment-column"
                            ref={ provided.innerRef }
                            { ...provided.droppableProps }
                        >
                            <h2>Back To Repairs</h2>
                            { assignments &&
                                assignments
                                    .filter( ( a ) => a.status === "backToRepairs" )
                                    .map( ( a, index ) => (
                                        <Draggable
                                            key={ a._id }
                                            draggableId={ a._id }
                                            index={ index }
                                        >
                                            { ( provided ) => (
                                                <div
                                                    ref={ provided.innerRef }
                                                    { ...provided.draggableProps }
                                                    { ...provided.dragHandleProps }
                                                >
                                                    <SmallAssignmentCard
                                                        assignment={ a }
                                                        user={ props.admin && props.admin }
                                                        showAssignment={ handleOpenAssignment } // Pass the handleOpenAssignment function as the showAssignment prop
                                                    />
                                                </div>
                                            ) }
                                        </Draggable>
                                    ) ) }
                            { provided.placeholder }
                        </div>
                    ) }
                </Droppable>

                <Droppable droppableId="managerApproved">
                    { ( provided: DroppableProvided ) => (
                        <div
                            className="assignment-column"
                            ref={ provided.innerRef }
                            { ...provided.droppableProps }
                        >
                            <h2>Manager Approved</h2>
                            { assignments &&
                                assignments
                                    .filter( ( a ) => a.status === "managerApproved" )
                                    .map( ( a, index ) => (
                                        <Draggable
                                            key={ a._id }
                                            draggableId={ a._id }
                                            index={ index }
                                        >
                                            { ( provided ) => (
                                                <div
                                                    ref={ provided.innerRef }
                                                    { ...provided.draggableProps }
                                                    { ...provided.dragHandleProps }
                                                >
                                                    <SmallAssignmentCard
                                                        assignment={ a }
                                                        user={ props.admin && props.admin }
                                                        showAssignment={ handleOpenAssignment } // Pass the handleOpenAssignment function as the showAssignment prop
                                                    />
                                                </div>
                                            ) }
                                        </Draggable>
                                    ) ) }
                            { provided.placeholder }
                        </div>
                    ) }
                </Droppable>

                {/* Repeat the same structure for other columns */ }

            </DragDropContext>
        </div>
    );
}

export default AdminAssignments;
