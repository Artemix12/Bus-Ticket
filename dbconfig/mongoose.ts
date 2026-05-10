import mongoose from 'mongoose'

const MONGO_URI = process.env.MONGO_URI!

 if (!MONGO_URI){
    throw new Error('Please define the MONGODB_URI environment variable');
}

const cached = (global as any).mongoose ?? {conn:null , promise:null};
(global as any).mongoose= cached

async function dbConnect(){
    if(cached.conn)return cached.com

    if(!cached.conn){
      cached.promise = mongoose.connect(MONGO_URI,{bufferCommands:false})
    }
    
    cached.conn = await cached.promise
    return cached.conn
}

export default dbConnect