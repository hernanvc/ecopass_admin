import React, { Component } from 'react';
import { Row, Col, FormGroup, Label, Input } from 'reactstrap';
import { Table, Divider, Icon, notification } from 'antd';
import { requestHttp } from '../../services/request.services';
import moment from 'moment';

const { Column } = Table;

class EventTickets extends Component {
    constructor(props) {
        super(props)
        this.state = {
            active: 5,
            visible: false,
            request: 0,
            loader: true,
            requestId: 0,
            tickets: [],
            event_type_id: ''
        }
    }

    async componentDidMount(next) {
        moment.locale('es');
        let id = this.props.match.params.handle
        let fetch = await requestHttp.requestGet('ticket/event/' + id)
        if (fetch) {
            await this.setState({
                tickets: fetch.data,
                loader: false
            })
        }
        else {
            await this.setState({
                loader: false
            })
        }
    }

    async activateTicket(e) {
        let position = 0;
        this.state.tickets.forEach((element, index) => {
            if (element.id === e.id) {
                position = index
            }
        });
        let arr = this.state.tickets;
        let currentTicket = this.state.tickets[position];

        if (currentTicket) {
            let request = await requestHttp.requestPostToken('ticket/activate', currentTicket.id);
            if (request)
                this.setState({
                    loader: false,
                });
            arr[position].is_active = !arr[position].is_active;
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

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleCheck(e, val) {
        this.setState({
            [e.target.name]: val
        })
    }

    render() {
        return (
            <section className="bg-white">
                <Col span={24}>
                    <div className="admin-container">
                        <Row>
                            <Col xl={{ size: 12 }} >
                                <h5>Tickets del evento </h5>
                                <br />
                                <Row>
                                    <Col xl="7" lg="6" md="12">
                                        <FormGroup>
                                            <Label >Habilita y deshabilita tickets para el evento</Label>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Table dataSource={this.state.tickets} style={{ marginTop: "30px" }}>
                                    <Column title="Nombre" dataIndex="name" key="name" />
                                    <Column
                                        title="Estado"
                                        key={this.state.tickets.length}
                                        render={(text, record, index) => (
                                            <span>
                                                <p>{record.is_active ? <span style={{ color: "#7bb42c" }}>Activo</span> : <span style={{ color: "red" }}>Inactivo</span>}</p>
                                                <p>{record.is_outofstock ? <span style={{ color: "red" }}>Marcado como agotado</span> : null }</p>
                                            </span>
                                        )}
                                    />
                                    <Column title="Tipo"
                                        dataIndex="type"
                                        key="type"
                                        render={(text, record, index) => (
                                            <span>
                                                {record.tipo === 3 ? <span>Pagado</span> : null}
                                                {record.tipo === 4 ? <span>Cortesía</span> : null}
                                                {record.tipo === 5 ? <span>Gratuito</span> : null}
                                            </span>
                                        )} />
                                    <Column title="Cantidad/Disponibles" dataIndex="stock" key="stock"
                                        render={(text, record, index) => (
                                            <span>
                                                {(record.stock - record.stock_acquired) + "/" + record.stock }
                                            </span>
                                        )} />
                                    <Column title="Precio" dataIndex="price" key="price"
                                        render={(text, record, index) => (
                                            <span>
                                                {record.price + " CLP"}
                                            </span>
                                        )} />
                                    <Column
                                        title="Configuración"
                                        key="action"
                                        render={(text, record, index) => (
                                            <span>
                                                <span onClick={(e) => this.activateTicket(record)}>{record.is_active ? <span style={{ color: "red", fontWeight: "100" }}>Desactivar</span> : <span style={{ color: "#7bb42c" }}>Activar</span>}</span>
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
export default EventTickets;