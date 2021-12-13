const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { getPacientes, crearPaciente, actualizarPaciente, borrarPaciente } = require('../controllers/pacientes');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();

router.get( '/', validarJWT , getPacientes );

router.post( '/',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ], 
    crearPaciente 
);

router.put( '/:id',
    [
        validarJWT,
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('role', 'El role es obligatorio').not().isEmpty(),
        validarCampos,
    ],
    actualizarPaciente
);

router.delete( '/:id',
    validarJWT,
    borrarPaciente
);

module.exports = router;