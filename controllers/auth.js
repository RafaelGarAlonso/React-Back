const { response } = require('express');
const bcrypt = require('bcryptjs');
const Medico = require('../models/medico');
const Paciente = require('../models/paciente');
const { generarJWT } = require('../helpers/jwt');

const medicoLogin = async( req, res = response ) => {
    const { email, password } = req.body;
    try {

        const medicoDB = await Medico.findOne({ email });
        if ( !medicoDB ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrecta'
            });
        }

        const validPassword = bcrypt.compareSync( password, medicoDB.password );
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrecta'
            });
        }

        const token = await generarJWT( medicoDB.id );

        setTimeout(function() {
            res.json({
                ok: true,
                id: medicoDB.id,
                token,
                role: medicoDB.role,
                name: medicoDB.name,
                menu: buildMenu(medicoDB.role),
            });
        }, 1000);
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error en el servicio'
        });
    }
}

const pacienteLogin = async( req, res = response ) => {
    const { email, password } = req.body;
    try {

        const pacienteDB = await Paciente.findOne({ email });
        if ( !pacienteDB ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrecta'
            });
        }

        const validPassword = bcrypt.compareSync( password, pacienteDB.password );
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrecta'
            });
        }

        const token = await generarJWT( pacienteDB.id );

        setTimeout(function() {
            res.json({
                ok: true,
                id: pacienteDB.id,
                token,
                role: pacienteDB.role,
                name: pacienteDB.name,
                menu: buildMenu(pacienteDB.role),
            });
        }, 1000);
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error en el servicio'
        });
    }
}

const renewToken = async(req, res = response) => {
    const uid = req.uid;
    const token = await generarJWT( uid );
    setTimeout(function() {
        res.json({
            ok: true,
            token
        });
    }, 1000);
}

function buildMenu(ROLE) {
    const ADMIN_MENU = [
        { title: 'Dashboard', url:'/dashboard' },
        { title: 'Perfil', url:'/perfil' },
        { title: 'Pacientes', url:'/pacientes' },
        { title: 'Citas', url:'/citas' }
    ]

    const USER_MENU = [
        { title: 'Dashboard', url:'/dashboard' },
        { title: 'Perfil', url:'/perfil' },
        { title: 'Asignar médico', url:'/medico' },
        { title: 'Citas', url:'/citas' }
    ]
    return ROLE === 'ADMIN' ? ADMIN_MENU : USER_MENU;
}

module.exports = {
    medicoLogin,
    pacienteLogin,
    renewToken
}