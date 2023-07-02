import "./AssignmentCards.scss";
import { useEffect, useState } from "react";
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

interface AssignmentCardsProps
{
    employee: EmployeeModel;
    showAssignment: ( assignment: AssignmentModel ) => void;
}
function AssignmentCards ( props: AssignmentCardsProps ): JSX.Element
{
    // User assignments
    const [ userAssignments, setUserAssignments ] = useState<AssignmentModel[]>( [] );

    // Selected assignment state
    const [ selectedAssignment, setSelectedAssignment ] = useState<AssignmentModel>();

    // Get assignments from server, and listing to redux for changes
    useEffect( () =>
    {
        try
        {
            assignmentsService.getAssignmentsByDepartment( props.employee && props.employee.departmentId )
                .then( dbAssignments =>
                {
                    setUserAssignments( dbAssignments.filter( ( a ) =>
                        a.employeeIds.find( ( id ) => id === props.employee._id )
                    ) );
                } );

            const unsubscribe = assignmentsStore.subscribe( () =>
            {
                const state = assignmentsStore.getState().assignments;
                setUserAssignments( state.filter( ( a ) =>
                    a.employeeIds.find( ( id ) => id === props.employee._id )
                ) );
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


    // Handle open assignments function - send to parent selected assignment
    function handleOpenAssignment ( a: AssignmentModel )
    {
        props.showAssignment( a );
    }

    // Handle drag and drop
    const handleDragEnd = ( result: any ) =>
    {
        if ( !result.destination ) return;

        const { source, destination, draggableId } = result;

        const updatedAssignments = [ ...userAssignments ];

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
                assignmentsService.editAssignment( props.employee.departmentId, draggedAssignment );
                break;
            case "inProgress":
                draggedAssignment.status = "inProgress";
                assignmentsService.editAssignment( props.employee.departmentId, draggedAssignment );
                break;
            case "waitingForApproval":
                draggedAssignment.status = "waitingForApproval";
                assignmentsService.editAssignment( props.employee.departmentId, draggedAssignment );
                break;
            case "backToRepairs":
                draggedAssignment.status = "backToRepairs";
                assignmentsService.editAssignment( props.employee.departmentId, draggedAssignment );
                break;
            case "managerApproved":
                draggedAssignment.status = "managerApproved";
                assignmentsService.editAssignment( props.employee.departmentId, draggedAssignment );
                break;
            default:
                break;
        }

        // Insert the assignment into the new position
        updatedAssignments.splice( destination.index, 0, draggedAssignment );

        setUserAssignments( updatedAssignments );
    };

    return (
        <div className="AssignmentCard">
            <div className="priority-keys-wrapper">
                <span className="priority-key"></span> <p>Low</p>
                <span className="priority-key"></span> <p>Medium</p>
                <span className="priority-key"></span> <p>High</p>
            </div>
            <DragDropContext onDragEnd={ handleDragEnd }>
                <Droppable droppableId="waiting">
                    { ( provided: DroppableProvided ) => (
                        <div
                            className="assignment-column"
                            ref={ provided.innerRef }
                            { ...provided.droppableProps }
                        >
                            <h2>Waiting</h2>
                            { userAssignments &&
                                userAssignments
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
                                                        user={ props.employee && props.employee }
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
                            { userAssignments &&
                                userAssignments
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
                                                        user={ props.employee && props.employee }
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
                            { userAssignments &&
                                userAssignments
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
                                                        user={ props.employee && props.employee }
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
                            { userAssignments &&
                                userAssignments
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
                                                        user={ props.employee && props.employee }
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
                            { userAssignments &&
                                userAssignments
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
                                                        user={ props.employee && props.employee }
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

export default AssignmentCards;
