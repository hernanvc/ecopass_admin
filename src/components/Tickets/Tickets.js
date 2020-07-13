import React, {Component} from 'react';
import {Row, Col, FormGroup, Label, Input, InputGroup} from 'reactstrap';
import {Table, Divider, Icon, notification} from 'antd';
import {requestHttp} from '../../services/request.services';
import moment from 'moment';
import {Link} from 'react-router-dom';

const {Column} = Table;

class CreatedTickets extends Component {
    constructor(props) {
        super(props)
        this.state = {
            active: 5,
            visible: false,
            request: 0,
            loader: true,
            requestId: 0,
            tickets: [],
            all: [],
            event_type_id: ''
        }
    }

    async componentDidMount(next) {
        moment.locale('es');
        let fetch = await requestHttp.requestGet('ticket/info')
        if (fetch) {
            let data = fetch.data.reverse()
            await this.setState({
                tickets: fetch.data.reverse(),
                loader: false,
                all: data
            })
        } else {
            await this.setState({
                loader: false
            })
        }
    }

    async activateTicket(e) {
        let position = 0;
        this.state.tickets.forEach((element, index) => {
            if (element.ticket.id === e.ticket.id) {
                position = index
            }
        });
        let arr = this.state.tickets;
        let currentTicket = this.state.tickets[position].ticket;

        if (currentTicket) {
            let request = await requestHttp.requestPostToken('ticket/activate', currentTicket.id);
            if (request)
                this.setState({
                    loader: false,
                });
            arr[position].ticket.is_active = !arr[position].ticket.is_active;
            await this.setState({
                tickets: arr
            });
            notification.open({
                message: 'Se han guardado los tickets',
                description: 'Se han guardado los tickets',
                icon: <Icon type="smile" style={{color: '#108ee9'}}/>,
            });
        } else {
            this.setState({
                loader: false
            })
            notification.open({
                message: 'Ha ocurrido un error',
                description: 'Por favor intentar mas tarde',
                icon: <Icon type="sad" style={{color: '#108ee9'}}/>,
            });
        }
    }

/**
 handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }*/

async
handleChange(data)
{

    let inputArray = this.state.all
    let arr = []
    for (let i = 0; i < inputArray.length; i++) {
        if (data.value.length > 0 && inputArray[i].ticket.name.toLowerCase().substring(0, data.value.length) === data.value.toLowerCase()) {
            arr.push(inputArray[i])
            this.setState({
                tickets: arr
            })
        } else if (data.value.length === 0) {
            this.setState({
                tickets: inputArray
            })
        } else {
            this.setState({
                tickets: arr
            })
        }
    }
}


handleCheck(e, val)
{
    this.setState({
        [e.target.name]: val
    })
}

render()
{
    return (
        <section className="bg-white">
            <Col span={24}>
                <div className="admin-container">
                    <Row>
                        <Col xl={{size: 12}}>
                            <h5>Tickets del evento </h5>
                            <br/>
                            <Row>
                                <Col xl="6" lg="5" md="12">
                                    <FormGroup>
                                        <Label>Muestra todos los tickets creados en la plataforma</Label>
                                    </FormGroup>
                                </Col>
                                <Col xl="6" lg="5" md="12">
                                    <InputGroup className="search-bar"
                                                style={{float: "right", width: "100%", marginBottom: "40px"}}>
                                        <Input placeholder="Buscar Ticket" type="text"
                                               onChange={(e) => this.handleChange(e.target)}/>
                                        <Icon className="icon-light" type="search"/>
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Table dataSource={this.state.tickets} style={{marginTop: "30px"}}>
                                <Column title="Nombre"
                                        key="name"
                                        render={(text, record, index) => (
                                            <span>
                                            <p>{record.ticket.name}</p>
                                        </span>
                                        )}/>
                                <Column
                                    title="Estado"
                                    key={this.state.tickets.length}
                                    render={(text, record, index) => (
                                        <span>
                                                <p>{record.ticket.is_active ?
                                                    <span style={{color: "#7bb42c"}}>Activo</span> :
                                                    <span style={{color: "red"}}>Inactivo</span>}</p>
                                                <p>{record.ticket.is_outofstock ?
                                                    <span style={{color: "red"}}>Marcado como agotado</span> : null}</p>
                                            </span>
                                    )}
                                />
                                <Column title="Tipo"
                                        dataIndex="type"
                                        key="type"
                                        render={(text, record, index) => (
                                            <span>
                                                {record.ticket.tipo === 3 ? <span>Pagado</span> : null}
                                                {record.ticket.tipo === 4 ? <span>Cortesía</span> : null}
                                                {record.ticket.tipo === 5 ? <span>Gratuito</span> : null}
                                            </span>
                                        )}
                                />
                                <Column title="Evento"
                                        key="event"
                                        render={(text, record, index) => (
                                            <span>
                                                    <p>{record.event.name}</p>
                                                </span>
                                        )}
                                />
                                <Column title="Productor"
                                        key="producer"
                                        render={(text, record, index) => (
                                            <span>
                                                    <p>{record.producer.name}</p>
                                                </span>
                                        )}
                                />
                                <Column title="Disponibles/Total" dataIndex="stock" key="stock"
                                        render={(text, record, index) => (
                                            <span>
                                                {(record.ticket.stock - record.ticket.stock_acquired) + "/" + record.ticket.stock}
                                            </span>
                                        )}/>
                                <Column title="Precio" dataIndex="price" key="price"
                                        render={(text, record, index) => (
                                            <span>
                                                {record.ticket.price + " CLP"}
                                            </span>
                                        )}/>
                                <Column
                                    title="Configuración"
                                    key="action"
                                    render={(text, record, index) => (
                                        <span>
                                                <button className="transparent-btn" style={{cursor: "pointer"}}
                                                        onClick={(e) => this.activateTicket(record)}>{record.ticket.is_active ?
                                                    <span>Desactivar</span> : <span>Activar</span>}</button>
                                            </span>
                                    )}
                                />
                            </Table>
                        </Col>
                    </Row>
                </div>
            </Col>
        </section>
    )
}
}
export default CreatedTickets;