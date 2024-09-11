'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Leave extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Leave.belongsTo(models.Employee, {
        foreignKey: 'employeeId',  
        as: 'Leaves'            
      });
    }
  }
  
  Leave.init({
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    reason: {
      type: DataTypes.STRING,
    },
    leaveStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Pending'  // Set default value here
    }
  }, {
    sequelize,
    modelName: 'Leave',
  });

  return Leave;
};
