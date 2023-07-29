import * as React from 'react'
import { styled } from '@mui/material/styles'

export interface InstanceListProps {
    /** A list of instances that the user can select from. */
    instances: { value: number; label: string }[]
    /**
     * The ID of the instance that should be highlighted.
     *
     * If none of the instances has been selected, it must be `null`.
     */
    selectedInstance: number | null
    /**
     * Will be called with the ID of the selected instance as its only
     * argument when the user selects an instance.
     *
     * @param instanceId The ID of the selected instance.
     * @returns
     */
    onSelectInstance: (instanceId: number) => void
}

/**
 * Renders a list of instances that the user can select from and reports back
 * the selected instance ID.
 */
export const InstanceSelector: React.FunctionComponent<InstanceListProps> = (props) => {
    const { instances, selectedInstance, onSelectInstance } = props
    return (
        <StyledInstanceList data-testid={'instance-list'}>
            {instances.map((instance) => {
                return (
                    <InstanceListItem
                        key={instance.value}
                        data-testid={'instance-list-item'}
                        onClick={() => onSelectInstance(instance.value)}
                        className={selectedInstance === instance.value ? 'active' : undefined}
                    >
                        {selectedInstance === instance.value ? '> ' : ''}
                        {`[${instance.value}] ${instance.label}`}
                        {selectedInstance === instance.value ? ' <' : ''}
                    </InstanceListItem>
                )
            })}
        </StyledInstanceList>
    )
}

export default InstanceSelector

/**
 * Looks like a simple box without any padding which grows with its context up
 * to a certain extend, then shows scrollbars.
 *
 * Horizontal overflow is simply hidden.
 */
const StyledInstanceList = styled('ul')(({ theme }) => ({
    border: `1px solid ${theme.palette.grey[300]}`,
    padding: 0,
    listStyle: 'none',
    minHeight: '2rem',
    maxHeight: '20rem',
    overflowX: 'hidden',
    overflowY: 'auto',
}))

/**
 * A list item with a background color that changes according to the elements
 * state.
 */
const InstanceListItem = styled('li')(({ theme }) => ({
    padding: theme.spacing(0.5, 1),
    listStyle: 'none',
    fontSize: theme.typography.button.fontSize,
    userSelect: 'none',
    whiteSpace: 'nowrap',
    borderBottom: `1px solid ${theme.palette.grey[theme.palette.mode === 'dark' ? 800 : 100]}`,
    '&:focus': {
        backgroundColor: theme.palette.action.focus,
    },
    '&:hover': {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'dark' ? 900 : 100],
        cursor: 'pointer',
    },
    '&.active': {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'dark' ? 900 : 200],
    },
    '&:active': {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'dark' ? 800 : 300],
        cursor: 'pointer',
        color: theme.palette.text.primary,
    },
}))
