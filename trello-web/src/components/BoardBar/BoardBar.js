import React, { useState } from 'react'
import './BoardBar.scss'
import { Container as BContainer, Row, Col, InputGroup, FormControl } from 'react-bootstrap'
import Avatar from 'react-avatar'

function BoardBar() {
  const [listUser, setlistUser] = useState([
    { name: 'V H', src: 'https://scontent-hkg4-1.xx.fbcdn.net/v/t1.6435-9/48383984_2205729266341882_8234720880857448448_n.jpg?_nc_cat=107&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=nCX-2VcjItYAX8w_L9W&_nc_ht=scontent-hkg4-1.xx&oh=cc624466a062e0d017af4b0ecd43eae0&oe=6150CD37'},
    { name: 'T T'},
    { name: 'M H'},
    { name: 'T A'},
    { name: 'M T'},
  ])
  return (
    <div className='navbar navbar-board'>
      <BContainer fluid>
        <Row>
          <Col xs={12} sm={10}>
            <div className="left-actions">
              <div className="item boards">
                <i className="fa fa-tasks" aria-hidden="true"></i>
                <span>Board</span>
                <i className="fa fa-chevron-down" aria-hidden="true"></i>
              </div>
              <div className="item board-name">
                Trello HiepDev
              </div>
              <div className="item start"><i className="fa fa-star-o" aria-hidden="true"></i></div>
              <div className="board-divider"></div>
              <div className="item work-space">Private Workspace</div>
              <div className="board-divider"></div>
              <div className="item group-users">
                { listUser &&
                  listUser.map((item, index) => {
                    if (item.src) return <Avatar key={index} size="36" round="50%" src={item.src}/>
                    return <Avatar key={index} size="36" round="50%" name={item.name}/>
                  })
                }
              </div>
              <div className="item add-user">Invite</div>
            </div>
          </Col>
          <Col xs={12} sm={2}>
            <div className="right-actions">
              <div className="item show-menu"><i className="fa fa-ellipsis-h" aria-hidden="true"></i>  <span>Show menu</span></div>
            </div>
          </Col>
        </Row>
      </BContainer>
    </div>
  )
}

export default BoardBar