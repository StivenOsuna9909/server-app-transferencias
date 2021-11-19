"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_model_1 = require("../models/usuario.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const autenticacion_1 = require("../middlewares/autenticacion");
const userRoutes = (0, express_1.Router)();
userRoutes.post("/create", (req, res) => {
    //login
    userRoutes.post("/login", (req, res) => {
        const body = req.body;
        usuario_model_1.Usuario.findOne({ email: req.body.email }, (err, userDB) => {
            if (err)
                throw err;
            if (!userDB) {
                return res.json({
                    ok: false,
                    mensaje: "Usuario/contraseña no son correctos",
                });
            }
            if (userDB.compararPassword(body.password)) {
                const tokenUser = token_1.default.getJwtToken({
                    _id: userDB._id,
                    nombre: userDB.nombre,
                    email: userDB.email,
                });
                res.json({
                    ok: true,
                    token: tokenUser,
                });
            }
            else {
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
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        tipocuenta: req.body.tipocuenta,
        numerocuenta: req.body.numerocuenta,
    };
    usuario_model_1.Usuario.create(user)
        .then((userDB) => {
        const tokenuser = token_1.default.getJwtToken({
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
    const saldoRoutes = (0, express_1.Router)();
    //Crear un saldo
    const saldo = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        tipocuenta: req.body.tipocuenta,
        numerocuenta: req.body.numerocuenta,
        saldocuenta: req.body.saldocuenta,
    };
    usuario_model_1.Usuario.create(saldo)
        .then((saldoDB) => {
        const tokenuser = token_1.default.getJwtToken({
            _id: saldoDB._id,
            nombre: saldoDB.nombre,
            email: saldoDB.email,
            tipocuenta: saldoDB.tipocuenta,
            numerocuenta: saldoDB.numerocuenta,
            saldocuenta: saldoDB.saldocuenta,
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
userRoutes.post("/update", autenticacion_1.verificaToken, (req, res) => {
    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        password: req.body.password || req.usuario.password,
    };
    usuario_model_1.Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: "No existe un usuario con ese ID",
            });
        }
        const tokenUser = token_1.default.getJwtToken({
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
//Actualizar SALDO
userRoutes.post("/updateamount", autenticacion_1.verificaToken, (req, res) => {
    const user = {
        saldo: req.body.saldo || req.usuario.saldo,
    };
    usuario_model_1.Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: "No existe un usuario con ese ID",
            });
        }
        const tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
        });
        res.json({
            ok: true,
            token: tokenUser,
        });
    });
});
userRoutes.get("/", [autenticacion_1.verificaToken], (req, res) => {
    const usuario = req.usuario;
    res.json({
        ok: true,
        usuario,
    });
});
exports.default = userRoutes;
