import { Schema, Document, model } from 'mongoose';

const transferSchema = new Schema ({
    created: {
        type: Date
    },
    mensaje:{
        type: String
    },
    cuenta:{
        type: String,
        ref:'Tipo de Cuenta',
        required: [ true,'Debe de existir un tipo de cuenta ahorros o corriente para transferir' ]
    },
    numerocuenta:{
        type: String,
        ref:'Numero Cuenta destino',
        required: [ true,'Debe de existir un numero de cuenta para transferir' ]
    },
    cuantotransfiere:{
        type: String,
        ref:'Cuanto se transfiere',
        required: [ true,'Debe de existir una cantidad para transferir' ]
    },
    moneda:{
        type: String,
        ref:'Moneda en la cual se transfiere',
        required: [ true,'Debe de existir una moneda para transferir' ]
    },

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [ true,'Debe de existir una referencia a un usuario' ]
    }
    
});
transferSchema.pre<Itransferencia>('save', function(next){
    this.created = new Date();
    next();
});
interface Itransferencia extends Document{
    created: Date;
    mensaje: string;
    cuenta: string;
    numerocuenta: string;
    cuantotransfiere: string;
    moneda: String ;
    usuario: string;
}

export const Transfer = model<Itransferencia>('Transfer', transferSchema);