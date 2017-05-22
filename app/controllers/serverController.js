var url = require('url');
var request = require('request');
var qs = require('querystring');

function serverFunctions() {
    var stream = function(query, data) {
        //Get the streams from the API response
        var streams = String(data.url_encoded_fmt_stream_map).split(',');
        //Loop througn all streams
        for (var i = 0; i < streams.length; i++) {
            //Parse the stream
            var stream = qs.parse(streams[i]);
            //If the stream is compatable with the video type,
            //we return a function that can stream the video to the client.
            //Note: we **DO NOT** stream HD videos to save bandwidth.
            if (String(stream.type).indexOf(query.type) > -1 /*&&
                (
                    //stream regular quality videos
                    (
                        stream.quality == "large" ||
                        stream.quality == "medium" ||
                        stream.quality == "small"
                    )
                )*/
            ) {
                return function(res) {
                    //Pipe the stream out
                    request(stream.url + '&signature=' + (stream.sig || stream.s)).pipe(res);
                };
            }
        }

        //No streams can be found with the format specified
        //Return an error message
        return function(res) {
            res.end("No compatable streams can be found!");
        };
    };

    this.getVideo = function(req, res) {
        var data = url.parse(req.url, true).query;
        data.type = data.type || 'video/mp4';
        // request('http://www.youtube.com/get_video_info?video_id=' + 'XzSSidHU54g', function(err, d_res, d_content) {
        request('http://www.youtube.com/get_video_info?video_id=' + data.id, function(err, d_res, d_content) {
            // Check if there's any error
            if (!err && d_res.statusCode === 200) {
                // No error happened.
                // Start parsing the content of the returned result.
                d_content = qs.parse(d_content);

                // If there's an API error _(such as copyright restrictions, video not allowed to embed, etc.)_
                // end the request with an error message.
                if (d_content.status.indexOf('ok') == -1) {
                    res.end(d_content.reason);
                }
                else {
                    // There's no API errors, start getting information from it.
                    // Log the video's title
                    console.log('Requesting video "%s"', d_content.title);
                    stream(data, d_content)(res);
                }
            }
            else {
                // An error happened, end the connection.
                console.log('Error getting video metadata: ', err);
                res.end();
            }
        });
    };
}

module.exports = serverFunctions;
