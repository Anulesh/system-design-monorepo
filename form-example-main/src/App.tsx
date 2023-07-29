import * as React from 'react'
import { Box, Divider, Paper, Stack, styled, Typography } from '@mui/material'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { LocalStateExample } from './LocalStateExample'
import { ThemeModeSwitch } from './ThemeModeSwitch'
import { ReduxExample } from './ReduxExample'

export const App: React.FunctionComponent = () => {
    return (
        <>
            <Box sx={{ position: 'fixed', right: '0.5rem', top: '0.5rem' }}>
                <ThemeModeSwitch />
            </Box>
            <StyledStack spacing={2} divider={<Divider orientation='horizontal' flexItem />}>
                <Item elevation={1}>
                    <Typography variant='h1' sx={{ fontSize: '2.0rem', mb: 2 }}>
                        Local State
                    </Typography>
                    <LocalStateExample />
                </Item>
                <Item elevation={1}>
                    <Typography variant='h1' sx={{ fontSize: '2.0rem', mb: 2 }}>
                        Redux-Based State
                    </Typography>
                    <ReduxExample />
                </Item>
            </StyledStack>
        </>
    )
}

export default App

const StyledStack = styled(Stack)(({ theme }) => ({
    minWidth: '600px',
    maxWidth: '1200px',
    width: `calc(100% - ${theme.spacing(6)})`,
    margin: 'auto',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
}))

const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
}))
