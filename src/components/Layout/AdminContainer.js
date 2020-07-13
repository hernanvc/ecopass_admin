import React, { Component } from 'react';
import { Menu, Icon, notification, Button } from 'antd';
import { Link, Redirect } from 'react-router-dom';
import Loader from '../partials/Loader'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    NavItem,
    Container,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    FormGroup,
    Input,
    Label,
} from 'reactstrap';

const { SubMenu } = Menu;

export default class AdminContainer extends React.Component {
    constructor(props) {
        super(props)
        this.toggle = this.toggle.bind(this);
        this.state = {
            collapsed: false,
            isOpen: false,
            default: NaN,
            all_events: [],
            default_event: {},
            user: JSON.parse(localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")) : {},
            isAdmin: true,
            loader: false,
            isLogged: localStorage.getItem("token") ? true : false,
            responsive:false
        };
    }

   async componentDidMount(){
       let token =  localStorage.getItem('token')
       if(!token){
            this.props.history.push('/')
       }
       let WindowWidth = window.innerWidth
        if(WindowWidth < 767){
            await this.setState({
                responsive: true,
                collapsed: true
            })
        }
   }

    
    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    closed = () => {
        this.setState({
            collapsed: true
        });
    }

    async salir() {
        localStorage.clear()
    }


    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        const children = (this.props.children);
        let AdminLayout =
            <div>
                <nav className="nav-sider">
                    <div style={{ width: "100%" }}>
                        <Menu
                            defaultSelectedKeys={['1']}
                            breakpoint="lg"
                            collapsedWidth="0"
                            defaultOpenKeys={['sub1']}
                            selectedKeys={[this.state.test]}
                            mode="inline"
                            inlineCollapsed={this.state.collapsed}>

                            <div className="header-admin">
                                <Link to="/"><img src={require("../../assets/images/logo--white.png")} alt="" className="logo-admin" /></Link>
                            </div>

                            <Menu.Item key="1" onClick={ this.state.responsive ? this.closed : null }>
                                <span>
                                    <img src={require("../../assets/images/iconos/user.png")} alt="" className="icon-menu" />
                                    <Link to="/admin/productores">Productores</Link>
                                </span>
                            </Menu.Item>
                            <Menu.Item key="6" onClick={ this.state.responsive ? this.closed : null }>
                                <span>
                                    <img src={require("../../assets/images/iconos/user.png")} alt="" className="icon-menu" />
                                    <Link to="/admin/usuarios">Usuarios</Link>
                                </span>
                            </Menu.Item>
                            <Menu.Item key="3" onClick={ this.state.responsive ? this.closed : null }>
                                <span>
                                    <img src={require("../../assets/images/iconos/eventos.png")} alt="" className="icon-menu" />
                                    <Link to="/admin/eventos">Eventos Creados</Link>
                                </span>
                                    
                            </Menu.Item>
                            <Menu.Item key="2" onClick={ this.state.responsive ? this.closed : null }>
                                <span>
                                    <img src={require("../../assets/images/iconos/tickets.png")} alt="" className="icon-menu" />
                                    <Link to="/admin/tickets">Tickets</Link>
                                </span>
                            </Menu.Item>
                            <Menu.Item key="5" onClick={ this.state.responsive ? this.closed : null }>
                                    <span>
                                        <img src={require("../../assets/images/iconos/tickets.png")} alt="" className="icon-menu" />
                                        <Link to="/admin/ordenes">Ordenes de pago</Link>
                                    </span>
                            </Menu.Item>
                            <Menu.Item key="10">
                                <Link to="/" onClick={() => this.salir()}>
                                    <span>
                                        <img src={require("../../assets/images/iconos/cerrar_sesion.png")} alt="" className="icon-menu" />
                                        <span>Cerrar sesión</span>
                                    </span>
                                </Link>
                            </Menu.Item>
                        </Menu>
                    </div>
                </nav>
                <div className="layout-admin">
                    <div className="nav-top">
                        <Navbar color="light" light expand="md">
                            <NavbarToggler onClick={this.toggleCollapsed}/>
                            {this.state.responsive ? <Link to="/"><img src={require("../../assets/images/logo.png")} alt="" className="logo-admin" /></Link> : null }
                            <Collapse isOpen={this.state.isOpen} navbar>
                                <Nav className="ml-auto" navbar>
                                    <NavItem>
                                        <Link to="/" className="nav-link" onClick={() => this.salir()}>Cerrar sesión</Link>
                                    </NavItem>
                                    {this.state.responsive ?  <Button type="primary" className="toggle-mobile" onClick={this.toggleCollapsed}>
                                        <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
                                    </Button> : null}
                                </Nav>
                            </Collapse>
                        </Navbar>
                    </div>
                        <Container>
                            {!this.state.loader ? children : <Loader /> }
                        </Container>
                        {!this.state.isLogged ? <Redirect to="" /> : null}

                    <div className="admin-footer text-center">
                        <h6>Todos los derechos reservados &copy; Ecopass 2019</h6>
                    </div>
                </div>
            </div>
        return AdminLayout
    }
}