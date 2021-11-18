"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transfer = void 0;
const mongoose_1 = require("mongoose");
const transferSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    mensaje: {
        type: String
    },
    cuenta: {
        type: String,
        ref: 'Cuenta',
        required: [true, 'Debe de existir un tipo de cuenta para transferir']
    },
    numerocuenta: {
        type: String,
        ref: 'Cuanto',
        required: [true, 'Debe de existir un numero de cuenta para transferir']
    },
    cuantotransfiere: {
        type: String,
        ref: 'Cuanto',
        required: [true, 'Debe de existir una cantidad para transferir']
    },
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe de existir una referencia a un usuario']
    }
});
transferSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Transfer = (0, mongoose_1.model)('Transfer', transferSchema);
