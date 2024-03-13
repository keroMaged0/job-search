import mongoose from "mongoose"


export const db_connection = () => {
    mongoose.connect('mongodb://127.0.0.1/jobSearch').then(() => {
        console.log('dbConnection done....');
    }).catch((err) => {
        console.log("error in connection ", err);
    });
}

