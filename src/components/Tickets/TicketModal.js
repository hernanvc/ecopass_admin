import React, { Component } from 'react';
import { Modal, Button, Icon, notification } from 'antd';
import NumberFormat from 'react-number-format';
import { FormGroup, Label, Input, Row, Col } from 'reactstrap';
import DatePicker from "react-datepicker";
import es from 'date-fns/locale/es';
import moment from 'moment';
import { requestHttp } from '../../services/request.services';

class TicketModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            is_hidden: false,
            visible: false,
            name: "",
            description: "",
            hasdescription: false,
            haslimited: false,
            startDate: new Date(),
            endDate: new Date(),
            open: false,
            personalize: false,
            soldout: false,
            limit: "",
            unique: false,
            price: "",
            price_ticket: "",
            stock: 0,
            cargo_servicio: "",
            commission: 0,
            comissioned: "",
            loader: false,
            error: "",
            config: false,
            id: 0,
            stock_acquired: 0,
            onEdit: false,
            event_id: 0,
            event_type_id: '',
            type: "",
            tipo: 0,
            
        }
    }

    async UNSAFE_componentWillReceiveProps(next) {
        let estado = next.visibility
        let ticket = next.ticket
        let evento = next.event
        let ev_init_date = next.ev_init_date
        let ev_end_date = next.ev_end_date

        let ticket_type = 0
        if (ticket && ticket.tipo === 3) {
            ticket_type = "pagado"
        }
        else if (ticket && ticket.tipo === 4) {
            ticket_type = "cortesia"
        }
        else {
            ticket_type = "gratuito"
        }
        await this.setState({
            ev_init_date: ev_init_date,
            ev_end_date: ev_end_date,
            event_id: evento ? evento : 0,
            visible: estado,
            name: ticket && ticket.name ? ticket.name : "",
            description: ticket && ticket.description ? ticket.description : "",
            hasdescription: ticket && ticket.hasdescription ? ticket.hasdescription : false,
            is_hidden: ticket && !ticket.is_active ? true : false,
            haslimited: ticket && ticket.haslimited ? ticket.haslimited : false,
            startDate: ticket && ticket.init_date ? ticket.init_date : new Date(),
            endDate: ticket && ticket.end_date ? ticket.end_date : new Date(),
            open: ticket && ticket.open ? ticket.open : false,
            personalize: ticket && ticket.personalize ? ticket.personalize : false,
            stock_acquired: ticket && ticket.stock_acquired ? ticket.stock_acquired: 0,
            soldout: ticket && ticket.is_outofstock  ? true : false,
            limit: ticket && ticket.limit ? ticket.limit : "",
            unique: ticket && ticket.unique ? ticket.unique : false,
            price: ticket && ticket.price ? ticket.price : "",
            price_ticket: ticket && ticket.price ? ticket.price : "",
            type: ticket_type,
            tipo: ticket && ticket.tipo ?  ticket.tipo : 0 ,
            stock: ticket && ticket.stock ? ticket.stock : 0,
            cargo_servicio: ticket && ticket.is_producer_commision ? "productor" : "usuario",
            commission: ticket && ticket.commission ? ticket.commission : 0,
            comissioned: ticket  ? (ticket.price + ticket.commission) : "",
            priority: ticket && ticket.priority ? ticket.priority : 0,
            //loader: ticket ? false : true,
            id: ticket && ticket.id ? ticket.id : 0,
            onEdit: ticket ? true : false
        })

        if (evento) {
            await requestHttp.requestGet('event/' + evento).then((data) => {
                this.setState({
                    event_type_id: data.data.categories[0].id,
                })
            })
        }

        if (ev_init_date && ev_end_date) {
            await this.setState({
                startDate: ev_init_date,
                endDate: ev_end_date
            })
        }
    }


    showModal = (e) => {
        this.setState({
            visible: true,
        });
    };

    handleOk = async e => {
        this.setState({
            loader: true
        })
        let valido = true
        let error = ""
        if (this.state.name === "") {
            error += "Ingresa el nombre del ticket \n"
            valido = false
        }
        if (this.state.type === "") {
            error += "Selecciona el tipo de ticket \n"
            valido = false
        }
        if (this.state.stock < 1) {
            error += "Ingresa una cantidad de tickets \n"
            valido = false
        }
        if (!valido) {
            window.scrollTo(0, 0)
            this.setState({
                error: error,
                loader: false
            })
        }
        else {
            this.setState({
                error: "",
                loader: false
            })
            await this.SendTicket()
        }
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    async handleChange(e) {
        let target = e.target.name
        await this.setState({
            [e.target.name]: e.target.value
        })
        if (target === "cargo_servicio" && this.state.cargo_servicio === "usuario" && this.state.price_ticket !== "") {
            let abono = typeof this.state.price_ticket === 'string' ? this.state.price_ticket.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "") : this.state.price_ticket
            let pay = parseInt(abono) * 0.12;
            await this.setState({
                comissioned: parseInt(abono) + pay,
                commission: pay
            })
        }
        else if (target === "cargo_servicio" && this.state.cargo_servicio === "productor" && this.state.price_ticket !== "") {
            let abono = typeof this.state.price_ticket === 'string' ? this.state.price_ticket.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "") : this.state.price_ticket
            let pay = parseInt(abono) * 0.12;
            await this.setState({
                comissioned: parseInt(abono),
                commission: 0,
            })
        }
    }

    handleCheck(e, value) {
        this.setState({
            [e.target.name]: value
        })
    }


    selectDate(date) {
        this.setState({
            startDate: date,
        });
    }

    selectSecondDate(date) {
        this.setState({
            endDate: date,
        });
    }

    toggleConfig() {
        this.setState({
            config: !this.state.config
        })
    }

    async SendTicket() {
        this.setState({
            loader: true
        })
        let ticket_type = 0
        if (this.state.type === "pagado") {
            ticket_type = 3
        }
        else if (this.state.type === "cortesia") {
            ticket_type = 4
        }
        else {
            ticket_type = 5
        }

        if (this.state.id !== 0) {
            var params = {
                "id": this.state.id,
                "description": this.state.hasdescription ? this.state.description : "",
                "name": this.state.name,
                "stock": this.state.stock,
                "price": typeof this.state.price_ticket === "string" ? this.state.price_ticket.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "") : parseInt(this.state.price_ticket),
                "init_date": this.state.startDate,
                "end_date": this.state.endDate,
                "limit_by_for_user": this.state.haslimited ? this.state.limit : 0,
                "commission": this.state.commission ? this.state.commission : 0,
                "is_producer_commision": this.state.cargo_servicio === "productor" ? true: false,
                "is_conference": this.state.event_type_id === 4 ? true : false,
                'is_active': !this.state.is_hidden ,
                "is_outofstock": this.state.soldout,
                'priority': this.state.priority,
                "stock_acquired": this.state.stock_acquired,
                "tipoTicket": {
                    "id": ticket_type
                },
                "tipo": ticket_type,
                "event": {
                    "id": this.state.event_id
                }
            }
            let putTicket = await requestHttp.update('ticket', params)
            if (putTicket) {
                let ticket_type = 0
                if (this.state.type && this.state.type.toLowerCase() === "pagado") {
                    ticket_type = 3
                }
                else if (this.state.type && this.state.type.toLowerCase() === "cortesia") {
                    ticket_type = 4
                }
                else {
                    ticket_type = 5
                }
                let params = {
                    name: this.state.name,
                    description: this.state.description,
                    hasdescription: this.state.hasdescription,
                    is_active: !this.state.is_hidden,
                    haslimited: this.state.haslimited,
                    open: this.state.open,
                    personalize: this.state.personalize,
                    soldout: this.state.soldout,
                    limit: this.state.limit,
                    price: this.state.price,
                    stock_acquired: this.state.stock_acquired,
                    price_ticket: this.state.price_ticket,
                    type: this.state.type,
                    tipo: ticket_type,
                    stock: this.state.stock,
                    startDate: this.state.startDate,
                    endDate: this.state.endDate,
                    commission: this.state.commission,
                    unique: this.state.unique,
                    cargo_servicio: this.state.cargo_servicio,
                    id: this.state.id,
                    onEdit: this.state.onEdit,
                }
                this.props.onClick(params)
                this.setState({
                    visible: false,
                    name: "",
                    description: "",
                    hasdescription: false,
                    is_hidden: this.state.is_hidden,
                    haslimited: false,
                    startDate: new Date(),
                    endDate: new Date(),
                    open: false,
                    personalize: false,
                    soldout: false,
                    limit: "",
                    price: "",
                    price_ticket: "",
                    unique: false,
                    type: "",
                    tipo: this.state.tipo,
                    stock: 0,
                    cargo_servicio: "",
                    commission: 0,
                    comissioned: "",
                    id: 0,
                    onEdit: false,
                    loader: false
                })
                notification.open({
                    message: 'Ticket actualizado',
                    description: 'Se ha actualizado el ticket',
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
        else {
            var params =
            {
                "description": this.state.hasdescription ? this.state.description : "",
                "name": this.state.name,
                "stock": this.state.stock,
                "price": typeof this.state.price_ticket === "string" ? this.state.price_ticket.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "") : parseInt(this.state.price_ticket),
                "init_date": this.state.startDate,
                "end_date": this.state.endDate,
                "limit_by_for_user": this.state.haslimited ? this.state.limit : 0,
                "commission": this.state.commission ? this.state.commission : 0,
                "is_producer_commision": this.state.cargo_servicio === "productor" ? true: false,
                "is_conference": this.state.event_type_id === 4 ? true : false,
                "is_active":  !this.state.is_hidden,
                "is_outofstock": this.state.soldout,
                "stock_acquired": 0,
                "tipoTicket": {
                    "id": ticket_type
                },
                "tipo": ticket_type,
                "event": {
                    "id": this.state.event_id
                }
            }
            let saveTicket = await requestHttp.createEvent('ticket', params)
            if (saveTicket) {
                await this.setState({
                    loader: false,
                    id: saveTicket.data.id
                })
                let ticket_type = 0
                if (this.state.type && this.state.type.toLowerCase() === "pagado") {
                    ticket_type = 3
                }
                else if (this.state.type && this.state.type.toLowerCase() === "cortesia") {
                    ticket_type = 4
                }
                else {
                    ticket_type = 5
                }
                let params = {
                    name: this.state.name,
                    description: this.state.description,
                    hasdescription: this.state.hasdescription,
                    is_active: !this.state.is_hidden,
                    haslimited: this.state.haslimited,
                    open: this.state.open,
                    personalize: this.state.personalize,
                    soldout: this.state.soldout,
                    limit: this.state.limit,
                    price: this.state.price,
                    stock_acquired: this.state.stock_acquired,
                    price_ticket: this.state.price_ticket,
                    type: this.state.type,
                    tipo: ticket_type,
                    stock: this.state.stock,
                    startDate: this.state.startDate,
                    endDate: this.state.endDate,
                    commission: this.state.commission,
                    unique: this.state.unique,
                    cargo_servicio: this.state.cargo_servicio,
                    id: this.state.id,
                    onEdit: this.state.onEdit
                }
                this.props.onClick(params)
                this.setState({
                    visible: false,
                    name: "",
                    description: "",
                    hasdescription: false,
                    is_hidden: this.state.is_hidden,
                    haslimited: false,
                    startDate: new Date(),
                    endDate: new Date(),
                    open: false,
                    personalize: false,
                    soldout: false,
                    limit: "",
                    price: "",
                    price_ticket: "",
                    unique: false,
                    type: "",
                    tipo: this.state.tipo,
                    stock: 0,
                    cargo_servicio: "",
                    commission: 0,
                    id: 0,
                    onEdit: false
                })
                notification.open({
                    message: 'Ticket creado',
                    description: 'Se ha creado un nuevo ticket',
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
    }


    render() {
        return (
            <div>
                <Modal
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText="Guardar"
                    cancelText="Cancelar"
                    footer={[
                        <Button key="back" className="main-btn" onClick={this.handleCancel}>
                            Cancelar
                </Button>,
                        <Button key="submit" className="second-btn" disabled={this.state.loader} onClick={this.handleOk}>
                            Guardar
                </Button>,

                    ]}
                >
                    <div className="step-content">
                        <h4> Configuración (Selecciona las opciones) </h4>
                        <h5> Información del ticket </h5>
                        {this.state.error !== "" ? <p className="error-text">{this.state.error}</p> : null}
                        <FormGroup>
                            <Label>Tipo de ticket</Label>
                            <Input type="select" onChange={(e) => this.handleChange(e)} name="type" value={this.state.type ? this.state.type : ""} required>
                                <option value=""> - Selecciona un tipo - </option>
                                <option value="pagado">Pagado</option>
                                <option value="gratuito">Gratuito</option>
                                <option value="cortesia">Cortesía</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label>Nombre ticket</Label>
                            <Input type="text" onChange={(e) => this.handleChange(e)} name="name" value={this.state.name} required />
                        </FormGroup>
                        {this.state.type === "pagado" ?
                            <div>
                                <FormGroup>
                                    <Label>Precio ticket</Label>
                                    <NumberFormat value={this.state.price_ticket} placeholder="Ej: 10.000" thousandSeparator={"."} prefix={'$'} decimalSeparator={","} className="form-control" name="price_ticket" onChange={(e) => this.handleChange(e)} />
                                    <small>Cargo por servicio web(12%)</small>
                                </FormGroup>
                                <div className="row" style={{ marginTop: "10px" }}>
                                    <div className="col-md-6">
                                        {this.state.price_ticket !== "" ?
                                            <FormGroup>
                                                <Label>¿Quién pagará el cargo por servicio?</Label>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <FormGroup check className="out">
                                                            <Label check className={this.state.cargo_servicio === "productor" ? "active" : ""}>
                                                                <Input type="radio" name="cargo_servicio" checked={this.state.cargo_servicio === "productor" ? true : false} value="productor" onChange={(e) => this.handleChange(e)} />{' '}
                                                                Productor
                                                            </Label>
                                                        </FormGroup>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <FormGroup check className="out">
                                                            <Label check className={this.state.cargo_servicio === "usuario" ? "active" : ""}>
                                                                <Input type="radio" name="cargo_servicio" value="usuario" checked={this.state.cargo_servicio === "usuario" ? true : false} onChange={(e) => this.handleChange(e)} />{' '}
                                                                Usuario
                                                            </Label>
                                                        </FormGroup>
                                                    </div>
                                                </div>
                                            </FormGroup>
                                            : null}
                                    </div>
                                    {(this.state.cargo_servicio === "usuario" || this.state.cargo_servicio === "productor") && this.state.price_ticket != "" ?
                                        <div className="col-md-6">
                                            <FormGroup >
                                                <Label>Usuario Paga</Label>
                                                <NumberFormat value={this.state.comissioned} disabled={true}
                                                    thousandSeparator={"."} prefix={'$'} decimalSeparator={","}
                                                    className="form-control" name="price"
                                                    style={{ borderBottom: "none" }} />
                                                {this.state.cargo_servicio === "usuario" ?
                                                    <small> El productor recibe: <strong> $ {this.state.price_ticket.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} CLP</strong></small>
                                                    :
                                                    <small> El productor recibe: <strong> $ {(this.state.price_ticket - (this.state.price_ticket * 0.12)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") } CLP</strong></small>
                                                }
                                            </FormGroup>
                                        </div>
                                        : null}
                                </div>
                            </div>
                            : null
                        }
                        <FormGroup>
                            <Label>Ingresa una stock de ticket</Label>
                            <Input type="number" onChange={(e) => this.handleChange(e)} name="stock" value={this.state.stock} />
                        </FormGroup>
                        <Row>
                            <Col xl="12"><label>Fecha de Venta</label></Col>
                            <Col xl="6" lg="6">
                                <FormGroup>
                                    <label>Inicio</label>
                                    <DatePicker
                                        maxDate={this.state.ev_end_date}
                                        dateFormat="dd/MM/yyyy"
                                        locale={es}
                                        name="startDate"
                                        selected={this.state.startDate}
                                        onChange={(e) => this.selectDate(e)}
                                        className="form-control"
                                    />
                                </FormGroup>
                            </Col>
                            <Col xl="6" lg="6">
                                <FormGroup>
                                    <label>Término</label>
                                    <DatePicker
                                        maxDate={this.state.ev_end_date}
                                        dateFormat="dd/MM/yyyy"
                                        locale={es}
                                        name="startDate"
                                        selected={this.state.endDate}
                                        onChange={(e) => this.selectSecondDate(e)}
                                        className="form-control"
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <FormGroup>
                            <Label className="blue">Configuración avanzada <button onClick={() => this.toggleConfig()} className="toggle-btn"> <img src={this.state.config ? require("../../assets/images/iconos/arrowup.png") : require("../../assets/images/iconos/arrow.png")} /> </button></Label>
                        </FormGroup>

                        {this.state.config ?
                            <div>
                                <FormGroup check>
                                    <Label check className={this.state.is_hidden ? "active" : ""}>
                                        <Input type="checkbox" value={this.state.is_hidden} name="is_hidden" checked={this.state.is_hidden} onChange={(e) => this.handleCheck(e, !this.state.is_hidden)} />{' '}
                                        Ocultar ticket
                                    </Label>
                                </FormGroup>
                                <FormGroup check >
                                    <Label check className={this.state.soldout ? "active" : ""}>
                                        <Input type="checkbox" value={this.state.soldout} name="soldout" checked={this.state.soldout} onChange={(e) => this.handleCheck(e, !this.state.soldout)} />{' '}
                                        Mostrar ticket como agotado
                                    </Label>
                                </FormGroup>
                                <FormGroup check >
                                    <Label check className={this.state.personalize ? "active" : ""}>
                                        <Input type="checkbox" value={this.state.personalize} name="personalize" checked={this.state.personalize} onChange={(e) => this.handleCheck(e, !this.state.personalize)} />{' '}
                                        Crear link personalizado para cada usuario, el cuál se deshabilita una vez utilizado
                                    </Label>
                                </FormGroup>
                                <FormGroup check>
                                    <Label check className={this.state.open ? "active" : ""}>
                                        <Input type="checkbox" name="open" checked={this.state.open} onChange={(e) => this.handleCheck(e, !this.state.open)} />{' '}
                                        Crear link abierto (No quemable)
                                    </Label>
                                </FormGroup>
                                <FormGroup check>
                                    <Label check className={this.state.hasdescription ? "active" : ""}>
                                        <Input type="checkbox" name="hasdescription" value="true" onChange={(e) => this.handleCheck(e, !this.state.hasdescription)} />{' '}
                                        Agregar descripción del ticket
                                    </Label>
                                </FormGroup>
                                {this.state.hasdescription ?
                                    <FormGroup check>
                                        <Input type="text" name="description" value={this.state.description} onChange={(e) => this.handleChange(e)} />
                                    </FormGroup> :
                                    null
                                }
                                <FormGroup check>
                                    <Label check className={this.state.haslimited ? "active" : ""}>
                                        <Input type="checkbox" name="haslimited" value={this.state.haslimited} checked={this.state.haslimited} onChange={(e) => this.handleCheck(e, !this.state.haslimited)} />{' '}
                                        Usar una cantidad máxima de ticket por venta
                                    </Label>
                                </FormGroup>
                                {this.state.haslimited ?
                                    <FormGroup check>
                                        <Input type="select" onChange={(e) => this.handleChange(e)} name="limit" value={this.state.limit}>
                                            <option value=""> - Selecciona un limite - </option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                        </Input>
                                    </FormGroup> : null}
                            </div> : null}

                    </div>

                </Modal>
            </div>
        );
    }
}

export default TicketModal;