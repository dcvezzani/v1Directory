
exports.up = function(knex, Promise) {
  return knex.schema.createTable('visits', function(t) {
      t.increments('id').unsigned().primary();
      t.integer('family_id').notNull().unsigned();
      t.string('scheduledAt').notNull();
      t.string('confirmedAt').nullable();
      t.string('visitedAt').nullable();
      t.text('decription').nullable();
      t.timestamps;
  }).then(() =>
  knex.schema.createTable('assignees', function(t) {
      t.increments('id').unsigned().primary();
      t.string('name').notNull();
      t.text('decription').nullable();
      t.timestamps;
  })).then(() =>
  knex.schema.createTable('visit_assignees', function(t) {
      t.increments('id').unsigned().primary();
      t.integer('visit_id').notNull().unsigned();
      t.integer('assignee_id').notNull().unsigned();
      t.timestamps;
  }));
};

exports.down = function(knex, Promise) {
  
};
