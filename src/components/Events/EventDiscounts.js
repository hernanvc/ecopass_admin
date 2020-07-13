import React, { Component } from 'react';
import {Row, Col, Button, Alert,
    Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { Table, Icon, notification } from 'antd';
import { requestHttp } from '../../services/request.services';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import ReactExport from "react-data-export";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const { Column } = Table;

class EventDiscounts extends Component {
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
        let fetch = await requestHttp.requestGet('discount/event/' + id)
        if (fetch) {
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
            if(element.id === e.id){
                position = index
            }
        });
        let arr = this.state.tickets;
        let putTicket = await requestHttp.deleteItem('orderPay/'+ e.id )
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
    renderNoTickets() {
        return <h5 style={{ marginTop: "30px" }}>No hay códigos de descuento disponibles, puedes
                            <Link to={{ pathname: "/admin/tickets/discount/codediscount" }}><span> crear uno aquí</span></Link></h5>
    }

    generaterenderLink(code) {
        return 'ecopass.cl/' + this.state.defaul_event + '/' + code
    }

    copyToClipboard(link) {
        navigator.clipboard.writeText(link);
        this.setState({
            isCopied: '¡Enlace copiado!'
        })
    };

    handleChange(e) {
        this.setState({
            new_stock: e.target.value
        })
    }

    editStock(ticket, index) {
        if (this.state.new_stock !== null && this.state.new_stock !== undefined) {
            let params = {
                "code": ticket.code,
                "end_hour": ticket.end_hour,
                "general": ticket.general,
                "id": ticket.id,
                "ilimitedDate": ticket.ilimitedDate,
                "init_date": ticket.init_date,
                "init_hour": ticket.init_hour,
                "limited_date": ticket.limited_date,
                "name": ticket.name,
                "porcentaje": ticket.porcentaje,
                "stock": this.state.new_stock,
                "stock_ocuped": ticket.stock_ocuped,
                "value": ticket.value,
                "description": ticket.description,
                "isGeneral": ticket.general,
                "isPorcentaje": ticket.porcentaje,
                "isIlimitedDate": ticket.ilimitedDate,
                "event": {
                    "id": this.props.match.params.handle
                },
                "ticketList": ticket.ticketList
            }
            requestHttp.update('discount', params).then(data => {
                let newTicket = this.state.tickets
                newTicket.splice(index, 1, data.data)
                this.setState({
                    editStock: false,
                    tickets: newTicket,
                    new_stock: '',
                    loader: false
                })
                notification.open({
                    message: 'Código de descuento actualizado',
                    description:
                        'Descuento actualizado satisfactoriamente',
                    icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
                });
            }, (error => {
                this.setState({
                    editStock: false,
                    new_stock: '',
                    loader: false
                })
                notification.open({
                    message: 'Ha ocurrido un error',
                    description:
                        'Por favor intentar mas tarde',
                    icon: <Icon type="sad" style={{ color: '#108ee9' }} />,
                });
            }))

        }
    }

    renderModal(title, link) {
        return <Modal isOpen={this.state.modal} toggle={this.toggle}>
            <ModalHeader>{title}</ModalHeader>
            <ModalBody>
                <Alert color="success">
                    <span className="blackTitle">{link}</span>
                    <Button color="success"
                        onClick={() => this.copyToClipboard(link)}
                        style={{ float: "right", marginTop: "-7px" }}
                    >
                        <Icon className="icon-light" type="copy" />
                    </Button>
                </Alert>
                <ModalFooter style={{ display: "block", textAlign: "center" }}>{this.state.isCopied}</ModalFooter>
            </ModalBody>
        </Modal>
    }

    renderOcuped(tickets) {
        let total = 0
        for (let index = 0; index < tickets.length; index++) {
            if (tickets[index].stock_ocuped > 0) {
                total = total + 1
            }
        }
        return total
    }

    outOfStock(ticket, index) {
        Swal.fire({
            title: "¿Agotar stock de Cupones?",
            html: '<p>Agotarás todos los cupones disponibles en este grupo</p>',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.value) {

                this.setState({
                    loader: true
                })

                if (ticket.discounts.length > 1) {
                    let params = []
                    ticket.discounts.forEach((disc, index) => {
                        params.push(
                            {
                                "code": disc.code,
                                "end_hour": disc.end_hour,
                                "general": disc.general,
                                "id": disc.id,
                                "ilimitedDate": disc.ilimitedDate,
                                "init_date": disc.init_date,
                                "init_hour": disc.init_hour,
                                "limited_date": disc.limited_date,
                                "name": disc.name,
                                "porcentaje": disc.porcentaje,
                                "stock": disc.stock,
                                "stock_ocuped": disc.stock,
                                "value": disc.value,
                                "description": disc.description,
                                "isGeneral": disc.general,
                                "isPorcentaje": disc.porcentaje,
                                "isIlimitedDate": disc.ilimitedDate,
                                "event": {
                                    "id": this.props.match.params.handle
                                },
                                "ticketList": disc.ticketList,
                                "discountGroup": {
                                    "id": ticket.id
                                }
                            }
                        )
                    })

                    requestHttp.update('discount/all', params).then(data => {
                        this.setState({
                            loader: false
                        }, () => {
                            this.updateTable();
                        })
                        notification.open({
                            message: 'Código de descuento actualizado',
                            description:
                                'Descuento actualizado satisfactoriamente',
                            icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
                        });
                    }, (error => {
                        this.setState({
                            loader: false
                        })
                        notification.open({
                            message: 'Ha ocurrido un error',
                            description:
                                'Por favor intentar mas tarde',
                            icon: <Icon type="sad" style={{ color: '#108ee9' }} />,
                        });
                    }))


                } else {
                    let params =
                    {
                        "code": ticket.discounts[0].code,
                        "end_hour": ticket.discounts[0].end_hour,
                        "general": ticket.discounts[0].general,
                        "id": ticket.discounts[0].id,
                        "ilimitedDate": ticket.discounts[0].ilimitedDate,
                        "init_date": ticket.discounts[0].init_date,
                        "init_hour": ticket.discounts[0].init_hour,
                        "limited_date": ticket.discounts[0].limited_date,
                        "name": ticket.discounts[0].name,
                        "porcentaje": ticket.discounts[0].porcentaje,
                        "stock": ticket.discounts[0].stock,
                        "stock_ocuped": ticket.discounts[0].stock,
                        "value": ticket.discounts[0].value,
                        "description": ticket.discounts[0].description,
                        "isGeneral": ticket.discounts[0].general,
                        "isPorcentaje": ticket.discounts[0].porcentaje,
                        "isIlimitedDate": ticket.discounts[0].ilimitedDate,
                        "event": {
                            "id": this.props.match.params.handle
                        },
                        "ticketList": ticket.discounts[0].ticketList,
                        "discountGroup": {
                            "id": ticket.id
                        }
                    }

                    requestHttp.update('discount', params).then(data => {
                        this.setState({
                            loader: false
                        }, () => {
                            this.updateTable();
                        })
                        notification.open({
                            message: 'Código de descuento actualizado',
                            description:
                                'Descuento actualizado satisfactoriamente',
                            icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
                        });
                    }, (error => {
                        this.setState({
                            loader: false
                        })
                        notification.open({
                            message: 'Ha ocurrido un error',
                            description:
                                'Por favor intentar mas tarde',
                            icon: <Icon type="sad" style={{ color: '#108ee9' }} />,
                        });
                    }))

                }

            }
        })

    }

    updateTable() {
        let id_event = this.props.match.params.handle
        requestHttp.requestGet('discount/event/' + id_event).then(fetch => {
            this.setState({
                tickets: fetch.data,
                defaul_event: id_event
            })
        }, (error => {
            this.setState({
            })
        })
        )
    }

    render() {
        return (
            <section className="bg-white">
                <Col span={24}>
                    <div className="admin-container">
                        <Row>
                            <Col xl={{ size: 12 }} >
                                <Row>
                                    <Col xl="7" lg="6" md="12">
                                        <h5 className="blue" style={{ marginBottom: "15px" }}>Codigos de descuento</h5>
                                        <p>Muestra todos los códigos de descuento de los eventos</p>
                                        <br/>
                                    </Col>
                                </Row>
                                <Table dataSource={this.state.tickets} className="compra-table table-responsive">
                                        <Column
                                            title="Información"
                                            key={"info"}
                                            render={(text, record, index) => (
                                                <span>
                                                    {record.discounts && record.discounts[0] ? record.discounts[0].name : ""}
                                                </span>
                                            )}
                                        />
                                        <Column
                                            title="Cantidad"
                                            key={"stock"}
                                            render={(text, record, index) => (
                                                <span>
                                                    {record.discounts && record.discounts.length > 1 ?
                                                        <span>
                                                            {record.discounts.length}
                                                        </span>
                                                        :
                                                        <span>
                                                            {record.discounts && record.discounts[0] ? record.discounts[0].stock : ""}
                                                        </span>
                                                    }
                                                </span>
                                            )}
                                        />
                                        <Column title="Utilizados"
                                            key={"stock_ocuped"}
                                            render={(text, record, index) => (
                                                <span>
                                                    {record.discounts && record.discounts.length > 1 ?
                                                        <span>
                                                            {this.renderOcuped(record.discounts)}
                                                        </span>
                                                        :
                                                        <span>
                                                            {record.discounts && record.discounts[0] ? record.discounts[0].stock_ocuped : ""}
                                                        </span>
                                                    }
                                                </span>
                                            )}
                                        />
                                        <Column
                                            key={"out_of_stock"}
                                            render={(text, record, index) => (
                                                record.discounts && record.discounts.length > 1 ?
                                                    this.renderOcuped(record.discounts) === record.discounts.length ?
                                                        <p style={{ color: "red" }}>Agotado</p>
                                                        :
                                                        <Button onClick={() => this.outOfStock(record, index)} outline color="danger">Agotar</Button>
                                                    :
                                                    record.discounts[0].stock_ocuped === record.discounts[0].stock ?
                                                        <p style={{ color: "red" }}>Agotado</p>
                                                        :
                                                        <Button onClick={() => this.outOfStock(record, index)} outline color="danger">Agotar</Button>
                                            )}
                                        />
                                        <Column title="Código"
                                            key={"code"}
                                            render={(text, record, index) => (
                                                <span>
                                                    {record.discounts && record.discounts.length > 1 ?
                                                        <span>
                                                            <ExcelFile filename="Codigos de descuento" element={<button className="transparent-btn" style={{ minWidth: "162px" }} ><span> Descargar Códigos</span></button>}>
                                                                <ExcelSheet data={record.discounts} name="Codigos de descuento">
                                                                    <ExcelColumn label="Nombre codigo" value="name" />
                                                                    <ExcelColumn label="Tipo de descuento" value={(col) => col.porcentaje ? "Porcentaje" : "Monto"} headerCellOptions={{ textAlign: 'center' }} />
                                                                    <ExcelColumn label="Total de descuento" value="value" />
                                                                    <ExcelColumn label="Codigo de descuento" value="code" />
                                                                    {record.discounts[0].ticketList.map((ticket, i) =>
                                                                        <ExcelColumn key={i} label="Ticket al que aplica"
                                                                            value={(col) => col.ticketList ? ticket.name : "Monto"} />
                                                                    )}
                                                                </ExcelSheet>
                                                            </ExcelFile>
                                                        </span> :
                                                        <span>{record.discounts && record.discounts[0] ? record.discounts[0].code : ""}</span>
                                                    }
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
export default EventDiscounts;