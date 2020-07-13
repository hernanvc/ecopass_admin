import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Table} from 'antd';
import { Row, Col, InputGroup, Input, Form, FormGroup, } from 'reactstrap';
import { requestHttp } from '../../services/request.services';
import Loader from '../partials/Loader';
import {DEFAULT_URL} from '../../env';
import EditProducerModal from "./partials/EditProducerModal";


const { Column } = Table;

class Producers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            isLogged: false,
            loader: true,
            producers:[],
            all: [],
            token: '',
            producer: false,
            searchWord: ""
        };
    }

    async componentDidMount() {
        let token = localStorage.getItem('token')
        let fetch = await requestHttp.requestGet('producer/')
        if (fetch) {
            let data = fetch.data.reverse()
            await this.setState({
                producers: data,
                loader: false,
                token: token,
                all: data,
            })
        }
        else {
            await this.setState({
                loader: false
            })
        }
    }

    async handleChange(data){
        let inputArray = this.state.all;
        let arr =[];
        for (let i=0; i < inputArray.length; i++) {
            if ( data.value.length > 0 && (inputArray[i].name.toLowerCase().substring(0, data.value.length) === data.value.toLowerCase())
                ||  (inputArray[i].ejecutivo_de_ventas.toLowerCase().substring(0, data.value.length) === data.value.toLowerCase())) {
                arr.push(inputArray[i])
                this.setState({
                    producers: arr
                })
            }
            else if(data.value.length === 0){
                this.setState({
                    producers: inputArray
                })
            }
            else {
                this.setState({
                    producers: arr
                })
            }
        }
    }

    async showModal (e, producer){
        await this.setState({
            visible: true,
            producer: producer,
        });
    }

    async hiderEditProducerModalFail() {
        await this.setState({
            visible: false,
            producer: false
        })
    }

    async hideEditProducerModalSuccess(id, name, ejecutivo_de_ventas, producer_rut, commision, username, firstname, lastname, telefono, user_rut, email){
        console.log(id);
        console.log(name);

        let updatedProducers = this.state.producers;
        let index = updatedProducers.indexOf(this.state.producer);

        updatedProducers[index].name = name;
        updatedProducers[index].rut = producer_rut;
        updatedProducers[index].ejecutivo_de_ventas = ejecutivo_de_ventas;
        updatedProducers[index].commission = commision;


        await this.setState({
            visible: false,
            producer: false,
            producers: updatedProducers
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
                name: "Nombre",
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

    async handleSubmit(e){
        e.preventDefault();
        if(this.state.searchType === "0"){
            await this.showAll();
        }
        if(this.state.searchType === "1"){
            await this.searchByRut();
        }
        if(this.state.searchType === "2"){
            await this.searchById();
        }
        if(this.state.searchType === "3"){
            await this.searchByUsername();
        }
    }

    async showAll(){
        await this.setState({
            producers: this.state.all
        })
    }

    async searchByRut(){
        let word = this.state.searchWord;
        let inputArray = this.state.all;
        let arr = [];
        for (let i = 0; i < inputArray.length; i++) {
            let rut = inputArray[i].users.length > 0 ? inputArray[i].users[0].rut : inputArray[i].name;;
            if (rut && word.length > 0 && ((rut.substring(0, word.length) === word.toLowerCase()))) {
                arr.push(inputArray[i]);
                this.setState({
                    producers: arr
                })
            } else if (word.length === 0) {
                this.setState({
                    producers: inputArray
                })
            } else {
                this.setState({
                    producers: arr
                })
            }
        }
    }

    async searchByUsername(){
        let word = this.state.searchWord;
        let inputArray = this.state.all;
        let arr = [];
        for (let i = 0; i < inputArray.length; i++) {
            let username = inputArray[i].users.length > 0 ? inputArray[i].users[0].firstname : inputArray[i].name;
            username = username.toLowerCase()
            if (word.length > 0 && ((username.substring(0, word.length) === word.toLowerCase()))) {
                arr.push(inputArray[i]);
                this.setState({
                    producers: arr
                })
            } else if (word.length === 0) {
                this.setState({
                    producers: inputArray
                })
            } else {
                this.setState({
                    producers: arr
                })
            }
        }
    }

    async searchById(){
        let word = this.state.searchWord;
        let inputArray = this.state.all;
        let arr = [];
        for (let i = 0; i < inputArray.length; i++) {
            let id = inputArray[i].users.length > 0 ? inputArray[i].users[0].email : inputArray[i].name;
            if (word.length > 0 && ((id.substring(0, word.length) === word.toLowerCase()))) {
                arr.push(inputArray[i]);
                this.setState({
                    producers: arr
                })
            } else if (word.length === 0) {
                this.setState({
                    producers: inputArray
                })
            } else {
                this.setState({
                    producers: arr
                })
            }
        }
    }


    render() {
        return (
            <div className="admin-container">
                <Row>
                    <Col xl="7" lg="7" md="12">
                        <h4><img src={require("../../assets/images/iconos/user-color.png")} />PRODUCTORES</h4>
                        <p>Aquí podrás encontrar la lista de todos los productores de la plataforma de Ecopass</p>
                        <br />
                    </Col>
                    <Col xl="12">
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
                                        <Input name="searchWord" value={this.state.searchWord} placeholder="Ingrese un Valor"
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
                    </Col>
                    <Col xl="12">
                        <div className="table-responsive">
                            <Table dataSource={this.state.producers}>
                                <Column title="Nombre Productor" dataIndex="name" key="name"
                                    render={(text, record, index) => (
                                        <span>
                                            <p>{record.name}</p>
                                            <p>{record.rut} </p>
                                        </span>
                                    )}
                                />
                                <Column
                                    title="Información"
                                    key="id"
                                    render={(text, record, index) => (
                                        <span>
                                            <p>{record.users.length > 0 ? record.users[0].firstname : "No data"} {record.users.length > 0 ? record.users[0].lastname : ""}</p>
                                            <p>{record.users.length > 0 ? record.users[0].rut : "No data"} </p>
                                            <p>{record.users.length > 0 ? record.users[0].email : "No data"}</p>
                                            <p> {record.users.length > 0 ? record.users[0].telefono : "No data"} </p>
                                        </span>
                                    )}
                                />
                                <Column title="Ejecutivo de Ventas"
                                    key="ejecutive"
                                    render={(text, record, index) => (
                                        <span>
                                            <p>{record.ejecutivo_de_ventas ? record.ejecutivo_de_ventas : "No data"}</p>
                                        </span>
                                    )}
                                />
                                <Column
                                    title="Configuración"
                                    key="action"
                                    render={(text, record, index) => (
                                        <span>
                                            <Link to={{ pathname: "/admin/productor=" + record.id + "/eventos" }} className="second-btn" > <span>Ver eventos</span></Link>
                                            <a className="transparent-btn" href={DEFAULT_URL + "producer/id=" + record.id + "?admin=" + this.state.token } target="_blank">Ingresar</a>
                                            <button className="transparent-btn" onClick={(e) => this.showModal(e, record)}> Editar</button>
                                        </span>
                                    )}
                                />
                            </Table>
                            <EditProducerModal
                                visibility={this.state.visible}
                                producer={this.state.producer}
                                onHideSuccess={(id, name, ejecutivo_de_ventas, producer_rut, commision, username, firstname, lastname, telefono, user_rut, email) =>
                                    this.hideEditProducerModalSuccess(id, name, ejecutivo_de_ventas, producer_rut, commision, username, firstname, lastname, telefono, user_rut, email)}
                                onHideFail={() => this.hiderEditProducerModalFail()}
                            >
                            </EditProducerModal>
                        </div>
                        </Col>
                    {this.state.loader ? <Loader /> : null}
                </Row>
            </div>
        )
    }
}
export default Producers;