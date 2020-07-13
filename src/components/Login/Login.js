import React, { Component } from 'react';
import { Alert, Form, Icon, Input, notification } from 'antd';
import { Row, Container, Col, } from 'reactstrap';
import { requestHttp } from '../../services/request.services';
import Loader from '../partials/Loader';

import Logo from '../../assets/images/logo.png'

const FormItem = Form.Item;

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            email: '',
            password: '',
            user_type: '',
            loader: false,
        };
    }
    componentDidMount() {
        let user = this.props.match.params.user
        this.setState({
            user_type: user
        })
        window.scrollTo(0, 0)
    }

    async UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.user !== this.state.user_type) {
            let user = nextProps.match.params.user
            this.setState({
                user_type: user
            })
        }
        window.scrollTo(0, 0)
    }

    handleSubmit = e => {
        e.preventDefault();
        
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                this.setState({
                    loader: true
                })
                let params = {
                    'username': this.state.username,
                    'password': this.state.password
                }
                let request = await requestHttp.requestPost('auth/', params)
                if (request) {
                    if (request.data.token) {
                        await localStorage.setItem("token", request.data.token)
                        await localStorage.setItem("user", JSON.stringify(request.data.user))
                        await localStorage.setItem("auth", JSON.stringify(request.data.authorityList))
                        notification.open({
                            message: 'Sesión iniciada',
                            description:
                                'Bienvenido a Ecopass',
                            icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
                        });
                        this.props.history.push("/admin/productores")
                    }
                } else {
                    this.setState({
                        loader: false
                    })
                    notification.open({
                        message: 'Ha ocurrido un error',
                        description:
                            'Por favor intentar mas tarde',
                        icon: <Icon type="sad" style={{ color: '#108ee9' }} />,
                    });
                }
            }
        });
    };

    handleChange(e) {
        this.setState({
            [e.name]: e.value
        })

    }


    render() {
        const { getFieldDecorator } = this.props.form;
        let form =
            <main>
                <div className="login-layout">
                    {this.state.loader ? <Loader />:""}
                    <Container>
                        <Row>
                            <Col xl={{ size: "4", offset: "4" }} lg={{ size: "4", offset: "4" }} md={{ size: "6", offset: "3" }} sm="12">
                                {this.state.error ?
                                    <Alert message={this.state.error + ', Por favor ingresa a continuación '}
                                        type="warning"
                                        closable /> : null
                                }

                                <Form onSubmit={(e) => this.handleSubmit(e)} className="login-form">
                                    <FormItem>
                                        <img src={Logo} alt="Logo Ecopass" style={{height: "50px", margin: "10px 0px "}}/>
                                    </FormItem>
                                    <FormItem>
                                        {getFieldDecorator('username', {
                                            rules: [{ required: true, message: '¡Ingresa tu usuario!' }],
                                        })(
                                            <Input name="username" onChange={(e) => this.handleChange(e.target)} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Usuario" />
                                        )}
                                    </FormItem>
                                    <FormItem>
                                        {getFieldDecorator('password', {
                                            rules: [{ required: true, message: '¡Ingresa tu contraseña!' }],
                                        })(
                                            <Input name="password" onChange={(e) => this.handleChange(e.target)} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Contraseña" />
                                        )}
                                    </FormItem>
                                    <FormItem>
                                        <button onClick={(e) => this.handleSubmit(e)} className="main-btn" disabled={this.state.loader}>
                                            <span><Icon type="login" /> Ingresar</span>
                                        </button>

                                    </FormItem>
                                </Form>

                            </Col>
                        </Row>
                    </Container>
                </div>
            </main>

        return form
    }
}

export const WrappedLogin = Form.create()(Login);
