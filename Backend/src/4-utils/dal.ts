import mongoose from "mongoose";
import appConfig from "./app-config";
import { MongoClient } from 'mongodb';


async function connect():Promise<void> {
    try{
         const db = await mongoose.connect(appConfig.mongoConnection);
        console.log("connected to mongo: " + db.connections[0].name);        
    }
    catch(err:any){
            console.log(err);
        }
}

export default {connect};