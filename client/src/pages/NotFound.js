import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import MenuNavigationRouter from '../components/MenuNavigationRouter'

export default function NotFound() {
  useEffect(() => {
    document.title = 'Página não encontrada - Motorman'
  })
  return (
    <MenuNavigationRouter>
      Página não encontrada
      <br />
      <Link to="/">Ir para a página inicial</Link>
    </MenuNavigationRouter>
  )
}
