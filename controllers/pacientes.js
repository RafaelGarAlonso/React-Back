const { response } = require('express');
const bcrypt = require('bcryptjs');
const Paciente = require('../models/paciente');
const { generarJWT } = require('../helpers/jwt');

const getPacientes = async(req, res) => {
    const from = Number(req.query.from);
    const limit = Number(req.query.limit);
    const [ pacientes, total ] = await Promise.all([
        Paciente
            .find({}, 'name surname email gender address province role')
            .skip( from )
            .limit( limit ),
            Paciente.countDocuments()
    ]);

    setTimeout(function() {
        res.json({
            ok: true,
            pacientes,
            total
        });
    }, 1000);
}

const crearPaciente = async(req, res = response) => {
    const { email, password } = req.body;
    try {
        const existeEmail = await Paciente.findOne({ email });
        if ( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const paciente = new Paciente( req.body );
    
        const salt = bcrypt.genSaltSync();
        paciente.password = bcrypt.hashSync( password, salt );
    
        await paciente.save();

        const token = await generarJWT( paciente.id );

        setTimeout(function() {
            res.json({
                ok: true,
                paciente,
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

const actualizarPaciente = async (req, res = response) => {
    const uid = req.params.id;
    const { email, ...campos } = req.body;

    try {
        const pacienteDB = await Paciente.findById( uid );

        if ( !pacienteDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontró un paciente con ese ID'
            });
        }

        if ( pacienteDB.email !== email ) {
            const existeEmail = await Paciente.findOne({ email });
            if ( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un paciente con ese email'
                });
            }
        }
        campos.email = email;
        const pacienteActualizado = await Paciente.findByIdAndUpdate( uid, campos, { new: true } );

        setTimeout(function() {
            res.json({
                ok: true,
                paciente: pacienteActualizado
            });
        }, 1000);
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const borrarPaciente = async(req, res = response ) => {
    const uid = req.params.id;
    try {
        const pacienteDB = await Paciente.findById( uid );
        if ( !pacienteDB ) {
            return res.status(400).json({
                ok: false,
                msg: 'No se encontró un paciente con ese ID'
            });
        }

        await Paciente.findByIdAndDelete( uid );

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
    getPacientes,
    crearPaciente,
    actualizarPaciente,
    borrarPaciente
}