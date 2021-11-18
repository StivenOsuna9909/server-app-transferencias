import { Router, Response } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import { Transfer } from '../models/transferencia.model';
import Token from "../classes/token";



const transferenciaRouts = Router();



//Obtener transferencias paginadas

transferenciaRouts.get('/', async (req: any, res: Response) => {

    let pagina = Number (req.query.pagina) || 1;
    let skip = pagina -1;
    skip = skip * 10;

    const transf = await Transfer.find()
                                        .sort({ _id: -1 })
                                        .skip( skip )
                                        .populate('usuario', '-password')
                                        .limit(10)
                                        .exec();

    res.json({
        ok: true,
        pagina,
        transf
    });
});

// Crear transferencias
transferenciaRouts.post('/', [ verificaToken ], (req: any, res: Response) => {
  

    const body = req.body;

    body.usuario = req.usuario._id;


    Transfer.create( body ).then( async transferDB =>{

        await transferDB.populate('usuario', '-password ');

        res.json({
            ok: true,
            transfer: transferDB
        });
    }).catch(err =>{
        res.json(err)
    });


});


//Actualizar usuario
transferenciaRouts.post("/update", verificaToken, (req: any, res: Response) => {
    const user = {
      nombre: req.body.nombre || req.usuario.nombre, 
      email: req.body.email || req.usuario.email,
      password: req.body.password || req.usuario.password,
    };
  
    Transfer.findByIdAndUpdate( req.usuario._id, user, { new: true }, (err, userDB)=>{
      if (err) throw err;
  
      if ( !userDB ){
        return res.json({
          ok: false,
          mensaje: 'No existe un usuario con ese ID'
        });
      }
      const tokenUser = Token.getJwtToken({
        _id: userDB._id,
        nombre: userDB.nombre,
        email: userDB.email,
      });
  
      res.json({
        ok: true,
        token: tokenUser,
      });
  
  
    });
  });

export default transferenciaRouts;