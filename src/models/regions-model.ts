import { DataTypes, Model } from 'sequelize';
import db from '../config/database';

interface Region extends Model {
    id: number;
    name: string;
}

const Region = db.define<Region>('Region',{
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

export default Region;