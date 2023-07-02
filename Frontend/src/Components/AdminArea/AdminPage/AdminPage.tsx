import "./AdminPage.scss";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
// Models
import EmployeeModel from "../../../Models/EmployeeModel";
// Services
import socketService from "../../../Services/socketService";
// Redux
import { authStore } from "../../../Redux/AuthState";
// Components
import AdminAssignments from "../AdminAssignments/AdminAssignments";
import AddAssignments from "../AddAssignments/AddAssignments";
// Icons
import {MdAssignmentAdd} from "react-icons/md";
import {BiUserPlus} from "react-icons/bi";
import {AiOutlineCloseCircle} from "react-icons/ai";

function AdminPage (): JSX.Element
{
    // admin state
    const [ admin, setAdmin ] = useState<EmployeeModel>();

    // Add assignment popup state
    const [ isOpen, setIsOpen ] = useState( false );

    // Get employee From redux
    useEffect( () =>
    {
        const loggedInEmployee = authStore.getState().user;
        if ( loggedInEmployee )
        {
            setAdmin( loggedInEmployee );
            socketService.socketJoinRoom( loggedInEmployee.departmentId );
        }

    }, [] );

    // toggle add assignment -> show/hide add assignment component
    const togglePopup = () =>
    {
        setIsOpen( !isOpen );
    };

    return (
        <div className="AdminPage">
            { admin &&
                <>
                    <div className="buttons">
                        <button className="blue-btn" onClick={ togglePopup }> { isOpen === false ? <span><MdAssignmentAdd/> Add Assignment</span> : <span><AiOutlineCloseCircle/> Close and Cancel</span> }</button>
                        <button className="gold-btn"><NavLink to={ "/register" }><BiUserPlus/> Register New Employee</NavLink></button>
                    </div>

                    { isOpen && (
                        <AddAssignments admin={ admin } closeWindow={togglePopup}/>
                    ) }

                    <AdminAssignments admin={ admin } />
                </>

            }
        </div>
    );
}

export default AdminPage;
