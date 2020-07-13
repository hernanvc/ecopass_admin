import {Component} from "react";
import React from 'react'
import {Modal, Button, Icon, notification} from 'antd';
import {FormGroup, Label, Input} from 'reactstrap';
import {requestHttp} from '../../../services/request.services';
import PhoneInput from 'react-phone-input-2';
import {es as esp} from 'react-phone-input-2/lang/es.json';
import {FormateaRut} from "../../../services/formatters";


class EditUserModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            id: false,
            username: "",
            firstname: "",
            lastname: "",
            rut: "",
            email: "",
            telefono: "",
            usuario: "",
            error: "",
        }
    }

    async UNSAFE_componentWillReceiveProps(next) {
        let estado = next.visibility;
        console.log(next);

        if (next) {
            await this.setState({
                visible: estado,
                id: next.user && next.user.id ? next.user.id : "",
                username: next.user && next.user.username ? next.user.username : "",
                usuario: next.user && next.user.username ? next.user.username : "",
                firstname: next.user && next.user.firstname ? next.user.firstname : "",
                lastname: next.user && next.user.lastname ? next.user.lastname : "",
                rut: next.user && next.user.rut ? next.user.rut : "",
                email: next.user && next.user.email ? next.user.email : "",
                telefono: next.user && next.user.telefono ? next.user.telefono : "",
            })
        }
    }

    handleOk = async () => {
        let valido = true;
        let error = "";

        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (this.state.username === "" || !(re.test(String(this.state.username).toLowerCase()))) {
            error += "Ingresa un nombre de usuario valido  \n";
            valido = false
        }

        if (this.state.email === "" || !(re.test(String(this.state.email).toLowerCase()))) {
            error += "Ingresa un email valido  \n";
            valido = false
        }

        if (!valido) {
            window.scrollTo(0, 0);
            this.setState({
                error: error,
            })
        } else {
            this.setState({
                error: "",
            });
            await this.updateUser()

        }
    };

    async updateUser() {
        let id = this.state.id;
        let username = this.state.username;
        let firstname = this.state.firstname;
        let lastname = this.state.lastname;
        let rut = this.state.rut;
        let email = this.state.email;
        let telefono = this.state.telefono;

        let params = {
            "id": id,
            "username": username,
            "rut": rut,
            "firstname": firstname,
            "lastname": lastname,
            "telefono": telefono,
            "email": email
        };

        let request = await requestHttp.requestPostToken('update_normal_user_by_admin', params);


        if (!request.data.error) {
            notification.open({
                message: 'Usuario Actualizado',
                description: 'Se han actualizado el usuario ' + this.state.username,
                icon: <Icon type="smile" style={{color: '#108ee9'}}/>,
            });
            this.props.onHideSuccess(username, firstname, lastname, rut, email,telefono);
        } else {
            notification.open({
                message: 'Ha ocurrido un error',
                description: request.data.mensaje,
                icon: <Icon type="sad" style={{color: '#108ee9'}}/>,
            });
            this.handleCancel()
        }
        await this.clearData();


    };

    handleCancel = async () => {
        await this.clearData();
        this.props.onHideFail()
    };

    async clearData() {
        await this.setState({
            visible: false,
            id: "",
            username: "",
            firstname: "",
            lastname: "",
            rut: "",
            email: "",
            telefono: "",
            usuario: "",
            error: ""
        })
    }

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
                        <h4> Editar Usuario </h4>
                        <h5> Estás editando el usuario <b>{this.state.usuario}</b></h5>
                        {this.state.error !== "" ? <span>{this.state.error.split('\n').map(i => {
                            return <p className="error-text">{i}</p>
                        })}</span> : null}
                        <FormGroup>
                            <Label>Nombre de Usuario</Label>
                            <Input type="email" onChange={(e) => this.handleChange(e)} name="username"
                                   value={this.state.username} required/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Nombres</Label>
                            <Input type="text" onChange={(e) => this.handleChange(e)} name="firstname"
                                   value={this.state.firstname} required/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Apellidos</Label>
                            <Input type="text" onChange={(e) => this.handleChange(e)} name="lastname"
                                   value={this.state.lastname} required/>
                        </FormGroup>
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
                            <Label>Teléfono de Contacto</Label>
                            <PhoneInput
                                placeholder="Teléfono de contacto" defaultCountry={'cl'} value={this.state.telefono}
                                localization={esp}
                                inputExtraProps={{name: 'telefono'}} onChange={(e) => this.handlePhone(e)}
                                masks={{cl: '+.. ....-.....'}} isValid={v => v.length > '6'}/>
                        </FormGroup>
                    </div>

                </Modal>
            </div>
        );
    };
}

export default EditUserModal;