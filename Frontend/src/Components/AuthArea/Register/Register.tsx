import "./Register.scss";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// Models
import EmployeeModel from "../../../Models/EmployeeModel";
import DepartmentModel from "../../../Models/DepartmentModel";
import PositionModel from "../../../Models/PositionModel";
// Services
import authService from "../../../Services/AuthService";
import notifyService from "../../../Services/NotifyService";
import departmentsService from "../../../Services/departmentsService";
import positionsService from "../../../Services/positionsService";

function Register (): JSX.Element
{
    // Use navigate to redirect user after registration
    const navigate = useNavigate();

    // Use form state to hold registration information
    const { register, handleSubmit } = useForm<EmployeeModel>();

    // Departments state
    const [ departments, setDepartments ] = useState<DepartmentModel[]>( [] );

    // Positions states
    const [ positions, setPositions ] = useState<PositionModel[]>( [] );

    // positions By department
    const [ positionsByDepartments, setPositionsByDepartments ] = useState<PositionModel[]>( [] );

    // Min date for form
    const today = new Date().toISOString().split( 'T' )[ 0 ];

    // Get departments and positions from server
    useEffect( () =>
    {
        try
        {
            departmentsService.getAllDepartments()
                .then( dbDepartments => setDepartments( dbDepartments ) );

            positionsService.getAllPositions()
                .then( dbPositions => setPositions( dbPositions ) );
        }
        catch ( err: any )
        {
            notifyService.error( err );
        }
    }, [] );

    // handle selected department -> filter position by department
    function handelDepartmentSelection ( e: React.ChangeEvent<HTMLSelectElement> )
    {
        const departmentId = e.target.value;
        const positionsByDepartment = positions.filter( p => p.department._id === departmentId );
        setPositionsByDepartments( positionsByDepartment );
    }

    // Handle send form to server
    async function sendForm ( user: EmployeeModel )
    {
        try
        {
            await authService.register( user );
            notifyService.success( "Welcome!" );
            navigate( "/admin_page" );
        }
        catch ( err: any )
        {
            notifyService.error( err );
        }
    }
    return (
        <div className="Register">
            <form onSubmit={ handleSubmit( sendForm ) }>
                <div className="form-header">
                    <h3>Register New Employee</h3>
                </div>

                <div className="form-body">
                    <div className="form-group">
                        <h2> Personal details</h2>

                        <label>First name</label>
                        <input { ...register( "firstName" ) } type="text" minLength={ 2 } maxLength={ 30 } required></input>

                        <label>Last name</label>
                        <input { ...register( "lastName" ) } type="text" minLength={ 2 } maxLength={ 50 } required></input>

                        <label>Email address</label>
                        <input { ...register( "email" ) } type="email" pattern="^[\w.]+@[\w.]+\.[\w.]+$" placeholder="e.g example@gmail.com" required></input>

                        <label>Password</label>
                        <input { ...register( "password" ) } type="password" minLength={ 4 } required></input>
                    </div>

                    <div className="form-group">
                        <label>Department</label>
                        <select defaultValue={ "" } { ...register( "departmentId" ) } required onChange={ handelDepartmentSelection }>
                            <option disabled value=""> Select employee department </option>
                            { departments && departments.map( d => <option value={ d._id } key={ d._id }>{ d.name }</option> ) }
                        </select>

                        <label>Position</label>
                        <select defaultValue={ "" } { ...register( "positionId" ) } required disabled={ positionsByDepartments.length === 0 }>
                            <option disabled value=""> Select employee positions </option>
                            { positionsByDepartments && positionsByDepartments.map( p => <option value={ p._id } key={ p._id }>{ p.name }</option> ) }
                        </select>

                        <label>Recruitment Date</label>
                        <input { ...register( "recruitmentDate" ) } type="date" min={ today } required></input>
                    </div>

                    <div className="form-group">
                        <label>System Permissions</label>
                        <select value={ "user" } { ...register( "role" ) } required>
                            <option value="user"> User </option>
                            <option value="admin"> Admin </option>
                        </select>
                        <small> *choose employee Permissions </small>

                        <button type="submit"> Submit</button>
                    </div>

                </div>
            </form>
        </div>
    );
}

export default Register;
