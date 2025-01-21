import mongoose from "mongoose";
import 'dotenv/config'
import {DB_Name} from '../constant.js'


const ConnectDB = async ()=>{

    try {
        const ConnectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_Name}`)

        console.log(`Mongo DB Connected 🚀🚀🚀\n Host: ${ConnectionInstance.connection.host}`);
    } catch (error) {
        console.error("Error :",error)
    }
}

export default ConnectDB