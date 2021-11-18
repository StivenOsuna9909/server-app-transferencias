import Server from "./classes/server";
import userRoutes from "./routes/usuario";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import transferenciaRouts from './routes/transferencia';

const server = new Server();


// Body parser
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());




//Rutas de mi app
server.app.use("/user", userRoutes);
server.app.use("/transferencia", transferenciaRouts);

//conectar DB
mongoose.connect("mongodb://localhost:27017/databanking1", (err) => {
    if(err) throw err;
    console.log('Base de datos online');
});

//Levantar express
server.start(() => {
  console.log(`Servidor corriendo en puerto ${server.port}`);
});
