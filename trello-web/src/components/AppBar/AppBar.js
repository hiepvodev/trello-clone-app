import React from 'react'
import './AppBar.scss'
import { Container as BContainer, Row, Col, InputGroup, FormControl } from 'react-bootstrap'
import Avatar from 'react-avatar'

function AppBar() {
  return (
    <div className='navbar navbar-app'>
      <BContainer fluid>
        <Row>
          <Col xs={12} sm={5}>
            <div className="left-actions">
              <div className="item all"><i className="fa fa-th-list" aria-hidden="true"></i></div>
              <div className="item home"><i className="fa fa-home" aria-hidden="true"></i></div>
              <div className="item boards"><i className="fa fa-trello" aria-hidden="true"></i></div>
              <div className="item search">
                <InputGroup className="">
                  <FormControl
                    placeholder=""
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                  <InputGroup.Text id="search-icon"><i className="fa fa-search" aria-hidden="true"></i></InputGroup.Text>
                </InputGroup>
              </div>
            </div>
          </Col>
          <Col xs={12} sm={2}>
            <div className="center-action">
              <p className="mb-0"><i className="fa fa-trello" aria-hidden="true"></i>    Trello HiepDev</p>
            </div>
          </Col>
          <Col xs={12} sm={5}>
            <div className="right-actions">
              <div className="item create-new">Create New</div>
              <div className="item info"><i className="fa fa-info-circle" aria-hidden="true"></i></div>
              <div className="item noti"><i className="fa fa-bell-o" aria-hidden="true"></i></div>
              <Avatar size="36" round="50%" src="https://scontent-hkg4-1.xx.fbcdn.net/v/t1.6435-9/48383984_2205729266341882_8234720880857448448_n.jpg?_nc_cat=107&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=nCX-2VcjItYAX8w_L9W&_nc_ht=scontent-hkg4-1.xx&oh=cc624466a062e0d017af4b0ecd43eae0&oe=6150CD37"/>
            </div>
          </Col>
        </Row>
      </BContainer>
    </div>
  )
}

export default AppBar