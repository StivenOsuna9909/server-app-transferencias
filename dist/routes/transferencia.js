"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autenticacion_1 = require("../middlewares/autenticacion");
const transferencia_model_1 = require("../models/transferencia.model");
const transferenciaRouts = (0, express_1.Router)();
//Obtener transferencias paginadas
transferenciaRouts.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const transf = yield transferencia_model_1.Transfer.find()
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
}));
// Crear transferencias
transferenciaRouts.post("/", [autenticacion_1.verificaToken], (req, res) => {
    const body = req.body;
    body.usuario = req.usuario._id;
    transferencia_model_1.Transfer.create(body)
        .then((transferDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield transferDB.populate("usuario", "-password ");
        res.json({
            ok: true,
            transfer: transferDB,
        });
    }))
        .catch((err) => {
        res.json(err);
    });
});
exports.default = transferenciaRouts;
