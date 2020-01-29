import React from "react"
import { Card, Button, Form, Col } from 'react-bootstrap';

class AdditionalPlannedTravel extends React.Component {

  constructor(props) {
    super(props);
    this.state = { ...this.props, ...this.props.currentState };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    let value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    this.setState({[event.target.id]: value}, () => {
      this.props.setEnrollmentState({ ...this.state });
    });
  }

  render () {
    return (
      <React.Fragment>
        <Card className="mx-5 card-square">
          <Card.Header as="h4">Additional Planned Travel</Card.Header>
          <Card.Body>

            {this.props.previous && <Button variant="outline-primary" size="lg" className="btn-square px-5" onClick={this.props.previous}>Previous</Button>}
            {this.props.next && <Button variant="outline-primary" size="lg" className="float-right btn-square px-5" onClick={this.props.next}>Next</Button>}
            {this.props.finish && <Button variant="outline-primary" size="lg" className="float-right btn-square px-5" onClick={this.props.finish}>Finish</Button>}
          </Card.Body>
        </Card>
      </React.Fragment>
    );
  }
}

export default AdditionalPlannedTravel