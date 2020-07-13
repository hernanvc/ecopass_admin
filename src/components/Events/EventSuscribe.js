import React, { Component } from 'react';
import { Row, Col, FormGroup, Label, Input } from 'reactstrap';
import { Table, Divider, Icon, notification } from 'antd';
import { requestHttp } from '../../services/request.services';
import moment from 'moment';
import { Link } from 'react-router-dom';

const { Column } = Table;

class EventSuscribe extends Component {
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

    async componentDidMount() {
        moment.locale('es');
        let id = this.props.match.params.handle
        let fetch = await requestHttp.requestGet('/ticketPay/sucribe/event/' + id);
        if (fetch) {
            console.log(fetch)
            await this.setState({
                tickets: fetch.data.reverse(),
                loader: false
            })
        }
        else {
            await this.setState({
                loader: false
            })
        }
    }

    async deleteTicket(e) {
        let position = 0
        this.state.tickets.forEach((element, index) => {
            if(element.ticket.id === e.ticket.id){
                position = index
            }
        });
        let arr = this.state.tickets;
        let putTicket = await requestHttp.deleteItem('ticketPay/'+ e.ticketPay.id )
        if (putTicket) {
            this.setState({
                loader: false,
            })
            if (position > -1) {
                arr.splice(position, 1);
            }
            await this.setState({
                tickets: arr
            })
            notification.open({
                message: 'Se han guardado los tickets',
                description: 'Se han guardado los tickets',
                icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
            });
        }
        else {
            this.setState({
                loader: false
            })
            notification.open({
                message: 'Ha ocurrido un error',
                description: 'Por favor intentar mas tarde',
                icon: <Icon type="sad" style={{ color: '#108ee9' }} />,
            });
        }
    }

    render() {
        return (
            <section className="bg-white">
                <Col span={24}>
                    <div className="admin-container">
                        <Row>
                            <Col xl={{ size: 12 }} >
                                <h5>Ordenes de Pago</h5>
                                <br />
                                <Row>
                                    <Col xl="7" lg="6" md="12">
                                        <FormGroup>
                                            <Label >Detalla la orden de pago por evento</Label>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Table dataSource={this.state.tickets} style={{ marginTop: "30px" }}>
                                    <Column title="Nombre"
                                        dataIndex="name"
                                        key="name"
                                        render={(text, record, index) => (
                                            <span>
                                                {record.ticketPay.name}
                                                
                                            </span>
                                    )} />
                                    <Column title="RUT/DNI"
                                        dataIndex="rut"
                                        key="rut"
                                        render={(text, record, index) => (
                                            <span>
                                                {record.ticketPay.dni}
                                            </span>
                                    )} />
                                    <Column title="Email"
                                        dataIndex="email"
                                        key="email"
                                        render={(text, record, index) => (
                                            <span>
                                                {record.ticketPay.email}
                                            </span>
                                    )} />
                                    <Column
                                        title="Ticket"
                                        key="ticket"
                                        render={(text, record, index) => (
                                            <span>
                                                <p>{record.ticket.name}</p>
                                            </span>
                                        )}
                                    />
                                    <Column
                                        title="Monto pagado"
                                        key={this.state.tickets.length}
                                        render={(text, record, index) => (
                                            <span>
                                                <p>{record.ticketPay.price_ticket} CLP</p>
                                            </span>
                                        )}
                                    />
                                    {/**}
                                    <Column
                                        title="Configuración"
                                        key="action"
                                        render={(text, record, index) => (
                                            <span>
                                                <button className="transparent-btn" style={{cursor: "pointer"}} onClick={(e) => this.deleteTicket(record)}>Eliminar</button>
                                            </span>
                                        )}
                                    />*/}
                                </Table>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </section>
        )
    }
}
export default EventSuscribe;