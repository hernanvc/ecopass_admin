import {Component} from "react";
import React from 'react'
import { Modal, Button, Icon, notification } from 'antd';
import { FormGroup, Label, Input, Row, Col } from 'reactstrap';
import NumberFormat from "react-number-format";
import { requestHttp } from '../../../services/request.services';


class CommissionModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            commission: "",
            eventId: "",
            event: "",
        }
    }
    async UNSAFE_componentWillReceiveProps(next){
        let estado = next.visibility;
        let evento = next.eventId;


        if (evento) {
            await requestHttp.requestGet('event/' + evento).then((data) => {
                this.setState({
                    commission: data.data.commission*100+"%",
                    eventId: data.data.id,
                    event: data.data
                })
            })
        }

        await this.setState({
            visible: estado

        })
    }

    showModal = (e) => {
        this.setState({
            visible: true,
        });
    };

    handleOk = async e => {
        let valido = true;
        let error = "";
        if (this.state.commission === "") {
            error += "Debes ingresar un valor\n";
            valido = false
        }
        if (!valido) {
            window.scrollTo(0, 0);
            this.setState({
                error: error,
            })
        }

        else {
            this.setState({
                error: "",
            });
            await this.updatePercent()

        }
    };

    async updatePercent () {
        let id = this.state.eventId;
        let commission = this.state.commission.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "")/100;
        if (id !== 0) {
            let params = {
                "id": this.state.event.id,
                "name": this.state.event.name,
                "place_event": this.state.event.place_event,
                "address": this.state.event.address,
                "background_color": this.state.event.background_color,
                "is_galery": this.state.event.is_galery,
                "description": this.state.event.description,
                "init_date": this.state.event.init_date,
                "enddate": this.state.event.enddate,
                "init_hour": this.state.event.init_hour,
                "end_hour": this.state.event.end_hour,
                "privacy": this.state.event.privacy,
                "isdefault": this.state.event.isdefault,
                'city': this.state.event.city,
                'country': this.state.event.country,
                "is_active": this.state.event.is_active,
                "video": !this.state.event.video,
                "categories": this.state.event.categories,
                "producer": this.state.event.producer,
                "eventDesing": this.state.event.eventDesing,
                "pixel_facebook": this.state.event.pixel_facebook,
                "commission": commission
            };

            let changeComission = await requestHttp.requestPostToken('event/change_comission', params);

            this.setState({
                visible: false,
                commission: "",
                eventId: "",
                event: "",
            });

            if (changeComission) {
                notification.open({
                    message: 'Comisión Actualizada',
                    description: 'Se ha actualizado la comisión del evento',
                    icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
                });
            }
            else {
                notification.open({
                    message: 'Ha ocurrido un error',
                    description: 'Por favor intentar mas tarde',
                    icon: <Icon type="sad" style={{ color: '#108ee9' }} />,
                });
            }
        }

    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    async handleChange (e) {
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
                        <h4> Cambiar la Comisión del Evento </h4>
                        <h5> Aquí puedes cambiar el porcentaje de comisión del evento </h5>
                        {this.state.error !== "" ? <p className="error-text">{this.state.error}</p> : null}
                        <FormGroup>
                            <Label>Ingresa un valor entre 0 y 100.</Label>
                            <NumberFormat value={this.state.commission} suffix={'%'} decimalSeparator={","} className="form-control" name="commission" onChange={(e) => this.handleChange(e)} />
                        </FormGroup>
                    </div>

                </Modal>
            </div>
        );
    };
}

export default CommissionModal;