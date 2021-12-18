const { response } = require('express');
const bcrypt = require('bcryptjs');
const Patient = require('../models/patients');
const { generateJWT } = require('../helpers/jwt');

const getPatient = async(req, res) => {
    const from = Number(req.query.from);
    const limit = Number(req.query.limit);
    const [ patients, total ] = await Promise.all([
        Patient
            .find({}, 'name surname email gender address province role medicAssigned appointment')
            .skip( from )
            .limit( limit ),
            Patient.countDocuments()
    ]);

    setTimeout(function() {
        res.json({
            ok: true,
            patients,
            total
        });
    }, 1000);
}

const createPatient = async(req, res = response) => {
    const { email, password } = req.body;
    try {
        const emailExist = await Patient.findOne({ email });
        if ( emailExist ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const patient = new Patient( req.body );
    
        const salt = bcrypt.genSaltSync();
        patient.password = bcrypt.hashSync( password, salt );
    
        await patient.save();

        const token = await generateJWT( patient.id );

        setTimeout(function() {
            res.json({
                ok: true,
                patient,
                token
            });
        }, 1000);
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado...'
        });
    }
}

const updatePatient = async (req, res = response) => {
    const uid = req.params.id;
    const { email, ...fields } = req.body;

    try {
        const patientDB = await Patient.findById( uid );

        if ( !patientDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontró un paciente con ese ID'
            });
        }

        if ( patientDB.email !== email ) {
            const emailExist = await Patient.findOne({ email });
            if ( emailExist ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un paciente con ese email'
                });
            }
        }
        fields.email = email;
        const patientUpdated = await Patient.findByIdAndUpdate( uid, fields, { new: true } );

        setTimeout(function() {
            res.json({
                ok: true,
                patient: patientUpdated
            });
        }, 1000);
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const deletePatient = async(req, res = response ) => {
    const uid = req.params.id;
    try {
        const patientDB = await Patient.findById( uid );
        if ( !patientDB ) {
            return res.status(400).json({
                ok: false,
                msg: 'No se encontró un paciente con ese ID'
            });
        }

        await Patient.findByIdAndDelete( uid );

        setTimeout(function() {
            res.json({
                ok: true,
                msg: 'Paciente eliminado'
            });
        }, 1000);

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error en el servicio'
        });
    }
}

module.exports = {
    getPatient,
    createPatient,
    updatePatient,
    deletePatient
}