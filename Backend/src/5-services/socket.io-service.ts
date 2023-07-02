import http from "http"
import socketIo from "socket.io";
import AssignmentModel, { IAssignmentModel } from "../2-models/assignment-model";


//defined socket.io logic:
function init(httpServer:http.Server):void{

    // CORS options: * = open to all fronts
    const options = {cors: {origin:"*"}};

    // Create socket.io server:
    const socketServer = new socketIo.Server(httpServer, options);

    // 1. listing to client connection
    // event must be "connection"
    socketServer.sockets.on("connection", (socket:socketIo.Socket)=>{
      
      console.log("Client has been connected");

        //  Join room
        socket.on("joinRoom", (room:string)=>{
          socket.join(room);
          console.log(`User joined room: ${room}`);
        }); 
        // . Listen to new assignment
        socket.on("newAssignment", (room:string, assignment:IAssignmentModel)=>{
          socket.to(room).emit('ioNewAssignment',assignment)
          console.log('newAssignment ' + assignment + " --- " + room);
          
        }); 
        //  Listen to updated assignment
        socket.on("updatedAssignment", (room:string, assignment:IAssignmentModel)=>{
          console.log('updatedAssignment ' + assignment.status + " --- " + room);
          socket.to(room).emit('ioUpdatedAssignment',assignment)
        }); 
        //  Listen to delete assignment
        socket.on("deleteAssignment", (room:string, assignmentId:string)=>{
          console.log('deleteAssignment ' + assignmentId + " --- " + room);
          socket.to(room).emit('ioDeleteAssignment',assignmentId)
        }); 

        // 7. listing to specific client disconnect:
        // event must be "disconnect"
        socket.on("disconnect",()=>{
            console.log("client has been disconnected");
        })
    });

    
}

export default{
    init
};