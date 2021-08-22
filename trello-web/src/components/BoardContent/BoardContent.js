import Column from 'components/Column/Column'
import React, { useState, useEffect, useRef } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import './BoardContent.scss'
import { isEmpty, cloneDeep } from 'lodash'
import { mapOrder } from 'utilities/sorts'
import { applyDrag } from 'utilities/drapDrop'
import { Container as BContainer, Row, Col, Form, Button } from 'react-bootstrap'
import boardApi from 'api/boardApi'
import columnApi from 'api/columnApi'
import cardApi from 'api/cardApi'

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
      setColumns(mapOrder(activeColumns, board.columnOrder, '_id'))
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
    let newColumns = cloneDeep(columns)
    newColumns = applyDrag(newColumns, dropResult)

    let newBoard = cloneDeep(board)
    newBoard.columnOrder = newColumns.map(c => c._id)
    newBoard.columns = newColumns
    //call api update columnOrder in board
    setColumns(newColumns)
    setBoard(newBoard)
    boardApi.updateBoard(newBoard._id, newBoard).catch(error => {
      //handle error
      setColumns(columns)
      setBoard(board)
    })

  }

  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = cloneDeep(columns)

      let currentColumn = newColumns.find(c => c._id === columnId)
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
      currentColumn.cardOrder = currentColumn.cards.map(i => i._id)
      console.log(dropResult);
      setColumns(newColumns)
      if (dropResult.removedIndex !== null && dropResult.addedIndex !== null) {
        /**
         * Action: move card inside one column
         * 1 - Call api update cardOrder in current column
         */
        if (dropResult.removedIndex === dropResult.addedIndex) return
        columnApi.updateColumn(currentColumn._id, currentColumn).catch(() => {
          setColumns(columns)
        })

      } else {
        /**
         * Action: move card between two columns
         */

        //  1 - Call api update cardOrder in current column
        if (dropResult.addedIndex !== null) {
          columnApi.updateColumn(currentColumn._id, currentColumn).catch(() => {
            setColumns(columns)
          })
          let currentCard = cloneDeep(dropResult.payload)
          currentCard.columnId = currentColumn._id
          // 2 - Call api update columnId in current card
          cardApi.updatedCard(currentCard._id, currentCard)
        }
      }
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
              onAddNewCardToColumn={onUpdateColumn} />
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
