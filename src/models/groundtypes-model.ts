import { DataTypes, Model } from 'sequelize';
import db from '../config/database';

interface GroundType extends Model {
    id: number;
    name: string;
}

const GroundType = db.define<GroundType>('GroundType',{
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

export default GroundType;