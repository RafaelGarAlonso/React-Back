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
                uid: medicoDB.id,
                token,
                role: medicoDB.role,
                email: medicoDB.email,
                name: medicoDB.name,
                surname: medicoDB.surname,
                address: medicoDB.address,
                province: medicoDB.province,
                gender: medicoDB.gender,
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
        console.log('pacienteDB', pacienteDB)

        setTimeout(function() {
            res.json({
                ok: true,
                uid: pacienteDB.id,
                token,
                email: pacienteDB.email,
                role: pacienteDB.role,
                name: pacienteDB.name,
                surname: pacienteDB.surname,
                address: pacienteDB.address,
                province: pacienteDB.province,
                gender: pacienteDB.gender,
                medicAssigned: pacienteDB.medicAssigned,
                appointment: pacienteDB.appointment,
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
        { title: 'Consultar citas', url:'/consultar-citas' }
    ]

    const USER_MENU = [
        { title: 'Dashboard', url:'/dashboard' },
        { title: 'Perfil', url:'/perfil' },
        { title: 'Asignar médico', url:'/asignar-medico' },
        { title: 'Solicitar cita', url:'/solicitar-cita' }
    ]
    return ROLE === 'ADMIN' ? ADMIN_MENU : USER_MENU;
}

module.exports = {
    medicoLogin,
    pacienteLogin,
    renewToken
}