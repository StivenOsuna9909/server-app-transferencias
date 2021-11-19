import { Router, Response } from "express";
import { verificaToken } from "../middlewares/autenticacion";
import { Transfer } from "../models/transferencia.model";
import Token from "../classes/token";

const transferenciaRouts = Router();

//Obtener transferencias paginadas

transferenciaRouts.get("/", async (req: any, res: Response) => {
  let pagina = Number(req.query.pagina) || 1;
  let skip = pagina - 1;
  skip = skip * 10;

  const transf = await Transfer.find()
    .sort({ _id: -1 })
    .skip(skip)
    .populate("usuario", "-password")
    .limit(10)
    .exec();

  res.json({
    ok: true,
    pagina,
    transf,
  });
});

// Crear transferencias
transferenciaRouts.post("/", [verificaToken], (req: any, res: Response) => {
  const body = req.body;

  body.usuario = req.usuario._id;

  Transfer.create(body)
    .then(async (transferDB) => {
      await transferDB.populate("usuario", "-password ");

      res.json({
        ok: true, 
        transfer: transferDB,
      });
    })
    .catch((err) => {
      res.json(err);
    });
});



export default transferenciaRouts;
