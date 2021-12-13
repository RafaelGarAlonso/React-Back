const { response } = require('express');
const bcrypt = require('bcryptjs');
const Medico = require('../models/medico');
const { generarJWT } = require('../helpers/jwt');

const getMedicos = async(req, res) => {
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limit) || 5;
    const [ medicos, total ] = await Promise.all([
        Medico
            .find({}, 'name email img role')
            .skip( desde )
            .limit( limite ),
            Medico.countDocuments()
    ]);

    res.json({
        ok: true,
        medicos,
        total
    });   
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

        res.json({
            ok: true,
            medico,
            token
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado...'
        });
    }
}


const actualizarMedico = async (req, res = response) => {
    const uid = req.params.id;
    try {
        const medicoDB = await Medico.findById( uid );

        if ( !medicoDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontró un médico con ese ID'
            });
        }

        const { password, email, ...campos } = req.body;
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

        res.json({
            ok: true,
            usuario: medicoActualizado
        });
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
        res.json({
            ok: true,
            msg: 'Médico eliminado'
        });
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