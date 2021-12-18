const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { getMedics, createMedic, updateMedic, deleteMedic } = require('../controllers/medics');
const { validateJWT } = require('../middlewares/validate-jwt');
const router = Router();

router.get( '/', validateJWT , getMedics );

router.post( '/',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validateFields,
    ], 
    createMedic 
);

router.put( '/:id',
    [
        validateJWT,
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validateFields,
    ],
    updateMedic
);

router.delete( '/:id',
    validateJWT,
    deleteMedic
);

module.exports = router;