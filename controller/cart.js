const Cart = require('../model/cart');

module.exports.getAllCarts = (req, res) => {
	const limit = Number(req.query.limit) || 0;
	const sort = req.query.sort == 'desc' ? -1 : 1;
	const startDate = req.query.startdate || new Date('1970-1-1');
	const endDate = req.query.enddate || new Date();

	Cart.find({
		date: { $gte: new Date(startDate), $lt: new Date(endDate) },
	})
		.select('-_id -products._id')
		.limit(limit)
		.sort({ id: sort })
		.then((carts) => {
			res.json(carts);
		})
		.catch((err) => console.log(err));
};

module.exports.getCartsByPagination = (req, res) => {
	let limit = Number(req.query.limit) || 0;
	let page = Number(req.query.page) || 0;
	const sort = req.query.sort == 'desc' ? -1 : 1;
	const startDate = req.query.startdate || new Date('1970-1-1');
	const endDate = req.query.enddate || new Date();

	limit = limit <=0 ? 0 : limit;
	page = page <1 ? 0 : page;
	
	let skip = (page-1) * limit;

	Cart.find({
		date: { $gte: new Date(startDate), $lt: new Date(endDate) },
	})
		.select('-_id -products._id')
		.skipt(skip)
		.limit(limit)
		.sort({ id: sort })
		.then((carts) => {
			console.log(carts)
			res.json(carts);
		})
		.catch((err) => console.log(err));
};


module.exports.getCartsbyUserid = (req, res) => {
	const userId = req.params.userid;
	const startDate = req.query.startdate || new Date('1970-1-1');
	const endDate = req.query.enddate || new Date();

	console.log(startDate, endDate);
	Cart.find({
		userId,
		date: { $gte: new Date(startDate), $lt: new Date(endDate) },
	})
		.select('-_id -products._id')
		.then((carts) => {
			res.json(carts);
		})
		.catch((err) => console.log(err));
};

module.exports.getSingleCart = (req, res) => {
	const id = req.params.id;
	Cart.findOne({
		id,
	})
		.select('-_id -products._id')
		.then((cart) => res.json(cart))
		.catch((err) => console.log(err));
};

module.exports.addCart = (req, res) => {
	if (typeof req.body == undefined) {
		res.json({
			status: 'error',
			message: 'data is undefined',
		});
	} else {
		 let cartCount = 0;
		 Cart.findOne({userId:req.body.userId})
		 	.then((cart) => {
				if(cart == null || cart == undefined){
					Cart.find().countDocuments(function (err, count) {
						cartCount = count
						}).then(() => {
						cartCount++;
						 const cartobj = new Cart({
							 id: cartCount+1,
							 userId: req.body.userId,
							 date: req.body.date,
							 products: req.body.products,
							 createdAt: new Date()
						 });
						 cartobj.save()
						 .then(cartsave => res.json(cartsave))
						 .catch(err => console.log(err))
					 })
				}else{
					cart.date = req.body.date;
					cart.products = req.body.products;
					cart.updatedAt = new Date();
					cart.save()
						 .then(cartsave => res.json(cartsave))
						 .catch(err => console.log(err))
				}
			})
	}
};

module.exports.editCart = (req, res) => {
	if (typeof req.body == undefined || req.params.id == null) {
		res.json({
			status: 'error',
			message: 'something went wrong! check your sent data',
		});
	} else {
		res.json({
			id: parseInt(req.params.id),
			userId: req.body.userId,
			date: req.body.date,
			products: req.body.products,
		});
	}
};

module.exports.deleteCart = (req, res) => {
	if (req.params.id == null) {
		res.json({
			status: 'error',
			message: 'cart id should be provided',
		});
	} else {
		Cart.findOne({ id: req.params.id })
			.select('-_id -products._id')
			.then((cart) => {
				res.json(cart);
			})
			.catch((err) => console.log(err));
	}
};
