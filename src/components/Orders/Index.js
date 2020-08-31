import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Table, Divider, Icon, notification} from 'antd';
import {requestHttp} from '../../services/request.services';
import {Row, Col, InputGroup, Input, Form, FormGroup, Container, Alert} from 'reactstrap';
import moment from 'moment';
import Loader from '../partials/Loader';
import {ValidarRut} from '../../services/formatters'
import EditProducerModal from "../Producers/partials/EditProducerModal";
import EditTicketPayModal from "./partials/EditTicketPayModal";
import SendTicketModal from "./partials/SendTicketModal";
import Swal from "sweetalert2";

const {Column} = Table;

function customTicketExpandIcon(props) {
    let text;
    if (props.expanded) {
        text = '&#8679; Ocultar Tickets';
    } else {
        text = '&#8681; Ver Tickets';
    }
    return (
        <a
            className="expand-row-icon"
            onClick={e => props.onExpand(props.record, e)}
            dangerouslySetInnerHTML={{__html: text}}
            style={{color: '#128baf', cursor: 'pointer'}}
        />
    );
}

function customTalkExpandIcon(props) {


    let text;
    if (props.expanded) {
        text = '&#8679; Ocultar Charlas';
    } else {
        text = '&#8681; Ver Charlas';
    }


    if (props.record.conferencePays.length) {
        return (

            <a
                className="expand-row-icon"
                onClick={e => props.onExpand(props.record, e)}
                dangerouslySetInnerHTML={{__html: text}}
                style={{color: '#128baf', cursor: 'pointer'}}
            />
        );
    }


}

class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isLogged: false,
            loader: true,
            tickets: [],
            all: [],

            /* parametros del modal para editar */
            editModalVisible: false,
            selectedTicketPay: false,
            selectedOrderPayIndex: false,
            selectedTicketPayIndex: false,

            /* parametros para modal de enviar */
            sendTicketModalVisible: false,
            sendingTicketPay: false,
            sendingOrderPay: false,
            sendingEvent:false,

            /* buscador */
            searchWord: ""
        };
    }


    async componentDidMount() {
        if (this.props.tickets) {
            await this.setState({
                tickets: this.props.tickets.reverse(),
                loader: false,
                all: this.props.tickets.reverse()
            })
        } else {
            fetch = await requestHttp.requestGet("orderPay/paid");
            if (fetch) {
                let tickets = fetch.data.reverse()
                await this.setState({
                    tickets: tickets,
                    loader: false,
                    all: tickets
                })
            } else {
                await this.setState({
                    loader: false,
                })

            }
        }
    }


    async deleteTicket(e) {
        let position = 0;
        this.state.tickets.forEach((element, index) => {
            if (element.id === e.id) {
                position = index
            }
        });
        let arr = this.state.tickets;
        let putTicket = await requestHttp.deleteItem('orderPay/' + e.id);
        if (putTicket) {
            this.setState({
                loader: false,
            });
            if (position > -1) {
                arr.splice(position, 1);
            }
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
            });
            notification.open({
                message: 'Ha ocurrido un error',
                description: 'Por favor intentar mas tarde',
                icon: <Icon type="sad" style={{color: '#108ee9'}}/>,
            });
        }
    }

    showTalks(record){
        return <Table className="table-light"
                      dataSource={record}>
            <Column
                title="Ticket"
                key="ticket"
                render={(text, record) => (
                    <small>
                        {record.conference.name}
                    </small>
                )}
            />
            <Column
                title="Precio con Comisión"
                key="price"
                render={(text, record) => (
                    <small>
                        {record.total_pagado}
                    </small>
                )}
            />

        </Table>
    }


    showTickets(record, ColumnIndex, event) {
        //console.log("record: ",event)
        return <div className="table-responsive">
            <Table 
            dataSource={record}
            expandedRowRender={(record, index) =>
                <div>
                    {this.showTalks(record.conferencePays)}
                </div>
            }
            expandIcon={customTalkExpandIcon}>
            <Column
            title="Ticket"
            key="ticket"
            render={(text, record) => (
                <small>
                    {record.ticket.name}
                </small>
            )}
            />
            <Column
            title="Precio con Comisión"
            key="price"
            render={(text, record) => (
                <small>
                    {record.ticketPay.total_pagado}
                </small>
            )}
            />
            <Column
            title="Código de Descuento"
            key="codigo"
            render={(text, record) => (
                <small>
                    {record.ticketPay.discount_code}
                </small>
            )}
            />
            <Column
            title="Rut"
            key="rut"
            render={(text, record) => (
                <small>
                    {record.ticketPay.dni}
                </small>
            )}
            />
            <Column
            title="Email"
            key="email"
            render={(text, record) => (
                <small>
                    {record.ticketPay.email}
                </small>
            )}
            />
            <Column
            title="Link"
            key="link"
            render={(text, record) => (
                <small>
                    <a href={record.ticketPay.register_url}> {record.ticketPay.register_url}</a>
                </small>
            )}
            />
            <Column
            title="Estado"
            key="status"
            render={(text, record) => (
                <small>
                    {record.ticketPay_status}
                </small>
            )}
            />
            <Column
            title="Acciones"
            key="action"
            render={(text, record, index) => (
               
                <span>
                    <>

               </>
                    <button className="transparent-btn"
                            onClick={(e) => this.showSendTicketModal(record.ticketPay, record.orderPay, event)}
                            //disabled={record.orderPay.pay_state !== 'APPROVED' || record.ticketPay_status !== 'APROBADO'}
                            >
                        Enviar Link
                    </button>
                    <button className="transparent-btn"
                            onClick={(e) => this.showEditTicketPayModal(record.ticketPay, ColumnIndex, index)}
                            //disabled={record.orderPay.pay_state !== 'APPROVED' || record.ticketPay_status !== 'APROBADO'}
                            >
                        Editar
                    </button>
                    <button className="transparent-btn"
                            onClick={(e) => this.cancelTicketPay(record.ticketPay, ColumnIndex, index)}
                            //disabled={record.ticketPay_status !== 'APROBADO' || record.orderPay.pay_state !== 'APPROVED'}
                            >
                        Cancelar
                    </button>
                </span>
            )}
            />
            </Table>
        </div>
    }

    async cancelTicketPay(ticketPay, orderPayIndex, ticketPayIndex) {

        Swal.fire({
            title: "¿Estás seguro que deseas cancelar ticket",
            html: '<p>' + "Esta acción es irreversible" + '</p>',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.value) {
                let cancelTicket = await requestHttp.requestPostToken('ticketPay/cancel_ticket', ticketPay.id);
                if (cancelTicket) {
                    notification.open({
                        message: 'Entrada Cancelada',
                        description: 'Entrada cancelada exitosamente',
                        icon: <Icon type="smile" style={{color: '#108ee9'}}/>,
                    });
                    let updateTickets = this.state.tickets;
                    updateTickets[orderPayIndex].ticketAndTicketPayList[ticketPayIndex].ticketPay_status = 'CANCELADO';
                    updateTickets[orderPayIndex].ticketAndTicketPayList[ticketPayIndex].ticketPay.dni = '';
                    updateTickets[orderPayIndex].ticketAndTicketPayList[ticketPayIndex].ticketPay.email = '';
                    await this.setState({
                        tickets: updateTickets
                    })


                } else {
                    notification.open({
                        message: 'Ha ocurrido un error',
                        description: 'Por favor intentar mas tarde',
                        icon: <Icon type="sad" style={{color: '#108ee9'}}/>,
                    });
                }
            }
        })
    }

    async showEditTicketPayModal(ticketPay, orderPayIndex, ticketPayIndex) {
        await this.setState({
            editModalVisible: true,
            selectedTicketPay: ticketPay,
            selectedOrderPayIndex: orderPayIndex,
            selectedTicketPayIndex: ticketPayIndex
        })
    }

    async hideEditTicketPayModalSuccess(name, rut, email, phone) {
        let newTickets = this.state.tickets;
        newTickets[this.state.selectedOrderPayIndex].ticketAndTicketPayList[this.state.selectedTicketPayIndex].ticketPay.name = name;
        newTickets[this.state.selectedOrderPayIndex].ticketAndTicketPayList[this.state.selectedTicketPayIndex].ticketPay.dni = rut;
        newTickets[this.state.selectedOrderPayIndex].ticketAndTicketPayList[this.state.selectedTicketPayIndex].ticketPay.phone = phone;
        newTickets[this.state.selectedOrderPayIndex].ticketAndTicketPayList[this.state.selectedTicketPayIndex].ticketPay.email = email;

        await this.setState({
            tickets: newTickets,
            editModalVisible: false,
            selectedTicketPay: false,
            selectedOrderPayIndex: false,
            selectedTicketPayIndex: false

        })
    }

    async hideEditTicketPayModalFail() {
        await this.setState({
            editModalVisible: false,
            selectedTicketPay: false,
            selectedOrderPayIndex: false,
            selectedTicketPayIndex: false
        })
    }

    async showSendTicketModal(ticketPay, orderPay, event) {
        
        await this.setState({
            sendTicketModalVisible: true,
            sendingTicketPay: ticketPay,
            sendingOrderPay: orderPay,
            sendingEvent: event
        })
    }

    async hideSendTicketModal() {
        await this.setState({
            sendTicketModalVisible: false,
            sendingTicketPay: false,
            sendingOrderPay: false
        })
    }

    renderSearchType() {
        const types = [
            {
                name: "Rut",
                id: 1
            },
            {
                name: "Email",
                id: 2
            },
            {
                name: "Numero de Autorización",
                id: 3
            },
        ];
        return types.map((item, index) => {
            return <option key={index} value={item.id}>{item.name}</option>
        })
    }

    async selectSearchType(e) {
        let type = e.target.value;
        await this.setState({
            searchType: type
        })
    }

    async setSearchKeyword(e) {
        await this.setState({
            [e.target.name]: e.target.value
        });
    }

    async handleChange(data) {
        let inputArray = this.state.all;
        let arr = [];
        for (let i = 0; i < inputArray.length; i++) {
            let rut = inputArray[i].rut.replace(/[&\/\\#,+()$~%.'":*?<>{}-]/g, "");
            let input_RUT = data.value.replace(/[&\/\\#,+()$~%.'":*?<>{}-]/g, "");
            let input_email = inputArray[i].email;

            if (data.value.length > 0 &&
                ((input_email.substring(0, data.value.length) === data.value.toLowerCase()) ||
                    (rut.substring(0, input_RUT.length) === input_RUT))) {
                arr.push(inputArray[i]);
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

    async handleSubmit(e) {
        e.preventDefault();
        if (this.state.searchType === "0") {
            await this.showAll();
        }
        if (this.state.searchType === "1") {
            await this.searchByRut();
        }
        if (this.state.searchType === "2") {
            await this.searchByEmail();
        }
        if (this.state.searchType === "3") {
            await this.searchByAuthorization();
        }
    }

    async showAll() {
        await this.setState({
            tickets: this.state.all
        })
    }

    async searchByRut() {
        let word = this.state.searchWord.replace(/[&\/\\#,+()$~%.'":*?<>{}-]/g, "");
        let inputArray = this.state.all;
        let arr = [];
        for (let i = 0; i < inputArray.length; i++) {
            let rut = inputArray[i].orderPay.rut.replace(/[&\/\\#,+()$~%.'":*?<>{}-]/g, "");
            if (word.length > 0 && ((rut.substring(0, word.length) === word.toLowerCase()))) {
                arr.push(inputArray[i]);
                this.setState({
                    tickets: arr
                })
            } else if (word.length === 0) {
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

    async searchByEmail() {
        let word = this.state.searchWord;
        let inputArray = this.state.all;
        let arr = [];
        for (let i = 0; i < inputArray.length; i++) {
            let input_email = inputArray[i].orderPay.email;
            if (word.length > 0 && ((input_email.substring(0, word.length) === word.toLowerCase()))) {
                arr.push(inputArray[i]);
                this.setState({
                    tickets: arr
                })
            } else if (word.length === 0) {
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

    async searchByAuthorization() {
        let word = this.state.searchWord;
        let inputArray = this.state.all;
        let arr = [];
        for (let i = 0; i < inputArray.length; i++) {
            let authorization = inputArray[i].orderPay.numero_de_orden;
            if (word.length > 0 && ((authorization.substring(0, word.length) === word.toLowerCase()))) {
                arr.push(inputArray[i]);
                this.setState({
                    tickets: arr
                })
            } else if (word.length === 0) {
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

    render() {
        //console.log("tickets: ",this.state.tickets);
        
        return (
            <section className="bg-white">
                <Col span={'24'}>
                    <div className="admin-container">
                        <Row>
                            <Col xl="7" lg="7" md="12">
                                <h4>Ordenes de pago</h4>
                                <p>Ordenes de Pago realizadas</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xl="12" lg="7" md="12">
                                <section className="main-layout step-content searcher">
                                    <Form className="search-container">
                                        <Row>
                                            <Col xl="4" md="6" sm="12">
                                                <FormGroup>
                                                    <Input type="select" name="tipo" placeholder="Tipo de Búsqueda"
                                                            onChange={(e) => this.selectSearchType(e)}>
                                                        <option value="0">Tipo de Búsqueda</option>
                                                        {this.renderSearchType()}
                                                    </Input>
                                                </FormGroup>
                                            </Col>
                                            <Col xl="5" md="6" sm="12">
                                                <FormGroup>
                                                    <Input name="searchWord" value={this.state.searchWord}
                                                            placeholder="Ingrese un Valor"
                                                            onChange={(e) => this.setSearchKeyword(e)}/>
                                                </FormGroup>
                                            </Col>
                                            <Col xl="3" md="12" sm="12">
                                                <FormGroup>
                                                    <button onClick={(e) => this.handleSubmit(e)}
                                                            style={{
                                                                width: "-webkit-fill-available",
                                                                minWidth: "initial"
                                                            }}
                                                            className="second-btn">
                                                        <span>Buscar</span>
                                                    </button>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Form>
                                </section>
                            </Col>
                        </Row>
                        <Table className='table-responsive'
                                dataSource={this.state.tickets}
                                style={{marginTop: "10px"}}
                                expandedRowRender={(record, index) =>
                                    
                                    <div>
                                        {this.showTickets(record.ticketAndTicketPayList, this.state.tickets.indexOf(record), record.event)}
                                    </div>
                                }
                                expandIcon={customTicketExpandIcon}>
                            >
                            <Column title="Evento"
                                    dataIndex="event"
                                    key="event"
                                    render={(text, record, index) => (
                                        
                                
                                        <small>
                                            {record.event.name}
                                        </small>
                                    )}
                            />
                            <Column title="RUT/DNI"
                                    dataIndex="rut"
                                    key="rut"
                                    render={(text, record, index) => (
                                        <small>
                                            {record.orderPay.rut}
                                        </small>
                                    )}
                            />
                            <Column title="Email"
                                    dataIndex="email"
                                    key="email"
                                    render={(text, record, index) => (
                                        <small>
                                            {record.orderPay.email}
                                        </small>
                                    )}
                            />
                            <Column title="Nro de Autorización"
                                    dataIndex="nro_orden"
                                    key="nro_orden"
                                    render={(text, record, index) => (
                                        <small>
                                            {record.orderPay.numero_de_orden}
                                        </small>
                                    )}
                            />
                            <Column title="Fecha de Pago"
                                    dataIndex="fecha"
                                    key="fecha"
                                    render={(text, record, index) => (
                                        <small>
                                            {record.orderPay.fecha_de_pago}
                                        </small>
                                    )}
                            />
                            <Column
                                title="Estado"
                                key="estado"
                                render={(text, record, index) => (
                                    <small>
                                        {record.orderPay.pay_state}
                                    </small>
                                )}
                            />
                            <Column
                                title="Total"
                                key="total"
                                render={(text, record, index) => (
                                    <small>
                                        { record.orderPay && record.orderPay.pay_amount > 0 ? record.orderPay.pay_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : record.orderPay.pay_amount} CLP
                                    </small>
                                )}
                            />
                        </Table>
                        <EditTicketPayModal
                            visibility={this.state.editModalVisible}
                            ticketPay={this.state.selectedTicketPay}
                            onHideSuccess={(name, rut, email, phone) => this.hideEditTicketPayModalSuccess(name, rut, email, phone)}
                            onHideFail={() => this.hideEditTicketPayModalFail()}
                        >
                        </EditTicketPayModal>

                        <SendTicketModal
                            visibility={this.state.sendTicketModalVisible}
                            ticketPay={this.state.sendingTicketPay}
                            orderPay={this.state.sendingOrderPay}
                            event={this.state.sendingEvent}
                            onHide={() => this.hideSendTicketModal()}
                        >
                        </SendTicketModal>
                    </div>
                </Col>
                {this.state.loader ? <Loader/> : null}
            </section>

        )
    }
}

export default Orders;