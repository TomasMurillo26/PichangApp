import { DataTypes, Model, Association } from 'sequelize';
import db from '../config/database';
import Region from './regions-model';

interface Commune extends Model {
    id: number,
    name: string,
    region_id: number,
    associations: {
        regions: Association<Region, Commune>;
    }
}

const Commune = db.define<Commune>('Commune',{
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

Commune.belongsTo(Region, {
    foreignKey: {
        name: 'region_id',
        allowNull: false,
    }
})

Region.hasMany(Commune, {
    foreignKey: {
        name: 'region_id',
        allowNull: false,
    },
    onDelete: 'cascade'
})

export default Commune;