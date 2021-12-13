const { response } = require('express');
const bcrypt = require('bcryptjs');
const Paciente = require('../models/paciente');
const { generarJWT } = require('../helpers/jwt');

const getPacientes = async(req, res) => {
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limit) || 5;
    const [ pacientes, total ] = await Promise.all([
        Paciente
            .find({}, 'name email img role')
            .skip( desde )
            .limit( limite ),
        Usuario.countDocuments()
    ]);

    res.json({
        ok: true,
        pacientes,
        total
    });   
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

        res.json({
            ok: true,
            paciente,
            token
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado...'
        });
    }
}


const actualizarPaciente = async (req, res = response) => {
    const uid = req.params.id;
    try {
        const pacienteDB = await Paciente.findById( uid );

        if ( !pacienteDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontró un paciente con ese ID'
            });
        }

        const { password, email, ...campos } = req.body;
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

        res.json({
            ok: true,
            usuario: pacienteActualizado
        });
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
        res.json({
            ok: true,
            msg: 'Paciente eliminado'
        });
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