import { MongoClient } from 'mongodb';

class AppConfig {}

class DevelopmentConfig extends AppConfig {
  // Development or Production
  public isDevelopment = true;
  public isProduction = false;

  // Server Port:
  public port = 4000;
  public socketPort = 4001;

  // Database Host:
  public host = process.env.MONGODB_HOST || 'localhost';

  // Database Name:
  public database = process.env.MONGODB_DATABASE || 'manageYourCompany';

  // Server url:
  public serverUrl = `http://${this.host}:${this.port}`;


  // Images url:
  public getImgUrl(imageFolder: string): string {
    const imagesUrl = `http://localhost:${this.port}/api/images/${imageFolder}`;
    return imagesUrl;
  }

  // Files url:
  public getFileUrl(filesFolder: string): string {
    const filesUrl = this.serverUrl + '/api/files/' + filesFolder;
    return filesUrl;
  }

    // MongoDB connection string:
    public mongoConnection = `mongodb://localhost:27017/${this.database}`;

}

class ProductionConfig extends AppConfig {
  // Development or Production
  public isDevelopment = false;
  public isProduction = true;

  // Server Port:
  public port = 4000;
  public socketPort = 4001;

  // Database Host:
  public host = process.env.MONGODB_HOST || 'localhost';

  // Database Name:
  public database = process.env.MONGODB_DATABASE || 'manageYourCompany';

  // Server url:
  public serverUrl = `http://${this.host}:${this.port}`;


  // Images url:
  public getImgUrl(imageFolder: string): string {
    const imagesUrl = this.serverUrl + '/api/images/' + imageFolder;
    return imagesUrl;
  }

  // Files url:
  public getFileUrl(filesFolder: string): string {
    const filesUrl = this.serverUrl + '/api/files/' + filesFolder;
    return filesUrl;
  }
    // MongoDB connection string:
    public mongoConnection = `mongodb://localhost:27017/${this.database}`;

}

const appConfig =
  process.env.NODE_ENV === 'production'
    ? new ProductionConfig()
    : new DevelopmentConfig();

export default appConfig;
