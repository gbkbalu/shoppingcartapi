const Product = require('../model/product');

module.exports.getAllProducts = async(req, res) => {
	let limit = Number(req.query.limit) || 0;
	let page = Number(req.query.page) || 0;
	const sort = req.query.sort == 'desc' ? -1 : 1;
	limit = limit <=0 ? 0 : limit;
	page = page <1 ? 0 : page;
	let skip = (page-1) * limit;

	let productCnt = await Product.countDocuments({});
	console.log("Total product count:"+productCnt)
	console.log("Product.... limit..:"+limit)
	Product.find()
		.select(['-_id'])
		.skip(skip)
		.limit(limit)
		.sort({ id: sort })
		.then((products) => {
			res.json({count:productCnt, products:products});
		})
		.catch((err) => console.log(err));
};

module.exports.getProductsByPagination = async(req, res) => {
	let limit = Number(req.query.limit) || 0;
	let page = Number(req.query.page) || 0;
	const sort = req.query.sort == 'desc' ? -1 : 1;
	limit = limit <=0 ? 0 : limit;
	page = page <1 ? 0 : page;
	let skip = (page-1) * limit;

	console.log("pagination limit:"+limit);
	console.log("pagination page:"+page);
	console.log("pagination skip val:"+skip);
	let productCnt = await Product.countDocuments({});
	Product.find()
		.select(['-_id'])
		.skip(skip)
		.limit(limit)
		.sort({ id: sort })
		.then((products) => {
			res.json({count:productCnt, products: products});
		})
		.catch((err) => console.log(err));
};

module.exports.getProduct = (req, res) => {
	const id = req.params.id;

	Product.findOne({
		id,
	})
		.select(['-_id'])
		.then((product) => {
			res.json(product);
		})
		.catch((err) => console.log(err));
};

module.exports.getProductCategories = (req, res) => {
	Product.distinct('category')
		.then((categories) => {
			res.json(categories);
		})
		.catch((err) => console.log(err));
};

module.exports.getproductsbyname = (req, res) => {
	const name = req.params.name;
	const limit = Number(req.query.limit) || 0;
	const sort = req.query.sort == 'desc' ? -1 : 1;

	Product.find({title:name})
		.select(['-_id'])
		.limit(limit)
		.sort({ id: sort })
		.then((products) => {
			res.json(products);
		})
		.catch((err) => console.log(err));
};

module.exports.getProductsInCategory = (req, res) => {
	const category = req.params.category;
	const limit = Number(req.query.limit) || 0;
	const sort = req.query.sort == 'desc' ? -1 : 1;

	Product.find({
		category,
	})
		.select(['-_id'])
		.limit(limit)
		.sort({ id: sort })
		.then((products) => {
			res.json(products);
		})
		.catch((err) => console.log(err));
};

module.exports.addProduct = (req, res) => {
	if (typeof req.body == undefined) {
		res.json({
			status: 'error',
			message: 'data is undefined',
		});
	} else {
		let productCount = 0;
		Product.find()
		  .countDocuments(function (err, count) {
		    productCount = count + 1;
		  })
		  .then(() => {
			const product = new Product({
				id: productCount,
				title: req.body.title,
				price: req.body.price,
				description: req.body.description,
				image: req.body.image,
				category: req.body.category,
			});
			product.save()
			  .then(product => res.json(product))
			  .catch(err => console.log(err))
		});
	}
};

module.exports.editProduct = (req, res) => {
	if (typeof req.body == undefined || req.params.id == null) {
		res.json({
			status: 'error',
			message: 'something went wrong! check your sent data',
		});
	} else {
		Product.findOne({
			id: req.params.id,
		}).then((product) => {
			console.log("Product..."+product)
			if(product == null || product == undefined){
				res.status(400).json({message:"Invalid porduct, product not found with the provided details!"})
				return res.end();
			}
			product.title = req.body.title;
			product.price= req.body.price;
			product.description= req.body.description;
			product.image= req.body.image;
			product.category= req.body.category;
			product.save()
			  .then(product => res.json(product))
			  .catch(err => {
				console.log(err);
				res.json({error:err.toString()});
			  })
		})
		.catch((err) => {
			console.log(err)
			res.json({error:err.toString()});
		});
		// res.json({
		// 	id: parseInt(req.params.id),
		// 	title: req.body.title,
		// 	price: req.body.price,
		// 	description: req.body.description,
		// 	image: req.body.image,
		// 	category: req.body.category,
		// });
	}
};

module.exports.deleteProduct = (req, res) => {
	if (req.params.id == null) {
		res.json({
			status: 'error',
			message: 'cart id should be provided',
		});
	} else {
		Product.findOne({
			id: req.params.id,
		}).select(['-_id'])
		.then((product) => {
			res.json(product);
		}).catch((err) => console.log(err));
	}
};
