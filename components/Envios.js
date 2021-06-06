import React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import {
  Card,
  ResourceList,
  Stack,
  TextStyle,
  Thumbnail,
  FormLayout,
  TextField
} from '@shopify/polaris';
import store from 'store-js';
import { Redirect } from '@shopify/app-bridge/actions';
import { Context } from '@shopify/app-bridge-react';

const UPDATE_PRODUCT= gql`
mutation($input: ProductInput!) {
  productUpdate(input: $input) {
    product {
      metafields(first: 100) {
        edges {
          node {
            id
            namespace
            key
            value
          }
        }
      }
    }
  }
}
`;

const GET_PRODUCTS_BY_ID = gql`
query {
    products(first: 10) {
      edges {
        node {
            title
            handle
            descriptionHtml
            id
            images(first: 1) {
              edges {
                node {
                  originalSrc
                  altText
                }
              }
            }
          metafields(first:10) {
            edges {
              node {
                id,
                key,
                value
              }
            }
          }
        }
      }
    }
  }
`;

class Envios extends React.Component {
  state = {
    height: 0,
    width: 0,
    weight: 0,
    showToast: false,
  };
  static contextType = Context;
  

  render() {
    const { showToast } = this.state;
    const app = this.context;
    const redirectToProduct = () => {
      /* const redirect = Redirect.create(app);
      redirect.dispatch(
        Redirect.Action.APP,
        '/edit-products',
      ); */
    };

    const twoWeeksFromNow = new Date(Date.now() + 12096e5).toDateString();

    return (
        <h1>Servicios de Envio</h1>
    );
  }
  updateProducts(item, width, height, weight) {
      const [toggleTodoMutation] = useMutation(UPDATE_PRODUCT, {
        variables: {
          "input" : {
            "id": item.node.id,
            "metafields": [
              {
                "namespace": "width",
                "key": "width",
                "value": width.value
              },
              {
                "namespace": "height",
                "key": "height",
                "value": height.value
              },
              {
                "namespace": "weight",
                "key": "weight",
                "value": weight.value
              }
            ]
          }
        },
      });
  }
}

export default Envios;
