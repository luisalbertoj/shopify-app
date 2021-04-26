import React from 'react';
import gql from 'graphql-tag';
import { Query, useMutation } from 'react-apollo';
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
                value
              }
            }
          }
        }
      }
    }
  }
`;

class ProductList extends React.Component {
  static contextType = Context;
  

  render() {
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
      <Query query={GET_PRODUCTS_BY_ID}>
        {({ data, loading, error }) => {
          if (loading) return <div>Loading…</div>;
          if (error) return <div>{error.message}</div>;
          console.log(data);
          if(data) {
          return (
            <Card>
              <ResourceList
                showHeader
                resourceName={{ singular: 'Product', plural: 'Products' }}
                items={data?.products?.edges}
                renderItem={item => {
                  const media = (
                    <Thumbnail
                      source={
                        item.node.images.edges[0]
                          ? item.node.images.edges[0]?.node.originalSrc
                          : ''
                      }
                      alt={
                        item.node.images.edges[0]
                          ? item.node.images.edges[0]?.node.altText
                          : ''
                      }
                    />
                  );
                  const price = 123;
                  return (
                    <ResourceList.Item
                      id={item.node.id}
                      media={media}
                      accessibilityLabel={`View details for ${item.node.title}`}
                      onClick={() => {
                        store.set('item', item);
                        redirectToProduct();
                      }}
                    >
                      <Stack>
                        <Stack.Item fill>
                          <h3>
                            <TextStyle variation="strong">
                              {item.node.title}
                            </TextStyle>
                          </h3>
                        </Stack.Item>
                        <Stack.Item>
                            <label htmlFor="Width" className="form-label">Width</label>
                            <input type="number" className="form-control" id={"width"+item.node.id}/>
                        </Stack.Item>
                        <Stack.Item>
                            <label htmlFor="Height" className="form-label">Height</label>
                            <input type="number" className="form-control" id={"height"+item.node.id}/>
                        </Stack.Item>
                        <Stack.Item>
                            <label htmlFor="weight" className="form-label">weight</label>
                            <input type="number" className="form-control" id={"weight"+item.node.id} />
                        </Stack.Item>
                        <Stack.Item>
                            <button onClick={()=> {
                              let width = document.getElementById('width'+item.node.id);
                              let height = document.getElementById('height'+item.node.id);
                              let weight = document.getElementById('weight'+item.node.id);
                              this.updateProducts(item, width, height, weight)
                              }} type="button" className="btn btn-danger">Actualizar</button>
                        </Stack.Item>
                      </Stack>
                    </ResourceList.Item>
                  );
                }}
              />
            </Card>
          );
        } 
        }}
      </Query>
    );
  }
  updateProducts(item, width, height, weight) {
      const [toggleTodoMutation] = useMutation(UPDATE_PRODUCT);
      const toggleTodoMutation = {
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
        optimisticResponse: true,
      };
  }
}

export default ProductList;
