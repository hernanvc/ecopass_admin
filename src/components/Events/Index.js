import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Table, Icon} from 'antd';
import { Row, Col, Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { requestHttp } from '../../services/request.services';
import moment from 'moment';
import Loader from '../partials/Loader';
import Swal from 'sweetalert2'
import CommissionModal from "./partials/CommissionModal";

moment.locale('es');
const { Column } = Table;

class CreatedEvents extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            isOpen: false,
            isLogged: false,
            loader: true,
            events:[], 
            all:[],
            eventId: 0
        };
    }

    async componentDidMount() {
        
        let fetch = await requestHttp.requestGet('event/info')
        if (fetch) {
            await this.setState({
                events: fetch.data.reverse(),
                loader: false,
                all: fetch.data.reverse()
            })
        }
        else {
            await this.setState({
                loader: false
            })
        }
    }

    async updateEvent(e) {
        let id = this.state.events[e].event.id;
        Swal.fire({
            title: this.state.events[e].event.is_active ? "Desactivar el evento" : "Activar el evento",
            html: '<p>' + this.state.events[e].event.is_active ? "¿Estás seguro que deseas desactivar el evento?" : "¿Estás seguro que deseas activar el evento?" + '</p>' + '<h2 class="swal2-title">' + this.state.events[e].name + '</h2>',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, ' + (this.state.events[e].event.is_active ? "Desactivar evento" : "Activar evento"),
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.value) {
                let ev = this.state.events;
                requestHttp.requestGet('event/validate/' + id).then(data => {
                    ev[e].event.is_active = !ev[e].event.is_active
                    this.setState({
                        loader: false,
                        events: ev
                    })
                    Swal.fire(
                        'Evento ' + (this.state.events[e].event.is_active ? "Activado" : "Desactivado"),
                        'El evento ' + this.state.events[e].event.name  + " has sido " + (this.state.events[e].event.is_active ? "Activado" : "Desactivado"),
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
        let id = this.state.events[e].event.id;
        Swal.fire({
            title: !this.state.events[e].event.is_outstanding ? "Destacar el evento" : "Quitar destacado",
            html: '<p>' + (this.state.events[e].event.is_outstanding ? "¿Estás seguro que deseas cancelar destacar el evento?" : "¿Estás seguro que deseas destacar el evento?") + '</p>' + '<h4 class="swal2-title">' + this.state.events[e].event.name + '</h4>',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: !this.state.events[e].event.is_outstanding ? "Si, Destacar evento" : "Cancelar destacar evento",
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.value) {
                let ev = this.state.events;
                requestHttp.requestGet('event/destacar/' + id).then(data => {
                        ev[e].event.is_outstanding = !ev[e].event.is_outstanding
                    this.setState({
                        loader: false,
                        events: ev
                    })
                    Swal.fire(
                        (!this.state.events[e].event.is_outstanding ? 'Destacar Cancelado' : 'Evento Destacado'),
                        'El evento ' + this.state.events[e].event.name + (!this.state.events[e].event.is_outstanding ? ' ha sido marcado como no destacado' : ' ha sido destacado'),
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

    async deleteEvent(e) {
        let id = this.state.events[e].event.id;
        Swal.fire({
            title: !this.state.events[e].event.delete ? "Eliminar evento" : "Activar evento",
            html: '<p>' + (this.state.events[e].event.delete ? "¿Estás seguro que deseas activar el evento?" : "¿Estás seguro que deseas eliminar el evento?") + '</p>' + '<h4 class="swal2-title">' + this.state.events[e].event.name + '</h4>',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: !this.state.events[e].event.delete ? "Si, eliminar evento" : "Activar evento",
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.value) {
                let ev = this.state.events;
                requestHttp.requestGet('event/delete/' + id).then(data => {
                        ev[e].event.delete = !ev[e].event.delete
                    this.setState({
                        loader: false,
                        events: ev
                    })
                    Swal.fire(
                        (!this.state.events[e].event.delete ? 'Aliminar Cancelado' : 'Evento eliminado'),
                        'El evento ' + this.state.events[e].event.name + (!this.state.events[e].event.delete ? ' ha sido marcado como activo' : ' ha sido eliminado'),
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

    /**
     * Busca por nombre de productor y nombre del evento.
     * @param data
     * @returns {Promise<void>}
     */
    async handleChange(data){
        let inputArray = this.state.all;
        let arr =[]
        for (let i=0; i < inputArray.length; i++) {
            if ( (data.value.length > 0 && inputArray[i].event.name.toLowerCase().substring(0, data.value.length) === data.value.toLowerCase()) ||
                (data.value.length > 0 && inputArray[i].producer.name.toLowerCase().substring(0, data.value.length) === data.value.toLowerCase())  ) {
                arr.push(inputArray[i])
                this.setState({
                    events: arr
                })
            }
            else if(data.value.length === 0){
                this.setState({
                    events: inputArray
                })
            }
            else {
                this.setState({
                    events: arr
                })
            }
        }
    }

    async showModal (e, id){
        await this.setState({
            visible: true,
            eventId: id,
        });
    }

    render() {
        return (
            <div className="admin-container">
                <Row>
                    <Col xl="7" lg="7" md="12">
                        <h4><Icon type="calendar" theme="twoTone" twoToneColor="#7bb42c" />EVENTOS CREADOS</h4>
                        <p>Aquí podrás encontrar la lista de todos los eventos que has creado, los cuales podrás editar, duplicar o eliminar</p>
                        <br />
                    
                    </Col>
                    <Col xl="5" lg="5" md="12">
                        <InputGroup className="search-bar" style={{ float: "right", width: "100%", marginBottom: "40px" }}>
                            <Input placeholder="Buscar evento" type="text" onChange={(e)=>this.handleChange(e.target)} />
                            <Icon className="icon-light" type="search" />
                        </InputGroup>
                    </Col>
                    <Col xl="12">
                           <div className="table-responsive">
                                <Table dataSource={this.state.events}>
                                    <Column title="Nombre evento" dataIndex="name" key="name"
                                        render={(text, record, index) => (
                                            <span>
                                                {record.is_outstanding ? <span><img className="outstanding-icon" src={require("../../assets/images/iconos/star.png")} alt="" /> {record.event.name}</span> : <span>{record.event.name}</span>}
                                            </span>
                                        )}
                                    />
                                    <Column
                                        title="Información"
                                        key="info"
                                        render={(text, record, index) => (
                                            <span>
                                                <p>{moment(record.event.init_date).format("LL")} <br /> De {record.event.init_hour} hrs a {record.event.end_hour}</p>
                                                <p>{record.event.address}</p>
                                            </span>
                                        )}
                                    />
                                    <Column
                                        title="Productor"
                                        key="producer"
                                        render={(text, record, index) => (
                                            <span>
                                                <p>{record.producer.name}</p>
                                            </span>
                                        )}
                                    />
                                    <Column
                                        title="Fecha de Creación"
                                        key="created_date"
                                        render={(text, record, index) => (
                                            <span>
                                                <p>{moment(record.event.creation_date).format('LL')}</p>
                                            </span>
                                        )}
                                    />
                                    <Column title="Estado"
                                        key="estado"
                                        render={(text, record, index) => (
                                            <span>
                                                {record.event.is_active ? <span style={{ color: "#7bb42c" }}>Activo</span> : <span style={{ color: "red" }}>Inactivo</span>}
                                                {record.event.is_outstanding ? <p style={{ color: "#128baf" }}>Destacado</p> : <p>No Destacado</p>}
                                            </span>
                                        )}
                                    />
                                    <Column
                                        title="Configuración"
                                        key="action"
                                        render={(text, record, index) => (
                                            <span>
                                                <button className="transparent-btn" onClick={(e) => this.updateEvent(this.state.events.indexOf(record))}> <span>{record.event.is_active ? "Desactivar" : "Activar"} </span></button>
                                                <button className="transparent-btn" onClick={(e) => this.outstandEvent(this.state.events.indexOf(record))}> <span>{!record.event.is_outstanding ? "Destacar" : "No Destacar"}</span> </button>
                                                <Link to={{ pathname: "/admin/evento=" + record.event.id + "/tickets" }} className="second-btn" > <span>Tickets del evento</span></Link>
                                                <Link to={{ pathname: "/admin/evento=" + record.event.id + "/orden" }} className="second-btn" > <span>Ordenes de pago</span></Link>
                                                <Link to={{ pathname: "/admin/evento=" + record.event.id + "/pagos" }} className="second-btn" > <span>Tickets Pagados</span></Link>
                                                <Link to={{ pathname: "/admin/evento=" + record.event.id + "/suscritos" }} className="second-btn" > <span>Suscritos</span></Link>
                                                <Link to={{ pathname: "/admin/evento=" + record.event.id + "/descuentos" }} className="second-btn" > <span>Descuentos</span></Link>
                                                <button className="transparent-btn" onClick={(e) => this.showModal(e, record.event.id)}> Comisión</button>
                                                {record.event.delete ? null : <button className="danger-btn" onClick={(e) => this.deleteEvent(this.state.events.indexOf(record))}> <span>Eliminar Evento</span></button>}
                                            </span>
                                        )}
                                    />
                                </Table>

                               <CommissionModal
                                   onClick={(e) => this.showModal(e)}
                                   visibility={this.state.visible}
                                   eventId={this.state.eventId}
                               >


                               </CommissionModal>


                           </div>
                    </Col>
                    {this.state.loader ? <Loader /> : null}
                </Row>
            </div>
        )
    }
}
export default CreatedEvents;