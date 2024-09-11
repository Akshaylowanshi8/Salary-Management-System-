'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Salary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Salary.belongsTo(models.Employee, {
        foreignKey: 'employeeId',  
        as: 'employee'            
      });
    }
  }
  Salary.init({
    employeeId: DataTypes.INTEGER,
    totalSalaryMade: DataTypes.STRING,
    month: DataTypes.STRING,
    totalWorkingDays: DataTypes.STRING,
    attendedDays: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Salary',
  });
  return Salary;
};