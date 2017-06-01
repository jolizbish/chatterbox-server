/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
// Jordan, this fixes the issue. Our .on() functions reset the variables or something...
// so the solution is to put the variables 
var resultsObj = {results: []};
var value;
var body = '';
var requestHandler;

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};


module.exports = requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  // console.log('does it have classes?', (request.url).contains('classes'), request.url.contains('classes'));
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';



  var statusCode;
  // The outgoing status.

  // if (statusCode >= 100 && statusCode < 600) {
  //   console.log('asdfadsf');
  // }

  if (!(request.url.includes('classes'))) {
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end();
    // response.end('hello');
  } else if (request.method === 'GET') {
    statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(resultsObj));
  } else if (request.method === 'OPTIONS') {
    console.log("GRRRR");
    statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end();

    // request.on('end', function() {
    //   value = JSON.parse(body);
    //   resultsObj.results.push(value);
    //   console.log(value);
    //   // response.end(JSON.stringify(resultsObj));
    // });
  } else if (request.method === 'POST') {

    statusCode = 201;
    body = '';

    request.on('data', function(data) {
      body += data.toString();
    });

    request.on('end', function() {
      value = JSON.parse(body);
      resultsObj.results.push(value);
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(resultsObj));
    });

  } else {
    statusCode = 500;
  }

  // See the note below about CORS headers.
  // var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  // headers['Content-Type'] = 'text/plain';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  // response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // response.end(JSON.stringify(resultsObj));
};  

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

