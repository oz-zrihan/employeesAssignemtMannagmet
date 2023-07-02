import { io } from "socket.io-client";
import appConfig from "../Utils/AppConfig";
// Models
import AssignmentModel from "../Models/AssignmentModel";
// Redux
import {
  AssignmentsActionType,
  assignmentsStore,
} from "../Redux/AssignmentsState";

// Initializes a socket connection to a server
const socketService = io(appConfig.socketUrl);

// Join room
async function socketJoinRoom(room: string) {
  socketService.emit("joinRoom", room);
  // console.log('joinRoom ' + room);
}

// Socket service that listens to new/update assignments from server, and pass it to redux store
async function startSocketListener(
  assignment: AssignmentModel | string,
  room: string,
  isNew: boolean
) {
  // emit assignment
  if (isNew) {
    socketService.emit("newAssignment", room, assignment);
  } else {
    if(typeof assignment === "string"){
      socketService.emit("deleteAssignment", room, assignment);
      console.log(assignment);
      
    }else{
      socketService.emit("updatedAssignment", room, assignment);
    }
  }
}

// Listing to socket.io assignment
// Io Added assignment
socketService.on("ioNewAssignment", (assignment: AssignmentModel) => {
  assignmentsStore.dispatch({
    type: AssignmentsActionType.AddAssignment,
    payload: assignment,
  });
});

// Io updated assignment
socketService.on("ioUpdatedAssignment", (assignment: AssignmentModel) => {
  try {
    assignmentsStore.dispatch({
      type: AssignmentsActionType.UpdateAssignment,
      payload: assignment,
    });
  } catch (error) {
    console.error("Error in ioUpdatedAssignment event handler:", error);
  }
});

// Io delete assignment
socketService.on("ioDeleteAssignment", (assignmentId: string) => {
  try {
    console.log("ioDeleteAssignment");
    console.log(assignmentId);
    
    assignmentsStore.dispatch({
      type: AssignmentsActionType.DeleteAssignment,
      payload: assignmentId,
    });
  } catch (error) {
    console.error("Error in ioUpdatedAssignment event handler:", error);
  }
});

export default {
  socketJoinRoom,
  startSocketListener,
};
