import "./FeedCard.scss";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// Models
import AssignmentModel from "../../../Models/AssignmentModel";
import EmployeeResponseModel from "../../../Models/EmployeeResponseModel";
import EmployeeModel from "../../../Models/EmployeeModel";
//Services
import filesService from "../../../Services/FilesService";
import imagesService from "../../../Services/ImagesService";
import notifyService from "../../../Services/NotifyService";
import assignmentsService from "../../../Services/assignmentsService";
import employeeResponseService from "../../../Services/employeeResonseService";
// Redux
import { assignmentsStore } from "../../../Redux/AssignmentsState";
// Icons
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { MdOutlinePriorityHigh } from "react-icons/md";

interface FeedCardProps
{
    assignment: AssignmentModel;
    employee: EmployeeModel;
    isSelected: Boolean;
    close: () => void;
}

function FeedCard ( props: FeedCardProps ): JSX.Element
{

    // Assignment state
    const [ assignment, setAssignment ] = useState<AssignmentModel>( props.assignment && props.assignment );

    // Folder name state
    const [ folderName, setFolderName] = useState<string>("")

    // Images state
    const [ uploadedImages, setUploadedImages ] = useState<FileList[]>( [] );

    // Files state
    const [ uploadedFiles, setUploadedFiles ] = useState<FileList[]>( [] );

    // Use form state to hold registration information
    const { register, handleSubmit } = useForm<EmployeeResponseModel>();

    // Listing to redux for assignment changes
    useEffect( () =>
    {
        try
        {
            const unsubscribe = assignmentsStore.subscribe( () =>
            {
                const state = assignmentsStore.getState().assignments;
                setAssignment( state.find( ( a ) => a._id === props.assignment._id ) );
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

    // Set folder name
    useEffect(()=>{
        setFolderName(assignment._id + ":" + assignment.title)
    },[props.assignment])

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

    // Extract file name - for file download display
    function extractFileName ( url: string )
    {
        const lastSlashIndex = url.lastIndexOf( '/' );
        const fileNameWithExtension = url.substring( lastSlashIndex + 1 );
        const fileName = fileNameWithExtension.split( '|' )[ 1 ];
        return fileName;
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
    async function uploadFiles (): Promise<{ imagesUrl: string[], filesUrl: string[]; }>
    {
        const filesUrl: { imagesUrl: string[], filesUrl: string[]; } = {
            imagesUrl: [],
            filesUrl: []
        };
        if ( uploadedImages.length > 0 )
        {
            const urls = await imagesService.addImage( uploadedImages, folderName );
            filesUrl.imagesUrl = urls;
        }
        if ( uploadedFiles.length > 0 )
        {
            const urls = await filesService.addFile( uploadedFiles, folderName );
            filesUrl.filesUrl = urls;
        }

        return filesUrl;
    }

    // Handle send form to server
    async function sendForm ( response: EmployeeResponseModel )
    {
        try
        {
            const urls = await uploadFiles();

            response.dateTime = new Date();
            response.employeeId = props.employee._id;
            response.assignmentId = assignment._id;
            response.files = urls.filesUrl;
            response.images = urls.imagesUrl;

            const addedResponse = await employeeResponseService.addResponse( response );
            assignment.employeeResponseIds.push( addedResponse._id );
            assignmentsService.editAssignment( props.employee.departmentId, assignment );
            notifyService.success( "Response Added!" );
        }
        catch ( err: any )
        {
            notifyService.error( err );
        }
    }

    return (
        <div className="FeedCard">
            <div className="assignment-card">
                <div className="assignment-content-wrapper">
                    { props.isSelected && <button className="danger-btn" onClick={ props.close }> Close </button> }

                    <div className="priority-wrapper">
                        <div className={ `${ assignment.priority === "low" ? "low-priority" : assignment.priority === "medium" ? "medium-priority" : "high-priority" } priority-indicator` }> <MdOutlinePriorityHigh /></div>
                        <h2>{ assignment.title }</h2>
                    </div>

                    <div className="assignment-content">
                        <div className="status-wrapper">
                            <div className={ `status status-indicator ${ assignment.status === "waiting" ? "waiting" : assignment.status === "inProgress" ? "inProgress" : assignment.status === "waitingForApproval" ? "waitingForApproval" : assignment.status === "backToRepairs" ? "backToRepairs" : "managerApproved" }` }></div>
                            <p> { assignment.status }</p>

                        </div>


                        <div className="dates">
                            <small>{ formatDate( assignment.startDate ).date } | { formatDate( assignment.startDate ).time }</small>
                            <small>{ formatDate( assignment.dueDate ).date } | { formatDate( assignment.dueDate ).time }</small>
                        </div>

                        <p className="mission" >{ assignment.mission.replace( /\\n/g, '\n' ) }</p>

                        <div className="employees-list">
                            <p> Team Manager: { assignment.manager?.firstName } { assignment.manager?.lastName }</p>
                            { assignment.employees && assignment.employees.map( e => (
                                <small key={ e._id }>
                                    { e.firstName } { e.lastName }
                                </small>
                            ) ) }
                        </div>
                    </div>

                    <div className="employee-response-card">
                        { assignment.employeeResponses && assignment.employeeResponses.map( e => (
                            <div className="employee-response" key={ e._id }>
                                <p className="responder-name">
                                    { e.employee.firstName } { e.employee.firstName }
                                </p>

                                <small className="response-date">{ formatDate( e.dateTime ).date } | { formatDate( e.dateTime ).time }</small>

                                <p> { e.content }</p>
                                { e.images.length > 0 &&
                                    <div className="response-images">
                                        { e.images.map( ( i, index ) => <a key={ index } href={ i } target="_blank"> <img src={ i } alt="employee response image" /></a> ) }
                                    </div>
                                }

                                { e.files.length > 0 &&
                                    <div className="response-files">
                                        { e.files.map( ( f, index ) => <a key={ index } href={ f } download target="_blank">{ f }</a> ) }
                                    </div>
                                }

                            </div>
                        ) ) }
                    </div>

                    <div className="assignment-response">
                        <form onSubmit={ handleSubmit( sendForm ) }>
                            <textarea  { ...register( "content" ) } placeholder="Send You'r Respond" />

                            <div className="files-handler-btns">

                                <div className="files-btn">
                                    <input
                                        type="file"
                                        className="upload-images"
                                        accept="image/*"
                                        onChange={ handleUploadImages }
                                        multiple
                                        placeholder="images"
                                    />
                                </div>
                                <div className="files-btn">
                                    <input
                                        type="file"
                                        className="upload-files"
                                        accept="file/*"
                                        onChange={ handleUploadFiles }
                                        multiple
                                        placeholder="files"
                                    />
                                </div>
                                <button className="send-btn send-response"> Send</button>
                            </div>
                        </form>

                    </div>
                </div>

                <div className="assignment-images">
                    { assignment.imagesUrl.length > 0 && assignment.imagesUrl.map( ( i, index ) => <a key={ index } href={ i } target="_blank"><img src={ i } alt="image" /> </a> ) }
                </div>
                <div className="assignment-files">
                    { assignment.filesUrl.length > 0 && assignment.filesUrl.map( ( f, index ) => <a className="assignment-files-file" key={ index } href={ f } download> <HiOutlineDocumentDownload /> <p>{ extractFileName( f ) }</p></a> ) }
                </div>


            </div>
        </div>
    );
}

export default FeedCard;
