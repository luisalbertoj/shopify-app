import React from 'react';
import {
  Banner,
  Card,
  DisplayText,
  Form,
  FormLayout,
  Frame,
  Layout,
  Page,
  PageActions,
  TextField,
  Toast,
} from '@shopify/polaris';
import store from 'store-js';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const UPDATE_PRICE = gql`
  mutation productVariantUpdate($input: ProductVariantInput!) {
    productVariantUpdate(input: $input) {
      product {
        title
      }
      productVariant {
        id
        price
      }
    }
  }
`;

class Envios extends React.Component {
  state = {
    discount: '',
    price: '',
    variantId: '',
    showToast: false,
  };

  componentDidMount() {
    this.setState({ discount: this.itemToBeConsumed() });
  }

  render() {
    const { name, price, discount, variantId } = this.state;

    return (
      <h1>Envios</h1>
    );
  }

  handleChange = (field) => {
    return (value) => this.setState({ [field]: value });
  };

  itemToBeConsumed = () => {
    const item = store.get('item');
    const price = item.variants.edges[0].node.price;
    const variantId = item.variants.edges[0].node.id;
    const discounter = price * 0.1;
    this.setState({ price, variantId });
    return (price - discounter).toFixed(2);
  };
}

export default Envios;
