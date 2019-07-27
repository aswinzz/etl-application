import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import React from 'react'
import { InstantSearch, Hits,SearchBox} from 'react-instantsearch-dom';
import gql from 'graphql-tag'
import { Query, Mutation } from "react-apollo";
import withData from '../config';
import Head from 'next/head';


import { Button,PageHeader,Tabs,Tab,Panel,Row,Col } from 'react-bootstrap';

const api_key="b73cde9003e11331ad9f5ef0d0f37c1e"
function Book({ hit }) {
  return <div>{hit.title} by {hit.author}</div>;
}

const ADD_BOOK = gql`
  mutation insertBook($title: String!, $author: String!) {
    insert_book(objects:[{
      title: $title,
      author: $author
    }]) {
      returning { id }
    }
  }
`;


class Index extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      title:"",
      refresh:false,
      author:"",
      page:"index",
      key:1
    };
    this.onAuthorChange = this.onAuthorChange.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  onAuthorChange(e){
    console.log(e.target.value);
    this.setState({author:e.target.value});
  }

  onTitleChange(e){
    console.log(e.target.value);
    this.setState({title:e.target.value})
  }
  
  onSubmit(){
    this.setState({page:"search"});
  }

  handleSelect(key) {
    if(key==2){
      this.setState({refresh:true});
    }
    this.setState({ key });
    this.setState({refresh:false});
  }
  
  render () {
    return (
      <div>
        <Head>
          <title>ETL APP</title>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous"/>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous"></link>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/instantsearch.css@7.0.0/themes/algolia-min.css"/>
        </Head>
             <PageHeader>
                BOOK STORE
             </PageHeader>
             <Tabs activeKey={this.state.key}
        onSelect={this.handleSelect} id="uncontrolled-tab-example">
              <Tab eventKey={1} title="Add">
              <Row className="show-grid">
                <Col xs={4} xsOffset={4}>
                <Panel bsStyle="primary">
                <Panel.Heading>
                  <Panel.Title componentClass="h3">Enter details of a book to add to library</Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                Title : &nbsp;&nbsp;
            <input id="title" onChange={(e)=>this.onTitleChange(e)}/>
            <br/>
            <br/>
            Author : &nbsp;&nbsp;
            <input id="author" onChange={(e)=>this.onAuthorChange(e)}/>
            <br/>
            {/* <Button onClick={()=>this.onSubmit()}>save</Button> */}

            <Mutation mutation={ADD_BOOK}>
              {(addbook, {loading, error, data}) => {
                if (data) {
                  console.log(data);
                  // this.forceUpdate();
                  // this.setState({page:"search"});
                }
                if (loading) {
                  return (<span><Button disabled>Loading...</Button>&nbsp;&nbsp;</span>);
                }
                if (error) {
                  return (<span><Button >Try again: {error.toString()}</Button>&nbsp;&nbsp;</span>);
                }
                return (
                  <span>
                    <br/>
                    <Button
                      onClick={(e) => {
                        if (this.state.author === "" || this.state.title==="") {
                          window.alert('Author/Title is empty');
                          return;
                        }
                        addbook({
                          variables: {
                            title: this.state.title,
                            author:this.state.author
                          }})
                      }}>
                      Save
                    </Button>&nbsp;&nbsp;
                  </span>
                );
              }}
            </Mutation>
                </Panel.Body>
              </Panel>
                </Col>
              </Row>
              </Tab>
              <Tab eventKey={2} title="Search">
              <Row className="show-grid">
                <Col xs={8} xsOffset={2}>
                <Panel bsStyle="primary">
                <Panel.Heading>
                  <Panel.Title componentClass="h3"> Search Page</Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                <InstantSearch
                  appId="KCTNN4VJ6O"
                  apiKey={api_key}
                  indexName="demo_serverless_etl_app"
                >
                  <SearchBox />
                  <br/>
                  <Hits hitComponent={Book}/>
                  {/* Search widgets will go there */}
                </InstantSearch>
                </Panel.Body>
              </Panel>
                </Col>
              </Row>
              </Tab>
            </Tabs>
      </div>
    );
  }
}
export default withData(Index);