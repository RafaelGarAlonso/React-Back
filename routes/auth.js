const { Router } = require('express');
const { medicLogin, patientLogin } = require('../controllers/auth');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const router = Router();

router.post( '/medic',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validateFields
    ],
    medicLogin
);

router.post( '/patient',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validateFields
    ],
    patientLogin
);

module.exports = router;
