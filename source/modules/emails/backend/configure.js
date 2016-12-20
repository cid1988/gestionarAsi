exports = module.exports = function(app, conf) {
    var createMessage = require('./locals').createMessage = function(from, subject, text, html, to, cc, bcc, attachment) {
        if (attachment == ""){
            var message = {
                text: text,
                from: from,
                to: to,
                cc: cc,
                bcc: bcc,
                subject: subject,
                attachment: [{
                    data: html,
                    alternative: true
                }]
            };
        } else {
            var message = {
                text: text,
                from: from,
                to: to,
                cc: cc,
                bcc: bcc,
                subject: subject,
                attachment: [{
                    data: html,
                    alternative: true
                },
                {path: require('path').join(__dirname, "../../..", attachment), type:"application/pdf", name:"temario.pdf"}]
            };
        }
        return message;
    };

    require('./locals').sendMail = function(message, callback) {
        var email = require('emailjs/email');
        console.log(conf);
        var server = email.server.connect({
            user: conf.email.smtp.username,
            password: conf.email.smtp.password,
            host: conf.email.smtp.host,
            port: conf.email.smtp.port,
            ssl: conf.email.smtp.useSsl
        });

        server.send(message, function(err, message) {
            if (callback) {
                return callback(err, message);
            }
        });
    };
};