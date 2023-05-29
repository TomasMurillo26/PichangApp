import { DataTypes, Model } from 'sequelize';
import db from '../config/database';

interface Sport extends Model {
    id: number,
    name: string,
    max_players: number,
    min_players: number,
    icon_path: string,
    activated: boolean
}

const Sport = db.define<Sport>('Sport',{
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
    max_players: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    min_players: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    icon_path: {
        type: DataTypes.STRING(2048),
        allowNull: true,
    },
    activated: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
});

export default Sport;