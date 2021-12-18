const { response } = require('express');
const bcrypt = require('bcryptjs');
const Medic = require('../models/medics');
const { generateJWT } = require('../helpers/jwt');

const getMedics = async(req, res) => {
    const from = Number(req.query.from);
    const limit = Number(req.query.limit);

    const [ medics, total ] = await Promise.all([
        Medic
            .find({}, 'name email role surname gender address province')
            .skip( from )
            .limit( limit ),
            Medic.countDocuments()
    ]);

    setTimeout(function() {
        res.json({
            ok: true,
            medics,
            total
        });
    }, 1000);
}

const createMedic = async(req, res = response) => {
    const { email, password } = req.body;
    try {
        const emailExist = await Medic.findOne({ email });
        if ( emailExist ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const medic = new Medic( req.body );
    
        const salt = bcrypt.genSaltSync();
        medic.password = bcrypt.hashSync( password, salt );
    
        await medic.save();

        const token = await generateJWT( medic.id );

        setTimeout(function() {
            res.json({
                ok: true,
                medic,
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

const updateMedic = async (req, res = response) => {
    const uid = req.params.id;
    const { email, ...fields } = req.body;

    try {
        const medicDB = await Medic.findById( uid );

        if ( !medicDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontró un médico con ese ID'
            });
        }

        if ( medicDB.email !== email ) {
            const emailExist = await Medic.findOne({ email });
            if ( emailExist ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un médico con ese email'
                });
            }
        }
        fields.email = email;
        const medicUpdated = await Medic.findByIdAndUpdate( uid, fields, { new: true } );

        setTimeout(function() {
            res.json({
                ok: true,
                medic: medicUpdated
            });
        }, 1000);

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const deleteMedic = async(req, res = response ) => {
    const uid = req.params.id;
    try {
        const medicDB = await Medic.findById( uid );
        if ( !medicDB ) {
            return res.status(400).json({
                ok: false,
                msg: 'No se encontró un médico con ese ID'
            });
        }

        await Medic.findByIdAndDelete( uid );
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
    getMedics,
    createMedic,
    updateMedic,
    deleteMedic
}