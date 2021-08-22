import Card from 'components/Card/Card'
import React, { useState, useEffect, useRef } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import './Column.scss'
import { mapOrder } from 'utilities/sorts'
import { Dropdown, Form, Button } from 'react-bootstrap'
import ConfirmModal from 'components/Common/ConfirmModal'
import { MODAL_ACTION_CONFIRM } from 'utilities/constants'
import { handleKeyEnterPress, selectAllInlineText } from 'utilities/contentEditable'
import { cloneDeep } from 'lodash'
import cardApi from 'api/cardApi'
import columnApi from 'api/columnApi'

function Column(props) {
  const { column, onCardDrop, onUpdateColumn, onAddNewCardToColumn } = props
  const cards = mapOrder(column.cards, column.cardOrder, 'id')

  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal)

  const [columnTitle, setColumnTitle] = useState('')

  const [isOpenNewCard, setIsOpenNewCard] = useState(false)
  const onToogleNewCard = () => {
    setIsOpenNewCard(!isOpenNewCard)
  }

  const newCardTextareaRef = useRef(null)

  const [newCardTitle, setNewCardTitle] = useState('')

  useEffect(() => {
    setColumnTitle(column.title)
  }, [column.title])

  useEffect(() => {
    if (newCardTextareaRef && newCardTextareaRef.current) {
      newCardTextareaRef.current.focus()
      newCardTextareaRef.current.select()
    }
  }, [isOpenNewCard])

  const addNewCard = () => {
    if (!newCardTitle) {
      newCardTextareaRef.current.focus()
      return
    }

    const newCardToAdd = {
      boardId: column.boardId,
      columnId: column._id,
      title: newCardTitle.trim()
      // cover: null
    }

    cardApi.createNewCard(newCardToAdd).then(card => {
      let newColumn = cloneDeep(column)
      newColumn.cards.push(card)
      newColumn.cardOrder.push(card._id)

      onAddNewCardToColumn(newColumn)

      setNewCardTitle('')
      onToogleNewCard()
    })
  }

  //remove column
  const onConfirmModalAction = (type) => {
    if (type === MODAL_ACTION_CONFIRM) {
      const newColumn = {
        ...column,
        _destroy: true
      }
      //Call api update column
      columnApi.updateColumn(newColumn._id, newColumn).then(updatedColumn => {
        let newUpdatedColumn = {
          ...updatedColumn,
          _destroy: true
        }
        onUpdateColumn(newUpdatedColumn)
      })
    }
    toggleShowConfirmModal()
  }

  //update new column
  const handleColumnTitleBlur = () => {
    if (columnTitle !== column.title) {
      const newColumn = {
        ...column,
        title: columnTitle
      }
      //Call api update column
      columnApi.updateColumn(newColumn._id, newColumn).then(updatedColumn => {
        updatedColumn.cards = newColumn.cards
        onUpdateColumn(updatedColumn)
      })
    }
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
              <Dropdown.Item onClick={onToogleNewCard}>Add card ...</Dropdown.Item>
              <Dropdown.Item onClick={toggleShowConfirmModal}>Remove column...</Dropdown.Item>
              <Dropdown.Item>Something else</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>
      <div className='card-list'>
        <Container
          groupName='col'
          onDrop={dropResult => onCardDrop(column._id, dropResult)}
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
      { isOpenNewCard &&
          <div className="add-new-card-area">
            <Form.Control
              size="sm"
              as="textarea"
              placeholder="Enter column title"
              row="3"
              className="inp-enter-new-card"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={event => (event.key === 'Enter') && addNewCard()}
              ref={newCardTextareaRef}
            />
            <div className="mb-2">
              <Button
                variant="success"
                className="btn-add-title"
                onClick={addNewCard}
              >
                Add Column
              </Button>
              <Button
                className="common-btn-cancle"
                onClick={onToogleNewCard}
              >
                <i className="fa fa-times" aria-hidden="true"></i>
              </Button>
            </div>
          </div>
        }
        { !isOpenNewCard &&
          <div className="footer-actions" onClick={onToogleNewCard}>
            <i className='fa fa-plus icon'></i> Add another card
          </div>
        }
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
