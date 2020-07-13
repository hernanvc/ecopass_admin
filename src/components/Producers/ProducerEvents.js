import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Table, Icon} from 'antd';
import { Row, Col } from 'reactstrap';
import { requestHttp } from '../../services/request.services';
import moment from 'moment';
import Loader from '../partials/Loader';
import Swal from 'sweetalert2'

const { Column } = Table;

class ProducerEvents extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            isLogged: false,
            loader: true,
            events:[]
        };
    }

    async componentDidMount() {
        moment.locale('es');
        let id = this.props.match.params.handle
        let fetch = await requestHttp.requestGet('event/producer/' + id)
        if (fetch) {
            console.log(fetch)
            await this.setState({
                events: fetch.data,
                loader: false
            })
        }
        else {
            await this.setState({
                loader: false
            })
        }
    }

    async updateEvent(e) {
        let id = this.state.events[e].id;
        Swal.fire({
            title: this.state.events[e].is_active ? "Desactivar el evento" : "Activar el evento",
            html: '<p>' + this.state.events[e].is_active ? "¿Estás seguro que deseas desactivar el evento?" : "¿Estás seguro que deseas activar el evento?" + '</p>' + '<h2 class="swal2-title">' + this.state.events[e].name + '</h2>',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, ' + (this.state.events[e].is_active ? "Desactivar evento" : "Activar evento"),
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.value) {
                let ev = this.state.events;
                requestHttp.requestGet('event/validate/' + id).then(data => {
                    ev.splice(e, 1, data.data);
                    this.setState({
                        loader: false,
                        events: ev
                    })
                    Swal.fire(
                        'Evento ' + (this.state.events[e].is_active ? "Desactivado" : "Activado"),
                        'El evento ' + this.state.events[e].name + ' ha sido desactivado',
                        'success'
                    )
                }, (error => {
                    this.setState({
                        loader: false,
                    })
                    Swal.fire(
                        'Error',
                        'Ha ocurrido un error, intentar más tarde.',
                        'error'
                    )
                })
                )
            }
        })
    }

    async outstandEvent(e) {
        let id = this.state.events[e].id;
        Swal.fire({
            title: !this.state.events[e].is_outstanding ? "Destacar el evento" : "Quitar destacado",
            html: '<p>' + (this.state.events[e].is_outstanding ? "¿Estás seguro que deseas cancelar destacar el evento?" : "¿Estás seguro que deseas destacar el evento?") + '</p>' + '<h4 class="swal2-title">' + this.state.events[e].name + '</h4>',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: !this.state.events[e].is_outstanding ? "Si, Destacar evento" : "Cancelar destacar evento",
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.value) {
                let ev = this.state.events;
                requestHttp.requestGet('event/destacar/' + id).then(data => {
                    ev.splice(e, 1, data.data);
                    this.setState({
                        loader: false,
                        events: ev
                    })
                    Swal.fire(
                        (!this.state.events[e].is_outstanding ? 'Destacar Cancelado' : 'Evento Destacado'),
                        'El evento ' + this.state.events[e].name + (!this.state.events[e].is_outstanding ? ' ha sido marcado como no destacado' : ' ha sido destacado'),
                        'success',
                    )
                }, (error => {
                    this.setState({
                        loader: false,
                    })
                    Swal.fire(
                        'Error',
                        'Ha ocurrido un error, intentar más tarde.',
                        'error'
                    )
                })
                )
            }
        })
    }

   
    render() {
        return (
            <div className="admin-container">
            <Row>
                <Col xl="12">
                        <h4><Icon type="calendar" theme="twoTone" twoToneColor="#7bb42c" />EVENTOS CREADOS</h4>
                        <p>Aquí podrás encontrar la lista de todos los eventos que haz creado, los cuales podrás editar, duplicar o eliminar</p>
                        <br />
                            <Table dataSource={this.state.events}>
                                <Column title="Nombre evento" dataIndex="name" key="name"
                                    render={(text, record, index) => (
                                        <span>
                                            {record.is_outstanding ? <span><img className="outstanding-icon" src={require("../../assets/images/iconos/star.png")} alt="" /> {record.name}</span> : <span>{record.name}</span>}
                                        </span>
                                    )}
                                />
                                <Column
                                    title="Información"
                                    key="id"
                                    render={(text, record, index) => (
                                        <span>
                                            <p>{moment(record.init_date).format("LL")} <br /> De {record.init_hour} hrs a {record.end_hour}</p>
                                            <p>{record.address}</p>
                                        </span>
                                    )}
                                />
                                <Column title="Información"
                                    key="info"
                                    render={(text, record, index) => (
                                        <span>
                                            {record.is_active ? <span style={{ color: "#7bb42c" }}>Activo</span> : <span style={{ color: "red" }}>Inactivo</span>}
                                            {record.is_outstanding ? <p style={{ color: "#128baf" }}>Destacado</p> : <p>No Destacado</p>}
                                        </span>
                                    )}
                                />
                                <Column
                                    title="Configuración"
                                    key="action"
                                    render={(text, record, index) => (
                                        <span>
                                            <button className="transparent-btn" onClick={(e) => this.updateEvent(this.state.events.indexOf(record))}> {record.is_active ? "Desactivar" : "Activar"} </button>
                                            <button className="transparent-btn" onClick={(e) => this.outstandEvent(this.state.events.indexOf(record))}> {!record.is_outstanding ? "Destacar" : "No Destacar"} </button>

                                        </span>
                                    )}
                                />
                            </Table>
                        
                        </Col>
                    {this.state.loader ? <Loader /> : null}
                </Row>
            </div>
        )
    }
}
export default ProducerEvents;