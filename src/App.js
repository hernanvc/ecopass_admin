import React, { Component} from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AdminLayout from './components/Layout/AdminContainer';
import { WrappedLogin } from './components/Login/Login'


import Orders from './components/Orders/Index';

//Productores
import Producers from './components/Producers/Index';
import ProducerEvents from './components/Producers/ProducerEvents';

//usuarios
import Users from './components/Users/Index';

//Eventos
import CreatedEvents from './components/Events/Index';
import EventTickets from './components/Events/EventTickets';
import TicketOrders from './components/Events/EventOrder';
import EventPays from './components/Events/EventPays';
import EventSuscribe from './components/Events/EventSuscribe';
import EventDiscounts from './components/Events/EventDiscounts';

//ticket
import CreatedTickets from './components/Tickets/Tickets';

/*CSS */
import 'antd/dist/antd.css'; 
import './assets/css/font.css'
import './assets/css/bootstrap.min.css'
import './assets/css/animate.css'
import './assets/css/main.css'
import './assets/css/responsive.css';


/* auth */
function App() {
  
    return (
      <Router>
        <Switch>
            <Route exact path="/" component={WrappedLogin} />
            <AdminLayout>

              {/* Productores */}
              <Route exact path="/admin/productores" component={Producers} />
              <Route exact path="/admin/productor=:handle/eventos" component={ProducerEvents} />

              {/* Usuarios */}
              <Route exact path="/admin/usuarios" component={Users} />

              {/*Eventos */}
              <Route exact path="/admin/eventos" component={CreatedEvents} />
              <Route exact path="/admin/evento=:handle/tickets" component={EventTickets} />
              <Route exact path="/admin/evento=:handle/orden" component={TicketOrders} />
              <Route exact path="/admin/evento=:handle/pagos" component={EventPays} />
              <Route exact path="/admin/evento=:handle/suscritos" component={EventSuscribe} />
              <Route exact path="/admin/evento=:handle/descuentos" component={EventDiscounts} />

              {/* Tickets */}
              <Route exact path="/admin/tickets" component={CreatedTickets} />

              <Route exact path="/admin/ordenes" component={Orders} />
           </AdminLayout>
        </Switch>
      </Router> 
    );
}

export default App;

