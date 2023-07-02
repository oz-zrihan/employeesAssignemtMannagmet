import "./AddAssignments.scss";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
// Models
import DepartmentModel from "../../../Models/DepartmentModel";
import EmployeeModel from "../../../Models/EmployeeModel";
import AssignmentModel from "../../../Models/AssignmentModel";
// Services
import notifyService from "../../../Services/NotifyService";
import departmentsService from "../../../Services/departmentsService";
import assignmentsService from "../../../Services/assignmentsService";
import employeesService from "../../../Services/employeesService";
import imagesService from "../../../Services/ImagesService";
import filesService from "../../../Services/FilesService";

interface AddAssignmentsProps
{
    admin: EmployeeModel;
    closeWindow: () => void;
}

interface UploadedFiles
{
    imagesUrl: string[],
    filsUrl: string[];
}

function AddAssignments ( props: AddAssignmentsProps ): JSX.Element
{

    // Admin state
    const [ admin, setAdmin ] = useState<EmployeeModel>( props.admin );

    // Departments state
    const [ departments, setDepartments ] = useState<DepartmentModel[]>( [] );

    // Employees states
    const [ employees, setEmployees ] = useState<EmployeeModel[]>( [] );

    // Employees By department
    const [ employeesByDepartments, setEmployeesByDepartments ] = useState<EmployeeModel[]>( [] );

    // Selected employees states
    const [ selectedEmployees, setSelectedEmployees ] = useState<string[]>( [] );

    // Search employees query states
    const [ searchQuery, setSearchQuery ] = useState<string>( "" );

    // Use form state to hold registration information
    const { register, handleSubmit, setValue } = useForm<AssignmentModel>();

    // Folder name state
    const [ folderName, setFolderName ] = useState<string>( "" );

    // Images state
    const [ uploadedImages, setUploadedImages ] = useState<FileList[]>( [] );

    // Files state
    const [ uploadedFiles, setUploadedFiles ] = useState<FileList[]>( [] );

    // Mission state
    const [ mission, setMission ] = useState( '' );

    // Get departments and positions from server
    useEffect( () =>
    {
        try
        {
            departmentsService.getAllDepartments()
                .then( dbDepartments => setDepartments( dbDepartments ) );

            employeesService.getAllEmployees()
                .then( dbEmployees => setEmployees( dbEmployees ) );
            setEmployeesByDepartments( employees.filter( e => e.departmentId === admin.departmentId ) );

        }
        catch ( err: any )
        {
            notifyService.error( err );
        }
    }, [ employees ] );

    // handle selected department -> filter employees by the selected department
    function handelDepartmentSelection ( e: React.ChangeEvent<HTMLSelectElement> )
    {
        const departmentId = e.target.value;
        const employeesByDepartment = employees.filter( e => e.departmentId === departmentId );
        setEmployeesByDepartments( employeesByDepartment );
    }

    // Filter employees based on search query
    const filteredEmployees = employeesByDepartments.filter( ( employee ) =>
        `${ employee.firstName } ${ employee.lastName }`.toLowerCase().includes( searchQuery.toLowerCase() )
    );

    // Handle checkbox change
    function handleEmployeeSelect ( employeeId: string )
    {
        if ( selectedEmployees.includes( employeeId ) )
        {
            setSelectedEmployees( selectedEmployees.filter( ( id ) => id !== employeeId ) );
        } else
        {
            setSelectedEmployees( [ ...selectedEmployees, employeeId ] );
        }
    };

    // Handel folder name
    function handelFolderName ( event: React.ChangeEvent<HTMLInputElement> )
    {
        const folderName = event.target.value;
        setFolderName( folderName );
    }

    // Handel uploaded images
    function handleUploadImages (
        event: React.ChangeEvent<HTMLInputElement>
    ): void
    {
        const imagesList = event.target.files;
        setUploadedImages( [ ...[ imagesList ] ] );
    }

    // Handel uploaded files
    function handleUploadFiles (
        event: React.ChangeEvent<HTMLInputElement>
    ): void
    {
        const filesList = event.target.files;
        setUploadedFiles( [ ...[ filesList ] ] );
    }

    // Upload files
    async function uploadFiles (): Promise<UploadedFiles>
    {
        let filsUrl: UploadedFiles = {
            imagesUrl: [],
            filsUrl: []
        };
        if ( uploadedImages.length > 0 )
        {
            const urls = await imagesService.addImage( uploadedImages, folderName );
            filsUrl.imagesUrl = urls;
        }
        if ( uploadedFiles.length > 0 )
        {
            const urls = await filesService.addFile( uploadedFiles, folderName );
            filsUrl.filsUrl = urls;
        }

        return filsUrl;
    }

    // Handle send form to server
    async function sendForm ( assignment: AssignmentModel )
    {

        try
        {

            const urls = await uploadFiles();

            assignment.filesUrl = urls.filsUrl;
            assignment.imagesUrl = urls.imagesUrl;
            assignment.assignmentFolder = folderName;
            assignment.employeeIds = selectedEmployees;
            assignment.managerId = admin._id;

            await assignmentsService.addAssignment( admin.departmentId, assignment );
            notifyService.success( "Assignment Added!" );
            props.closeWindow();
        }
        catch ( err: any )
        {
            notifyService.error( err );
        }
    }

    return (
        <div className="AddAssignments">
            { admin &&
                <form onSubmit={ handleSubmit( sendForm ) }>
                    <div className="form-header">
                        <h3>Enter new assignment</h3>
                    </div>

                    <div className="form-body">
                        <input { ...register( "managerId", { value: admin._id } ) } type="text" disabled hidden></input>
                        <input { ...register( "status", { value: "waiting" } ) } type="text" disabled hidden />

                        <label>Department</label>
                        <select defaultValue={ departments && admin && departments.find( d => d._id === admin.departmentId )?._id } { ...register( "departmentId", { value: admin.departmentId } ) } required onChange={ handelDepartmentSelection }>
                            { departments && departments.map( d => <option value={ d._id } key={ d._id }>{ d.name }</option> ) }
                        </select>

                        <label>Search Employees</label>
                        <input type="text" value={ searchQuery } onChange={ ( e ) => setSearchQuery( e.target.value ) } disabled={ employeesByDepartments.length === 0 } />
                        { searchQuery && (
                            <>
                                <label>Select Employees</label>
                                <ul>
                                    { filteredEmployees.map( ( employee ) => (
                                        <li key={ employee._id }>
                                            <input
                                                type="checkbox"
                                                checked={ selectedEmployees.includes( employee._id ) }
                                                onChange={ () => handleEmployeeSelect( employee._id ) }
                                            />
                                            { `${ employee.firstName } ${ employee.lastName } - ${ employee.position.name }` }
                                        </li>
                                    ) ) }

                                </ul>
                            </>
                        ) }
                        <small>
                            { employees
                                .filter( ( employee ) => selectedEmployees.includes( employee._id ) )
                                .map( ( employee ) => (
                                    <span key={ employee._id }>
                                        { employee.firstName } { employee.lastName },{ " " }
                                    </span>
                                ) ) }
                        </small>

                        <label>Title</label>
                        <input { ...register( "title" ) } type="text" required onChange={ handelFolderName }></input>

                        <label>Mission</label>
                        <textarea { ...register( "mission" ) } required />

                        <label>Start date</label>
                        <input { ...register( "startDate" ) } type="datetime-local" min={ new Date().toISOString().slice( 0, -8 ) } required></input>

                        <label>Due date</label>
                        <input { ...register( "dueDate" ) } type="datetime-local" min={ new Date().toISOString().slice( 0, -8 ) } required></input>

                        <label>Priority</label>
                        <select defaultValue={ "low" } { ...register( "priority" ) } required>
                            <option value="low"> Low </option>
                            <option value="medium"> Medium </option>
                            <option value="high"> High </option>
                        </select>

                        <label>Images:</label>
                        <div className="files-handler-btns">
                            <input
                                type="file"
                                className="upload"
                                accept="image/*"
                                onChange={ handleUploadImages }
                                multiple
                            />
                        </div>
                        <label>Files:</label>
                        <div className="files-handler-btns">
                            <input
                                type="file"
                                className="upload"
                                accept="file/*"
                                onChange={ handleUploadFiles }
                                multiple
                            />
                        </div>

                        <button type="submit"> Submit</button>

                    </div>
                </form>
            }

        </div>
    );
}

export default AddAssignments;
