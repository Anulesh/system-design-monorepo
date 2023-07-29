import * as React from 'react'
import { DarkModeOutlined, LightModeOutlined } from '@mui/icons-material'
import { IconButton, useColorScheme } from '@mui/material'

/**
 * Renders a button that toggles Material UI's pallette mode between 'light'
 * and 'dark' when clicked.
 */
export const ThemeModeSwitch: React.FunctionComponent = (props) => {
    const { mode, setMode } = useColorScheme()

    return (
        <IconButton
            onClick={() => {
                setMode(mode === 'light' ? 'dark' : 'light')
            }}
        >
            {mode === 'light' ? <DarkModeOutlined /> : <LightModeOutlined />}
        </IconButton>
    )
}

export default ThemeModeSwitch
