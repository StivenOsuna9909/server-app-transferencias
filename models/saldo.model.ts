import { Schema, Document, model } from "mongoose";

const saldoSchema = new Schema ({
    created: {
        type: Date
    },
    mensaje:{
        type: String
    },
    amount:{
        type: Number,
        ref:'Cantidad de dinero',
        required: [ false,'Puede estar en cero' ]
    },
    numerocuenta:{
        type: String,
        ref:'Numero Cuenta destino',
        required: [ true,'Debe de existir un numero de cuenta para transferir' ]
    },     

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [ true,'Debe de existir una referencia a un usuario' ]
    }
    
});
saldoSchema.pre<Isaldo>('save', function(next){
    this.created = new Date();
    next();
});
interface Isaldo extends Document{
    created: Date;
    mensaje: string;
    cuenta: string;
    numerocuenta: string;
    cuantotransfiere: string;
    moneda: String ;
    usuario: string;
}

export const Saldo = model<Isaldo>('Saldo', saldoSchema);