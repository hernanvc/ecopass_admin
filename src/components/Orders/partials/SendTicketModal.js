import {Component} from "react";
import React from 'react'
import {Modal, Button, Icon, notification} from 'antd';
import {FormGroup, Input} from 'reactstrap';
import {requestHttp} from '../../../services/request.services';


class sendTicketModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            orderPay: false,
            ticketPay: false,
            email: "",
            error: ""
        }
    }

    async UNSAFE_componentWillReceiveProps(next) {
        await this.setState({
            visible: next.visibility,
            orderPay: next.orderPay,
            ticketPay: next.ticketPay,
            email: next.orderPay.email
        })

    }

    handleOk = async () => {
        let valido = true;
        let error = "";
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
            await this.sendTicket()

        }
    };

    async sendTicket() {
        let params = {
            "id": this.state.ticketPay.id,
            "email": this.state.email,
        };
        let sendEmail = await requestHttp.requestPostToken('ticketPay/resend_ticket', params);

        if (sendEmail) {
            notification.open({
                message: 'Entrada Enviada',
                description: 'Se ha enviado la entrada al correo ' + this.state.email,
                icon: <Icon type="smile" style={{color: '#108ee9'}}/>,
            });
        } else {
            notification.open({
                message: 'Ha ocurrido un error',
                description: 'Por favor intentar mas tarde',
                icon: <Icon type="sad" style={{color: '#108ee9'}}/>,
            });
        }

        await this.clearData();
    };

    handleCancel = async () => {
        this.clearData();
    };

    async clearData() {
        await this.setState({
            visible: false,
            orderPay: false,
            ticketPay: false,
            email: "",
            error: ""
        });
        await this.props.onHide();
    }

    async handleChange(e) {
        await this.setState({
            [e.target.name]: e.target.value
        });
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
                        <h4> Enviar Entrada</h4>
                        <h5> Por favor ingresa un email para enviar la entrada </h5>
                        {this.state.error !== "" ? <p className="error-text">{this.state.error}</p> : null}

                        <FormGroup>
                            <Input type="email" name="email" onChange={(e) => this.handleChange(e)}
                                   value={this.state.email}
                                   required/>
                        </FormGroup>
                    </div>

                </Modal>
            </div>
        );
    }
    ;
}

export default sendTicketModal;