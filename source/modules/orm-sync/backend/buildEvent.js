exports = module.exports = function(e) {
    var icalendar = require('icalendar');
    var event = new icalendar.VEvent(e.uuid);
    event.setSummary(e.asunto);
    event.setDescription(e.descripcion);
    event.setDate(new Date(e.desde), new Date(e.hasta));
    event.addProperty('LOCATION', e.ubicacion);
    var id,o;
    if (e.organizadores) {
        for(id in e.organizadores) {
            o = e.organizadores[id];
            event.addProperty('ORGANIZER;ROLE=REQ-PARTICIPANT;CN="' + o.nombre + ' ' + o.apellido + '"', 'MAILTO:' + o.email);
        }
    }
    if (e.comprometidos) {
        for(id in e.comprometidos) {
            o = e.comprometidos[id];
            event.addProperty('ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN="' +o.nombre + ' ' + o.apellido + '"', 'MAILTO:' + o.email);
        }
    }
    if (e.noComprometidos) {
        for(id in e.noComprometidos) {
            o = e.noComprometidos[id];
            event.addProperty('ATTENDEE;ROLE=NON-PARTICIPANT;PARTSTAT=TENTATIVE;CN=\"' + o.nombre + ' ' + o.apellido + '\"', 'MAILTO:' + o.email);
        }
    }
    if (e.sinConfirmar) {
        for(id in e.sinConfirmar) {
            o = e.sinConfirmar[id];
            event.addProperty('ATTENDEE;ROLE=OPT-PARTICIPANT;PARTSTAT=NEEDS-ACTION;CN=\"' + o.nombre + ' ' + o.apellido + '\"' , 'MAILTO:' + o.email);
        }
    }
    return event;
};