class AppConfig {
  // Socket.io
  public socketUrl = "http://localhost:4001";

  // Auth's
  public registerUrl = "http://localhost:4000/api/auth/register";
  public loginUrl = "http://localhost:4000/api/auth/login";

  // Data
  public employeesUrl = "http://localhost:4000/api/employees/";
  public employeesResponseUrl = "http://localhost:4000/api/employees_response/";
  public assignmentsUrl = "http://localhost:4000/api/assignments/";
  public departmentsUrl = "http://localhost:4000/api/departments/";
  public positionsUrl = "http://localhost:4000/api/positions/";

  // Files
  public imagesUrl = "http://localhost:4000/api/images/";
  public filesUrl = "http://localhost:4000/api/files/";
}

const appConfig = new AppConfig();

export default appConfig;
