module.exports = (sequelize, dataTypes) => {

    const alias = 'Product';//con este nombre es como llameremos desde el controller

    const cols = {
        // aca en cols van todos los campos de nuestra tabla products
        //id no hace falta ponerlo es opcional
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: dataTypes.STRING(45),
            notNull: false,
        },
        price: {
            type: dataTypes.FLOAT,
            notNull: false,
        },
        discount: {
            type: dataTypes.INTEGER,
            notNull: false,
        },
        description: {
            type: dataTypes.TEXT,
            notNull: false,
        },
        image: {
            type: dataTypes.STRING(45),
            notNull: false,
        }
    }

    const config = {
        tableName: 'products',
        underscored: true,
        timestamps: true,
        paranoid: true
    }

    const Product = sequelize.define(alias, cols, config);

    Product.associate = models => {
        Product.belongsTo(models.Category, {as: 'category', foreignKey: 'category_id'});
    }

    return Product;
}