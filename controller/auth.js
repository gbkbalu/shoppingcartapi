const User = require('../model/user');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

function makeSalt() {
	return crypto.randomBytes(16).toString('base64'); 
}
function  encryptPassword(password, preSalt) {
	if (!password || !preSalt) return '';
	var baseSalt = new Buffer.from(preSalt, 'base64');
	return crypto.pbkdf2Sync(password, baseSalt,100000, 64, 'sha512').toString('base64');
}
function authenticate(plainText, preSalt, hashedPassword) {
	return encryptPassword(plainText, preSalt) === hashedPassword;
}
module.exports.login = (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	if (email && password && email != null && email != undefined && password != null && password != undefined ) {
		User.findOne({
			email: email
		}).then((user) => {
				if (user != null && user != undefined) {
					if(user.status == false){
						res.status(401).send('User is inactive! Please contact admin!');
						res.end();
					}
					let authenticated = authenticate(password, user.salt, user.hashedPassword);
					if(!authenticated){
						authenticated = password == user.password ? true: false;
					}

					if(!authenticated){
						authenticated = password == user.password ? true: false;
						res.status(401);
						res.send('password is incorrect');
						res.end();
					}

					let mins = req.body.expiresin || 5;
					res.json({
						token: jwt.sign({ user: email, custom:{data:'userdata'}, userId:user.id, email:user.emial }, process.env.SECRET_KEY, { expiresIn: mins+'m' }, { algorithm: 'RS256' }),
					});
				} else {
					res.status(401);
					res.send('email or password is incorrect');
				}
			})
			.catch((err) => {
				console.error(err);
			});
	}else{
		res.status(401);
		res.send('please provide email and password');
	}
};
