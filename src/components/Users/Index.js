import React, {Component} from 'react';
import {Table} from 'antd';
import {Row, Col, InputGroup, Input, Container, Form, FormGroup, Alert} from 'reactstrap';
import {requestHttp} from '../../services/request.services';
import Loader from '../partials/Loader';
import {DEFAULT_URL} from '../../env'
import EditUserModal from './partials/EditUserModal'
import moment from "moment";


const {Column} = Table;

class Users extends Component {
    editUserModalVisible = false;
    selectedUser = false;

    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            isLogged: false,
            loader: true,
            users: [],
            selectedUser: false,
            all: [],
            token: '',

            /* buscador */
            searchWord: ""
        };
    }

    async componentDidMount() {
        let token = localStorage.getItem('token')
        //let fetch = await requestHttp.requestGet('get_all_by_not_producer/')
        let fetch = await requestHttp.requestGet('get_all_user/')
        if (fetch) {
            let data = fetch.data.reverse();
            await this.setState({
                users: data,
                loader: false,
                token: token,
                all: data,
            })
        } else {
            await this.setState({
                loader: false
            })
        }
    }


    async showEditUserModal(record, index) {
        await this.setState({
            editUserModalVisible: true,
            selectedUser: record
        })
    }

    async hideEditUserModalFail() {
        await this.setState({
            editUserModalVisible: false,
            selectedUser: false
        })
    }

    async hideEditUserModalSuccess(username, firstname, lastname, rut, email,telefono){
        let updatedUsers = this.state.users;
        let index = updatedUsers.indexOf(this.state.selectedUser);
        updatedUsers[index].username = username;
        updatedUsers[index].firstname = firstname;
        updatedUsers[index].lastname = lastname;
        updatedUsers[index].rut = rut;
        updatedUsers[index].email = email;
        updatedUsers[index].telefono = telefono;

        await this.setState({
            editUserModalVisible: false,
            selectedUser: false,
            users: updatedUsers
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
            // {
            //     name: "Id",
            //     id: 3
            // },
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
            await this.searchByUsername();
        }
        if(this.state.searchType === "3"){
            await this.searchById();
        }
    }

    async showAll(){
        await this.setState({
            users: this.state.all
        })
    }

    async searchByRut(){
        let word = this.state.searchWord;
        let inputArray = this.state.all;
        let arr = [];
        for (let i = 0; i < inputArray.length; i++) {
            let rut = inputArray[i].rut;
            if (rut && word.length > 0 && ((rut.substring(0, word.length) === word.toLowerCase()))) {
                arr.push(inputArray[i]);
                this.setState({
                    users: arr
                })
            } else if (word.length === 0) {
                this.setState({
                    users: inputArray
                })
            } else {
                this.setState({
                    users: arr
                })
            }
        }
    }

    async searchByUsername(){
        let word = this.state.searchWord;
        let inputArray = this.state.all;
        let arr = [];
        for (let i = 0; i < inputArray.length; i++) {
            let username = inputArray[i].username;
            if (word.length > 0 && ((username.substring(0, word.length) === word.toLowerCase()))) {
                arr.push(inputArray[i]);
                this.setState({
                    users: arr
                })
            } else if (word.length === 0) {
                this.setState({
                    users: inputArray
                })
            } else {
                this.setState({
                    users: arr
                })
            }
        }
    }

    async searchById(){
        let word = this.state.searchWord;
        let inputArray = this.state.all;
        let arr = [];
        for (let i = 0; i < inputArray.length; i++) {
            let id = inputArray[i].id + "";
            if (word.length > 0 && ((id.substring(0, word.length) === word.toLowerCase()))) {
                arr.push(inputArray[i]);
                this.setState({
                    users: arr
                })
            } else if (word.length === 0) {
                this.setState({
                    users: inputArray
                })
            } else {
                this.setState({
                    users: arr
                })
            }
        }
    }



    render() {
        return (
            <div className="admin-container">
                <Row>
                    <Col xl="7" lg="7" md="12">
                        <h4><img src={require("../../assets/images/iconos/user-color.png")}/>Usuarios</h4>
                        <p>Aquí podrás encontrar la lista de todos los usuarios de la plataforma de Ecopass</p>
                        <br/>
                    </Col>
                </Row>
                <Row>
                    {/**
                    <Col xl="5" lg="5" md="12">
                        <InputGroup className="search-bar"
                                    style={{float: "right", width: "100%", marginBottom: "40px"}}>
                            <Input placeholder="Buscar usuario" type="text"
                                   onChange={(e) => this.handleChange(e.target)}/>
                            <Icon className="icon-light" type="search"/>
                        </InputGroup>
                    </Col>
                     */}
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
                        </section>
                    </Col>
                </Row>
                <Row>
                    <Col xl="12">
                        <div className="table-responsive">
                            <Table dataSource={this.state.users}>
                                <Column title="Email" dataIndex="username" key="username"
                                        render={(text, record, index) => (
                                            <span>
                                            <p>{record.username}</p>
                                        </span>
                                        )}
                                />
                                <Column title="Datos del Usuario" dataIndex="name" key="name"
                                        render={(text, record, index) => (
                                            <span>
                                            <p>
                                                {record.firstname} {record.lastname}
                                                <br/>
                                                {record.rut}
                                            </p>
                                            </span>
                                        )}
                                />
                                <Column title="Contacto"
                                        key="contact"
                                        render={(text, record, index) => (
                                            <span>
                                            <p>{record.email}</p>
                                            <p> {record.telefono} </p>
                                        </span>
                                        )}
                                />
                                <Column title="Tipo / Fecha de Registro" dataIndex="register_date" key="register_date"
                                        render={(text, record, index) => (
                                            <span>
                                                <p> {record.registerType}
                                                    <br></br>
                                                    {moment(record.registerDate).format('DD/MM/YYYY')}</p>
                                            </span>
                                        )}
                                />
                                <Column
                                    title="Configuración"
                                    key="action"
                                    render={(text, record, index) => (
                                        <span>
                                            <button className="transparent-btn" style={{cursor: "pointer"}}
                                                    onClick={(e) => this.showEditUserModal(record)}>Editar</button>
                                            <br/>
                                            <a className="transparent-btn"
                                               href={DEFAULT_URL + "user/id=" + record.id + "?admin=" + this.state.token}
                                               target="_blank">Ingresar
                                            </a>
                                        </span>
                                    )}
                                />
                            </Table>
                        </div>

                        <EditUserModal
                            visibility={this.state.editUserModalVisible}
                            user={this.state.selectedUser}
                            onHideSuccess={(username, firstname, lastname, rut, email,telefono) => this.hideEditUserModalSuccess(username, firstname, lastname, rut, email,telefono)}
                            onHideFail={() => this.hideEditUserModalFail()}
                        >
                        </EditUserModal>
                    </Col>
                </Row>
                {this.state.loader ? <Loader/> : null}
            </div>
        )
    }
}

export default Users;