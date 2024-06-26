var assert = require('assert');
var Pack = require('../../../');

describe('Connectable ::', function() {
  describe('Release Connection', function() {
    var manager;
    var connection;

    // Create a manager and connection
    before(function(done) {
      // Needed to dynamically get the host using the docker container
      var host = process.env.POSTGRES_1_PORT_5432_TCP_ADDR || 'localhost';

      Pack.createManager({
        connectionString: 'postgres://mp:mp@' + host + ':5432/mppg'
      })
      .exec(function(err, report) {
        if (err) {
          return done(err);
        }

        manager = report.manager;

        Pack.getConnection({
          manager: manager
        })
        .exec(function(err, report) {
          if (err) {
            return done(err);
          }

          connection = report.connection;
          return done();
        });
      });
    });

    it('should successfully release a connection', function(done) {
      Pack.releaseConnection({
        connection: connection
      })
      .exec(function(err) {
        if (err) {
          return done(err);
        }

        // If the connection was successfully released the totalCount (total number of clients existing within the pool) and the
        // idleCount (number of clients which are not checked out but are currently idle in the pool) should be equal.
        var totalCount = manager.pool.totalCount;
        var idleCount = manager.pool.idleCount;

        assert.equal(totalCount, idleCount);

        return done();
      });
    });
  });
});
