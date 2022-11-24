
const {check} = require('express-validator');

const validationCreate = [

    check('name').notEmpty().withMessage('No puede estar vacio').bail().isString().withMessage('Debe ser un campo alfanumerico').bail(),
    check('price').notEmpty().withMessage('No puede estar vacio').bail().isNumeric().withMessage('Debe ser un campo numerico').bail(),
    check('discount').isNumeric().withMessage('Debe ser un campo numerico').bail(),
    check('category').notEmpty().withMessage('No puede estar vacio').bail(),
    check('description').notEmpty().withMessage('No puede estar vacio').bail().isLength({ min: 0, max: 100 }).withMessage('Debe tener como maxim 100 caracteres').bail(),

]

module.exports = validationCreate