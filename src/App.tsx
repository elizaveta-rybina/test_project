import { Main } from 'components/Main'
import React from 'react'
import { Toaster } from 'react-hot-toast'
import styles from './App.module.scss'

const App: React.FC = () => {
  return (
    <div className={styles.appContainer}>
      <Toaster position="top-right" />
      <Main />
    </div>
  )
}

export default App
