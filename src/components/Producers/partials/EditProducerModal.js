import {Component} from "react";
import React from 'react'
import {Modal, Button, Icon, notification} from 'antd';
import {FormGroup, Label, Input, Row, Col} from 'reactstrap';
import NumberFormat from "react-number-format";
import {requestHttp} from '../../../services/request.services';
import PhoneInput from 'react-phone-input-2';
import { es as esp } from 'react-phone-input-2/lang/es.json';
import {FormateaRut} from "../../../services/formatters";


class EditProducerModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            firstname: "",
            lastname: "",
            email: "",
            commission: "",
            executive: "",
            producerId: 0,
            producername: "",
            producer: "",
            phone: "",
            producerrut: ""
        }
    }

    async UNSAFE_componentWillReceiveProps(next) {
        let estado = next.visibility;
        let productor = next.producer;


        if (productor) {
            this.setState({
                firstname: productor.users[0].firstname,
                lastname: productor.users[0].lastname,
                rut: productor.users[0].rut,
                email: productor.users[0].email,
                phone: productor.users[0].telefono,
                executive: productor.ejecutivo_de_ventas,
                producerId: productor.id,
                producername: productor.name,
                visible: estado,
                producer: productor,
                producerrut: productor.rut,
                commission: productor.commission*100
            })
        }
    }

    handleOk = async e => {
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
            await this.updateProducer()
        }
        this.clearData();
    };

    async updateProducer() {

        //producer
        let id = this.state.producerId;
        let name = this.state.producername;
        let ejecutivo_de_ventas = this.state.executive;
        let producer_rut = this.state.producerrut;
        let commision = parseFloat(this.state.commission)/100;

        //user
        let username = this.state.producer.users[0].username;
        let firstname =  this.state.firstname;
        let lastname = this.state.lastname;
        let telefono = this.state.phone;
        let user_rut = this.state.rut;
        let email = this.state.email;

        let params = {
            "id": id,
            "name": name,
            "ejecutivo_de_ventas": ejecutivo_de_ventas,
            "rut": producer_rut,
            "commission": commision,
            "users": [
                {
                    "username": username,
                    "firstname": firstname,
                    "lastname": lastname,
                    "telefono": telefono,
                    "rut": user_rut,
                    "email": email
                }
            ],
        };

        let updateProducer = await requestHttp.requestPostToken('producer/update_producer', params);

        if (updateProducer) {
            notification.open({
                message: 'Productor Actualizado',
                description: 'Se han actualizado los datos del productor',
                icon: <Icon type="smile" style={{color: '#108ee9'}}/>,
            });
            this.props.onHideSuccess(id, name, ejecutivo_de_ventas, producer_rut, commision,
                username, firstname, lastname, telefono, user_rut, email)

        } else {
            notification.open({
                message: 'Ha ocurrido un error',
                description: 'Por favor intentar mas tarde',
                icon: <Icon type="sad" style={{color: '#108ee9'}}/>,
            });
        }


    };

    async clearData() {
        await this.setState({
            firstname: "",
            lastname: "",
            rut: "",
            email: "",
            phone: "",
            executive: "",
            producerId: "",
            producername: "",
            visible: "",
            producer: "",
            producerrut: "",
            commission: "",
        })
    }

    handleCancel = e => {
        this.clearData();
        this.props.onHideFail();
    };

    async handleChange(e) {
        if (e.target.name === "rut") {
            let format = FormateaRut(e.target.value);
            await this.setState({
                rut: format
            });
        }
        else if (e.target.name === "producerrut") {
            let format = FormateaRut(e.target.value);
            await this.setState({
                producerrut: format
            });
        }
        else {
            await this.setState({
                [e.target.name]: e.target.value
            });
        }
    }

    async handlePhone(value){
        this.setState({ phone: value })
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
                        <h4> Editar Productor </h4>
                        <h5> Aquí podrás editar los datos de un productor </h5>
                        {this.state.error !== "" ? <p className="error-text">{this.state.error}</p> : null}

                        <FormGroup>
                            <Label>Nombre Empresa</Label>
                            <Input type="text" onChange={(e) => this.handleChange(e)} name="producername"
                                   value={this.state.producername} required/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Rut Empresa</Label>
                            <Input type="text" onChange={(e) => this.handleChange(e)} name="producerrut"
                                   value={this.state.producerrut} required/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Nombre</Label>
                            <Input type="text" onChange={(e) => this.handleChange(e)} name="firstname"
                                   value={this.state.firstname} required/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Apellido</Label>
                            <Input type="text" onChange={(e) => this.handleChange(e)} name="lastname"
                                   value={this.state.lastname} required/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Rut</Label>
                            <Input placeholder="Rut" onChange={(e) => this.handleChange(e)} name="rut" value={this.state.rut} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Email</Label>
                            <Input type="email" name="email" onChange={(e) => this.handleChange(e)} value={this.state.email} required />
                        </FormGroup>
                        <FormGroup>
                            <Label>Teléfono de Contacto</Label>
                            <PhoneInput
                                placeholder="Teléfono de contacto" defaultCountry={'cl'} value={this.state.phone} localization={esp}
                                inputExtraProps={{ name: 'phone', required: true }} onChange={(e) => this.handlePhone(e)}
                                masks={{ cl: '+.. ....-.....' }}  isValid={v => v.length > '6'} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Ejecutivo de Ventas</Label>
                            <Input type="text" name="executive" onChange={(e) => this.handleChange(e)}
                                   value={this.state.executive} required/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Comisión</Label>
                            <NumberFormat value={this.state.commission} suffix={'%'} decimalSeparator={","}
                                          className="form-control" name="commission"
                                          onChange={(e) => this.handleChange(e)}/>
                        </FormGroup>
                    </div>

                </Modal>
            </div>
        );
    };
}

export default EditProducerModal;