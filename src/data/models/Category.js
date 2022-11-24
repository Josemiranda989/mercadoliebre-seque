module.exports = (sequelize, dataTypes) => {
    const alias = 'Category';

    const cols = {
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
    }

    const config = {
        tableName: 'categories',
        underscored: true,
        timestamps: false,
        paranoid: false
    }

    const Category = sequelize.define(alias, cols, config);

    Category.associate = models => {
        Category.hasMany(models.Product, {as: 'products', foreignKey: 'category_id'});
    }

    return Category;
}