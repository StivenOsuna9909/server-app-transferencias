import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

const usuarioSchema = new Schema ({

    nombre:{
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email:{
        type: String,
        unique: true,
        required: [true, 'El email es necesario']
    },
    password:{
        type: String,
        required: [true, 'La contraseña es necesaria']
    },
    tipocuenta:{
        type: String,
        required: [true, 'El tipo de cuenta es necesaria']
    },
    numerocuenta:{
        type: String,
        required: [true, 'El numero de cuenta es necesario']
    },
})

usuarioSchema.method('compararPassword',function( password: string = '' ):boolean {
    if( bcrypt.compareSync( password, this.password ) ){
        return true;

    } else{
        return false;
    }
});


export interface IUsuario extends Document{
    nombre: string;
    email: string;
    password: string;
    tipocuenta: string;
    numerocuenta: string;

    compararPassword(password: string): boolean;
}

export const Usuario = model<IUsuario>('Usuario', usuarioSchema);