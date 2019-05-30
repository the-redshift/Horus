import React from 'react';
import './main.css';
import { withRouter } from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios';
import Modal from 'react-modal';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const objectsRecognition = [
    { value: 'person', label: 'People' },
    { value: 'car', label: 'Car' },
    { value: 'truck', label: 'Truck' },
    { value: 'bus', label: 'Bus' },
    { value: 'motorcycle', label: 'Motorcycle' },
    { value: 'dog', label: 'Dog' },
    { value: 'cat', label: 'Cat' }
];

const camera = [
    { value: '1', label: 'Camera 1' },
    { value: '2', label: 'Camera 2' },
    { value: '3', label: 'Camera 3' }
];


class Main extends React.Component {
    constructor(props) {
        super(props);
        let date = new Date();
        this.state = {
            selectedObjects: [],
            selectedCamera: '',
            isAlertModalOpen: false,
            isReportModalOpen: false,
            formFields: {email: '', objects: [], startDate: date, endDate: date}
        };

        this.handleLogout = this.handleLogout.bind(this);
        this.saveConfiguration = this.saveConfiguration.bind(this);
        this.openAlertModal = this.openAlertModal.bind(this);
        this.closeAlertModal = this.closeAlertModal.bind(this);
    }

    handleLogout() {
        this.props.history.push("/");
    }

    selectObjects = (selectedObjects) => {
        this.setState({ selectedObjects });
        console.log(`Objects selected:`, selectedObjects);
    }

    selectCamera = (selectedCamera) => {
        this.setState({ selectedCamera });
        console.log(`Selected camera:`, selectedCamera);
    }

    saveConfiguration(option, values) {
        if (option === 'camera') {
            console.log(values);
            /*
            axios.post(`url`, { values })
                .then(() => {
                        Alert.success(`${values.label} has been chosen`);
                    })
            */
        } else if (option === 'objects') {
            if (this.state.selectedCamera) {
                console.log(values);
                /*
                axios.post(`url`, { values })
                    .then(() => {
                        Alert.success('Objects configuration sent successfully');
                    })
                */
            } else {
                Alert.error('Please choose camera first');
            }
        }
    }

    openAlertModal() {
        this.setState({isAlertModalOpen: true});
    }

    closeAlertModal() {
        this.setState({isAlertModalOpen: false});
    }

    handleObjects = (objects) => {
        this.setState({ formFields: {
                ...this.state.formFields,
                objects: objects,
            },
        });
    }

    handleDateChange = (dateName, dateValue) => {
        this.setState({
            formFields: {
                ...this.state.formFields,
                [dateName]: dateValue
            }
        })
    }

    inputChangeHandler(e) {
        let formFields = {...this.state.formFields};
        formFields[e.target.name] = e.target.value;
        this.setState({
            formFields
        });
    }


    formHandler(formFields) {
        console.log(formFields);
       /* axios.post('/api/register', formFields)
            .then(() => {
                Alert.success('Configuration options sent successfully');
            })
            .catch(() => {
                Alert.error('Error occurred while sending configuration options');
            });*/
    }

render() {
    const { selectedObjects, selectedCamera } = this.state;
    const { email, objects, startDate, endDate } = this.state.formFields;

return (
    <div className="container">

	<div className="header">
        <div>
            <button type="button" className="btn btn-default btn-conf" onClick={this.openAlertModal}>
                <span><i className="fa fa-cog pr-2"/> Configure alerts</span>
            </button>
            <button type="button" className="btn btn-default btn-conf" onClick={this.openAlertModal}>
                <span><i className="fa fa-upload pr-2"/> Generate report</span>
            </button>
            <button type="button" className="btn btn-default btn-logout" onClick={this.handleLogout}>
                <span><i className="fa fa-sign-out pr-2"/> Log out </span>
            </button>
            <button type="button" className="btn secondary">Log out</button>
        </div>
	</div>

      <div className ="app">

        <Alert stack={{limit: 3, position: 'top-right', timeout: 1000}} />

        <div className="row">
          <div className="col-md-4 configuration">
            <h2 className="mb-4">Configuration</h2>
            <p>Choose camera</p>
              <Select
                  value={selectedCamera}
                  className="select"
                  onChange={this.selectCamera}
                  options={camera}
              />
              <button
                  className="btn btn-secondary mt-2 mb-4"
                  onClick={() => this.saveConfiguration('camera', selectedCamera)}
              >
                      Choose camera &raquo;
              </button>
              <p>Choose objects to recognize</p>
              <Select
                  value={selectedObjects}
                  className="select"
                  onChange={this.selectObjects}
                  options={objectsRecognition}
                  isMulti
              />
              <button
                  className="btn btn-secondary mt-2 mb-4"
                  onClick={() => this.saveConfiguration('objects', selectedObjects)}
              >
                  Choose objects &raquo;
              </button>
          </div>
          <div className="col-md-8 camera">
            <h2 className="mb-4">Camera preview</h2>
              <p> View from the selected camera will be displayed in here - user can choose
                  camera and objects to recognize in the left panel</p>
          </div>
        </div>

        <Modal
          isOpen={this.state.isAlertModalOpen}
          onRequestClose={this.closeAlertModal}
          className="modal-content-custom"
          contentLabel="Generate report"
        >
          <div className="alertModal">
              <h2>Configure alerts</h2>
              <form onSubmit={() => this.formHandler(this.state.formFields)}>
                      <p>E-mail</p>
                      <input
                          type="email" name="email"
                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                          className="inputs"
                          value={email}/> <br/>
                      <p>Objects</p>
                      <Select
                          value={objects}
                          onChange={this.handleObjects}
                          options={objectsRecognition}
                          isMulti
                          className="inputs selects"
                      /> <br />
                      <p>Start date</p>
                      <DatePicker
                          selected={startDate}
                          onChange={(value) => this.handleDateChange("startDate", value)}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat='d/M/YY HH:mm'
                          className="inputs"
                          autoComplete="off"
                      /> <br />
                      <p>End date</p>
                      <DatePicker
                          selected={endDate}
                          onChange={(value) => this.handleDateChange("endDate", value)}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat='d/M/YY HH:mm'
                          className="inputs"
                          autoComplete="off"
                      /> <br/>

                  <button className="btn btn-success m-3" type="submit">Send configuration</button>
                  <button type="button" className="btn btn-danger mr-4" onClick={this.closeAlertModal}>Close</button>
              </form>
          </div>
        </Modal>

      </div>

    </div>
);}}

export default withRouter(Main);
