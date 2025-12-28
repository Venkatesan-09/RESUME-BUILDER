import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        mongoose.connection.on("connected",()=>{console.log("Datadase connected successfully");
        })

        let mongodbURI = process.env.mongodb_URI;
        const projectName = 'resuem-builder';

        if(!mongodbURI){
            throw new Error("Mongodv_URI environment variable not set")
        }
        if(mongodbURI.endsWith('/')){
            mongodbURI = mongodbURI.slice(0,-1)
        }

        await mongoose.connect(`${mongodbURI}/${projectName}`)
    } catch (error) {
        console.error("Error connecting to mongoDB:",error)
    }
}

export default connectDB;