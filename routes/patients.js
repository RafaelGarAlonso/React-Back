const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { getPatient, createPatient, updatePatient, deletePatient } = require('../controllers/patients');
const { validateJWT } = require('../middlewares/validate-jwt');
const router = Router();

router.get( '/', validateJWT , getPatient );

router.post( '/',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validateFields,
    ], 
    createPatient 
);

router.put( '/:id',
    [
        validateJWT,
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validateFields,
    ],
    updatePatient
);

router.delete( '/:id',
    validateJWT,
    deletePatient
);

module.exports = router;