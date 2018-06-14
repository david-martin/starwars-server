module.exports = (sequelize, DataTypes) => {
  const Note = sequelize.define('Note', {
    id: {
      primaryKey: true,
      type: DataTypes.STRING
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  });

  return Note;
};
