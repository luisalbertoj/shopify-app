import React from 'react';
import { EmptyState, Layout, Page } from '@shopify/polaris';
import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';
import store from 'store-js';
import ResourceListWithProducts from '../components/ResourceList';
import ProductList from '../components/ProductsList';
import Envios from '../components/Envios';

import axios from 'axios';

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

class Index extends React.Component {
  state = { open: false };
  render() {
    const emptyState = !store.get('ids');

    return (
      <Page>
        <hr></hr>
        <Envios></Envios>
        {cargarServicios()}
        <hr></hr>
        <ProductList></ProductList>
      </Page>
    );
  }
  handleSelection = (resources) => {
    const idsFromResources = resources.selection.map((product) => product.id);
    this.setState({ open: false });
    store.set('ids', idsFromResources);
  };
  cargarServicios = () => {
    axios.get('https://facturacion.enviame.io/api/v1/prices?from_place=Pudahuel&to_place=Quilicura&weight=1',{
      headers: {
        'x-api-key': 'afw6mcptnjy448t227a1vh74lcv36jhz '
      }
     })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

export default Index;