import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { CssBaseline, Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material'
import type {} from '@mui/material/themeCssVarsAugmentation'

import { store } from './app/store'
import App from './App'
import reportWebVitals from './reportWebVitals'

const container = document.getElementById('root')!
const root = createRoot(container)

root.render(
    <React.StrictMode>
        <CssVarsProvider>
            <CssBaseline />
            <Provider store={store}>
                <App />
            </Provider>
        </CssVarsProvider>
    </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
