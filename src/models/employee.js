'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Employee.hasMany(models.Salary, {
        foreignKey: 'employeeId',  // Foreign key in Salary model
        as: 'salaries'             // Alias for the association
      });
       Employee.hasMany(models.Leave, {
        foreignKey: 'employeeId',  // Foreign key in Salary model
        as: 'Leaves'             // Alias for the association
      });
    }
  }
  Employee.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    mobile: DataTypes.STRING,
    address: DataTypes.STRING,
    baseSalary: DataTypes.STRING,
    password: DataTypes.STRING
    
  }, {
    sequelize,
    modelName: 'Employee',
  });
  return Employee;
};