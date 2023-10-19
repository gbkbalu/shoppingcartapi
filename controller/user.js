const User = require('../model/user');
const respHandler = require('../handler/response.handler')
const PWD_REGX = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,20})");
const EMAIL_REGEX = new RegExp('[a-zA-Z0-9]+@[a-zA-Z]+.[a-zA-Z]{2,3}');
const Joi = require('joi');
const crypto = require('crypto');

module.exports.getAllUser = (req, res) => {
	const limit = Number(req.query.limit) || 0;
	const sort = req.query.sort == 'desc' ? -1 : 1;

	User.find()
		.select(['-_id'])
		.limit(limit)
		.sort({
			id: sort,
		})
		.then((users) => {
			res.json(users);
		})
		.catch((err) => console.log(err));
};

module.exports.getUsersByPagination = (req, res) => {
	let limit = Number(req.query.limit) || 0;
	let page = Number(req.query.page) || 0;
	const sort = req.query.sort == 'desc' ? -1 : 1;

	limit = limit <=0 ? 0 : limit;
	page = page <1 ? 0 : page;
	
	let skip = (page-1) * limit;

	console.log("pagination limit:"+limit);
	console.log("pagination page:"+page);
	console.log("pagination skip val:"+skip);
	User.find()
		.select(['-_id'])
		.skip(skip)
		.limit(limit)
		.sort({ id: sort })
		.then((users) => {
			res.json(users);
		})
		.catch((err) => console.log(err));
};

module.exports.getUser = (req, res) => {
	const id = req.params.id;

	User.findOne({
		id,
	})
		.select(['-_id'])
		.then((user) => {
			res.json(user);
		})
		.catch((err) => console.log(err));
};

module.exports.validateObject= (inputObject) => {
    const schema = Joi.object().keys({
      email: Joi.string().trim().min(5).max(100).required().email(),
      password: Joi.string().trim().min(6).max(15).required(),
  
      name:{
		firstname: Joi.string().trim().min(1).max(50).required(),
      	lastname: Joi.string().trim().min(1).max(50).required()
	  }
    }).unknown(true);
  
    return schema.validate(inputObject);
}

function makeSalt() {
	return crypto.randomBytes(16).toString('base64'); 
}
function  encryptPassword(password, preSalt) {
	if (!password || !preSalt) return '';
	var baseSalt = new Buffer.from(preSalt, 'base64');
	return crypto.pbkdf2Sync(password, baseSalt,100000, 64, 'sha512').toString('base64');
}

module.exports.addUser = async (req, res) => {
	if (typeof req.body == undefined) {
		res.json({
			status: 'error',
			message: 'data is undefined',
		});
	} else {
		try {
			const { error } = this.validateObject(req.body);
			if (error) return respHandler.validationHandler(res, error);
			var email = req.body.email;
			if (email === null || email === undefined || email === "" || !EMAIL_REGEX.test(email)) {
				return respHandler.errorHandler(res, {}, "Not a valid email.", "INVALID_EMAIL");
			}

			if (req.body.password === null || req.body.password === undefined || req.body.password === "" || !PWD_REGX.test(req.body.password)) {
				return respHandler.errorHandler(res, {}, "Not a valid password. Password need atleast 8-20 chars and containing a small and upper letter , special char and digit", "INVALID_PASSWORD");
			}

			email = email.toLowerCase();
			let userCnt = await User.find({email:email}).countDocuments();
			if(userCnt>0){
				res.status(409);
				return res.json({success:false, message:"User already exists with the provided email:"+req.body.email})
			}

			let salt = makeSalt();
			let hashedpassword = encryptPassword(req.body.password,salt);
			let userCount = 0;
			User.find()
				.countDocuments(function (err, count) {
					userCount = count;
				})
				.then(() => {
					const user = new User({
						id: userCount + 1,
						email: req.body.email,
						password: req.body.password,
						hashedpassword: hashedpassword,
						salt: salt,
						name: {
							firstname: req.body.name.firstname,
							lastname: req.body.name.lastname,
						},
						address: {
							city: req.body.address.city,
							street: req.body.address.street,
							number: req.body.address.number,
							zipcode: req.body.address.zipcode,
							geolocation: {
								lat: req.body.address.geolocation.lat,
								long: req.body.address.geolocation.long,
							},
						},
						phone: req.body.phone,
						createdAt: new Date()
					});
					user.save()
					.then(user =>
						res.status(201).json({ success: true, details: "User registered successfully", message: "Email verification link has been sent to the provided mail for verification. Please check your inbox to verify the mail:" + user.email })
					)
					.catch(err => {
						res.status(400);
						res.json({success:false, message:"Invalid request.", error: err.message})
					})
					
				});
			}catch (e) {
			console.log(e)
			}
	}
};

module.exports.editUser = (req, res) => {
	if (typeof req.body == undefined || req.params.id == null) {
		res.json({
			status: 'error',
			message: 'something went wrong! check your sent data',
		});
	} else {
		User.findOne({ id: req.params.id })
			.then((user) => {
				if(user == null){
					res.status(400).json({status: 'error',message:"User Not Found!, Provided UserId is invalid!"})
					res.end();
				}
				user.name = {
					firstname: req.body.name.firstname,
					lastname: req.body.name.lastname,
				};
				user.address = {
					city: req.body.address.city,
					street: req.body.address.street,
					number: req.body.address.number,
					zipcode: req.body.address.zipcode,
					geolocation: {
						lat: req.body.address.geolocation.lat,
						long: req.body.address.geolocation.long,
					}
				};
				user.phone = req.body.phone,
				user.updatedAt = new Date()
				user.save()
					.then(user =>
						res.status(201).json({ success: true, details: "User details updated successfully!", message:"FYI! You can't update your email id."})
					)
					.catch(err => {
						res.status(400);
						res.json({success:false, message:"Invalid request.", error: err.message})
					})
			})
			.catch((err) => console.log(err));
	}
};

module.exports.deleteUser = (req, res) => {
	if (req.params.id == null) {
		res.json({
			status: 'error',
			message: 'cart id should be provided',
		});
	} else {
		User.findOne({ id: req.params.id })
			.then((user) => {
				if(user == null || user == undefined){
					res.status(400).json({message:"Invalid userid! User was not found with the provided id!"});
					res.end();
				}

				User.updateOne({id:req.params.id},{$set:{status:false}}).then((user) => {
					res.status(200).json({message:"User inactivated successfully!"});
				})
				.catch((err) => console.log(err));
			})
			.catch((err) => console.log(err));
	}
};
