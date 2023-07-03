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

  // MongoDB connection string:
  public async getMongoConnection(): Promise<MongoClient> {
    const client = new MongoClient(`mongodb://${this.host}`, {
      useUnifiedTopology: true,
    });
    await client.connect();
    return client;
  }

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

  // MongoDB connection string:
  public async getMongoConnection(): Promise<MongoClient> {
    const client = new MongoClient(`mongodb://${this.host}`, {
      useUnifiedTopology: true,
    });
    await client.connect();
    return client;
  }

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
}

const appConfig =
  process.env.NODE_ENV === 'production'
    ? new ProductionConfig()
    : new DevelopmentConfig();

export default appConfig;
