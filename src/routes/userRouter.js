// ************ Require's ************
const express = require('express');
const router = express.Router();
const multer = require('multer')
const path = require('path');

// ************ Controller Require ************

const controller = require('../controllers/userController');
const guestRoute = require('../middlewares/guestRoute');
const userRoute = require('../middlewares/userRoute');
// ************ Multer ************
let storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, 'public/images/users')
    },
    filename: function(req,file,cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
let upload = multer({storage});

//Mostrar el formulario para hacer el regsitro
router.get('/register',guestRoute,controller.register)

//hacer post del formulario de registro
router.post('/',guestRoute,upload.single('image'), controller.store)

//Mostramos el formulario de login
router.get('/login',guestRoute,controller.login)
//hacer el post de formulario de login
router.post('/login',guestRoute,controller.authenticate)

//logout
router.post('/logout',userRoute,controller.logout)

router.get('/profile', userRoute, controller.profile);





module.exports = router;
