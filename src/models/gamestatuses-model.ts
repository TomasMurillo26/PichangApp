import { DataTypes, Model } from 'sequelize';
import db from '../config/database';

interface GameStatus extends Model {
    id: number;
    name: string;
}

const GameStatus = db.define<GameStatus>('GameStatus',{
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

export default GameStatus;