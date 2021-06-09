import React, {useCallback, useState} from 'react';
import { Context } from '@shopify/app-bridge-react';
import axios from 'axios';


const List = (props) => (
  <ul>
      {
          props.items.map((item, i) => {
              return <li key={i}>{item.name}</li>
          })
      }
  </ul>
)

class Envios extends React.Component {

  static contextType = Context;

  constructor() {
    super();
    this.state = { 
        done: false,
        items: []
    };
}

componentDidMount() {
    /* fetch('https://facturacion.enviame.io/api/v1/prices?from_place=Pudahuel&to_place=Quilicura&weight=1', { 
      method: 'get', 
      headers: new Headers({
        'x-api-key': 'afw6mcptnjy448t227a1vh74lcv36jhz',
        'Content-Type': 'application/json'
      })
    })
    .then(result=>result.json())
    .then(items=>this.setState({
      done: true,
      items: items.data
    }))
    .catch(() => {
    }); */
    
    axios.get('https://facturacion.enviame.io/api/v1/prices?from_place=Pudahuel&to_place=Quilicura&weight=1',{
        headers: {
          'Accept': 'application/json',
          'x-api-key': 'afw6mcptnjy448t227a1vh74lcv36jhz'
        }
        })
        .then(items=> {
          console.log(items);
          this.setState({
          done: true,
          items: items.data
          });
        })
        .catch((error) => {
        });
}
render() {
  return(
      <div>
          {this.state.done && this.state.items.isArray() ? (
              <List items={this.state.items} />
          ) : (
              <p>Cargando Servicios......</p>
          )}
      </div>
  )
}
}

export default Envios;
