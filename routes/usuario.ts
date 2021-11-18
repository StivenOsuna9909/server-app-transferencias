import { Router, Request, Response } from "express";
import { Usuario, IUsuario } from "../models/usuario.model";
import bcrypt from "bcrypt";
import Token from "../classes/token";
import { verificaToken } from "../middlewares/autenticacion";

const userRoutes = Router();


userRoutes.post("/create", (req: Request, res: Response) => {
  //login
  userRoutes.post("/login", (req: Request, res: Response) => {
    const body = req.body;
    Usuario.findOne({ email: req.body.email }, (err: any, userDB: IUsuario) => {
      if (err) throw err;
      if (!userDB) {
        return res.json({
          ok: false,
          mensaje: "Usuario/contraseña no son correctos",
        });
      }

      if (userDB.compararPassword(body.password)) {
        const tokenUser = Token.getJwtToken({
          _id: userDB._id,
          nombre: userDB.nombre,
          email: userDB.email,
        });

        res.json({
          ok: true,
          token: tokenUser,
        });
      } else {
        return res.json({
          ok: false,
          mensaje: "Usuario/contraseña no son correctos",
        });
      }
    });
  });

  //Crear un usuario
  const user = {
    nombre: req.body.nombre,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    tipocuenta: req.body.tipocuenta,
    numerocuenta: req.body.numerocuenta,
  };

  Usuario.create(user)
    .then((userDB) => {
      const tokenuser = Token.getJwtToken({
        _id: userDB._id,
        nombre: userDB.nombre,
        email: userDB.email,
        tipocuenta: userDB.tipocuenta,
        numerocuenta: userDB.numerocuenta,
      });

      res.json({
        ok: true,
        token: tokenuser,
      });
    })
    .catch((err) => {
      res.json({
        ok: false,
        err,
      });
    });
});
//Actualizar usuario
userRoutes.post("/update", verificaToken, (req: any, res: Response) => {
  const user = {
    nombre: req.body.nombre || req.usuario.nombre, 
    email: req.body.email || req.usuario.email,
    password: req.body.password || req.usuario.password,
  };

  Usuario.findByIdAndUpdate( req.usuario._id, user, { new: true }, (err, userDB)=>{
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

userRoutes.get('/', [verificaToken], (req: any, res: Response) =>{

  const usuario = req.usuario;
  res.json({
    ok: true,
    usuario
  });

});

export default userRoutes;
