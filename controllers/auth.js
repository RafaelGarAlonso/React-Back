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
        res.json({
            ok: true,
            id: medicoDB.id,
            token,
            name: medicoDB.name,
            menu: buildMenu(medicoDB.role),
        });
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
        res.json({
            ok: true,
            id: pacienteDB.id,
            token,
            name: pacienteDB.name,
            menu: buildMenu(pacienteDB.role),
        });
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
    res.json({
        ok: true,
        token
    });
}

function buildMenu(ROLE) {
    const ADMIN_MENU = {
        title: 'ADMIN',
        submenu: [
            { title: 'Dashboard', url:'/dashboard' },
            { title: 'Perfil', url:'/perfil' },
            { title: 'Pacientes', url:'/pacientes' },
            { title: 'Citas', url:'/citas' },
            { title: 'Estadísticas', url:'/estadisticas' }
        ]
    }
    const USER_MENU = {
        title: 'USER',
        submenu: [
            { title: 'Dashboard', url:'/dashboard' },
            { title: 'Perfil', url:'/perfil' },
            { title: 'Asignar médico', url:'/medico' },
            { title: 'Citas', url:'/citas' }
        ]
    }
    return ROLE === 'ADMIN' ? ADMIN_MENU : USER_MENU;
}

module.exports = {
    medicoLogin,
    pacienteLogin,
    renewToken
}