import React, { useState, useRef, useEffect } from 'react'
import { IconArrowBackUp, IconTrash } from '@tabler/icons-react'

import { Button } from './Button'

export const CardProxy = ({ card, setCards }) => {
  const [editing, setEditing] = useState(false)
  const textAreaRef = useRef(null)

  useEffect(() => {
    if (editing) handleResize()
  }, [editing])

  const handleResize = () => {
    if (!textAreaRef.current) return
    textAreaRef.current.focus()
    textAreaRef.current.style.height = 'auto'
    textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`
  }

  const handleInput = (e) => {
    setCards((prev) => {
      const currentCard = prev.find((x) => x.id === card.id)
      currentCard.string = e.target.value
      return [...prev]
    })
    handleResize()
  }

  const handleReset = () => {
    setCards((prev) => {
      const currentCard = prev.find((x) => x.id === card.id)
      currentCard.string = `${card.name}\n${card.type_line}\n${card.oracle_text}`
      return [...prev]
    })
  }

  const handleDelete = () => {
    setCards((prev) => {
      return prev.filter((x) => x.id !== card.id)
    })
  }

  const [name, type_line, ...oracle_text] = card.string.split('\n')

  const oracleText = oracle_text.join('\n')

  const getReplacement = (symbol) => {
    if (!symbol?.match(/^{.*}$/g)) return symbol

    let replacementClass = ''

    switch (symbol) {
      case '{T}':
        replacementClass = 'tap'
        break
      default:
        replacementClass = symbol.replace(/[{}/]/g, '').toLowerCase()
        break
    }

    return (
      <i
        className={`ms ms-${replacementClass} ms-cost text-[4.5pt] -translate-y-[0.5pt]`}
      ></i>
    )
  }

  const parseSymbols = (str) => {
    const regex = new RegExp(String.raw`({[^}]+})|(\n)|(${name})`, 'g')
    const parts = str.split(regex)

    return parts.map((part, index) => {
      if (part === '\n') {
        return <br key={index} />
      }

      if (part === name) {
        return '~'
      }

      const replacement = getReplacement(part)
      if (replacement) {
        return <React.Fragment key={index}>{replacement}</React.Fragment>
      }

      return <React.Fragment key={index}>{part}</React.Fragment>
    })
  }

  const parsedOracleText = parseSymbols(oracleText).map((part, index) => {
    return <React.Fragment key={index}>{part}</React.Fragment>
  })

  return (
    <div className="text-[6pt] mb-2 break-inside-avoid">
      {editing ? (
        <textarea
          ref={textAreaRef}
          value={card.string}
          onInput={handleInput}
          onBlur={() => setEditing(false)}
          rows={1}
          className="overflow-hidden resize-none w-full box-border"
          placeholder="Type card details"
        />
      ) : (
        <div className="relative rounded">
          <div className="hover:opacity-100 opacity-0 absolute w-full h-full bg-black bg-opacity-70 rounded flex items-center justify-center transition z-10">
            <Button onClick={() => setEditing(true)}>Edit</Button>
            <div className="absolute flex bottom-1 right-1 gap-1">
              <Button
                onClick={handleReset}
                className="!px-0 !py-0 w-5 h-5 flex items-center justify-center"
              >
                {<IconArrowBackUp size={14} />}
              </Button>
              <Button
                onClick={handleDelete}
                className="!px-0 !py-0 w-5 h-5 flex items-center justify-center"
              >
                {<IconTrash size={14} />}
              </Button>
            </div>
          </div>
          <p className="font-bold leading-[7pt] mb-[0.5pt]">{name}</p>
          <p className="italic leading-[7pt] mb-[1pt]">{type_line}</p>
          <p className="leading-[7pt]">{parsedOracleText}</p>
        </div>
      )}
    </div>
  )
}
