module.exports = {
  /** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
  Model: {},

  Relationship: {
    /** @type {typeof import('@adonisjs/lucid/src/Lucid/Relations/HasOne')} */
    HasOne: {},

    /** @type {typeof import('@adonisjs/lucid/src/Lucid/Relations/HasMany')} */
    HasMany: {},

    /** @type {typeof import('@adonisjs/lucid/src/Lucid/Relations/BelongsTo')} */
    BelongsTo: {},

    /** @type {typeof import('@adonisjs/lucid/src/Lucid/Relations/BelongsToMany')} */
    BelongsToMany: {},

    /** @type {typeof import('@adonisjs/lucid/src/Lucid/Relations/HasManyThrough')} */
    ManyThrough: {},
  },

  /** @type {typeof import('@adonisjs/framework/src/Hash')} */
  Hash: {},

  Http: {
    /** @type {import('@adonisjs/framework/src/Request')} */
    Request: {},

    /** @type {typeof import('node-res/methods') | import('@adonisjs/framework/src/Response')} */
    Response: {},

    /** @type {typeof import('@adonisjs/framework/src/Context')} */
    Context: {},
  },

  /** @type {typeof import('@adonisjs/lucid/src/Factory/DatabaseFactory')} */
  Factory: {},

  Migration: {
    /** @type {import('knex/types').TableBuilder |
     *         import('knex/types').AlterTableBuilder}
     */
    Table: {},
  },

  /** @type {import('knex/types').QueryInterface} */
  Database: {},

  Test: {
    /** @type {typeof import('@types/chai')} */
    Assert: {},
  },

  /** @type {import('@adonisjs/validator/src/Validator/index').validate} */
  Validate: {},
}
