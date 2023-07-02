import axios from "axios";
import appConfig from "../Utils/AppConfig";
// Models
import AssignmentModel from "../Models/AssignmentModel";
// Services
import socketService from "./socketService";
// Redux
import {
  AssignmentsActionType,
  assignmentsStore,
} from "../Redux/AssignmentsState";

class AssignmentsService {
  //  ==================== GET all assignments ====================
  public async getAllAssignments(): Promise<AssignmentModel[]> {
    // Get assignments from global state:
    let assignments = assignmentsStore.getState().assignments;

    // If we don't have assignments
    if (assignments.length === 0) {
      // Get from server
      const response = await axios.get<AssignmentModel[]>(
        appConfig.assignmentsUrl
      );

      // Extract assignments
      assignments = response.data;

      // Update global state
      assignmentsStore.dispatch({
        type: AssignmentsActionType.FetchAssignments,
        payload: assignments,
      });
    }

    // Return
    return assignments;
  }

  // ==================== GET assignments by employee ====================
  public async getAssignmentsByEmployee(
    employeeId: string
  ): Promise<AssignmentModel[]> {
    // Get assignments from global state:
    let globalAssignments = assignmentsStore.getState().assignments;

    // Extract specific assignments
    let assignments: AssignmentModel[] = globalAssignments.filter((a) =>
      a.employeeIds.find((id) => id === employeeId)
    );

    // If assignments don't exist
    if (!assignments.length) {
      // Get from server
      const response = await axios.get<AssignmentModel[]>(
        appConfig.assignmentsUrl + "by-employee/" + employeeId
      );

      // Extract assignments
      assignments = response.data;
    }

    // Return
    return assignments;
  }
  // ==================== GET assignments by department ====================
  public async getAssignmentsByDepartment(
    departmentId: string
  ): Promise<AssignmentModel[]> {
    // Get assignments from global state:
    let globalAssignments = assignmentsStore.getState().assignments;

    // Extract specific assignments
    let assignments: AssignmentModel[] = globalAssignments.filter(
      (a) => a.departmentId === departmentId
    );

    // If assignments don't exist
    if (!assignments.length) {
      // Get from server
      const response = await axios.get<AssignmentModel[]>(
        appConfig.assignmentsUrl + "by-department/" + departmentId
      );

      // Extract assignments
      assignments = response.data;
    }

    // Update global state
    assignmentsStore.dispatch({
      type: AssignmentsActionType.FetchAssignments,
      payload: assignments,
    });

    // Return
    return assignments;
  }

  // ==================== GET one assignment ====================
  public async getOneEmployee(_id: string): Promise<AssignmentModel> {
    // Get assignments from global state:
    let assignments = assignmentsStore.getState().assignments;

    // Extract specific assignment
    let assignment = assignments.find((a) => a._id === _id);

    // If assignment don't exist
    if (!assignment) {
      // Get from server
      const response = await axios.get<AssignmentModel>(
        appConfig.assignmentsUrl + _id
      );

      // Extract vacation
      assignment = response.data;
    }

    // Return
    return assignment;
  }

  // ==================== ADD one assignment ====================
  public async addAssignment(
    room: string,
    assignment: AssignmentModel
  ): Promise<void> {
    // Send axios request to server
    const response = await axios.post<AssignmentModel>(
      appConfig.assignmentsUrl,
      assignment
    );

    // Get added assignment
    const addedAssignment = response.data;

    // Send via socket.io
    socketService.startSocketListener(addedAssignment, room, true);

    // Add assignment to global state
    assignmentsStore.dispatch({
      type: AssignmentsActionType.AddAssignment,
      payload: addedAssignment,
    });
  }

  // ==================== EDIT assignment ====================
  public async editAssignment(
    room: string,
    assignment: AssignmentModel
  ): Promise<void> {
    // Send assignment to server
    const response = await axios.put<AssignmentModel>(
      appConfig.assignmentsUrl + assignment._id,
      assignment
    );

    // Get updated assignment
    const updatedAssignment = response.data;

    // Send via socket.io
    socketService.startSocketListener(updatedAssignment, room, false);

    // Update global state
    assignmentsStore.dispatch({
      type: AssignmentsActionType.UpdateAssignment,
      payload: updatedAssignment,
    });
  }
  // ==================== DELETE assignment ====================
  public async deleteAssignment(room: string, _id: string): Promise<void> {
    
    // Delete assignment from server
    await axios.delete(appConfig.assignmentsUrl + _id);

     // Send via socket.io
     socketService.startSocketListener(_id, room, false);

    // Delete from global state
    assignmentsStore.dispatch({
      type: AssignmentsActionType.DeleteAssignment,
      payload: _id,
    });
  }
}

const assignmentsService = new AssignmentsService();

export default assignmentsService;
