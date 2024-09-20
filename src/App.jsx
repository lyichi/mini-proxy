import { useState } from 'react'
import Swal from 'sweetalert2'
import axios from 'axios'

import { Button } from './components/Button'
import { CardProxy } from './components/CardProxy'

function App() {
  const [cards, setCards] = useState([])

  const onAdd = () => {
    Swal.fire({
      title: 'Enter card title',
      input: 'textarea',
    }).then(async ({ isConfirmed, value }) => {
      if (isConfirmed && value) {
        const cards = value.split('\n')
        for (const card of cards) {
          const input = card.split(' ').join('+')
          axios
            .get(`https://api.scryfall.com/cards/named?fuzzy=${input}`)
            .then(({ data }) => {
              const { id, name, type_line, oracle_text } = data
              const oracleText = oracle_text ?? ''
              setCards((prev) => [
                ...prev,
                {
                  id,
                  name,
                  type_line,
                  oracle_text: oracleText,
                  string: `${name}\n${type_line}\n${oracleText}`,
                },
              ])
            })
        }
      }
    })
  }

  const cardElements = cards.map((card) => {
    return <CardProxy key={card.id} card={card} setCards={setCards} />
  })

  return (
    <div className="flex">
      <div className="no-print p-2 bg-zinc-700">
        <Button onClick={onAdd}>Add Cards</Button>
      </div>
      <div className="sheet px-4 py-4 relative">
        <div className="columns-[35mm] gap-2 h-full">{cardElements}</div>
      </div>
    </div>
  )
}

export default App
