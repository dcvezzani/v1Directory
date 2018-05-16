
exports.up = function(knex, Promise) {
  return knex.schema.createTable('members', function(t) {
      t.increments('id').unsigned().primary();
      t.integer('family_id').unsigned();
      t.string('type').notNull();
      t.string('name').nullable();
      t.string('address').nullable();
      t.string('phone').nullable();
      t.string('email').nullable();
      t.text('decription').nullable();
      t.timestamps;
  }).then(() =>
  knex.schema.createTable('families', function(t) {
      t.integer('id').unsigned().primary();
      t.text('decription').nullable();
      t.timestamps;
  }));
};

exports.down = function(knex, Promise) {
  
};
