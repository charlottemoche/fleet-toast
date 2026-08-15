import {
  formatMinutesRemaining,
  formatMinutesRemainingLong,
} from '../../utils/format.js'

export function Timer({ remainingMinutes }) {
  return (
    <span aria-label={formatMinutesRemainingLong(remainingMinutes)}>
      {formatMinutesRemaining(remainingMinutes)}
    </span>
  )
}
