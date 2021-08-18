//on keydown
export const handleKeyEnterPress = (e) => {
  if (e.key === 'Enter') {
    e.target.blur()
  }
}

//select all text
export const selectAllInlineText = (e) => {
  e.target.focus()
  e.target.select()
}
