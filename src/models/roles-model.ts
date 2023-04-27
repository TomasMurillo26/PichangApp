import { DataTypes, Model } from 'sequelize';
import db from '../config/database';

interface Role extends Model {
    id: number;
    name: string;
}

const Role = db.define<Role>('Role',{
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

export default Role;