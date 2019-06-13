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

const camera_filepath = {
    1: "arson.mp4",
    2: "car.avi"
}


class Main extends React.Component {
    constructor(props) {
        super(props);
        let date = new Date();
        this.state = {
            selectedObjects: JSON.parse(localStorage.getItem('selectedObjects')) || [],
            selectedCamera: JSON.parse(localStorage.getItem('selectedCamera')) || '',
            isAlertModalOpen: false,
            isReportModalOpen: false,
            alertFormFields: {
                email: localStorage.getItem('email')|| '',
                objects: JSON.parse(localStorage.getItem('objects')) || [],
                startDate: Date.parse(localStorage.getItem('startDate')) || date,
                endDate: Date.parse(localStorage.getItem('endDate')) || date
            },
            reportFormFields: {
                reportEmail: JSON.parse(localStorage.getItem('reportEmail')) || '',
                reportStartDate: Date.parse(localStorage.getItem('reportStartDate')) || date,
                reportEndDate: Date.parse(localStorage.getItem('reportEndDate')) || date
            },
        };

        this.handleLogout = this.handleLogout.bind(this);
        this.saveConfiguration = this.saveConfiguration.bind(this);
        this.openAlertModal = this.openAlertModal.bind(this);
        this.closeAlertModal = this.closeAlertModal.bind(this);
        this.openReportModal = this.openReportModal.bind(this);
        this.closeReportModal = this.closeReportModal.bind(this);
    }

    handleLogout() {
        this.props.history.push("/");
    }

    selectObjects = (selectedObjects) => {
        this.setState({ selectedObjects }, () => {
            localStorage.setItem('selectedObjects', JSON.stringify(this.state.selectedObjects))
        });
        console.log(`Objects selected:`, selectedObjects);
    }

    selectCamera = (selectedCamera) => {
        this.setState({ selectedCamera }, () => {
            localStorage.setItem('selectedCamera', JSON.stringify(this.state.selectedCamera))
        });
        console.log(`Selected camera:`, selectedCamera);
    }

    saveConfiguration(option, values) {
        if (option === 'camera') {
            let endpoint = "http://127.0.0.1:5000/start/"
                         + this.state.selectedCamera.value;

            const payload = new URLSearchParams();
            payload.append('filename', camera_filepath[this.state.selectedCamera.value])

            axios({
                url: endpoint,
                method: 'post',
                params: payload
                })
                .then(function (response) {
                    Alert.success('Objects configuration sent successfully');
                })
        } else if (option === 'objects') {
            if (this.state.selectedCamera) {
                let endpoint = "http://127.0.0.1:5000/specify-class-subset/"
                            + this.state.selectedCamera.value;

                var values_array = [];
                for (var i = 0; i < values.length; i++)
                    values_array.push(values[i].value)

                const payload = new URLSearchParams();
                payload.append('class_subset', values_array)

                axios({
                    url: endpoint,
                    method: 'post',
                    params: payload
                    })
                    .then(function (response) {
                        Alert.success('Objects configuration sent successfully');
                    })
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

    openReportModal() {
        this.setState({isReportModalOpen: true});
    }

    closeReportModal() {
        this.setState({isReportModalOpen: false});
    }

    handleObjects = (objects) => {
        this.setState({ alertFormFields: {
                ...this.state.alertFormFields,
                objects: objects,
            },
        }, () => {
            localStorage.setItem("objects", JSON.stringify(this.state.alertFormFields.objects))
        });
    }

    handleDateChange = (dateName, dateValue) => {
        this.setState({
            alertFormFields: {
                ...this.state.alertFormFields,
                [dateName]: dateValue
            }
        }, () => {
            localStorage.setItem(`${dateName}`, this.state.alertFormFields[dateName])
        });
    }

    handleReportDateChange = (dateName, dateValue) => {
        this.setState({
            reportFormFields: {
                ...this.state.reportFormFields,
                [dateName]: dateValue
            }
        }, () => {
            localStorage.setItem(`${dateName}`, this.state.reportFormFields[dateName])
        });
    }

    inputChangeHandler(e) {
        let alertFormFields = {...this.state.alertFormFields};
        alertFormFields[e.target.name] = e.target.value;
        this.setState({
            alertFormFields
        }, () => {
            localStorage.setItem("email", this.state.alertFormFields.email)
        });
    }

    reportInputChangeHandler(e) {
        let reportFormFields = {...this.state.reportFormFields};
        reportFormFields[e.target.name] = e.target.value;
        this.setState({
            reportFormFields
        }, () => {
            localStorage.setItem("reportEmail", this.state.reportFormFields.reportEmail)
        });
    }


    submitAlerting(email, objects, startDate, endDate)
    {
        if (!this.state.selectedCamera)
        {
            Alert.error("Select the camera first!");
            return;
        }

        var values_array = [];
        for (var i = 0; i < objects.length; i++)
            values_array.push(objects[i].value)

        let endpoint = "http://127.0.0.1:5000/configure-alerting/"
                      + this.state.selectedCamera.value;

        const payload = new URLSearchParams();
        payload.append('mail', email);
        payload.append('objects', values_array);
        payload.append('start_date', startDate);
        payload.append('end_date', endDate);

        axios({
            url: endpoint,
            method: 'post',
            params: payload
        })
        .then(function (response) {
            Alert.success('Alerts configuration sent successfully');
        })
    }

    submitReport(email, startDate, endDate)
    {
        if (!this.state.selectedCamera)
        {
            Alert.error("Select the camera first!");
            return;
        }

        let endpoint = "http://127.0.0.1:5000/configure-alerting/"
            + this.state.selectedCamera.value;

        const payload = new URLSearchParams();
        payload.append('mail', email);
        payload.append('start_date', startDate);
        payload.append('end_date', endDate);


        axios({
            url: endpoint,
            method: 'post',
            params: payload
        })
            .then(function (response) {
                Alert.success('Report generated successfully');
            })
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
    const { email, objects, startDate, endDate } = this.state.alertFormFields;
    const { reportEmail, reportStartDate, reportEndDate } = this.state.reportFormFields;

return (
    <div className="container">

	<div className="header">
        <div>
            <button type="button" className="btn btn-default btn-conf" onClick={this.openAlertModal}>
                <span><i className="fa fa-cog pr-2"/> Configure alerts</span>
            </button>
            <button type="button" className="btn btn-default btn-conf" onClick={this.openReportModal}>
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
          contentLabel="Configure alerts"
        >
          <div className="alertModal">
              <h2>Configure alerts</h2>
              <form onSubmit={() => this.formHandler(this.state.alertFormFields)}>
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

                  <button
                   className="btn btn-success m-3"
                   type="button"
                   onClick={() => this.submitAlerting(email, objects, startDate, endDate)}
                   >
                       Send configuration
                  </button>
                  <button type="button" className="btn btn-danger mr-4" onClick={this.closeAlertModal}>Close</button>
              </form>
          </div>
        </Modal>
          <Modal
              isOpen={this.state.isReportModalOpen}
              onRequestClose={this.closeReportModal}
              className="modal-content-custom"
              contentLabel="Generate report"
          >
              <div className="alertModal">
                  <h2>Generate report</h2>
                  <form onSubmit={() => this.formHandler(this.state.reportFormFields)}>
                      <p>E-mail</p>
                      <input
                          type="email" name="reportEmail"
                          onChange={(e) => this.reportInputChangeHandler.call(this, e)}
                          className="inputs"
                          value={reportEmail}/> <br/>
                      <p>Start date</p>
                      <DatePicker
                          selected={reportStartDate}
                          onChange={(value) => this.handleReportDateChange("reportStartDate", value)}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat='d/M/YY HH:mm'
                          className="inputs"
                          autoComplete="off"
                      /> <br />
                      <p>End date</p>
                      <DatePicker
                          selected={reportEndDate}
                          onChange={(value) => this.handleReportDateChange("reportEndDate", value)}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat='d/M/YY HH:mm'
                          className="inputs"
                          autoComplete="off"
                      /> <br/>

                      <button
                          className="btn btn-success m-3"
                          type="button"
                          onClick={() => this.submitReport(reportEmail, reportStartDate, reportEndDate)}
                      >
                          Generate report
                      </button>
                      <button type="button" className="btn btn-danger mr-4" onClick={this.closeReportModal}>Close</button>
                  </form>
              </div>
          </Modal>

      </div>

    </div>
);}}

export default withRouter(Main);
