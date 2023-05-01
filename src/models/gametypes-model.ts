import { DataTypes, Model } from 'sequelize';
import db from '../config/database';

interface GameType extends Model {
    id: number;
    name: string;
}

const GameType = db.define<GameType>('GameType',{
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
});

export default GameType;