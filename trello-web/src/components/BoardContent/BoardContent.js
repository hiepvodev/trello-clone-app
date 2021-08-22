import Column from 'components/Column/Column'
import React, { useState, useEffect, useRef } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import './BoardContent.scss'
import { isEmpty } from 'lodash'
import { mapOrder } from 'utilities/sorts'
import { applyDrag } from 'utilities/drapDrop'
import { Container as BContainer, Row, Col, Form, Button } from 'react-bootstrap'
import boardApi from 'api/boardApi'
import columnApi from 'api/columnApi'

function BoardContent() {
  const [board, setBoard] = useState({})
  const [columns, setColumns] = useState([])
  const [isOpenNewColumn, setIsOpenNewColumn] = useState(false)
  const onToogleNewColumn = () => {
    setIsOpenNewColumn(!isOpenNewColumn)
  }

  const newColumnInputRef = useRef(null)

  const [newColumnTitle, setNewColumnTitle] = useState('')

  useEffect(() => {
    const boardId = '611fe5a77539766a0f6d2022'
    boardApi.fetchBoardDetails(boardId).then(board => {
      setBoard(board)
      //sort column
      const activeColumns = board.columns.filter(c => c._destroy === false)
      setColumns(mapOrder(activeColumns, board.columnOrder, 'id'))
    })
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
      boardId: board._id,
      title: newColumnTitle.trim()
    }

    columnApi.createNewColumn(newColumnToAdd).then(column => {
      let newColumns = [...columns]
      newColumns.push(column)

      let newBoard = { ...board }
      newBoard.columnOrder = newColumns.map(c => c._id)
      newBoard.columns = newColumns

      setColumns(newColumns)
      setBoard(newBoard)

      setNewColumnTitle('')
      onToogleNewColumn()
    })
  }


  const onColumnDrop = (dropResult) => {
    let newColumns = [...columns]
    newColumns = applyDrag(newColumns, dropResult)

    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map(c => c._id)
    newBoard.columns = newColumns

    setColumns(newColumns)
    setBoard(newBoard)
  }

  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = [...columns]

      let currentColumn = newColumns.find(c => c._id === columnId)
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
      currentColumn.cardOrder = currentColumn.cards.map(i => i._id)

      setColumns(newColumns)
    }
  }

  const onUpdateColumn = (newColumnUpdate) => {
    const columnIdToUpdate = newColumnUpdate._id

    let newColumns = [...columns]
    const columnIndexToUpdate = newColumns.findIndex(i => i._id === columnIdToUpdate)

    if (newColumnUpdate._destroy) {
      newColumns.splice(columnIndexToUpdate, 1)
    } else {
      newColumns.splice(columnIndexToUpdate, 1, newColumnUpdate)
    }

    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map(c => c._id)
    newBoard.columns = newColumns

    setColumns(newColumns)
    setBoard(newBoard)
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
            <Column
              column={column}
              onCardDrop={onCardDrop}
              onUpdateColumn={onUpdateColumn}
              onAddNewCardToColumn={onUpdateColumn}/>
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
                  <Button className="common-btn-cancle" onClick={onToogleNewColumn}>
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
