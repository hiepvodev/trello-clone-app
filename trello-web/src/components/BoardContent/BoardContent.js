import Column from 'components/Column/Column'
import React, { useState, useEffect, useRef } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import './BoardContent.scss'
import { initialData } from 'actions/initialData'
import { isEmpty } from 'lodash'
import { mapOrder } from 'utilities/sorts'
import { applyDrag } from 'utilities/drapDrop'
import { Container as BContainer, Row, Col, Form, Button } from 'react-bootstrap'

function BoardContent() {
  const [board, setBoard] = useState({})
  const [columns, setColumns] = useState([])
  const [isOpenNewColumn, setIsOpenNewColumn] = useState(false)

  const newColumnInputRef = useRef(null)

  const [newColumnTitle, setNewColumnTitle] = useState('')

  useEffect(() => {
    const boardFromDB = initialData.boards.find(
      (board) => board.id === 'board-1'
    )
    if (boardFromDB) {
      setBoard(boardFromDB)

      //sort column
      setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'))
    }
  }, [])

  useEffect(() => {
    if (newColumnInputRef && newColumnInputRef.current) {
      newColumnInputRef.current.focus()
      newColumnInputRef.current.select()
    }
  }, [isOpenNewColumn])

  if (isEmpty(board)) {
    return (
      <div className='not-found' style={{ padding: '10px', color: 'white' }}>
        Board not found
      </div>
    )
  }

  const addNewColumn = () => {
    if (!newColumnTitle) {
      newColumnInputRef.current.focus()
      return
    }

    const newColumnToAdd = {
      id: Math.random().toString(36).substr(2, 5),
      boardId: board.id,
      title: newColumnTitle.trim(),
      cardOrder: [],
      cards: []
    }

    let newColumns = [...columns]
    newColumns.push(newColumnToAdd)

    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map(c => c.id)
    newBoard.columns = newColumns

    setColumns(newColumns)
    setBoard(newBoard)

    setNewColumnTitle('')
    onToogleNewColumn()
  }

  const onToogleNewColumn = () => {
    setIsOpenNewColumn(!isOpenNewColumn)
  }

  const onColumnDrop = (dropResult) => {
    let newColumns = [...columns]
    newColumns = applyDrag(newColumns, dropResult)

    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map(c => c.id)
    newBoard.columns = newColumns

    setColumns(newColumns)
    setBoard(newBoard)
  }

  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = [...columns]

      let currentColumn = newColumns.find(c => c.id === columnId)
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
      currentColumn.cardOrder = currentColumn.cards.map(i => i.id)

      setColumns(newColumns)
    }
  }

  return (
    <div className='board-content'>
      <Container
        orientation="horizontal"
        onDrop={onColumnDrop}
        getChildPayload={index => columns[index]}
        dragHandleSelector=".column-drag-handle"
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: 'column-drop-preview'
        }}
      >
        {columns.map((column, index) => (
          <Draggable key={index}>
            <Column column={column} onCardDrop={onCardDrop} />
          </Draggable>
        ))}
      </Container>

      <BContainer className="trello-container">
        {!isOpenNewColumn ?
          <Row>
            <Col className="add-new-column" onClick={onToogleNewColumn}>
              <div className="footer-actions">
                <i className='fa fa-plus icon'></i> Add another column
              </div>
            </Col>
          </Row>
          :
          <Row>
            <Col className="enter-new-column">
              <div className="footer-actions">
                <Form.Control
                  size="sm"
                  type="text"
                  placeholder="Enter column title"
                  className="title-inp"
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  onKeyDown={event => (event.key === 'Enter') && addNewColumn()}
                  ref={newColumnInputRef}
                />
                <div className="mb-2">
                  <Button variant="success" className="btn-add-title" onClick={addNewColumn}>Add Column</Button>
                  <Button className="btn-cancle" onClick={onToogleNewColumn}>
                    <i className="fa fa-times" aria-hidden="true"></i>
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        }
      </BContainer>

    </div>
  )
}

export default BoardContent
