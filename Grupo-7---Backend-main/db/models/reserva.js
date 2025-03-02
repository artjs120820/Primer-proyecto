'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reserva extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.libro, {as:'reservalibro', foreignKey:'id_libro'}),
      this.belongsTo(models.usuario, {as:'usuariolibro', foreignKey:'id_usuario'})
    }
  }
  reserva.init({
    fecha: DataTypes.STRING,
    fechaentrega: DataTypes.STRING,
    disponibilidad: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'reserva',
  });
  return reserva;
};