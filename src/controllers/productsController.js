const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

const {Product, Category } = require('../data/models')

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: async (req, res) => {

		try {
			
			const products = await Product.findAll({
				include: [{association:'category'}]
			})
			//return res.send(products)

			return res.render('products',{ products,toThousand })
		} catch (error) {
			return res.send(error)
			
		}

		// Product.findAll() 
		// 	.then(products => {
		// 		return res.render('products',{ products })
		// 	})
		// 	.catch(error => {
		// 		return res.send(error)
		// 	})


	},
	
	// Detail - Detail from one product
	detail: async(req, res) => {

		try {
			
			const {id} = req.params;
			const product = await Product.findByPk(id)
			res.render('detail', {product,toThousand})

		} catch (error) {
			return res.send(error)
			
		}

		// let id = req.params.id
		// let product = products.find(product => product.id == id)
		// res.render('detail', {
		// 	product,
		// 	toThousand
		// })
	},
	
	// Create - Form to create
	create: async (req, res) => {

		try {
			const categories = await Category.findAll()
			
	
			return res.render('product-create-form',{categories})
		} catch (error) {
			return res.send(error)
			
		}

	},
	
	// Create -  Method to store
	store: async (req, res) => {

			const errors = validationResult(req);		
			 if (!errors.isEmpty()) {
				 return res.render('product-create-form', { errors: errors.mapped(), old: req.body })
				
			 }else{
	
				 let image
				 if(req.file != undefined){
					 image = req.file.filename
				 } else {
					 image = 'default-image.png'
				 }
				
				 let product = {
					 ...req.body,
					 category_id : req.body.category,
					 image
					 
					};
					delete product.category
				//console.log(product);

				//return res.send(product)
				 await Product.create(product)
				 return res.redirect('/products')
			}
			
	

	},

	// Update - Form to edit
	edit:async (req, res) => {

		try {
			const {id} = req.params;
			// const categories = await Category.findAll()
			// const productToEdit = await Product.findByPk(id,{include: [{association:'category'}]})

			const [ categories, productToEdit] = await Promise.all([
				Category.findAll(),
				Product.findByPk(id,{include: [{association:'category'}]})
			])

			//return res.send({productToEdit,categories})
			return res.render('product-edit-form', {productToEdit,categories})

		} catch (error) {
			return res.send(error)
			
		}

		// let id = req.params.id
		// let productToEdit = products.find(product => product.id == id)
		// res.render('product-edit-form', {productToEdit})
	},
	// Update - Method to update
	update: async(req, res) => {
		try {
			
			const {id} = req.params
	
			let image
			if(req.file != undefined){
				image = req.file.filename
			} else {
				image = 'default-image.png'
			}
	
			productToEdit = {
	
				...req.body,
				category_id : req.body.category,
				image
			};
			await Product.update(productToEdit, {
				where: { id }
			})
	
			res.redirect('/products');
		} catch (error) {
			return res.send(error)
			
		}
	},

	// Delete - Delete one product from DB
	destroy : async(req, res) => {

		try {
			const {id} = req.params
			
			await Product.destroy({
				where: { id }
			})
			return res.redirect('/products')

		} catch (error) {
			return res.send(error)
			
		}

		// let id = req.params.id;
		// let finalProducts = products.filter(product => product.id != id);
		// fs.writeFileSync(productsFilePath, JSON.stringify(finalProducts, null, ' '));
		// res.redirect('/');
	}
};

module.exports = controller;