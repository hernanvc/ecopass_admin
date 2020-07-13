import {Component} from "react";
import React from 'react'
import {Modal, Button, Icon, notification} from 'antd';
import {FormGroup, Label, Input} from 'reactstrap';
import {requestHttp} from '../../../services/request.services';
import PhoneInput from 'react-phone-input-2';
import {es as esp} from 'react-phone-input-2/lang/es.json';
import {FormateaRut} from "../../../services/formatters";


class EditTicketPayModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            name: "",
            id: "",
            rut: "",
            email: "",
            telefono: ""
        }
    }

    async UNSAFE_componentWillReceiveProps(next) {
        let ticketPay = next.ticketPay;
        let estado = next.visibility;

        if (next) {
            await this.setState({
                visible: estado,
                id: ticketPay.id,
                name: ticketPay.name,
                rut: ticketPay.dni,
                email: ticketPay.email,
                telefono: ticketPay.phone,
            })
        }


    }

    handleOk = async () => {
        let valido = true;
        let error = "";
        if (!valido) {
            window.scrollTo(0, 0);
            this.setState({
                error: error,
            })
        } else {
            this.setState({
                error: "",
            });
            await this.updateTicketPay()

        }
    };

    async updateTicketPay() {

        const name = this.state.name;
        const dni = this.state.rut;
        const email = this.state.email;
        const phone = this.state.telefono;

        let params = {
            "id": this.state.id,
            "name": name,
            "dni": dni,
            "email": email,
            "phone": phone
        };

        let request = await requestHttp.requestPostToken('ticketPay/update_by_admin', params);

        this.setState({
            visible: false,
            id: "",
            name: "",
            rut: "",
            email: "",
            telefono: "",
        });

        if (request) {
            notification.open({
                message: 'Ticket Actualizado',
                description: 'Se han actualizado los datos del ticket',
                icon: <Icon type="smile" style={{color: '#108ee9'}}/>,
            });
            this.props.onHideSuccess(name, dni, email, phone);
        } else {
            notification.open({
                message: 'Ha ocurrido un error',
                description: 'Por favor intentar mas tarde',
                icon: <Icon type="sad" style={{color: '#108ee9'}}/>,
            });
            this.handleCancel()
        }



    };

    handleCancel = async () => {
        await this.setState({
            visible: false,
            id: "",
            name: "",
            rut: "",
            email: "",
            telefono: "",
        });
        this.props.onHideFail()
    };

    async handleChange(e) {
        if (e.target.name === "rut") {
            let format = FormateaRut(e.target.value);
            await this.setState({
                rut: format
            });
        } else {
            await this.setState({
                [e.target.name]: e.target.value
            });
        }
    }

    async handlePhone(value) {
        this.setState({telefono: value})
    }


    render() {
        return (
            <div>
                <Modal
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" className="main-btn" onClick={this.handleCancel}>
                            Cancelar
                        </Button>,
                        <Button key="submit" className="second-btn" onClick={this.handleOk}>
                            Guardar
                        </Button>,
                    ]}
                >
                    <div className="step-content">
                        <h4> Editar Registro de Ticket </h4>
                        <h5> Aquí podrás modificar los datos de registro de un Ticket </h5>
                        {this.state.error !== "" ? <p className="error-text">{this.state.error}</p> : null}

                        <FormGroup>
                            <Label>Rut</Label>
                            <Input placeholder="Rut" onChange={(e) => this.handleChange(e)} name="rut"
                                   value={this.state.rut}/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Email</Label>
                            <Input type="email" name="email" onChange={(e) => this.handleChange(e)}
                                   value={this.state.email}/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Nombre Completo</Label>
                            <Input type="text" onChange={(e) => this.handleChange(e)} name="name"
                                   value={this.state.name} required/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Teléfono de Contacto</Label>
                            <PhoneInput
                                placeholder="Teléfono de contacto" defaultCountry={'cl'} value={this.state.telefono}
                                localization={esp}
                                inputExtraProps={{name: 'telefono'}} onChange={(e) => this.handlePhone(e)}
                                masks={{cl: '.... ..... ..'}} isValid={v => v.length > '6'}/>
                        </FormGroup>
                    </div>

                </Modal>
            </div>
        );
    };
}

export default EditTicketPayModal;