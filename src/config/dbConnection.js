import { connect } from "mongoose"

const URL = 'mongodb+srv://guerreroagustavo:tavo-9614@cluster0.en1m04u.mongodb.net/eComerce?retryWrites=true&w=majority'
// const URL = 'mongodb+srv://localhost/'


const dbConnection = async () => {
    return await connect(URL, err => {
        if (err) {
            console.log('No se puede conectar mongodb: ', err)
            process.exit()
        }
        console.log('DB conectada ')
    })
}

export default dbConnection

//datos de conexion