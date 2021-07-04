import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader,
        Label, Col, Row} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import CardTitle from 'reactstrap/lib/CardTitle';

const required = val => val && val.length;
const maxLength = len => val => !val || (val.length <= len);
const minLength = len => val => val && (val.length >= len);
const isNumber = val => !isNaN(+val);

class CommentForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            rating: '',
            author: '',
            text: '',
            touched:{
                rating: false,
                author: false,
                text: false
            }
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleSubmit(values) {
        console.log('Current state is: ' + JSON.stringify(values));
        alert('Current state is: ' + JSON.stringify(values));
        this.toggleModal();
    }

    render(){
        return(
            <React.Fragment>
                <Button className="fa fa-lg fa-pencil"  outline onClick={this.toggleModal} > Submit Comment</Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>
                        Submit Comment
                    </ModalHeader>
                    <LocalForm onSubmit={this.handleSubmit}>
                        <Row className="form-group">
                            <Col md={{size: 10, offset: 1}}>
                            <Label htmlFor="rating" md={2}>Rating</Label>
                            <Control.select 
                                model=".rating" 
                                id="rating" 
                                name="rating" 
                                className="form-control"
                                validators={{
                                    required,
                                    isNumber
                                }}>
                                    <option value="none" selected disabled hidden>Rate</option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </Control.select>
                                <Errors
                                        className="text-danger"
                                        model=".rating"
                                        show="touched"
                                        component="div"
                                        messages={{
                                            required: 'Required',
                                            isNumber: 'Select Rating 1 - 5'
                                        }}
                                />
                            </Col>
                        </Row>
                        <Row className="form-group">
                            <Col md={{size: 10, offset: 1}}>
                            <Label htmlFor="author" md={2}>Name</Label>
                                <Control.text 
                                    model=".author" 
                                    id="author" 
                                    name="author"
                                    placeholder="Name"
                                    className="form-control"
                                    validators={{
                                        required, 
                                        minLength: minLength(2),
                                        maxLength: maxLength(15)
                                    }}
                                />
                                <Errors
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        component="div"
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be at least 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                    />
                            </Col>                        
                        </Row>
                        <Row className="form-group">
                            <Col md={{size: 10, offset: 1}}>
                            <Label htmlFor="text" md={2}>Comment</Label>
                                <Control.textarea 
                                    model=".text" 
                                    id="text" 
                                    name="text"
                                    rows="6"
                                    className="form-control"
                                    validators={{
                                        required, 
                                        minLength: minLength(2)
                                    }}
                                />
                                <Errors
                                    className="text-danger"
                                    model=".text"
                                    show="touched"
                                    component="div"
                                    messages={{
                                        required: 'Required',
                                        minLength: 'Please write a comment'
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row className="form-group">
                            <Col md={{size: 10, offset: 1}}>
                                <Button type="submit" color="primary">
                                    Submit
                                </Button>
                            </Col>
                        </Row>
                    </LocalForm>
                </Modal>
            </React.Fragment>
        )
    }
}


function RenderCampsite({campsite}){
    return(
        <div class="col-md-5 m-1">
            <Card>
                <CardImg top src={campsite.image} alt={campsite.name} />
                <CardBody>
                    <CardTitle>{campsite.name}</CardTitle>
                    <CardText>{campsite.description}</CardText>
                </CardBody>
            </Card>
        </div>
    )
}

function RenderComments({comments}){
    if(comments){
        return(
            <div class="col-md-5 m1">
                <h4>Comments</h4>
                {comments.map(comment => {
                    return (
                    <div>
                        <p key={comment.id}>{comment.text}</p>
                        <p key={comment.id}>-- {comment.author}</p>
                        <p>{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}</p>
                    </div>
                )})}
                <CommentForm />
            </div>
        )
    }
    return <div />
}

function CampsiteInfo(props){
    if(props.campsite){
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <h2>{props.campsite.name}</h2>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <RenderCampsite campsite={props.campsite} />
                    <RenderComments comments={props.comments} />
                </div>
            </div>
        );
    }
    return <div />;
}

export default CampsiteInfo;