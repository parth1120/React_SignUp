import React, {Component} from 'react';
import axios from 'axios';
import * as alertify from "alertify.js";
import TagsInput from 'react-tagsinput';
import {Link} from "react-router-dom";


class AddQuestion extends Component {
    constructor(props) {
        super(props);
        this.handelSubmit = this.handelSubmit.bind(this);

    }

    state = {
        title: '',
        description: '',
        tags: [],

        titleRequired: false,
        descriptionRequired: false,
        tagsRequired: false,
        token: ''
    };


    validateTitle = () => {
        if (this.state.title === '') {
            this.setState({titleRequired: true})
        }
    };

    changeTitle = (event) => {

        this.setState({titleRequired: false});
        this.setState({title: event.target.value}, () => {
            this.validateTitle()
        })
    };

    validateDescription = () => {
        if (this.state.description === '') {
            this.setState({descriptionRequired: true})
        }
    };

    changeDescription = (event) => {
        this.setState({descriptionRequired: false});
        this.setState({description: event.target.value}, () => {
            this.validateDescription()
        })
    };

    validateTags = () => {
        if (this.state.tags.length === 0) {
            this.setState({tagsRequired: true})
        }
    };

    changeTags = (tags) => {
        this.setState({tags});
        this.setState({tagsRequired: false}, () => {
            this.validateTags()
        });

    };


    componentDidMount() {
        this.setState({token: localStorage.getItem('token')})
    }


    handelSubmit = async (e) => {
        if (e) e.preventDefault();
        await this.validateTitle();
        await this.validateDescription();
        await this.validateTags();

        if (!this.state.titleRequired && !this.state.descriptionRequired && !this.state.tagsRequired) {

            const body = {
                title: this.state.title,
                description: this.state.description,
                tags: this.state.tags,
            };

            axios.post('http://10.42.0.1:3000/api/question', body,
                {
                    headers: {
                        'Authorization': 'Bearer ' + this.state.token
                    }
                }
            )
                .then((res) => {
                    console.log(res);
                    console.log(res.data);
                    alertify.logPosition('top right').success(res.data.message);
                    this.props.history.push('/');

                })
                .catch((err) => {
                    console.error(err.response);
                    alertify.logPosition('top right').error(err.response.data.message);
                })
        }
    };


    render() {
        return (

            <div className="container">
                <div className="d-flex justify-content-between">
                <div style={{fontSize: "3vh"}}>
                    Add Your Question

                </div>
                    {/*pending --back button functionality*/}
                    <div> <Link className="btn btn-sm btn-outline-danger" to="/">Back</Link></div>
                </div>


                <form>

                    <div className="FormField">
                        <label className="questionField">Title : </label>
                        <input className="FormField__Inputt"
                               placeholder="Enter Title" type="text" onChange={this.changeTitle}
                               value={this.state.title}/>
                        {this.state.titleRequired ? <p className="errorMsg">Title required</p> : null}

                    </div>

                    <div className="FormField">
                        <label className="questionField">Description : </label>
                        <input className="FormField__Inputt"
                               placeholder="Enter Description" type="text" onChange={this.changeDescription}
                               value={this.state.description}/>
                        {this.state.descriptionRequired ? <p className="errorMsg">Description required</p> : null}

                    </div>

                    <div className="FormField">
                        <label className="questionField">Tags : </label>
                        {/*<input className="FormField__Inputt"*/}
                        {/*placeholder="Enter Title" type="text" onChange={this.changeTags}*/}
                        {/*value={this.state.tags}/>*/}
                        <TagsInput className="FormField__Inputt" value={this.state.tags} onChange={this.changeTags}/>
                        {this.state.tagsRequired ? <p className="errorMsg">Tags required</p> : null}

                    </div>
                    <input type="submit" value="Add Question" className="FormField__Button mr-20"
                           onClick={this.handelSubmit}></input>
                </form>

            </div>
        );
    }
}

export default AddQuestion;