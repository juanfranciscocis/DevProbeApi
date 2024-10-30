let post_notification = async (req, res) => {

    try {
    var request = require('request');

    let sid = req.body.sid;
    let type = req.body.type;
    let message = req.body.message;
    let target_url = req.body.target;

    if (!sid) {
        throw 'sid is required';
    }
    if (!type) {
        throw 'type is required';
    }
    if (!message) {
        throw 'message is required';
    }
    if (!target_url) {
        throw 'target URL is required';
    }

    var headers = {
        'webpushrKey': '8095732f54f78cf401591a615ef46879',
        'webpushrAuthToken': '96853',
        'Content-Type': 'application/json'
    };

    var dataString;
    switch (type) {
        case 'new_incident':
            dataString = JSON.stringify({
                title: 'Your have been assigned a new incident',
                message: message,
                target_url: target_url,
                sid: sid
            });
            break;
        case 'update_incident':
            dataString = JSON.stringify({
                title: 'There has been an update to your incident',
                message: message,
                target_url: target_url,
                sid: sid
            });
            break;

            case 'load_test':
            dataString = JSON.stringify({
                title: 'Load Test Results',
                message: message,
                target_url: target_url,
                sid: sid
            });
            break;

            case 'test':
            dataString = JSON.stringify({
                title: 'You have been assigned a new test',
                message: message,
                target_url: target_url,
                sid: sid
            });
            break;


        default:
            throw 'type is not valid';
    }

    var options = {
        url: 'https://api.webpushr.com/v1/notification/send/sid',
        method: 'POST',
        headers: headers,
        body: dataString
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
    }

    request(options, callback);

    res.status(200).send({ message: 'Notification sent successfully' });
    } catch (error) {
        console.log("error", error);
        res.status(400).send({ error: error });
    }
}

module.exports = { post_notification: post_notification };
