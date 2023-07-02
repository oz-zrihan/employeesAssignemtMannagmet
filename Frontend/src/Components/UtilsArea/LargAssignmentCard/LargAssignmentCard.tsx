import "./LargAssignmentCard.scss";
import { useState } from "react";
import { useForm } from "react-hook-form";
// Models
import AssignmentModel from "../../../Models/AssignmentModel";
import EmployeeResponseModel from "../../../Models/EmployeeResponseModel";
import EmployeeModel from "../../../Models/EmployeeModel";
// Services
import filesService from "../../../Services/FilesService";
import imagesService from "../../../Services/ImagesService";
import employeeResponseService from "../../../Services/employeeResonseService";
import notifyService from "../../../Services/NotifyService";
import assignmentsService from "../../../Services/assignmentsService";
// Icons
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { MdOutlinePriorityHigh } from "react-icons/md";

interface LargeAssignmentCardProps
{
    assignment: AssignmentModel;
    admin: EmployeeModel;
    close: () => void;
}


function LargAssignmentCard ( props: LargeAssignmentCardProps ): JSX.Element
{

    // Folder name state
    const folderName = props.assignment._id + ":" + props.assignment.title;

    // Images state
    const [ uploadedImages, setUploadedImages ] = useState<FileList[]>( [] );

    // Files state
    const [ uploadedFiles, setUploadedFiles ] = useState<FileList[]>( [] );

    // Priority changes window state
    const [ isPriority, setIsPriority ] = useState<boolean>( false );

    // Use form state to hold registration information
    const { register, handleSubmit } = useForm<EmployeeResponseModel>();

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

    // Show / hide priority selection options
    function togglePrioritySelection (): void { setIsPriority( !isPriority ); }

    // Set selected priority and update assignment in server + redux
    function handlePrioritySelection ( e: React.MouseEvent<HTMLLIElement> )
    {
        const value = e.currentTarget.getAttribute( "value" );
        props.assignment.priority = value;
        assignmentsService.editAssignment( props.admin.departmentId, props.assignment );
        setIsPriority( !isPriority );
    }


    // Handel uploaded images
    function handleUploadImages ( event: React.ChangeEvent<HTMLInputElement> ): void
    {
        const imagesList = event.target.files;
        setUploadedImages( [ ...[ imagesList ] ] );
    }

    // Handel uploaded files
    function handleUploadFiles ( event: React.ChangeEvent<HTMLInputElement> ): void
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
            response.employeeId = props.admin._id;
            response.files = urls.filesUrl;
            response.images = urls.imagesUrl;
            response.assignmentId = props.assignment._id;

            const addedResponse = await employeeResponseService.addResponse( response );
            const updatedAssignment = {
                ...props.assignment,
                employeeResponseIds: [ addedResponse._id ]
            };

            await assignmentsService.editAssignment( props.admin.departmentId, updatedAssignment );
            notifyService.success( "Response Added!" );
        }
        catch ( err: any )
        {
            notifyService.error( err );
        }
    }

    async function deleteAssignment ()
    {
        await assignmentsService.deleteAssignment( props.admin.departmentId, props.assignment._id );
        props.close();
    }

    return (
        <div className="LargAssignmentCard">
            <div className="assignment-large-card">
                <div className="assignment-content-wrapper">
                    <div className="assignment-content">
                        <div className="priority-wrapper">
                            <div onClick={ togglePrioritySelection } className={ `${ props.assignment.priority === "low" ? "low-priority" : props.assignment.priority === "medium" ? "medium-priority" : "high-priority" } priority-indicator` }> <MdOutlinePriorityHigh /></div>
                            { isPriority &&
                                <div className="priority-list">
                                    <ul className={ isPriority ? "visible" : "" }>
                                        <li className="low-priority" onClick={ handlePrioritySelection } value={ "low" }>  </li>
                                        <li className="medium-priority" onClick={ handlePrioritySelection } value={ "medium" }>  </li>
                                        <li className="high-priority" onClick={ handlePrioritySelection } value={ "high" }>  </li>
                                    </ul>
                                </div>
                            }
                            <span className={ `${ isPriority ? "visible" : "" } priority-name` }> { props.assignment.priority }-priority </span>
                        </div>
                        <h2>{ props.assignment.title }</h2>
                        <div className="dates">
                            <small>{ formatDate( props.assignment.startDate ).date } | { formatDate( props.assignment.startDate ).time }</small>
                            <small>{ formatDate( props.assignment.dueDate ).date } | { formatDate( props.assignment.dueDate ).time }</small>
                        </div>
                        <p className="mission-p">{ props.assignment.mission.replace( /\\n/g, '\n' ) }</p>

                        <div className="employees-list">
                            <p> Team Manager: { props.assignment.manager?.firstName } { props.assignment.manager?.lastName }</p>
                            { props.assignment.employees && props.assignment.employees.map( e => (
                                <small key={ e._id }>
                                    { e.firstName } { e.lastName }
                                </small>
                            ) ) }
                        </div>
                    </div>

                    <div className="assignment-content employees-response">

                        <div className="employee-response-card">
                            { props.assignment.employeeResponses && props.assignment.employeeResponses.map( e => (
                                <div key={ e._id }>
                                    <p>
                                        { e.employee.firstName } { e.employee.firstName }
                                    </p>
                                    <p className="response-p"> { e.content }</p>
                                    { e.images.length > 0 &&
                                        <div className="response-images">
                                            { e.images.map( ( i, index ) => <a key={ index } href={ i } target="_blank"><img src={ i } alt="employee response image" /></a> ) }
                                        </div>
                                    }

                                    { e.files.length > 0 &&
                                        <div className="response-files">
                                            { e.files.map( ( f, index ) => <a key={ f } href={ f } download>Download</a> ) }
                                        </div>
                                    }


                                    <small>{ formatDate( e.dateTime ).date } | { formatDate( e.dateTime ).time }</small>
                                </div>
                            ) ) }
                        </div>
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

                <div className="assignment-files">
                    <button className="danger-btn" onClick={ props.close }> Close </button>
                    <button className="danger-btn" onClick={ deleteAssignment }> Delete </button>
                    <div className="assignment-files-images">
                        { props.assignment.imagesUrl.length > 0 && props.assignment.imagesUrl.map( ( i, index ) => <a key={ index } href={ i } target="_blank"><img src={ i } alt="image" /> </a> ) }
                    </div>
                    <div className="assignment-files-file">
                        { props.assignment.filesUrl.length > 0 && props.assignment.filesUrl.map( ( f, index ) => <a className="download-file" key={ index } href={ f } download><HiOutlineDocumentDownload /> <p>{ extractFileName( f ) }</p></a> ) }
                    </div>
                </div>


            </div>


        </div>
    );
}

export default LargAssignmentCard;
