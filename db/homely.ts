import { sequelize } from './connection';
import {
  Association,
  CreationOptional,
  DataTypes,
  ForeignKey,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize';

export class HomelyDevice extends Model<
  InferAttributes<HomelyDevice, { omit: 'features' }>,
  InferCreationAttributes<HomelyDevice, { omit: 'features' }>
> {
  declare id: string;
  declare homeId: string;
  declare location: string;
  declare modelId: string;
  declare modelName: string;
  declare name: string;
  declare serialNumber: string;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;

  declare getFeatures: HasManyGetAssociationsMixin<HomelyFeature>; // Note the null assertions!
  declare addFeature: HasManyAddAssociationMixin<HomelyFeature, number>;
  declare addFeatures: HasManyAddAssociationsMixin<HomelyFeature, number>;
  declare setFeatures: HasManySetAssociationsMixin<HomelyFeature, number>;
  declare removeFeature: HasManyRemoveAssociationMixin<HomelyFeature, number>;
  declare removeFeatures: HasManyRemoveAssociationsMixin<HomelyFeature, number>;
  declare hasFeature: HasManyHasAssociationMixin<HomelyFeature, number>;
  declare hasFeatures: HasManyHasAssociationsMixin<HomelyFeature, number>;
  declare countFeatures: HasManyCountAssociationsMixin;
  declare createFeature: HasManyCreateAssociationMixin<
    HomelyFeature,
    'device_id'
  >;

  declare features?: NonAttribute<Array<HomelyFeature>>;

  declare static associations: {
    features: Association<HomelyDevice, HomelyFeature>;
  };
}

export class HomelyFeature extends Model<
  InferAttributes<HomelyFeature>,
  InferCreationAttributes<HomelyFeature>
> {
  declare id: string;
  declare unique_id?: string;
  declare device_id: ForeignKey<HomelyDevice['id']>;
  declare path: string;
  declare format: string;
  declare type: string;
  declare published: CreationOptional<boolean>;
  declare name: string;
  declare device_class?: string;
  declare entity_category?: string;
  declare config_topic: string;
  declare availability_topic: string;
  declare state_topic: string;
  declare icon?: string;
  declare unit?: string;
  declare unit_of_measurement?: string;
  declare state_class?: string;
  declare device_id_suffix: string;
  declare command_topic?: string;

  declare device?: NonAttribute<HomelyDevice>;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
}

HomelyFeature.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    device_id_suffix: {
      type: DataTypes.STRING,
    },
    device_id: DataTypes.STRING,
    state_class: DataTypes.STRING,
    command_topic: DataTypes.STRING,
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    unique_id: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.id;
      },
      set(v) {
        throw new Error(`unique_id is readonly`);
      },
    },
    unit_of_measurement: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.unit;
      },
      set(v) {
        throw new Error(`unique_id is readonly`);
      },
    },
    icon: DataTypes.STRING,
    path: DataTypes.STRING,
    unit: DataTypes.STRING,
    format: DataTypes.STRING,
    type: DataTypes.STRING,
    name: DataTypes.STRING,
    device_class: DataTypes.STRING,
    entity_category: {
      type: DataTypes.STRING,
      get() {
        const value = this.getDataValue('entity_category');
        return value ?? undefined;
      },
    },
    config_topic: {
      type: DataTypes.STRING,
      unique: true,
    },
    availability_topic: DataTypes.STRING,
    state_topic: {
      type: DataTypes.STRING,
      unique: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'features',
    underscored: true,
  }
);

HomelyDevice.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    homeId: DataTypes.STRING,
    location: DataTypes.STRING,
    modelId: DataTypes.STRING,
    modelName: DataTypes.STRING,
    name: DataTypes.STRING,
    serialNumber: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'devices',
    underscored: true,
  }
);

HomelyDevice.hasMany(HomelyFeature, {
  sourceKey: 'id',
  foreignKey: 'device_id',
  as: 'features',
});
HomelyFeature.belongsTo(HomelyDevice, {
  targetKey: 'id',
  foreignKey: 'device_id',
  as: 'device',
});
