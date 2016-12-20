exports = module.exports = {
    '/orm/alarma': {
        section: 'calendario',
        title: 'Alarma de reuniones',
        name: 'alarma',
        views: {
            'body@': {
                templateUrl: '/views/orm/alarma/index.html',
            },
            'navbar-extra-left@': {},
            'navbar-extra-right@': {}
        }
    },
    '/orm/alarmaTemario': {
        section: 'calendario',
        title: 'Alarma de temarios',
        name: 'alarma',
        views: {
            'body@': {
                templateUrl: '/views/orm/alarma/temarios.html',
            },
            'navbar-extra-left@': {},
            'navbar-extra-right@': {}
        }
    },
    '/orm/reuniones/:_id/minuta': {
        section: 'calendario',
        title: 'Minuta de reunión',
        name: 'minuta',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/orm/minuta/main.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/orm/navbar.html'},
            'navbar-extra-right@': {
                templateUrl: '/views/orm/minuta/navbar-right.html'
            }
        }
    },
    '/orm/reuniones/reportes': {
        section: 'calendario',
        title: 'Reportes de reuniones',
        name: 'estadisticas',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/orm/reportes/reportes.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/orm/navbar.html'},
            'navbar-extra-right@': {}
        }
    },
    '/orm/reuniones/:_id/asistencia': {
        title: 'Participantes de reunión',
        name: 'participantes',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/orm/reunion/planillaAsistencia.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/orm/navbar.html'},
            'navbar-extra-right@': {}
        }
    },
    '/orm/reuniones/:_id/editableAsistencia': {
        title: 'Participantes de reunión',
        name: 'participantes',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/orm/reunion/editableAsistencia.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/orm/navbar.html'},
            'navbar-extra-right@': {}
        }
    },
    '/orm/reuniones/:_id/editableLlamados': {
        title: 'Llamados de una reunión',
        name: 'llamados',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/orm/reunion/editableLlamados.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/orm/navbar.html'},
            'navbar-extra-right@': {}
        }
    },
    '/orm/reuniones/:_id/llamados': {
        title: 'Llamados de reunión',
        name: 'llamados',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/orm/reunion/planillaLlamados.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/orm/navbar.html'},
            'navbar-extra-right@': {}
        }
    },
    '/orm/reuniones/:_id/participantesPrint': {
        title: 'Participantes',
        name: 'participantes',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/orm/reunion/participantesPrint.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/orm/navbar.html'
            },
            'navbar-extra-right@': {}
        }
    },
    '/orm/reuniones/:_id/citasPrint': {
        title: 'Citas',
        name: 'citas',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/orm/reunion/citasPrint.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/orm/navbar.html'
            },
            'navbar-extra-right@': {}
        }
    },
    '/orm/reuniones/:_id/mailsCitasPrint': {
        title: 'Citas',
        name: 'citas',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/orm/reunion/mailsCitasPrint.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/orm/navbar.html'
            },
            'navbar-extra-right@': {}
        }
    },
    '/orm/reuniones/:_id/envioPropuestaPrint': {
        title: 'Envio de Propuesta',
        name: 'envioPropuesta',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/orm/reunion/envioPropuestaPrint.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/orm/navbar.html'
            },
            'navbar-extra-right@': {}
        }
    },
    '/orm/reuniones/:_id/envioTemarioPrint': {
        title: 'Envio de Temario',
        name: 'envioTemario',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/orm/reunion/envioTemarioPrint.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/orm/navbar.html'
            },
            'navbar-extra-right@': {}
        }
    },
    '/orm/reuniones/:_id/envioMinutaPrint': {
        title: 'Envio de Minuta',
        name: 'envioMinuta',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/orm/reunion/envioMinutaPrint.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/orm/navbar.html'
            },
            'navbar-extra-right@': {}
        }
    },
    '/orm/reuniones/:_id/mailsPropuestaPrint': {
        title: 'Envio de Propuesta',
        name: 'envioPropuesta',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/orm/reunion/mailsPropuestaPrint.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/orm/navbar.html'
            },
            'navbar-extra-right@': {}
        }
    },
    '/orm/reuniones/:_id/mailsTemarioPrint': {
        title: 'Envio de Temario',
        name: 'envioTemario',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/orm/reunion/mailsTemarioPrint.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/orm/navbar.html'
            },
            'navbar-extra-right@': {}
        }
    },
    '/orm/reuniones/:_id/mailsMinutaPrint': {
        title: 'Envio de Minuta',
        name: 'envioMinuta',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/orm/reunion/mailsMinutaPrint.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/orm/navbar.html'
            },
            'navbar-extra-right@': {}
        }
    },
    '/orm/reuniones/:_id/llamadosPrint': {
        title: 'Llamados',
        name: 'llamados',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/orm/reunion/llamadosPrint.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/orm/navbar.html'
            },
            'navbar-extra-right@': {}
        }
    },
    '/orm/reuniones/:_id/calendarioPrint': {
        title: 'Calendario',
        name: 'calendario',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/orm/reunion/calendarioPrint.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/orm/navbar.html'
            },
            'navbar-extra-right@': {}
        }
    },
    '/orm/reuniones/:_id/propuestaPrint': {
        title: 'Propuesta de Temario',
        name: 'calendario',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/orm/reunion/propuestaPrint.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/orm/navbar.html'
            },
            'navbar-extra-right@': {}
        }
    },
    '/orm/mi-agenda': {
        title: 'Mi agenda',
        section: 'mi-agenda',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/orm/mi-agenda/main.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/orm/navbar.html'
            },
            'navbar-extra-right@': {
                // templateUrl: '/views/orm/minuta/navbar-right.html'
            }
        }
    },
    '/orm': {
        title: 'ORM',
        reloadOnSearch: false,
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/orm/home.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/orm/navbar.html'
            }
     }
    },
    '/orm/calendario': {
        section: 'calendario',
        title: 'Calendario',
        reloadOnSearch: false,
        allowed: ['orm'],
        parents: ['/orm'],
        views: {
            'body@': {
                templateUrl: '/views/orm/calendario/calendario.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/orm/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/orm/calendario/navbar.html'
            }
        }
    },
    '/orm/reuniones/maestro': {
        reloadOnSearch: false,
        allowed: ['orm'],
        section: 'calendario',
        views: {
            'body@': {
                templateUrl: '/views/orm/reunion/maestro.html',
            },
            'navbar-extra-right@': {
                templateUrl: '/views/orm/reunion/navbar.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/orm/navbar.html'
            }
        }
    },
    '/orm/reuniones/nueva': {
        section: 'calendario',
        title: 'Reunion',
        allowed: ['orm'],
        edit: true,
        new: true,
        parents: ['/orm', '/orm/calendario'],
        reloadOnSearch: false,
        views: {
            'body@': {
                templateUrl: '/views/orm/reunion/nuevaReunion.html',
            }
        }
    },
    '/orm/reuniones/:_id': {
        reloadOnSearch: false,
        allowed: ['orm'],
        section: 'calendario',
        views: {
            'body@': {
                templateUrl: '/views/orm/reunion/reunion.html',
            },
            'navbar-extra-right@': {
                templateUrl: '/views/orm/reunion/navbar.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/orm/navbar.html'
            }
        }
    },
    '/orm/temarios/:_id': {
        title: 'Temario',
        section: 'temarios',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/orm/temario/temario.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/orm/navbar.html',
            },
            'navbar-extra-right@': {
                templateUrl: '/views/orm/temario/navbar.html',
            }
        }
    },
    '/orm/temarios/:_id/vuelta': {
        title: 'Vuelta de Temario',
        section: 'temarios',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/orm/temario/temarioVuelta.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/orm/navbar.html',
            },
            'navbar-extra-right@': {
                templateUrl: '/views/orm/temario/navbarVuelta.html',
            }
        }
    },
    '/orm/cita/:_id': {
        title: 'Cita',
        section: 'calendario',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/orm/cita/cita.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/orm/navbar.html',
            }
        }
    },
    '/orm/temarios': {
        title: 'Temarios',
        section: 'temarios',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/orm/temario/temarios.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/orm/navbar.html',
            }
        }
    },
    '/orm/minutas/compromisos': {
        title: 'Compromisos',
        section: 'compromisos',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/orm/minuta/compromisos.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/orm/navbar.html',
            }
        }
    },
    '/orm/historico': {
        title: 'Archivo Histórico',
        section: 'temarios',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/orm/temario/historico.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/orm/navbar.html',
            }
        }
    },
    '/orm/temarios/:_id/print': {
        title: 'Temario',
        section: 'temarios',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/orm/temario/temarioPrint.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/orm/navbar.html',
            }
        }
    },
    '/orm/minutas/:_id/print': {
        title: 'Minuta',
        section: 'calendario',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/orm/minuta/minutaPrint.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/orm/navbar.html',
            }
        }
    },
    '/orm/temarios/:_id/blanco': {
        title: 'Temario',
        section: 'temarios',
        allowed: ['orm'],
        views: {
            'body@': {
                templateUrl: '/views/orm/temario/temarioBlanco.html',
            }
        }
    }
};