'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Attendance.init({
    employeeId: DataTypes.INTEGER,
    date: DataTypes.STRING,
    hoursWorked: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};