import React, { Component } from 'react';
import { Row, Col, FormGroup, Label, Input } from 'reactstrap';
import { Table, Divider, Icon, notification } from 'antd';
import { requestHttp } from '../../services/request.services';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Orders from "../Orders/Index";
import Loader from "../partials/Loader";

const { Column } = Table;

class TicketOrders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            request: 0,
            loader: true,
            requestId: 0,
            tickets: false,
            event_type_id: ''
        }
    }

    async componentDidMount() {
        moment.locale('es');
        let id = this.props.match.params.handle;
        let fetch = await requestHttp.getWithToken('orderPay/event/' + id);
        if (fetch) {
            await this.setState({
                tickets: fetch.data.reverse(),
                loader: false
            })
        }
        else {
            await this.setState({
                loader: false
            })
        }
    }

    render() {
        return (
            this.state.tickets ?
                <Orders tickets={this.state.tickets}/>
                :
                null
        )
    }
}
export default TicketOrders;