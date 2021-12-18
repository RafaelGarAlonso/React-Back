const { Schema, model } = require('mongoose');

const MedicSchema = Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    province: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'ADMIN'
    }
});

MedicSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model( 'Medic', MedicSchema );
