import Card from 'components/Card/Card'
import React, { useState, useEffect } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import './Column.scss'
import { mapOrder } from 'utilities/sorts'
import { Dropdown, Form } from 'react-bootstrap'
import ConfirmModal from 'components/Common/ConfirmModal'
import { MODAL_ACTION_CONFIRM } from 'utilities/constants'
import { handleKeyEnterPress, selectAllInlineText } from 'utilities/contentEditable'

function Column(props) {
  const { column, onCardDrop, onUpdateColumn } = props
  const cards = mapOrder(column.cards, column.cardOrder, 'id')

  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal)

  const [columnTitle, setColumnTitle] = useState('')

  useEffect(() => {
    setColumnTitle(column.title)
  }, [column.title])

  const onConfirmModalAction = (type) => {
    if (type === MODAL_ACTION_CONFIRM) {
      const newColumn = {
        ...column,
        _destroy: true
      }
      onUpdateColumn(newColumn)
    }
    toggleShowConfirmModal()
  }


  const handleColumnTitleBlur = () => {
    const newColumn = {
      ...column,
      title: columnTitle
    }
    onUpdateColumn(newColumn)
  }

  return (
    <div className='column'>
      <header className='column-drag-handle'>
        <div className="column-title">
          {/* {column.title} */}
          <Form.Control
            size="sm"
            type="text"
            placeholder="Enter column title"
            className="trello-content-ediable"
            value={columnTitle}
            spellCheck="false"
            onClick={selectAllInlineText}
            onChange={(e) => setColumnTitle(e.target.value)}
            onBlur={handleColumnTitleBlur}
            onKeyDown={handleKeyEnterPress}
            onMouseDown={e => e.preventDefault()}
          />
        </div>
        <div className="column-dropdown-action">
          <Dropdown>
            <Dropdown.Toggle size="sm" className="dropdown-btn"/>

            <Dropdown.Menu>
              <Dropdown.Item>Add card ...</Dropdown.Item>
              <Dropdown.Item onClick={toggleShowConfirmModal}>Remove column...</Dropdown.Item>
              <Dropdown.Item>Something else</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>
      <div className='card-list'>
        <Container
          groupName='col'
          onDrop={dropResult => onCardDrop(column.id, dropResult)}
          getChildPayload={ index => cards[index] }
          dragClass='card-ghost'
          dropClass='card-ghost-drop'
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: 'card-drop-preview'
          }}
          dropPlaceholderAnimationDuration={200}
        >
          {cards.map((card, index) => (
            <Draggable key={index}>
              <Card card={card} />
            </Draggable>
          ))}
        </Container>
      </div>
      <footer>
        <div className="footer-actions">
          <i className='fa fa-plus icon'></i> Add another card
        </div>
      </footer>

      {/* Modal */}
      <ConfirmModal
        show={showConfirmModal}
        onAction={onConfirmModalAction}
        title="Remove column"
        content={` Are you sure you want to remove <strong>${column.title}</strong><br>All related cards will be remove!`}
      />
    </div>
  )
}

export default Column
