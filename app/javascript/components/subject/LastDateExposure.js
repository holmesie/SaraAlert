import React from 'react';
import { Form, Row, Col, Button, Modal } from 'react-bootstrap';
import { PropTypes } from 'prop-types';
import axios from 'axios';
import reportError from '../util/ReportError';
import InfoTooltip from '../util/InfoTooltip';
import _ from 'lodash';

class LastDateExposure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      last_date_of_exposure: this.props.patient.last_date_of_exposure,
      continuous_exposure: !!this.props.patient.continuous_exposure,
      loading: false,
      apply_to_group: false, // Flag to apply a change to all members
      apply_to_group_cm_only: false, // Flag to apply a change only to group members where continuous_exposure is true
      showExposureDateModal: false,
      showContinuousMonitoringModal: false,
    };
    this.origState = Object.assign({}, this.state);
    this.submit = this.submit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggleExposureDateModal = this.toggleExposureDateModal.bind(this);
    this.toggleContinuousMonitoringModal = this.toggleContinuousMonitoringModal.bind(this);
    this.createModal = this.createModal.bind(this);
  }

  toggleExposureDateModal() {
    this.setState({ showExposureDateModal: !this.state.showExposureDateModal, apply_to_group: false, apply_to_group_cm_only: false });
  }

  toggleContinuousMonitoringModal() {
    this.setState({
      showContinuousMonitoringModal: !this.state.showContinuousMonitoringModal,
      continuous_exposure: !this.state.continuous_exposure,
      apply_to_group: false,
      apply_to_group_cm_only: false,
    });
  }

  handleChange(event) {
    event.persist();
    let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({ [event.target.id]: value }, () => {
      // Make sure other toggle is reset (these need to act like radio buttons)
      if (event.target.id === 'apply_to_group' && this.state.apply_to_group) {
        this.setState({ apply_to_group_cm_only: false });
      } else if (event.target.id === 'apply_to_group_cm_only' && this.state.apply_to_group_cm_only) {
        this.setState({ apply_to_group: false });
      }
    });
  }

  submit(isLDE) {
    let diffState = Object.keys(this.state).filter(k => _.get(this.state, k) !== _.get(this.origState, k));
    diffState.push('continuous_exposure'); // Since exposure date updates change CE, always make sure this gets changed
    this.setState({ loading: true, continuous_exposure: diffState.includes('last_date_of_exposure') || isLDE ? false : this.state.continuous_exposure }, () => {
      axios.defaults.headers.common['X-CSRF-Token'] = this.props.authenticity_token;
      axios
        .post(window.BASE_PATH + '/patients/' + this.props.patient.id + '/status', {
          last_date_of_exposure: this.state.last_date_of_exposure,
          continuous_exposure: this.state.continuous_exposure,
          apply_to_group: this.state.apply_to_group,
          apply_to_group_cm_only: this.state.apply_to_group_cm_only,
          diffState: diffState,
        })
        .then(() => {
          location.reload(true);
        })
        .catch(error => {
          reportError(error);
        });
    });
  }

  createModal(title, message, toggle, submit) {
    return (
      <Modal size="lg" show centered>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{message}</p>
          {this.props.has_group_members && (
            <Form.Group className="mt-2">
              <Form.Check
                type="switch"
                id="apply_to_group"
                label='Update Last Date of Exposure for all household members whose Monitoring Status is "Actively Monitoring" in the Exposure workflow'
                onChange={this.handleChange}
                checked={this.state.apply_to_group === true || false}
              />
            </Form.Group>
          )}
          {this.props.has_group_members && this.state.showExposureDateModal && <b>OR</b>}
          {this.props.has_group_members && this.state.showExposureDateModal && (
            <Form.Group className="mt-3">
              <Form.Check
                type="switch"
                id="apply_to_group_cm_only"
                label='Update Last Date of Exposure only for household members with Continuous Exposure whose Monitoring Status is "Actively Monitoring" in the Exposure workflow'
                onChange={this.handleChange}
                checked={this.state.apply_to_group_cm_only === true || false}
              />
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary btn-square" onClick={toggle}>
            Cancel
          </Button>
          <Button variant="primary btn-square" onClick={submit} disabled={this.state.loading}>
            {this.state.loading && (
              <React.Fragment>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>&nbsp;
              </React.Fragment>
            )}
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    return (
      <React.Fragment>
        {this.state.showExposureDateModal &&
          this.createModal(
            'Last Date of Exposure',
            'Are you sure you want to modify the last date of exposure? This will reset the continuous monitoring status for this monitoree.',
            this.toggleExposureDateModal,
            () => this.submit(true)
          )}
        {this.state.showContinuousMonitoringModal &&
          this.createModal('Continuous Exposure', 'Are you sure you want to modify continuous monitoring?', this.toggleContinuousMonitoringModal, () =>
            this.submit(false)
          )}
        <Row>
          <Col md="4" sm="24">
            <h6 className="nav-input-label mt-3">
              LAST DATE OF EXPOSURE
              <InfoTooltip tooltipTextKey="lastDateOfExposure" location="right"></InfoTooltip>
            </h6>
          </Col>
          <Col md="8" sm="24">
            <Row>
              <Col>
                <Form.Control
                  size="lg"
                  id="last_date_of_exposure"
                  type="date"
                  className="form-square"
                  value={this.state.last_date_of_exposure || ''}
                  onChange={this.handleChange}
                />
              </Col>
              <Col>
                <Button className="btn-lg" onClick={() => this.toggleExposureDateModal()}>
                  <i className="fas fa-temperature-high"></i> Update
                </Button>
              </Col>
            </Row>
            <Row>
              <Form.Check
                className="ml-3 mt-2"
                size="lg"
                label="CONTINUOUS EXPOSURE"
                type="switch"
                id="continuous_exposure"
                checked={this.state.continuous_exposure === true || false}
                onChange={() => this.toggleContinuousMonitoringModal()}
              />
            </Row>
          </Col>
          <Col md="12" sm="24">
            <div className="mt-3">
              <span className="nav-input-label">END OF MONITORING</span>
              <InfoTooltip tooltipTextKey="endOfMonitoring" location="right"></InfoTooltip>
              <span className="ml-3">{this.props.patient.linelist.end_of_monitoring}</span>
            </div>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

LastDateExposure.propTypes = {
  has_group_members: PropTypes.bool,
  authenticity_token: PropTypes.string,
  patient: PropTypes.object,
};

export default LastDateExposure;
