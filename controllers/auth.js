const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const login = async( req, res = response ) => {
    const { email, password } = req.body;
    try {
        // Verify email
        const usuarioDB = await Usuario.findOne({ email });
        if ( !usuarioDB ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrecta'
            });
        }
        // Verify Password
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrecta'
            });
        }
        // Generate token (JWT)
        const token = await generarJWT( usuarioDB.id );
        res.json({
            ok: true,
            id: usuarioDB.id,
            token,
            name: usuarioDB.name,
            menu: buildMenu(usuarioDB.role),
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
    // Generate token (JWT)
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
    login,
    renewToken
}
