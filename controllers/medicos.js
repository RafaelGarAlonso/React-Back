const { response } = require('express');
const bcrypt = require('bcryptjs');
const Medico = require('../models/medico');
const { generarJWT } = require('../helpers/jwt');

const getMedicos = async(req, res) => {
    const from = Number(req.query.from);
    const limit = Number(req.query.limit);

    const [ medicos, total ] = await Promise.all([
        Medico
            .find({}, 'name email role surname gender address province')
            .skip( from )
            .limit( limit ),
            Medico.countDocuments()
    ]);

    setTimeout(function() {
        res.json({
            ok: true,
            medicos,
            total
        });
    }, 1000);
}

const crearMedico = async(req, res = response) => {
    const { email, password } = req.body;
    try {
        const existeEmail = await Medico.findOne({ email });
        if ( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const medico = new Medico( req.body );
    
        const salt = bcrypt.genSaltSync();
        medico.password = bcrypt.hashSync( password, salt );
    
        await medico.save();

        const token = await generarJWT( medico.id );

        setTimeout(function() {
            res.json({
                ok: true,
                medico,
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

const actualizarMedico = async (req, res = response) => {
    const uid = req.params.id;
    const { email, ...campos } = req.body;

    try {
        const medicoDB = await Medico.findById( uid );

        if ( !medicoDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontró un médico con ese ID'
            });
        }

        if ( medicoDB.email !== email ) {
            const existeEmail = await Medico.findOne({ email });
            if ( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un médico con ese email'
                });
            }
        }
        campos.email = email;
        const medicoActualizado = await Medico.findByIdAndUpdate( uid, campos, { new: true } );

        setTimeout(function() {
            res.json({
                ok: true,
                medico: medicoActualizado
            });
        }, 1000);
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const borrarMedico = async(req, res = response ) => {
    const uid = req.params.id;
    try {
        const medicoDB = await Medico.findById( uid );
        if ( !medicoDB ) {
            return res.status(400).json({
                ok: false,
                msg: 'No se encontró un paciente con ese ID'
            });
        }

        await Medico.findByIdAndDelete( uid );
        setTimeout(function() {
            res.json({
                ok: true,
                msg: 'Médico eliminado'
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
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}