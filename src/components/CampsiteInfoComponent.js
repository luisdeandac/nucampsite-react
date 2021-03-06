import React, { Component, useState } from 'react';
import { Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader,
        Label, Col, Row} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { Fade, Stagger } from 'react-animation-components';
import { useSpring, a } from '@react-spring/web'

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
        this.toggleModal();
        this.props.postComment(this.props.campsiteId, values.rating, values.author, values.text);
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
    const [flipped, set] = useState(false)
    const { transform, opacity } = useSpring({
        opacity: flipped ? 1 : 0,
        transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
        config: { mass: 5, tension: 500, friction: 80 },
      })
    return(
        <div className="col-md-5 m-1"  onClick={() => set(state => !state)}>
                <a.div style={{ opacity: opacity.to(o => 1 - o), transform }}>
                    <img className="col m-1" src={baseUrl + campsite.image} alt={campsite.name} width="450px"/>
                </a.div>
                <a.div  style={{opacity, transform, rotateX: '180deg'}}>
                    <h3>{campsite.name} </h3>
                    <p>{campsite.description}</p>
                </a.div>
        </div>
    )
}

function RenderComments({comments, postComment, campsiteId}) {
    if(comments){
        return(
            <div class="col-md-5 m1">
                <h4>Comments</h4>
                <Stagger in>
                    {
                        comments.map(comment => {
                            return (
                                <Fade in key={comment.id}>
                                    <div>
                                        <p>
                                            {comment.text}<br />
                                            -- {comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}
                                        </p>
                                    </div>
                                </Fade>
                            );
                        })
                    }
                </Stagger>
                <CommentForm campsiteId={campsiteId} postComment={postComment} />
            </div>
        )
    }
    return <div />
}

function CampsiteInfo(props){
    if (props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    if (props.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            </div>
        );
    }
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
                    <RenderComments 
                        comments={props.comments} 
                        postComment={props.postComment}
                        campsiteId={props.campsite.id}
                    />
                </div>
            </div>
        );
    }
    return <div />;
}

export default CampsiteInfo;