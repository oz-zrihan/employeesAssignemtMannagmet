import express from "express";
import expressFileUpload from "express-fileupload";
import expressRateLimit from "express-rate-limit";
import preventXss from "./3-middleware/prevent-xss";
import helmet from "helmet";
import cors from "cors";
import appConfig from "./4-utils/app-config";
import dal from "./4-utils/dal";
import http from "http"
import socketIoService from "./5-services/socket.io-service";

//Routs
import authRout from "./6-routes/auth-routes";
import employeesRout from "./6-routes/employees-routes";
import positionsRout from "./6-routes/positions-routes";
import departmentsRout from "./6-routes/departments-routes";
import assignmentsRout from "./6-routes/assignments-routes";
import imagesRout from "./6-routes/images-routes";
import filesRout from "./6-routes/files-routes";
import employeesResponseRout from "./6-routes/employees-response-routes";
import routeNotFound from "./3-middleware/route-not-found";
import catchAll from "./3-middleware/catch-all";

const server = express();

// Prevent DoS attack:
// server.use(
//   expressRateLimit({
//     windowMs: 10000,
//     max: 10000,
//     message: "To many request",
//   })
// );

// Use helmet to defense against malicious headers:
server.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Create CORS policy:
server.use(cors());

// Create request.body object if json was sent:
server.use(express.json());

// Defend from cross-site scripting:
server.use(preventXss);

// Get files sent by the front into request.files object:
server.use(expressFileUpload());
server.use(express.static("./images"));
server.use(express.static("./files"));

// Routs:
server.use("/api/auth", authRout);
server.use("/api/employees", employeesRout);
server.use("/api/employees_response", employeesResponseRout);
server.use("/api/assignments", assignmentsRout);
server.use("/api/departments", departmentsRout);
server.use("/api/positions", positionsRout);
server.use("/api/images", imagesRout);
server.use("/api/files", filesRout);
server.use("*", routeNotFound);
server.use(catchAll);


// Mongoose
server.listen(appConfig.port, async () =>{
  await dal.connect();
  console.log("Listening on http://localhost:" + appConfig.port)});

// Socket.io
const httpServer:http.Server = server.listen(appConfig.socketPort, () => console.log("Listening on http://localhost:" + appConfig.socketPort));
socketIoService.init(httpServer)