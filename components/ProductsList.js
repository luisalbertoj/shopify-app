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

class ProductList extends React.Component {
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
      <Query query={GET_PRODUCTS_BY_ID}>
        {({ data, loading, error }) => {
          if (loading) return <div>Loading…</div>;
          if (error) return <div>{error.message}</div>;
          console.log(data);
          if(data) {
          return (
            <Card>
              <Mutation
                mutation={UPDATE_PRODUCT}
              >
                {(handleSubmit, {error, dataPro}) => {
                  const showError = error && (
                    <Banner status="critical">{error.message}</Banner>
                  );
                  console.log(error);
                  console.log(dataPro);
                  const showToast = dataPro && (
                    <Toast
                      content="Sucessfully updated"
                      onDismiss={() => this.setState({ showToast: false })}
                    />
                  );
                  return(
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
                  let height = 0;
                  let width = 0;
                  let large = 0;

                  for (let i = 0; i < item.node.metafields.edges.length; i++) {
                      height = item.node.metafields.edges[i].node.key==="height"? item.node.metafields.edges[i].node.value : height;
                      width = item.node.metafields.edges[i].node.key==="width"? item.node.metafields.edges[i].node.value : width;
                      large = item.node.metafields.edges[i].node.key==="large"? item.node.metafields.edges[i].node.value : large;
                  }
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
                            <label htmlFor="Ancho en cm" className="form-label">Ancho {height} cm</label>
                            <input type="number" className="form-control" id={"width"+item.node.id}/>
                        </Stack.Item>
                        <Stack.Item>
                            <label htmlFor="Alto en cm" className="form-label">Alto {width} cm</label>
                            <input type="number" className="form-control" id={"height"+item.node.id}/>
                        </Stack.Item>
                        <Stack.Item>
                            <label htmlFor="large en cm" className="form-label">large {large} cm</label>
                            <input type="number" className="form-control" id={"large"+item.node.id} />
                        </Stack.Item>
                        <Stack.Item>
                            <button onClick={()=> {
                              const widthIn = document.getElementById('width'+item.node.id);
                              const heightIn = document.getElementById('height'+item.node.id);
                              const largeIn = document.getElementById('large'+item.node.id);
                              handleSubmit({
                                variables: {
                                  "input" : {
                                    "id": item.node.id,
                                    "metafields": [
                                      {
                                        "namespace": "width",
                                        "key": "width",
                                        "valueType": "INTEGER",
                                        "value": widthIn.value
                                      },
                                      {
                                        "namespace": "height",
                                        "key": "height",
                                        "valueType": "INTEGER",
                                        "value": heightIn.value
                                      },
                                      {
                                        "namespace": "large",
                                        "key": "large",
                                        "valueType": "INTEGER",
                                        "value": largeIn.value
                                      }
                                    ]
                                  }
                                },
                              });
                              }} type="button" className="btn btn-success">Actualizar</button>
                        </Stack.Item>
                      </Stack>
                    </ResourceList.Item>
                  );
                }}
              />
              )}}
              </Mutation>
            </Card>
          );
        } 
        }}
      </Query>
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

export default ProductList;
