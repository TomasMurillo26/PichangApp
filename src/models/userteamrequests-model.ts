import { DataTypes, Model } from 'sequelize';
import db from '../config/database';

interface UserteamRequest extends Model {
    id: number,
    name: string,
}

const UserteamRequest = db.define<UserteamRequest>('UserteamRequest',{
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(150),
        allowNull: false,
    }
});

export default UserteamRequest;