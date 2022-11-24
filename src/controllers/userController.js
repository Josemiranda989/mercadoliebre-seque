const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs')

const userFilePath = path.join(__dirname, '../data/user.json');
const users = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));

const userLoginInfoFilePath = path.join(__dirname, '../data/userLoginInfo.json');
const usersLoginInfo = JSON.parse(fs.readFileSync(userLoginInfoFilePath, 'utf-8'));

const controller = {

	register: (req,res)=> {
		res.render('user-register')
	},
	
	store: (req, res) => {


			// Creamos un nuevo usuario tomando los datos del formulario
			let newUser = {
				id: users[users.length - 1].id + 1,
				...req.body,
				image:req.file ? req.file.filename : 'default-image.png',
				category : 'user'

			};

			//encriptamos la contrasenia y borramos el password para q noo se guarde en nuestro json
			newUser.password = bcrypt.hashSync(req.body.password, 10);
			delete newUser.repassword


			//escribimos en nuestro archivo json
			let usersNews = [...users, newUser]
			fs.writeFileSync(userFilePath, JSON.stringify(usersNews, null, ' '));

			res.redirect('/');
		},

	login:(req,res)=>{
		res.render('login')
	},

	authenticate:(req, res)=>{

		//PRIMERO Q TODO HACEMOS LOGICA PARA GUARDAR LOS DATOS DEL LOGIN EN UN JSON
		const { email,password } = req.body;

		
		//verifico si el mail q puso en el formulario esta en nuestra db
		let user = users.find(user => user.email ==email)

		if (user) {
			// y la contraseña es correcta...
			if (bcrypt.compareSync(password,user.password)) {
				// Eliminamos los datos sensibles y guardamos el usuario en sesión
				delete user.password;

				req.session.user = user;

				
				// Si pidió que lo recordemos
				if (req.body.remember) {
					// Generamos un token seguro, eso para que no pueda entrar cualquiera
					// https://stackoverflow.com/questions/8855687/secure-random-token-in-node-js
					const token = crypto.randomBytes(64).toString('base64');
					user.token=token
					// Lo guardamos en base, para poder chequearlo luego
		
					
					let userLoginInfo = [...usersLoginInfo, user]
					fs.writeFileSync(userLoginInfoFilePath, JSON.stringify(userLoginInfo, null, ' '));
					
					// Recordamos al usuario por 3 meses         msegs  segs  mins  hs   días
					res.cookie('rememberToken', token, { maxAge: 1000 * 60  * 60 *  24 * 90 });                
				}

				// Finalmente lo mandamos a la home
				return res.redirect('/');
			} else {
				// Si la contraseña esta mal
				return res.render('login', { 
					old: req.body,
					errors: { 
						email: 'la contraseña son inválidos'
					}
				});
			}
		} else {
			// Si el email no existe
			return res.render('login', { 
				old: req.body,
				errors: { 
					email: 'El email o la contraseña son inválidos'
				}
			});        
		}

	},
	profile: (req, res) => {
		res.render('profile');
	},
	logout: (req, res) => {
		// Borramos el registro de la base de datos si existe
		const token = usersLoginInfo.find(user => user.token = req.cookies.rememberToken);
		if (token) {
			let logerDeleter = usersLoginInfo.filter(user => user.token != req.cookies.rememberToken);
			fs.writeFileSync(userLoginInfoFilePath, JSON.stringify(logerDeleter, null, ' '));
		}
		// Destruimos la sesión
		req.session.destroy();
		
		// Destruimos la cookie de recordar
		res.clearCookie('rememberToken');

		// Redirigimos a la home
		res.redirect('/');
	}
	
};

module.exports = controller;
