var http = require("http");
var pg = require("pg");
var url = require('url');

var conString = "postgres://gpadmin:gpadmin@10.103.217.190/postgres";

var server = http.createServer(function(req, res) {
    var url_parts = url.parse(req.url, true);
    var query_string = url_parts.query.query;
    console.log(url_parts);
    // get a pg client from the connection pool
    pg.connect(conString, function(err, client, done) {

	var handleError = function(err) {
	    // no error occurred, continue with the request
	    if(!err) return false;

	    // An error occurred, remove the client from the connection pool.
	    // A truthy value passed to done will remove the connection from the pool
	    // instead of simply returning it to be reused.
	    // In this case, if we have successfully received a client (truthy)
	    // then it will be removed from the pool.
	    done(client);
	    res.writeHead(500, {'content-type': 'text/plain'});
	    res.end('An error occurred');
	    return true;
	};
	if (handleError(err)) return;
	res.writeHead(200, {'content-type': 'text/plain'});
	res.write('Results from GPDB:');
	var query = client.query(query_string);
	query.on('row', function (row) {
	    res.write(row.a + ', ' + row.b);
	});
	query.on('end', function(result) {
	    res.end('Retrieved ' + result.rowCount + ' rows from GPDB');
	});
    });
});
server.listen(8888);

/*
var rows = [];
var g_client;
g_client = pg.connect("postgres://gpadmin:gpadmin@10.103.217.190/postgres",
	   function(err, client, done) { });
var query = g_client.query({
    text: 'SELECT a, b FROM t1',
});

query.on('row', function(row) {
    rows.push(row);
});

http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello World");
  response.write("%d, %d", (rows[0].a, rows[0].b));
  response.write("%d, %d", (rows[1].a, rows[1].b));
  response.end();
}).listen(8888);

*/
