import { DataTypes, Model, Association } from 'sequelize';
import db from '../config/database';
import Sport from './sports-model';

interface Position extends Model {
    id: number,
    name: string,
    sport_id: number,
    activated: boolean,
    associations: {
        sports: Association<Sport, Position>;
    }
}

const Position = db.define<Position>('Position',{
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    activated: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
});

Position.belongsTo(Sport, {
    foreignKey: {
        name: 'sport_id',
        allowNull: false,
    }
});

Sport.hasMany(Position, {
    foreignKey: {
        name: 'sport_id',
        allowNull: false,
    }
});


export default Position;